import Image from "next/image";
import { Eye } from "lucide-react";
import type { ServiceCategory } from "@/lib/types";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { LinkButton } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PHOTOS } from "@/lib/photos";
import { formatCOP, formatDuration } from "@/lib/format";
import { ServiceCard } from "./ServiceCard";
import { getI18n } from "@/i18n/server";

/** Couples category — the catalog's one dark "evening" moment, led by the signature Voyerista ritual. */
export async function CouplesSection({ category }: { category: ServiceCategory }) {
  const { t, href, lang } = await getI18n();
  const voyerista = category.services.find((s) => s.slug === "masaje-voyerista");
  const rest = category.services.filter((s) => s.slug !== "masaje-voyerista");

  return (
    <section id="pareja" className="bg-ink py-16 sm:py-32">
      <Container>
        <Reveal>
          <SectionHeading
            light
            eyebrow={t("Experiencias en pareja", "Couples experiences")}
            title={category.name}
            description={category.description ?? undefined}
          />
        </Reveal>

        {voyerista && (
          <Reveal delay={0.1}>
            <div className="mt-12 grid overflow-hidden rounded-[2rem] border border-gold/20 bg-espresso shadow-2xl md:grid-cols-2">
              <div className="relative order-last flex flex-col justify-center gap-5 p-7 sm:p-14 md:order-first">
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-champagne">
                  <Eye size={16} aria-hidden />
                  {t("El arte de mirar", "The art of watching")}
                </p>
                <h3 className="font-serif text-3xl font-semibold text-ivory sm:text-4xl">{voyerista.name}</h3>
                <p className="text-base leading-relaxed text-ivory/75">
                  {t(
                    "Conexión a través de los sentidos: uno de los dos se entrega por completo a la relajación mientras el otro observa cada movimiento, alimentando la fantasía y la complicidad de la pareja.",
                    "Connection through the senses: one of you surrenders completely to relaxation while the other watches every movement, fuelling the couple's fantasy and complicity.",
                  )}
                </p>
                <div className="flex items-center gap-6 text-sm text-ivory/70">
                  <span>{formatDuration(voyerista.durationMinutes)}</span>
                  <span className="font-serif text-xl font-semibold text-champagne">{formatCOP(voyerista.price, lang)}</span>
                </div>
                <LinkButton href={href(`/reservar?service=${voyerista.slug}`)} variant="light" className="w-fit">
                  {t("Vivir esta experiencia", "Live this experience")}
                </LinkButton>
              </div>
              <div className="relative min-h-56 md:min-h-[26rem]">
                <Image
                  src={PHOTOS.candles.src}
                  alt={lang === "en" ? PHOTOS.candles.altEn : PHOTOS.candles.alt}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-espresso via-espresso/10 to-transparent md:bg-gradient-to-r md:from-espresso/80 md:via-espresso/20" />
              </div>
            </div>
          </Reveal>
        )}

        <div className="mt-6 grid grid-cols-1 border-t border-ivory/10 sm:grid-cols-2 sm:gap-6 sm:border-t-0">
          {rest.map((service, i) => (
            <Reveal key={service.id} delay={0.08 * i}>
              <ServiceCard service={service} categorySlug={category.slug} index={i} tone="dark" />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
