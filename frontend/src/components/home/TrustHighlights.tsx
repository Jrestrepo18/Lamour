"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { ArrowUpRight, CalendarCheck, MapPinned, ShieldCheck, Sparkles, X, type LucideIcon } from "lucide-react";
import { useLenisInstance } from "@/components/motion/LenisProvider";
import { Container } from "@/components/ui/Container";
import { PHOTOS, type Photo } from "@/lib/photos";

type Highlight = { label: string; title: string; text: string; icon: LucideIcon; photo: Photo };

const HIGHLIGHTS: Highlight[] = [
  {
    label: "Certificadas",
    title: "Terapeutas certificadas",
    text: "Técnica, presencia y trato profesional en cada ritual. Cada terapeuta es seleccionada por su formación y su discreción.",
    icon: Sparkles,
    photo: PHOTOS.handsBack,
  },
  {
    label: "Discreción",
    title: "Discreción total",
    text: "Sin señalética ni uniformes. Llegamos como una visita más, y toda la comunicación se maneja con absoluta confidencialidad.",
    icon: ShieldCheck,
    photo: PHOTOS.candles,
  },
  {
    label: "Reserva fácil",
    title: "Reserva en tiempo real",
    text: "Elige tu servicio, tu terapeuta y un horario disponible en minutos, sin llamadas ni esperas. Te confirmamos por WhatsApp.",
    icon: CalendarCheck,
    photo: PHOTOS.suite,
  },
  {
    label: "A domicilio",
    title: "Todo el Valle de Aburrá",
    text: "Medellín, Envigado, Sabaneta, Itagüí, Bello, La Estrella, Caldas y Rionegro. Tu ritual, en la privacidad de tu espacio.",
    icon: MapPinned,
    photo: PHOTOS.bathTray,
  },
];

const STORY_SECONDS = 6;

/**
 * The service guarantees as Instagram-style story highlights: photo circles
 * with the gold "unseen" ring, opening a full-screen story viewer — progress
 * bars, tap left/right to move, press-and-hold to pause, auto-advance. A
 * gesture every visitor already knows, instead of a plain feature list.
 */
export function TrustHighlights() {
  const [open, setOpen] = useState<number | null>(null);
  const [seen, setSeen] = useState<Set<number>>(new Set());

  function openStory(i: number) {
    setOpen(i);
    setSeen((s) => new Set(s).add(i));
  }

  return (
    <section aria-label="Por qué elegir L'AMOUR" className="border-y border-ink/10 bg-white/40 backdrop-blur-sm">
      <Container className="py-8 sm:py-10">
        <ul className="flex items-start justify-between gap-2 sm:justify-center sm:gap-12">
          {HIGHLIGHTS.map((h, i) => (
            <li key={h.label} className="flex w-[4.75rem] flex-col items-center sm:w-24">
              <button
                type="button"
                onClick={() => openStory(i)}
                aria-label={`Ver historia: ${h.title}`}
                className="group relative cursor-pointer rounded-full"
              >
                {/* The ring: gold gradient while unseen, a quiet hairline once viewed — like stories. */}
                <span
                  className={clsx(
                    "block rounded-full p-[2.5px] transition-colors duration-500",
                    seen.has(i)
                      ? "bg-ink/15"
                      : "bg-[conic-gradient(from_210deg,#d4af37,#e8d8b0,#9c7a26,#d4af37)]",
                  )}
                >
                  <span className="block rounded-full bg-ivory p-[3px]">
                    <span className="relative block h-16 w-16 overflow-hidden rounded-full sm:h-20 sm:w-20">
                      <Image
                        src={h.photo.src}
                        alt=""
                        fill
                        sizes="80px"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      />
                      <span className="absolute inset-0 bg-espresso/15" />
                    </span>
                  </span>
                </span>
                <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-ivory bg-ink text-champagne sm:h-7 sm:w-7">
                  <h.icon size={12} strokeWidth={2} aria-hidden />
                </span>
              </button>
              <span className="mt-2.5 text-center text-xs font-medium leading-tight text-ink">{h.label}</span>
            </li>
          ))}
        </ul>
      </Container>

      {/* Portaled to <body>: this section's backdrop-blur creates a containing block
          that would otherwise trap the viewer's position:fixed inside the strip. */}
      {open !== null &&
        createPortal(
          <StoryViewer
            index={open}
            onIndexChange={(i) => {
              setOpen(i);
              setSeen((s) => new Set(s).add(i));
            }}
            onClose={() => setOpen(null)}
          />,
          document.body,
        )}
    </section>
  );
}

