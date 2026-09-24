"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { useGsapContext } from "@/hooks/useGsapContext";
import { Container } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PHOTOS, type Photo } from "@/lib/photos";

const SENSES: { name: string; line: string; photo: Photo }[] = [
  { name: "Aroma", line: "Incienso, velas y aceites esenciales preparan tu espacio antes del primer contacto.", photo: PHOTOS.incense },
  { name: "Calor", line: "Aceites tibios y piedras calientes que sueltan, una a una, cada tensión.", photo: PHOTOS.oilHand },
  { name: "Tacto", line: "Manos expertas y presión consciente, siempre a tu ritmo.", photo: PHOTOS.herbal },
  { name: "Calma", line: "Penumbra, silencio y un tiempo que es solo tuyo.", photo: PHOTOS.oilBowl },
  { name: "En pareja", line: "Rituales para compartir la experiencia, en la intimidad de tu hogar.", photo: PHOTOS.bathTray },
];

// Desktop parallax: each card drifts at its own rate for a gentle, staggered depth.
const DRIFT = [-28, 36, -40, 30, -24];

/**
 * "Un ritual para cada sentido" — the photo section as a story, not a wall.
 *
 * Phones: one swipeable row (native CSS scroll-snap, no library) with the
 * next card peeking in, a live "n / 5" counter and 44px prev/next buttons so
 * it never depends on swiping alone — about one screen tall instead of the
 * old 2½-screen masonry. Desktop: all five in a row with a multi-speed
 * parallax, the same effect the previous gallery had.
 */
export function SensesSection() {
  const trackRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [active, setActive] = useState(0);

  useGsapContext(() => {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      cardRefs.current.forEach((card, i) => {
        if (!card) return;
        gsap.fromTo(
          card,
          { y: -DRIFT[i] / 2 },
          {
            y: DRIFT[i],
            ease: "none",
            scrollTrigger: { trigger: rowRef.current, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      });
    });
    return () => mm.revert();
  }, []);

  const onScroll = useCallback(() => {
    const track = trackRef.current;
    const first = cardRefs.current[0];
    if (!track || !first) return;
    const step = first.offsetWidth + 16; // card width + gap-4
    setActive(Math.max(0, Math.min(SENSES.length - 1, Math.round(track.scrollLeft / step))));
  }, []);

  function goTo(index: number) {
    const card = cardRefs.current[Math.max(0, Math.min(SENSES.length - 1, index))];
    const track = trackRef.current;
    if (!card || !track) return;
    track.scrollTo({ left: card.offsetLeft - track.offsetLeft - 20, behavior: "smooth" });
  }

  return (
    <section id="sentidos" aria-labelledby="sentidos-title" className="overflow-hidden py-16 sm:py-32">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Reveal>
            <SectionHeading
              eyebrow="La experiencia"
              title={<span id="sentidos-title">Un ritual para cada sentido</span>}
              description="Cada detalle está pensado para que el cuerpo suelte y la mente descanse."
            />
          </Reveal>

          {/* Phone controls — swiping is optional, never the only way through */}
          <div className="flex items-center gap-3 lg:hidden">
            <p className="min-w-12 text-sm tabular-nums text-ink-soft" aria-live="polite">
              <span className="font-semibold text-ink">{active + 1}</span> / {SENSES.length}
            </p>
            <button
              type="button"
              onClick={() => goTo(active - 1)}
              disabled={active === 0}
              aria-label="Sentido anterior"
              className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-ink/15 bg-white/60 text-ink transition-opacity disabled:opacity-35"
            >
              <ChevronLeft size={18} aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => goTo(active + 1)}
              disabled={active === SENSES.length - 1}
              aria-label="Sentido siguiente"
              className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-ink/15 bg-white/60 text-ink transition-opacity disabled:opacity-35"
            >
              <ChevronRight size={18} aria-hidden />
            </button>
          </div>
        </div>

        <div ref={rowRef} className="mt-10 lg:mt-16">
          <div
            ref={trackRef}
            onScroll={onScroll}
            className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-5 px-5 pb-2 [scrollbar-width:none] sm:-mx-8 sm:scroll-px-8 sm:px-8 lg:mx-0 lg:grid lg:snap-none lg:grid-cols-5 lg:gap-5 lg:overflow-visible lg:px-0 [&::-webkit-scrollbar]:hidden"
          >
            <ol className="contents">
              {SENSES.map((sense, i) => (
                <li
                  key={sense.name}
                  ref={(el) => {
                    cardRefs.current[i] = el;
                  }}
                  className="w-[78%] max-w-[20rem] shrink-0 snap-start sm:w-[45%] lg:w-auto lg:max-w-none"
                >
                  <Reveal delay={0.08 * i}>
                  <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] bg-silk shadow-[0_24px_50px_-30px_rgba(43,32,25,0.55)]">
                    <div className="absolute inset-0 animate-kenburns" style={{ animationDelay: `-${i * 3}s` }}>
                      <Image
                        src={sense.photo.src}
                        alt={sense.photo.alt}
                        fill
                        sizes="(min-width: 1024px) 19vw, (min-width: 640px) 45vw, 78vw"
                        className="object-cover"
                      />
                    </div>
                    <span className="absolute left-4 top-4 rounded-full bg-ivory/90 px-3 py-1 text-xs font-semibold tracking-widest text-ink">
                      0{i + 1}
                    </span>
                  </div>
                  <h3 className="mt-5 font-serif text-2xl font-semibold text-ink">{sense.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--tone-body)]">{sense.line}</p>
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>

          {/* Phone progress rail */}
          <div aria-hidden className="mt-6 h-px w-full bg-ink/10 lg:hidden">
            <div
              className="h-px bg-bronze transition-[width] duration-300"
              style={{ width: `${((active + 1) / SENSES.length) * 100}%` }}
            />
          </div>
        </div>

        <Reveal className="mt-10 lg:mt-20">
          <LinkButton href="/reservar" size="lg" className="w-full sm:w-auto">
            Reservar mi ritual
          </LinkButton>
        </Reveal>
      </Container>
    </section>
  );
}
