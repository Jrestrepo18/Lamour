import Link from "next/link";
import { ArrowUpRight, ChevronRight, Clock3 } from "lucide-react";
import type { Service } from "@/lib/types";
import { Container } from "@/components/ui/Container";
import { FadeInImage } from "@/components/ui/FadeInImage";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PHOTOS } from "@/lib/photos";
import { formatCOP, formatDuration } from "@/lib/format";

// The hero already uses the oil-pour photo, so the signature ritual leads with a different frame.
const VISUALS = [PHOTOS.handsBack, PHOTOS.hotStone, PHOTOS.candles];

/**
 * The three signature rituals as tall editorial cards: full-bleed photo,
 * a numbered index, and name/price/duration set over a soft ink wash at the
 * base — the same "photo-led product card" language premium spa sites use.
 */
export function FeaturedServices({ services }: { services: Service[] }) {
  if (services.length === 0) return null;

  return (
    <section className="py-16 sm:py-32">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Reveal>
            <SectionHeading
              eyebrow="Lo más pedido"
              title="Rituales destacados"
              description="Nuestras experiencias favoritas, creadas para desconectar la mente y despertar cada sentido."
            />
          </Reveal>
          <Reveal delay={0.1}>
            <Link
              href="/servicios"
              className="group inline-flex items-center gap-1.5 text-sm font-medium text-ink underline decoration-gold/60 underline-offset-8 transition-colors hover:decoration-ink"
            >
              Ver catálogo completo
              <ArrowUpRight size={16} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </Reveal>
        </div>

        {/* Phones: an elegant "carta" — thumbnail, name, duration and price on one line each,
            gold hairlines between rows. Half a screen instead of three tall cards. */}
        <ol className="mt-8 border-t border-ink/10 md:hidden">
          {services.map((service, i) => {
            const photo = VISUALS[i % VISUALS.length];
            return (
              <li key={service.id} className="border-b border-ink/10">
                <Reveal delay={0.08 * i} from="right">
                <Link href={`/reservar?service=${service.slug}`} className="group flex items-center gap-4 py-4">
                  <span className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-silk">
                    <FadeInImage
                      src={service.imageUrl ?? photo.src}
                      alt={service.imageUrl ? service.name : photo.alt}
                      fill
                      sizes="80px"
                      className="object-cover"
                      unoptimized={!!service.imageUrl}
                    />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[0.7rem] font-semibold tracking-[0.25em] text-bronze">0{i + 1}</span>
                    <span className="mt-0.5 block font-serif text-base font-semibold leading-snug text-ink">{service.name}</span>
                    <span className="mt-1 flex items-center gap-3 text-xs text-[var(--tone-body)]">
                      <span className="flex items-center gap-1">
                        <Clock3 size={12} className="text-bronze" aria-hidden />
                        {formatDuration(service.durationMinutes)}
                      </span>
                      <span className="ml-auto font-serif text-sm font-semibold text-ink">{formatCOP(service.price)}</span>
                    </span>
                  </span>
                  <ChevronRight size={18} className="shrink-0 text-bronze" aria-hidden />
                </Link>
                </Reveal>
              </li>
            );
          })}
        </ol>

        <div className="mt-12 hidden grid-cols-3 gap-6 md:grid">
          {services.map((service, i) => {
            const photo = VISUALS[i % VISUALS.length];
            return (
              <Reveal key={service.id} delay={0.08 * i}>
                <Link
                  href={`/reservar?service=${service.slug}`}
                  className="group relative block aspect-[3/4] overflow-hidden rounded-[1.75rem] bg-silk shadow-[0_24px_50px_-30px_rgba(43,32,25,0.6)]"
                >
                  {/* Slow "reel" drift; each card starts at a different point of the cycle. */}
                  <div className="absolute inset-0 animate-kenburns" style={{ animationDelay: `-${i * 5}s` }}>
                  <FadeInImage
                    src={service.imageUrl ?? photo.src}
                    alt={service.imageUrl ? service.name : photo.alt}
                    fill
                    sizes="33vw"
                    className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
                    unoptimized={!!service.imageUrl}
                  />
                  </div>
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-espresso/90 via-espresso/30 to-transparent" />

                  <span className="absolute left-5 top-5 rounded-full bg-ivory/90 px-3 py-1 text-xs font-semibold tracking-widest text-ink">
                    0{i + 1}
                  </span>
                  <span className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-ivory/90 text-ink transition-transform duration-300 group-hover:rotate-45">
                    <ArrowUpRight size={17} />
                  </span>

                  <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7">
                    <h3 className="font-serif text-2xl font-semibold leading-tight text-ivory">{service.name}</h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ivory/80">{service.shortDescription}</p>
                    <div className="mt-5 flex items-center justify-between border-t border-ivory/20 pt-4 text-sm text-ivory/85">
                      <span className="flex items-center gap-1.5">
                        <Clock3 size={14} className="text-champagne" aria-hidden />
                        {formatDuration(service.durationMinutes)}
                      </span>
                      <span className="font-serif text-lg font-semibold text-ivory">{formatCOP(service.price)}</span>
                    </div>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
