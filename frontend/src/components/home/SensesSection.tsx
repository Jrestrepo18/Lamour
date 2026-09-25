"use client";

import { useCallback, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PHOTOS, type Photo } from "@/lib/photos";
import { InstagramPost } from "./InstagramPost";

const SENSES: { name: string; line: string; photo: Photo; tags: string[] }[] = [
  { name: "Aroma", line: "Incienso, velas y aceites esenciales preparan tu espacio antes del primer contacto.", photo: PHOTOS.incense, tags: ["aroma", "ritual", "medellín"] },
  { name: "Calor", line: "Aceites tibios y piedras calientes que sueltan, una a una, cada tensión.", photo: PHOTOS.oilHand, tags: ["calor", "aceitestibios", "bienestar"] },
  { name: "Tacto", line: "Manos expertas y presión consciente, siempre a tu ritmo.", photo: PHOTOS.herbal, tags: ["tacto", "masajeadomicilio"] },
  { name: "Calma", line: "Penumbra, silencio y un tiempo que es solo tuyo.", photo: PHOTOS.oilBowl, tags: ["calma", "pausa", "autocuidado"] },
  { name: "En pareja", line: "Rituales para compartir la experiencia, en la intimidad de tu hogar.", photo: PHOTOS.bathTray, tags: ["enpareja", "ritual", "lamour"] },
];

/**
 * "Un ritual para cada sentido" — five Instagram-style posts in one swipeable
 * row (native CSS scroll-snap, no library): the next post peeks in, with a
 * live "n / 5" counter and 44px prev/next buttons so it never depends on
 * swiping alone. Same carousel on desktop, three posts in view.
 */
export function SensesSection() {
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [active, setActive] = useState(0);

  const onScroll = useCallback(() => {
    const track = trackRef.current;
    const first = cardRefs.current[0];
    if (!track || !first) return;
    const step = first.offsetWidth + parseFloat(getComputedStyle(track).columnGap || "16");
    setActive(Math.max(0, Math.min(SENSES.length - 1, Math.round(track.scrollLeft / step))));
  }, []);

  function goTo(index: number) {
    const card = cardRefs.current[Math.max(0, Math.min(SENSES.length - 1, index))];
    const track = trackRef.current;
    if (!card || !track) return;
    track.scrollTo({ left: card.offsetLeft - track.offsetLeft - parseFloat(getComputedStyle(track).paddingLeft || "0"), behavior: "smooth" });
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

          {/* Controls — swiping is optional, never the only way through */}
          <div className="flex items-center gap-3">
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

        <div className="mt-10 lg:mt-14">
          <div
            ref={trackRef}
            onScroll={onScroll}
            className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-5 px-5 pb-4 pt-1 [scrollbar-width:none] sm:-mx-8 sm:scroll-px-8 sm:px-8 lg:mx-0 lg:gap-6 lg:scroll-px-0 lg:px-0 [&::-webkit-scrollbar]:hidden"
          >
            <ol className="contents">
              {SENSES.map((sense, i) => (
                <li
                  key={sense.name}
                  ref={(el) => {
                    cardRefs.current[i] = el;
                  }}
                  className="w-[82%] max-w-[22rem] shrink-0 snap-start sm:w-[45%] lg:w-[calc((100%-3rem)/3)] lg:max-w-none"
                >
                  <Reveal delay={0.08 * i}>
                    <InstagramPost photo={sense.photo} title={sense.name} caption={sense.line} tags={sense.tags} priorityIndex={i} />
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>

          {/* Progress rail */}
          <div aria-hidden className="mt-6 h-px w-full bg-ink/10">
            <div
              className="h-px bg-bronze transition-[width] duration-300"
              style={{ width: `${((active + 1) / SENSES.length) * 100}%` }}
            />
          </div>
        </div>

        <Reveal className="mt-10 lg:mt-14">
          <LinkButton href="/reservar" size="lg" className="w-full sm:w-auto">
            Reservar mi ritual
          </LinkButton>
        </Reveal>
      </Container>
    </section>
  );
}
