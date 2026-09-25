import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, ShieldCheck } from "lucide-react";
import { getServiceCategories } from "@/lib/api";
import { catalogSection, servicePath } from "@/lib/catalog";
import { CITIES, cityPath, findCity } from "@/lib/cities";
import { absoluteUrl, faqJsonLd, pageMetadata } from "@/lib/seo";
import { formatCOP, formatDuration } from "@/lib/format";
import { PHOTOS } from "@/lib/photos";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { JsonLd } from "@/components/seo/JsonLd";
import { FinalCta } from "@/components/home/FinalCta";
import { BookingSteps } from "@/components/services/BookingSteps";
import { FaqList } from "@/components/services/FaqList";

type Props = { params: Promise<{ municipio: string }> };

// The municipality list is fixed (lib/cities.ts) — anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return CITIES.map((c) => ({ municipio: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const city = findCity((await params).municipio);
  if (!city) notFound();
  return pageMetadata({
    title: `Masajes a domicilio en ${city.name}`,
    description: `Spa y masajes a domicilio en ${city.name}, ${city.where}: relajación, piedras volcánicas, masajes en pareja y más. Reserva en línea, todos los días.`,
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
  const city = findCity((await params).municipio);
  if (!city) notFound();

  const { data } = await getServiceCategories();
  const services = catalogSection(data, "spa").flatMap((c) =>
    c.services.map((service) => ({ service, href: servicePath(service, c.slug) })),
  );
  const cheapest = [...services].sort((a, b) => a.service.price - b.service.price)[0]?.service;
  const others = CITIES.filter((c) => c.slug !== city.slug);
  const sectors = city.sectors ?? [];
  const sectorList =
    sectors.length > 1 ? `${sectors.slice(0, -1).join(", ")} o ${sectors[sectors.length - 1]}` : sectors[0];

  const faqs = [
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

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          "@id": `${absoluteUrl(cityPath(city))}#service`,
          name: `Masajes a domicilio en ${city.name}`,
          serviceType: "Masajes a domicilio",
          url: absoluteUrl(cityPath(city)),
          provider: { "@id": absoluteUrl("/#business") },
          areaServed: { "@type": "City", name: city.name },
        }}
      />
      <JsonLd data={faqJsonLd(faqs)} />

      <PageHeader
        path={cityPath(city)}
        parent={{ name: "Cobertura", path: "/masajes-a-domicilio" }}
        eyebrow="Spa y bienestar en casa"
        title={`Masajes a domicilio en ${city.name}`}
        description={`Relajación, terapias con calor y experiencias en pareja, llevadas hasta tu espacio en ${city.name}.`}
        photo={PHOTOS.suite}
      />

      <section className="pb-16 sm:pb-24">
        <Container className="max-w-4xl space-y-14">
          <div className="space-y-5 text-base leading-relaxed text-ink-soft sm:text-lg">
            {city.intro.map((p) => (
              <p key={p}>{p}</p>
            ))}
            {sectorList && <p>Llegamos a cualquier dirección del municipio: por ejemplo {sectorList}.</p>}
          </div>

          <div>
            <h2 className="font-serif text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
              Masajes disponibles en {city.name}
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
                      <span className="block font-serif font-semibold text-ink">{formatCOP(service.price)}</span>
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
              href="/masajes-tantricos"
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-bronze underline decoration-gold/60 underline-offset-4 hover:text-ink"
            >
              <ShieldCheck size={15} aria-hidden />
              También en {city.name}: rituales tántricos (solo mayores de 18)
            </Link>
          </div>

          <BookingSteps title={`Cómo reservar en ${city.name}`} />

          <FaqList faqs={faqs} />

          <nav aria-label="Otros municipios">
            <h2 className="font-serif text-2xl font-semibold tracking-tight text-ink sm:text-3xl">También llegamos a</h2>
            <ul className="mt-5 flex flex-wrap gap-2">
              <li>
                <Link href="/" className={chip}>
                  Medellín
                </Link>
              </li>
              {others.map((c) => (
                <li key={c.slug}>
                  <Link href={cityPath(c)} className={chip}>
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
