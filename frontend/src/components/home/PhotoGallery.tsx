"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { useGsapContext } from "@/hooks/useGsapContext";
import { Container } from "@/components/ui/Container";
import { FadeInImage } from "@/components/ui/FadeInImage";
import { Reveal } from "@/components/ui/Reveal";

const PHOTOS = [
  { src: "/images/spa-suite-massage.jpg", alt: "Suite privada de masajes", w: 4000, h: 6000 },
  { src: "/images/massage-oil-pour-back.jpg", alt: "Aceite tibio deslizándose sobre la espalda", w: 3648, h: 5472 },
  { src: "/images/hot-stone-massage.jpg", alt: "Piedras de jade sobre la espalda", w: 2048, h: 2536 },
  { src: "/images/massage-hands-back.jpg", alt: "Manos de la terapeuta en contacto consciente", w: 3888, h: 5184 },
  { src: "/images/spa-incense-candle.jpg", alt: "Incienso y velas en un espacio de ritual", w: 2912, h: 5184 },
  { src: "/images/massage-oil-pour-hand.jpg", alt: "Aceite tibio vertiéndose en la mano de la terapeuta", w: 3024, h: 4032 },
  { src: "/images/foot-massage-bw.jpg", alt: "Reflexología en blanco y negro", w: 3743, h: 5614 },
  { src: "/images/spa-suite-oil-bowl.jpg", alt: "Ritual con cuenco de aceite en suite privada", w: 3973, h: 5959 },
  { src: "/images/spa-ambiance-candles.jpg", alt: "Velas encendidas en un ambiente íntimo", w: 5184, h: 3456 },
  { src: "/images/essential-oil-bottle.jpg", alt: "Aceite esencial en un frasco de vidrio ámbar", w: 3000, h: 4500 },
  { src: "/images/herbal-compress-massage.jpg", alt: "Masaje con compresas herbales tibias", w: 1693, h: 2540 },
  { src: "/images/spa-bath-tray.jpg", alt: "Ritual de baño con velas, sales y aceites", w: 3648, h: 5472 },
];

// lg+ only: split into 4 explicit columns (round-robin) so each one can be
// given its own GSAP scroll offset — a CSS `columns-N` masonry has no per-
// column element to target. Offsets alternate direction and magnitude for a
// gentle zig-zag depth rather than every column sliding the same way.
const COLUMN_COUNT = 4;
const COLUMN_OFFSETS = [-36, 56, -52, 32];
const COLUMNS = Array.from({ length: COLUMN_COUNT }, () => [] as { photo: (typeof PHOTOS)[number]; index: number }[]);
PHOTOS.forEach((photo, index) => COLUMNS[index % COLUMN_COUNT].push({ photo, index }));

/**
 * A curated editorial masonry — real aspect ratios, no forced crop — that
 * opens into a full lightbox on click, with keyboard/arrow navigation
 * between photos. Takes the homepage slot the masseuses teaser used to
 * occupy; the team already has its own page (linked from the nav), so this
 * spot is better spent as the site's one deliberate, interactive photo
 * moment instead of a passive auto-scrolling strip.
 *
 * Two layouts: below lg, a plain CSS-columns masonry (mobile is the most-
 * visited version and stays simple/fast). At lg+, an explicit 4-column grid
 * where each column drifts vertically at its own rate as the section
 * scrolls past — a multi-speed parallax, purely a desktop/tablet flourish.
 */
export function PhotoGallery() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);
  const columnRefs = useRef<(HTMLDivElement | null)[]>([]);

  const close = useCallback(() => setActiveIndex(null), []);
  const prev = useCallback(() => setActiveIndex((i) => (i === null ? null : (i - 1 + PHOTOS.length) % PHOTOS.length)), []);
  const next = useCallback(() => setActiveIndex((i) => (i === null ? null : (i + 1) % PHOTOS.length)), []);

  useGsapContext(() => {
    if (!parallaxRef.current) return;

    columnRefs.current.forEach((col, i) => {
      if (!col) return;
      gsap.to(col, {
        y: COLUMN_OFFSETS[i % COLUMN_OFFSETS.length],
        ease: "none",
        scrollTrigger: {
          trigger: parallaxRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    });
  }, []);

  useEffect(() => {
    if (activeIndex === null) return;

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    }
    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [activeIndex, close, prev, next]);

  const active = activeIndex !== null ? PHOTOS[activeIndex] : null;

  function renderTile(photo: (typeof PHOTOS)[number], index: number, delayIndex: number) {
    return (
      <Reveal key={photo.src} delay={0.04 * (delayIndex % 8)} from="up" className="mb-5 block break-inside-avoid">
        <button
          type="button"
          onClick={() => setActiveIndex(index)}
          className="group relative block w-full overflow-hidden rounded-[1.25rem]"
        >
          <FadeInImage
            src={photo.src}
            alt={photo.alt}
            width={photo.w}
            height={photo.h}
            sizes="(min-width: 1024px) 23vw, (min-width: 640px) 31vw, 46vw"
            className="h-auto w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <span className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-ivory/90 text-ink opacity-0 shadow-md backdrop-blur transition-all duration-300 group-hover:opacity-100">
            <Expand size={16} />
          </span>
        </button>
      </Reveal>
    );
  }

  return (
    <section className="overflow-hidden py-20 sm:py-28">
      <Container>
        <Reveal className="max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-terracotta">Un vistazo</p>
          <h2 className="mt-3 font-serif text-4xl leading-[1.05] text-ink text-balance sm:text-5xl">
            El ritual, en detalle
          </h2>
        </Reveal>

        {/* Below lg: plain masonry, no parallax — keeps mobile simple and fast. */}
        <div className="mt-10 columns-2 gap-5 sm:columns-3 lg:hidden">
          {PHOTOS.map((photo, i) => renderTile(photo, i, i))}
        </div>

        {/* lg+: explicit 4-column grid, each column parallaxed independently. */}
        <div ref={parallaxRef} className="mt-10 hidden gap-5 lg:grid lg:grid-cols-4">
          {COLUMNS.map((column, colIndex) => (
            <div key={colIndex} ref={(el) => { columnRefs.current[colIndex] = el; }}>
              {column.map(({ photo, index }, i) => renderTile(photo, index, colIndex + i))}
            </div>
          ))}
        </div>
      </Container>

      {active && (
        <div
          data-lenis-prevent
          role="dialog"
          aria-modal="true"
          aria-label={active.alt}
          className="fixed inset-0 z-50 flex items-center justify-center bg-espresso/90 p-4 backdrop-blur-sm sm:p-8"
        >
          <button aria-hidden tabIndex={-1} className="absolute inset-0 cursor-default" onClick={close} />

          <button
            type="button"
            onClick={close}
            aria-label="Cerrar"
            className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-ivory/10 text-ivory backdrop-blur transition-colors hover:bg-ivory/20"
          >
            <X size={20} />
          </button>

          <button
            type="button"
            onClick={prev}
            aria-label="Foto anterior"
            className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-ivory/10 text-ivory backdrop-blur transition-colors hover:bg-ivory/20 sm:left-6"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Foto siguiente"
            className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-ivory/10 text-ivory backdrop-blur transition-colors hover:bg-ivory/20 sm:right-6"
          >
            <ChevronRight size={22} />
          </button>

          <div className="relative max-h-[85vh] max-w-3xl">
            <FadeInImage
              key={active.src}
              src={active.src}
              alt={active.alt}
              width={active.w}
              height={active.h}
              sizes="90vw"
              className="max-h-[85vh] w-auto rounded-2xl object-contain shadow-2xl"
            />
          </div>
        </div>
      )}
    </section>
  );
}
