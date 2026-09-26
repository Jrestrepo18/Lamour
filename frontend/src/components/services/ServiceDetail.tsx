import Link from "next/link";
import { ArrowUpRight, Check, Clock3, MapPin, ShieldCheck, Users } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import type { Service, ServiceCategory } from "@/lib/types";
import { Container } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import { FinalCta } from "@/components/home/FinalCta";
import { BookingSteps } from "./BookingSteps";
import { FaqList } from "./FaqList";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqJsonLd, serviceJsonLd, SITE } from "@/lib/seo";
import { SECTION_BASE, SECTION_NAME, sectionOf, servicePath } from "@/lib/catalog";
import { serviceContent } from "@/lib/service-content-en";
import { fallbackPhoto } from "@/lib/photos";
import { formatCOP, formatDuration } from "@/lib/format";
import type { Locale } from "@/i18n/config";
import { getI18n } from "@/i18n/server";

const heading = "font-serif text-2xl font-semibold tracking-tight text-ink sm:text-3xl";

/** General questions every service page answers, filled in with this service's own data. */
function generalFaqs(service: Service, adult: boolean, lang: Locale) {
  if (lang === "en") {
    return [
      {
        q: `How much does ${service.name} cost and how long is it?`,
        a: `${service.name} lasts ${formatDuration(service.durationMinutes)} and costs ${formatCOP(service.price, "en")}${
          service.requiresTwoTherapists ? ", with two therapists" : ""
        }, at your home, apartment or hotel.`,
      },
      {
        q: "Where is it available?",
        a: "At your place anywhere in Medellín and the Aburrá Valley (Envigado, Sabaneta, Itagüí, Bello, La Estrella and Caldas), and also in Rionegro. Every day, 9:00 a.m. to 9:00 p.m.",
      },
      {
        q: "How do I pay?",
        a: "In cash, by bank transfer or by card, in Colombian pesos (COP). You choose the method when you book.",
      },
      ...(adult
        ? [
            {
              q: "Is it a discreet service?",
              a: "Yes. It's for adults only (18+); our therapists arrive with nothing that reveals the type of service and every conversation is confidential.",
            },
          ]
        : []),
    ];
  }
  return [
    {
      q: `¿Cuánto cuesta y cuánto dura ${service.name}?`,
      a: `${service.name} dura ${formatDuration(service.durationMinutes)} y cuesta ${formatCOP(service.price)}${
        service.requiresTwoTherapists ? ", con dos terapeutas" : ""
      }, a domicilio en tu dirección.`,
    },
    {
      q: "¿En qué zonas está disponible?",
      a: `A domicilio en Medellín y el Valle de Aburrá (Envigado, Sabaneta, Itagüí, Bello, La Estrella y Caldas), y también en Rionegro. Todos los días, de 9:00 a.m. a 9:00 p.m.`,
    },
    {
      q: "¿Cómo pago?",
      a: "En efectivo, por transferencia o con tarjeta. Eliges el método al reservar.",
    },
    ...(adult
      ? [
          {
            q: "¿Es un servicio discreto?",
            a: "Sí. Es exclusivo para mayores de 18 años; nuestras terapeutas llegan sin nada que revele el tipo de servicio y toda la comunicación es confidencial.",
          },
        ]
      : []),
  ];
}

/**
 * The full, indexable page of one service — shared by the general catalog
 * (/servicios/[slug]) and the adult section (/masajes-tantricos/[slug]). Built
 * from the catalog data plus the editorial copy in lib/service-content.ts.
 */
