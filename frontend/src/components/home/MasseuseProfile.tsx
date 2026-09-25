"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowUpRight, BadgeCheck, ChevronLeft, ChevronRight, Grid3x3, X } from "lucide-react";
import type { Masseuse } from "@/lib/types";
import { LinkButton } from "@/components/ui/Button";
import { useLenisInstance } from "@/components/motion/LenisProvider";

const FOCUSABLE =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

function initial(name: string) {
  return name.slice(0, 1).toUpperCase();
}

/**
 * A masseuse opened as an Instagram-style profile: ringed avatar, verified
 * badge, stats, bio, a primary "Reservar" action and her photos as a 3-column
 * feed grid that enlarges on tap. Bottom sheet on phones, centered dialog on
 * desktop; portaled to <body> so no ancestor can trap position:fixed.
 */
export function MasseuseProfile({
  masseuse,
  photos,
  onClose,
}: {
  masseuse: Masseuse;
  photos: string[];
  onClose: () => void;
}) {
  const [viewing, setViewing] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const lenis = useLenisInstance();

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
      if (e.key === "Escape") {
        if (viewing !== null) setViewing(null);
        else onClose();
        return;
      }
      if (viewing !== null && e.key === "ArrowRight") setViewing((v) => (v === null ? v : Math.min(photos.length - 1, v + 1)));
      if (viewing !== null && e.key === "ArrowLeft") setViewing((v) => (v === null ? v : Math.max(0, v - 1)));
      if (e.key !== "Tab" || !dialogRef.current) return;
      const f = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (f.length === 0) return;
      if (e.shiftKey && document.activeElement === f[0]) {
        e.preventDefault();
        f[f.length - 1].focus();
      } else if (!e.shiftKey && document.activeElement === f[f.length - 1]) {
        e.preventDefault();
        f[0].focus();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose, viewing, photos.length]);

  const avatar = photos[0];

  return createPortal(
    <div
      data-lenis-prevent
      className="fixed inset-0 z-[60] flex animate-fade-in items-end justify-center bg-espresso/60 backdrop-blur-sm sm:items-center sm:p-6"
    >
      <button type="button" aria-hidden tabIndex={-1} className="absolute inset-0 cursor-default" onClick={onClose} />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={`Perfil de ${masseuse.stageName}`}
        className="relative flex max-h-[92dvh] w-full max-w-lg animate-rise flex-col overflow-hidden rounded-t-[2rem] bg-ivory shadow-2xl sm:rounded-[2rem]"
      >
        {/* Sheet handle + close */}
        <div className="relative flex shrink-0 items-center justify-center pb-1 pt-3">
          <span aria-hidden className="h-1 w-10 rounded-full bg-ink/15 sm:hidden" />
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Cerrar perfil"
            className="absolute right-3 top-2 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-ink transition-colors hover:bg-silk/60"
          >
            <X size={20} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto pb-[max(1.25rem,env(safe-area-inset-bottom))]">
          {/* Profile header */}
          <div className="flex items-center gap-5 px-5 pt-3 sm:px-7">
            <span className="shrink-0 rounded-full bg-[conic-gradient(from_210deg,#c9a227,#d6b978,#a8871a,#c9a227)] p-[3px]">
              <span className="block rounded-full bg-ivory p-[3px]">
                <span className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-champagne via-silk to-champagne/60">
                  {avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element -- admin-uploaded image served by the API host
                    <img src={avatar} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <span className="font-serif text-3xl font-semibold text-bronze">{initial(masseuse.stageName)}</span>
                  )}
                </span>
              </span>
            </span>

            <dl className="grid flex-1 grid-cols-2 text-center">
              <div>
                <dt className="sr-only">Fotos</dt>
                <dd className="font-serif text-xl font-semibold text-ink">{photos.length}</dd>
                <dd aria-hidden className="text-xs text-ink-soft">fotos</dd>
              </div>
              {masseuse.age != null && (
                <div>
                  <dt className="sr-only">Edad</dt>
                  <dd className="font-serif text-xl font-semibold text-ink">{masseuse.age}</dd>
                  <dd aria-hidden className="text-xs text-ink-soft">años</dd>
                </div>
              )}
            </dl>
          </div>

          <div className="px-5 pt-4 sm:px-7">
            <h2 className="flex items-center gap-1.5 font-serif text-2xl font-semibold text-ink">
              {masseuse.stageName}
              <BadgeCheck size={20} className="fill-gold text-ivory" aria-label="Terapeuta verificada" />
            </h2>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-bronze">Terapeuta L&apos;AMOUR</p>
            <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-soft">
              {masseuse.bio ?? "Terapeuta certificada del equipo L'AMOUR."}
            </p>
            <LinkButton href={`/reservar?masseuse=${masseuse.id}`} className="mt-5 w-full">
              Reservar con {masseuse.stageName}
              <ArrowUpRight size={16} aria-hidden />
            </LinkButton>
          </div>

          {/* Feed grid */}
          <div className="mt-6 border-t border-ink/10">
            <div className="flex justify-center border-b-2 border-ink/80 py-3 text-ink" aria-hidden>
              <Grid3x3 size={18} />
            </div>
            {photos.length > 0 ? (
              <ul className="grid grid-cols-3 gap-0.5">
                {photos.map((src, i) => (
                  <li key={src + i}>
                    <button
                      type="button"
                      onClick={() => setViewing(i)}
                      aria-label={`Ver foto ${i + 1} de ${photos.length}`}
                      className="group relative block aspect-square w-full cursor-zoom-in overflow-hidden bg-silk"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element -- admin-uploaded image served by the API host */}
                      <img
                        src={src}
                        alt=""
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="grid grid-cols-3 gap-0.5" aria-hidden>
                {[0, 1, 2].map((i) => (
                  <div key={i} className="flex aspect-square items-center justify-center bg-gradient-to-br from-champagne/50 to-silk">
                    <span className="font-serif text-2xl text-bronze/40">{initial(masseuse.stageName)}</span>
                  </div>
                ))}
              </div>
            )}
            {photos.length === 0 && (
              <p className="px-5 pt-4 text-center text-sm text-ink-soft">Pronto compartirá más fotos.</p>
            )}
          </div>
        </div>

        {/* Photo viewer inside the sheet */}
        {viewing !== null && (
          <div className="absolute inset-0 z-10 flex animate-fade-in items-center justify-center bg-espresso">
            {/* eslint-disable-next-line @next/next/no-img-element -- admin-uploaded image served by the API host */}
            <img
              src={photos[viewing]}
              alt={`${masseuse.stageName} — foto ${viewing + 1} de ${photos.length}`}
              className="max-h-full max-w-full object-contain"
            />
            <button
              type="button"
              onClick={() => setViewing(null)}
              aria-label="Volver al perfil"
              className="absolute right-3 top-3 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-ivory/15 text-ivory backdrop-blur"
            >
              <X size={20} />
            </button>
            {photos.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => setViewing((v) => (v === null ? v : Math.max(0, v - 1)))}
                  disabled={viewing === 0}
                  aria-label="Foto anterior"
                  className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-ivory/15 text-ivory backdrop-blur disabled:opacity-0"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  type="button"
                  onClick={() => setViewing((v) => (v === null ? v : Math.min(photos.length - 1, v + 1)))}
                  disabled={viewing === photos.length - 1}
                  aria-label="Foto siguiente"
                  className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-ivory/15 text-ivory backdrop-blur disabled:opacity-0"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