function StoryViewer({
  index,
  onIndexChange,
  onClose,
}: {
  index: number;
  onIndexChange: (i: number) => void;
  onClose: () => void;
}) {
  const [paused, setPaused] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const lenis = useLenisInstance();
  const reduceMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const story = HIGHLIGHTS[index];

  const next = useCallback(() => {
    if (index < HIGHLIGHTS.length - 1) onIndexChange(index + 1);
    else onClose();
  }, [index, onIndexChange, onClose]);
  const prev = useCallback(() => onIndexChange(Math.max(0, index - 1)), [index, onIndexChange]);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    lenis?.stop();
    return () => {
      document.body.style.overflow = previousOverflow;
      lenis?.start();
      previouslyFocused?.focus();
    };
  }, [lenis]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [next, prev, onClose]);

  return (
    <div
      data-lenis-prevent
      role="dialog"
      aria-modal="true"
      aria-label={story.title}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-espresso/90 backdrop-blur-md animate-fade-in sm:p-6"
    >
      <button type="button" aria-hidden tabIndex={-1} className="absolute inset-0 cursor-default" onClick={onClose} />

      <div
        className="relative h-full w-full overflow-hidden bg-espresso sm:aspect-[9/16] sm:h-[min(88dvh,46rem)] sm:w-auto sm:rounded-[1.75rem] sm:shadow-2xl"
        onPointerDown={() => setPaused(true)}
        onPointerUp={() => setPaused(false)}
        onPointerLeave={() => setPaused(false)}
      >
        <Image
          key={story.photo.src}
          src={story.photo.src}
          alt={story.photo.alt}
          fill
          sizes="(min-width: 640px) 26rem, 100vw"
          className="object-cover animate-hero-settle"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-espresso/70 via-transparent to-espresso/90" />

        {/* Progress bars */}
        <div className="absolute inset-x-3 top-[max(0.75rem,env(safe-area-inset-top))] flex gap-1.5">
          {HIGHLIGHTS.map((h, i) => (
            <span key={h.label} className="h-[3px] flex-1 overflow-hidden rounded-full bg-ivory/30">
              <span
                key={`${index}-${i}`}
                className={clsx("block h-full rounded-full bg-ivory", i < index && "w-full", i > index && "w-0")}
                style={
                  i === index
                    ? reduceMotion
                      ? { width: "100%" }
                      : {
                          animation: `story-progress ${STORY_SECONDS}s linear forwards`,
                          animationPlayState: paused ? "paused" : "running",
                        }
                    : undefined
                }
                onAnimationEnd={i === index ? next : undefined}
              />
            </span>
          ))}
        </div>

        {/* Header */}
        <div className="absolute inset-x-4 top-[max(1.75rem,calc(env(safe-area-inset-top)+1rem))] flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-champagne/60 bg-espresso/40 text-champagne">
            <story.icon size={16} aria-hidden />
          </span>
          <span className="text-sm font-semibold text-ivory">L&apos;AMOUR</span>
          <span className="text-xs text-ivory/70">{story.label}</span>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Cerrar historia"
            className="relative z-10 ml-auto flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-ivory transition-colors hover:bg-ivory/10"
          >
            <X size={22} />
          </button>
        </div>

        {/* Tap zones: left third = back, right two-thirds = forward (story convention) */}
        <button type="button" aria-label="Historia anterior" onClick={prev} className="absolute bottom-40 left-0 top-20 w-1/3 cursor-w-resize" />
        <button type="button" aria-label="Historia siguiente" onClick={next} className="absolute bottom-40 right-0 top-20 w-2/3 cursor-e-resize" />

        {/* Copy + CTA */}
        <div className="absolute inset-x-0 bottom-0 p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-champagne">
            {index + 1} / {HIGHLIGHTS.length}
          </p>
          <h3 className="mt-2 font-serif text-3xl font-semibold leading-tight text-ivory">{story.title}</h3>
          <p className="mt-3 text-base leading-relaxed text-ivory/85">{story.text}</p>
          <Link
            href="/reservar"
            className="relative z-10 mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-ivory text-sm font-semibold text-ink transition-colors hover:bg-champagne"
          >
            Reservar mi ritual
            <ArrowUpRight size={16} aria-hidden />
          </Link>
        </div>
      </div>
    </div>
  );
}