export async function ServiceDetail({
  service,
  category,
  index,
  siblings,
}: {
  service: Service;
  category: ServiceCategory;
  /** Position in its category — picks the same stand-in photo the catalog card uses. */
  index: number;
  /** Other services of the same section, for "otros rituales". */
  siblings: { service: Service; categorySlug: string }[];
}) {
  const { t, href, lang } = await getI18n();
  const section = sectionOf(service, category.slug);
  const adult = section === "adult";
  const path = servicePath(service, category.slug);
  const content = serviceContent(service.slug, lang);
  const faqs = [...(content?.faqs ?? []), ...generalFaqs(service, adult, lang)];
  const related = siblings.filter((s) => s.service.slug !== service.slug).slice(0, 3);
  const bookHref = href(`/reservar?service=${service.slug}`);
  const whatsappHref = SITE.whatsapp
    ? `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(t(`Hola, me gustaría reservar ${service.name} en L'AMOUR.`, `Hi, I'd like to book ${service.name} at L'AMOUR.`))}`
    : null;

  return (
    <>
      <JsonLd
        data={serviceJsonLd({
          name: service.name,
          slug: service.slug,
          description: service.longDescription ?? service.shortDescription,
          path,
          price: service.price,
          category: category.name,
          lang,
        })}
      />
      <JsonLd data={faqJsonLd(faqs)} />

      <PageHeader
        path={path}
        parent={{ name: SECTION_NAME[lang][section], path: SECTION_BASE[section] }}
        eyebrow={
          adult
            ? t("Masaje tántrico a domicilio · Medellín", "Tantric massage at your place · Medellín")
            : t("Masaje a domicilio · Medellín", "Massage at your place · Medellín")
        }
        title={service.name}
        description={service.shortDescription}
        photo={fallbackPhoto(category.slug, index)}
      />

      <section className="pb-16 sm:pb-24">
        <Container className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-16">
          <div className="space-y-12">
            <div className="space-y-5 text-base leading-relaxed text-ink-soft sm:text-lg">
              <p>{service.longDescription ?? service.shortDescription}</p>
              {content?.intro.map((p) => <p key={p}>{p}</p>)}
            </div>

            {service.highlights.length > 0 && (
              <div>
                <h2 className={heading}>{t("Qué incluye", "What's included")}</h2>
                <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                  {service.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-3 rounded-2xl bg-silk/50 px-4 py-3.5 text-sm text-ink">
                      <Check size={16} className="mt-0.5 shrink-0 text-bronze" aria-hidden />
                      {h}
                    </li>
                  ))}
                  {service.hasSensoryDressOption && (
                    <li className="flex items-start gap-3 rounded-2xl bg-silk/50 px-4 py-3.5 text-sm text-ink">
                      <Check size={16} className="mt-0.5 shrink-0 text-bronze" aria-hidden />
                      {t("Opción de vestidura sensorial", "Sensory attire option")}
                    </li>
                  )}
                  {service.allowsExtraTime && (
                    <li className="flex items-start gap-3 rounded-2xl bg-silk/50 px-4 py-3.5 text-sm text-ink">
                      <Check size={16} className="mt-0.5 shrink-0 text-bronze" aria-hidden />
                      {t("Admite tiempo adicional", "Extra time available")}
                    </li>
                  )}
                </ul>
              </div>
            )}

            {content && (
              <div className="grid gap-10 sm:grid-cols-2">
                <div>
                  <h2 className={heading}>{t("Ideal para", "Ideal for")}</h2>
                  <ul className="mt-5 space-y-3">
                    {content.idealFor.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-base text-ink-soft">
                        <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" aria-hidden />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h2 className={heading}>{t("Cómo es la sesión", "What the session is like")}</h2>
                  <p className="mt-5 text-base leading-relaxed text-ink-soft">{content.session}</p>
                </div>
              </div>
            )}

            <BookingSteps title={t("Cómo reservar a domicilio", "How to book an in-home session")} />

            <FaqList faqs={faqs} />
          </div>

          {/* Booking card — sticky beside the copy on desktop, right after the intro flow on phones. */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-[1.75rem] border border-ink/10 bg-white/70 p-6 shadow-[0_18px_40px_-32px_rgba(23,23,23,0.5)]">
              <p className="font-serif text-3xl font-semibold text-ink">{formatCOP(service.price, lang)}</p>
              <ul className="mt-4 space-y-2.5 text-sm text-ink-soft">
                <li className="flex items-center gap-2.5">
                  <Clock3 size={16} className="text-bronze" aria-hidden />
                  {formatDuration(service.durationMinutes)}
                </li>
                {service.requiresTwoTherapists && (
                  <li className="flex items-center gap-2.5">
                    <Users size={16} className="text-bronze" aria-hidden />
                    {service.isCoupleExperience ? t("Un terapeuta por persona", "One therapist per person") : t("2 masajistas", "2 therapists")}
                  </li>
                )}
                <li className="flex items-center gap-2.5">
                  <MapPin size={16} className="text-bronze" aria-hidden />
                  {t("A domicilio en Medellín y alrededores", "At your place in Medellín and nearby")}
                </li>
                <li className="flex items-center gap-2.5">
                  <ShieldCheck size={16} className="text-bronze" aria-hidden />
                  {adult ? t("Solo mayores de 18 · total discreción", "Adults only (18+) · complete discretion") : t("Total discreción", "Complete discretion")}
                </li>
              </ul>
              <LinkButton href={bookHref} className="mt-6 w-full">
                {t("Reservar este ritual", "Book this ritual")}
                <ArrowUpRight size={16} />
              </LinkButton>
              {whatsappHref && (
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-ink/15 px-5 text-sm font-semibold text-ink transition-colors hover:bg-white"
                >
                  <WhatsAppIcon size={17} className="text-[#25D366]" />
                  {t("Preguntar por WhatsApp", "Ask on WhatsApp")}
                </a>
              )}
            </div>
          </aside>
        </Container>
      </section>

      {related.length > 0 && (
        <section className="bg-silk/45 py-16 sm:py-24">
          <Container>
            <h2 className={heading}>
              {adult ? t("Otros rituales tántricos", "Other tantric rituals") : t("Otros masajes a domicilio", "Other in-home massages")}
            </h2>
            <ul className="mt-8 grid gap-4 sm:grid-cols-3">
              {related.map(({ service: s, categorySlug }) => (
                <li key={s.slug}>
                  <Link
                    href={href(servicePath(s, categorySlug))}
                    className="group flex h-full flex-col rounded-[1.5rem] border border-ink/10 bg-ivory/80 p-5 transition-[transform,border-color] duration-300 hover:-translate-y-0.5 hover:border-gold/50"
                  >
                    <span className="font-serif text-lg font-semibold text-ink">{s.name}</span>
                    <span className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">{s.shortDescription}</span>
                    <span className="mt-4 flex items-center justify-between text-sm">
                      <span className="text-ink-soft">
                        {formatDuration(s.durationMinutes)} · {formatCOP(s.price, lang)}
                      </span>
                      <ArrowUpRight size={16} className="text-bronze transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href={href(SECTION_BASE[section])}
              className="mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-ink underline decoration-gold/60 underline-offset-8 hover:decoration-ink"
            >
              {adult ? t("Ver todos los rituales tántricos", "See all tantric rituals") : t("Ver todos los servicios", "See all services")}
              <ArrowUpRight size={16} />
            </Link>
          </Container>
        </section>
      )}

      <FinalCta className={related.length > 0 ? "bg-silk/45" : undefined} />
    </>
  );
}
