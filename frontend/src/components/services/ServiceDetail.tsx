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
import { SERVICE_CONTENT } from "@/lib/service-content";
import { fallbackPhoto } from "@/lib/photos";
import { formatCOP, formatDuration } from "@/lib/format";

const heading = "font-serif text-2xl font-semibold tracking-tight text-ink sm:text-3xl";

/** General questions every service page answers, filled in with this service's own data. */
function generalFaqs(service: Service, adult: boolean) {
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
export function ServiceDetail({
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
  const section = sectionOf(service, category.slug);
  const adult = section === "adult";
  const path = servicePath(service, category.slug);
  const content = SERVICE_CONTENT[service.slug];
  const faqs = [...(content?.faqs ?? []), ...generalFaqs(service, adult)];
  const related = siblings.filter((s) => s.service.slug !== service.slug).slice(0, 3);
  const bookHref = `/reservar?service=${service.slug}`;
  const whatsappHref = SITE.whatsapp
    ? `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(`Hola, me gustaría reservar ${service.name} en L'AMOUR.`)}`
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
        })}
      />
      <JsonLd data={faqJsonLd(faqs)} />

      <PageHeader
        path={path}
        parent={{ name: SECTION_NAME[section], path: SECTION_BASE[section] }}
        eyebrow={adult ? "Masaje tántrico a domicilio · Medellín" : "Masaje a domicilio · Medellín"}
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
                <h2 className={heading}>Qué incluye</h2>
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
                      Opción de vestidura sensorial
                    </li>
                  )}
                  {service.allowsExtraTime && (
                    <li className="flex items-start gap-3 rounded-2xl bg-silk/50 px-4 py-3.5 text-sm text-ink">
                      <Check size={16} className="mt-0.5 shrink-0 text-bronze" aria-hidden />
                      Admite tiempo adicional
                    </li>
                  )}
                </ul>
              </div>
            )}

            {content && (
              <div className="grid gap-10 sm:grid-cols-2">
                <div>
                  <h2 className={heading}>Ideal para</h2>
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
                  <h2 className={heading}>Cómo es la sesión</h2>
                  <p className="mt-5 text-base leading-relaxed text-ink-soft">{content.session}</p>
                </div>
              </div>
            )}

            <BookingSteps title="Cómo reservar a domicilio" />

            <FaqList faqs={faqs} />
          </div>

          {/* Booking card — sticky beside the copy on desktop, right after the intro flow on phones. */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-[1.75rem] border border-ink/10 bg-white/70 p-6 shadow-[0_18px_40px_-32px_rgba(23,23,23,0.5)]">
              <p className="font-serif text-3xl font-semibold text-ink">{formatCOP(service.price)}</p>
              <ul className="mt-4 space-y-2.5 text-sm text-ink-soft">
                <li className="flex items-center gap-2.5">
                  <Clock3 size={16} className="text-bronze" aria-hidden />
                  {formatDuration(service.durationMinutes)}
                </li>
                {service.requiresTwoTherapists && (
                  <li className="flex items-center gap-2.5">
                    <Users size={16} className="text-bronze" aria-hidden />
                    {service.isCoupleExperience ? "Un terapeuta por persona" : "2 masajistas"}
                  </li>
                )}
                <li className="flex items-center gap-2.5">
                  <MapPin size={16} className="text-bronze" aria-hidden />A domicilio en Medellín y alrededores
                </li>
                <li className="flex items-center gap-2.5">
                  <ShieldCheck size={16} className="text-bronze" aria-hidden />
                  {adult ? "Solo mayores de 18 · total discreción" : "Total discreción"}
                </li>
              </ul>
              <LinkButton href={bookHref} className="mt-6 w-full">
                Reservar este ritual
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
                  Preguntar por WhatsApp
                </a>
              )}
            </div>
          </aside>
        </Container>
      </section>

      {related.length > 0 && (
        <section className="bg-silk/45 py-16 sm:py-24">
          <Container>
            <h2 className={heading}>{adult ? "Otros rituales tántricos" : "Otros masajes a domicilio"}</h2>
            <ul className="mt-8 grid gap-4 sm:grid-cols-3">
              {related.map(({ service: s, categorySlug }) => (
                <li key={s.slug}>
                  <Link
                    href={servicePath(s, categorySlug)}
                    className="group flex h-full flex-col rounded-[1.5rem] border border-ink/10 bg-ivory/80 p-5 transition-[transform,border-color] duration-300 hover:-translate-y-0.5 hover:border-gold/50"
                  >
                    <span className="font-serif text-lg font-semibold text-ink">{s.name}</span>
                    <span className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">{s.shortDescription}</span>
                    <span className="mt-4 flex items-center justify-between text-sm">
                      <span className="text-ink-soft">
                        {formatDuration(s.durationMinutes)} · {formatCOP(s.price)}
                      </span>
                      <ArrowUpRight size={16} className="text-bronze transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href={SECTION_BASE[section]}
              className="mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-ink underline decoration-gold/60 underline-offset-8 hover:decoration-ink"
            >
              {adult ? "Ver todos los rituales tántricos" : "Ver todos los servicios"}
              <ArrowUpRight size={16} />
            </Link>
          </Container>
        </section>
      )}

      <FinalCta className={related.length > 0 ? "bg-silk/45" : undefined} />
    </>
  );
}
