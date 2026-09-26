import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, ShieldCheck } from "lucide-react";
import { getServiceCategories } from "@/server/catalog";
import { catalogSection, localizeCatalog, servicePath } from "@/lib/catalog";
import { CITIES, cityPath, findCity, localizeCity } from "@/lib/cities";
import { getI18n } from "@/i18n/server";
import { absoluteUrl, faqJsonLd, pageMetadata } from "@/lib/seo";
import { formatCOP, formatDuration } from "@/lib/format";
import { PHOTOS } from "@/lib/photos";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { JsonLd } from "@/components/seo/JsonLd";
import { FinalCta } from "@/components/home/FinalCta";
import { BookingSteps } from "@/components/services/BookingSteps";
import { FaqList } from "@/components/services/FaqList";

/** Catalog pages regenerate at most once a minute (and right after an admin edit). */
export const revalidate = 60;

type Props = { params: Promise<{ municipio: string }> };

// The municipality list is fixed (lib/cities.ts) — anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return CITIES.map((c) => ({ municipio: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { t, lang } = await getI18n();
  const found = findCity((await params).municipio);
  if (!found) notFound();
  const city = localizeCity(found, lang);
  return pageMetadata({
    lang,
    title: city.seoTitle ?? t(`Masajes a domicilio en ${city.name}`, `In-home massage in ${city.name}`),
    description: t(
      `Masajes a domicilio en ${city.name}, ${city.where}: relajación, piedras volcánicas y masajes en pareja. Reserva en línea, todos los días.`,
      `Massage at your home or hotel in ${city.name}, ${city.where}: relaxation, hot stones and couples massage. Book online, every day.`,
    ),
    path: cityPath(city),
  });
}

const chip = "inline-flex min-h-10 items-center rounded-full border border-ink/15 px-4 text-sm text-ink hover:border-gold";

/**
 * Local landing page for one covered municipality. Lists only the general
 * catalog (the adult rituals stay on their own rating=adult pages and are
 * one link away), so these pages can rank for plain local searches.
 */
export default async function MunicipioPage({ params }: Props) {
  const { t, href, lang } = await getI18n();
  const found = findCity((await params).municipio);
  if (!found) notFound();
  const city = localizeCity(found, lang);

  const { data } = await getServiceCategories();
  const services = catalogSection(localizeCatalog(data, lang), "spa").flatMap((c) =>
    c.services.map((service) => ({ service, href: href(servicePath(service, c.slug)) })),
  );
  const cheapest = [...services].sort((a, b) => a.service.price - b.service.price)[0]?.service;
  const others = CITIES.filter((c) => c.slug !== city.slug);
  const sectors = city.sectors ?? [];
  const sectorList =
    sectors.length > 1 ? `${sectors.slice(0, -1).join(", ")} ${t("o", "or")} ${sectors[sectors.length - 1]}` : sectors[0];

  const faqsEn = [
    {
      q: `Do you cover all of ${city.name}?`,
      a: `Yes, we come to your address in ${city.name}${sectorList ? `, for example in ${sectorList}` : ""} — homes, apartments and hotels. You enter your address when you book and we confirm the appointment on WhatsApp.`,
    },
    {
      q: "What are your hours?",
      a: "Every day, from 9:00 a.m. to 9:00 p.m. Each therapist's availability is shown in real time when you book.",
    },
    ...(cheapest
      ? [
          {
            q: `How much is an in-home massage in ${city.name}?`,
            a: `Prices start at ${formatCOP(cheapest.price, "en")} (${cheapest.name}, ${formatDuration(
              cheapest.durationMinutes,
            )}). Every ritual shows its price and duration before you book.`,
          },
        ]
      : []),
    { q: "How do I pay?", a: "Cash, bank transfer or card, in Colombian pesos (COP). You choose the method when you book." },
  ];

  const faqsEs = [
    {
      q: `¿Atienden en todo ${city.name}?`,
      a: `Sí, llegamos a tu dirección en ${city.name}${sectorList ? `, por ejemplo en ${sectorList}` : ""}. Al reservar indicas tu dirección y te confirmamos la cita por WhatsApp.`,
    },
    {
      q: "¿Qué horario tienen?",
      a: "Atendemos todos los días, de 9:00 a.m. a 9:00 p.m. La disponibilidad de cada masajista se ve en tiempo real al reservar.",
    },
    ...(cheapest
      ? [
          {
            q: `¿Cuánto cuesta un masaje a domicilio en ${city.name}?`,
            a: `Los precios del catálogo empiezan en ${formatCOP(cheapest.price)} (${cheapest.name}, ${formatDuration(
              cheapest.durationMinutes,
            )}). Cada ritual muestra su precio y duración antes de reservar.`,
          },
        ]
      : []),
    { q: "¿Cómo pago?", a: "En efectivo, por transferencia o con tarjeta. Eliges el método al reservar." },
  ];
  const faqs = lang === "en" ? faqsEn : faqsEs;
  const url = absoluteUrl(href(cityPath(city)));

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          "@id": `${url}#service`,
          name: t(`Masajes a domicilio en ${city.name}`, `In-home massage in ${city.name}`),
          serviceType: t("Masajes a domicilio", "In-home massage"),
          url,
          provider: { "@id": absoluteUrl("/#business") },
          areaServed: { "@type": "City", name: city.name },
        }}
      />
      <JsonLd data={faqJsonLd(faqs)} />

      <PageHeader
        path={cityPath(city)}
        parent={{ name: t("Cobertura", "Service areas"), path: "/masajes-a-domicilio" }}
        eyebrow={t("Spa y bienestar en casa", "Spa and wellbeing at your place")}
        title={city.seoTitle ?? t(`Masajes a domicilio en ${city.name}`, `In-home massage in ${city.name}`)}
        description={t(
          `Relajación, terapias con calor y experiencias en pareja, llevadas hasta tu espacio en ${city.name}.`,
          `Relaxation, heat therapies and couples experiences, brought to your place in ${city.name}.`,
        )}
        photo={PHOTOS.suite}
      />

      <section className="pb-16 sm:pb-24">
        <Container className="max-w-4xl space-y-14">
          <div className="space-y-5 text-base leading-relaxed text-ink-soft sm:text-lg">
            {city.intro.map((p) => (
              <p key={p}>{p}</p>
            ))}
            {sectorList && (
              <p>
                {t(
                  `Llegamos a cualquier dirección del municipio: por ejemplo ${sectorList}.`,
                  `We come to any address in the municipality: for example ${sectorList}.`,
                )}
              </p>
            )}
          </div>

          <div>
            <h2 className="font-serif text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
              {t("Masajes disponibles en", "Massages available in")} {city.name}
            </h2>
            <ul className="mt-6 divide-y divide-ink/10 border-y border-ink/10">
              {services.map(({ service, href }) => (
                <li key={service.slug}>
                  <Link href={href} className="group flex items-center gap-4 py-4">
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold text-ink">{service.name}</span>
                      <span className="mt-0.5 block text-sm text-ink-soft">{service.shortDescription}</span>
                    </span>
                    <span className="shrink-0 text-right text-sm">
                      <span className="block font-serif font-semibold text-ink">{formatCOP(service.price, lang)}</span>
                      <span className="block text-ink-soft">{formatDuration(service.durationMinutes)}</span>
                    </span>
                    <ArrowUpRight
                      size={16}
                      className="shrink-0 text-bronze transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href={href("/masajes-tantricos")}
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-bronze underline decoration-gold/60 underline-offset-4 hover:text-ink"
            >
              <ShieldCheck size={15} aria-hidden />
              {t(
                `También en ${city.name}: rituales tántricos (solo mayores de 18)`,
                `Also in ${city.name}: tantric rituals (adults only, 18+)`,
              )}
            </Link>
          </div>

          <BookingSteps title={t(`Cómo reservar en ${city.name}`, `How to book in ${city.name}`)} />

          <FaqList faqs={faqs} />

          <nav aria-label={t("Otros municipios", "Other towns")}>
            <h2 className="font-serif text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
              {t("También llegamos a", "We also cover")}
            </h2>
            <ul className="mt-5 flex flex-wrap gap-2">
              {others.map((c) => (
                <li key={c.slug}>
                  <Link href={href(cityPath(c))} className={chip}>
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </Container>
      </section>

      <FinalCta />
    </>
  );
}
