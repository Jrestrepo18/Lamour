"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { ArrowUpRight, ChevronDown, ChevronUp, Clock3, Heart, MessageCircle, Send, X } from "lucide-react";
import { useLenisInstance } from "@/components/motion/LenisProvider";
import { useFavorites } from "@/hooks/useFavorites";
import { formatCOP, formatDuration } from "@/lib/format";
import type { Photo } from "@/lib/photos";
import type { Service } from "@/lib/types";

export type Reel = { service: Service; photo: Photo };

/**
 * Full-screen Reels viewer: one ritual per screen, swipe up/down (vertical
 * scroll-snap) to move between them — the Reels gesture. The right-hand rail
 * does real things: ♡ saves the ritual to "Guardados" (shown in the booking
 * flow), 💬 opens the FAQ chat, ➤ shares. Double-tap the photo to save, with
 * the heart pop. Arrow keys / ↑↓ buttons on desktop. Portaled to <body>.
 */
export function ReelViewer({ reels, start, onClose }: { reels: Reel[]; start: number; onClose: () => void }) {
  const [active, setActive] = useState(start);
  const [burst, setBurst] = useState(0);
  const [copied, setCopied] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastTap = useRef(0);
  const downAt = useRef<{ x: number; y: number } | null>(null);
  const lenis = useLenisInstance();
  const { isFavorite, toggle, add } = useFavorites();
  const current = reels[active].service;

  // Open on the reel that was tapped, without an animated scroll from the first one.
  useLayoutEffect(() => {
    const track = trackRef.current;
    if (track) track.scrollTop = start * track.clientHeight;
  }, [start]);

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

  function goTo(i: number) {
    const track = trackRef.current;
    if (!track) return;
    const index = Math.max(0, Math.min(reels.length - 1, i));
    track.scrollTo({ top: index * track.clientHeight, behavior: "smooth" });
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowDown") {
        e.preventDefault();
        goTo(active + 1);
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        goTo(active - 1);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  });

  function onScroll() {
    const track = trackRef.current;
    if (!track || track.clientHeight === 0) return;
    setActive(Math.round(track.scrollTop / track.clientHeight));
  }

  function onPointerDown(e: React.PointerEvent) {
    downAt.current = { x: e.clientX, y: e.clientY };
  }
  function onPointerUp(e: React.PointerEvent, slug: string) {
    const d = downAt.current;
    if ((e.target as Element).closest("a, button")) return;
    if (!d || Math.abs(e.clientX - d.x) > 10 || Math.abs(e.clientY - d.y) > 10) return;
    const now = e.timeStamp;
    if (now - lastTap.current < 320) {
      add(slug);
      setBurst((b) => b + 1);
      lastTap.current = 0;
    } else {
      lastTap.current = now;
    }
  }

  async function share() {
    const url = `${window.location.origin}/reservar?service=${current.slug}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: `L'AMOUR — ${current.name}`, text: current.shortDescription, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Share sheet dismissed.
    }
  }

  const saved = isFavorite(current.slug);

  return createPortal(
    <div
      data-lenis-prevent
      role="dialog"
      aria-modal="true"
      aria-label="Rituales destacados"
      className="fixed inset-0 z-[60] flex animate-fade-in items-center justify-center bg-espresso sm:bg-espresso/92 sm:p-4"
    >
      <div className="relative h-full w-full sm:aspect-[9/16] sm:h-[min(92dvh,52rem)] sm:w-auto sm:overflow-hidden sm:rounded-[1.5rem] sm:shadow-2xl">
        {/* Vertical reel track */}
        <div
          ref={trackRef}
          onScroll={onScroll}
          className="h-full snap-y snap-mandatory overflow-y-auto overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {reels.map(({ service, photo }, i) => (
            <section
              key={service.id}
              aria-label={`${i + 1} de ${reels.length}: ${service.name}`}
              className="relative h-full w-full touch-manipulation snap-start snap-always overflow-hidden"
              onPointerDown={onPointerDown}
              onPointerUp={(e) => onPointerUp(e, service.slug)}
            >
              <div className="absolute inset-0 animate-kenburns" style={{ animationDelay: `-${i * 4}s` }}>
                {service.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element -- admin-uploaded image served by the API host
                  <img src={service.imageUrl} alt={service.name} className="h-full w-full object-cover" />
                ) : (
                  <Image src={photo.src} alt={photo.alt} fill sizes="(min-width: 640px) 30rem, 100vw" className="object-cover" />
                )}
              </div>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-espresso/55 via-transparent to-espresso/90" />

              {/* Caption block */}
              <div className="absolute inset-x-0 bottom-0 pb-[max(1.5rem,env(safe-area-inset-bottom))] pl-5 pr-20">
                <div className="flex items-center gap-2.5">
                  <span className="rounded-full bg-[conic-gradient(from_210deg,#c9a227,#d6b978,#a8871a,#c9a227)] p-[2px]">
                    <Image src="/icon.svg" alt="" width={28} height={28} className="h-7 w-7 rounded-full border-2 border-espresso" />
                  </span>
                  <span className="text-sm font-semibold text-ivory">L&apos;AMOUR</span>
                  <span className="rounded-full border border-ivory/40 px-2 py-0.5 text-[0.65rem] font-medium text-ivory/90">
                    Lo más pedido
                  </span>
                </div>
                <h3 className="mt-3 font-serif text-2xl font-semibold leading-tight text-ivory">{service.name}</h3>
                <p className="mt-1.5 line-clamp-3 text-sm leading-relaxed text-ivory/85">{service.shortDescription}</p>
                <p className="mt-2 flex items-center gap-2 text-sm text-ivory/85">
                  <Clock3 size={14} className="text-champagne" aria-hidden />
                  {formatDuration(service.durationMinutes)} ·{" "}
                  <span className="font-semibold text-ivory">{formatCOP(service.price)}</span>
                </p>
                <Link
                  href={`/reservar?service=${service.slug}`}
                  className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-full bg-ivory px-5 text-sm font-semibold text-ink transition-colors hover:bg-champagne"
                >
                  Reservar este ritual
                  <ArrowUpRight size={15} aria-hidden />
                </Link>
              </div>
            </section>
          ))}
        </div>

        {/* Top bar */}
        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between px-4 pt-[max(0.75rem,env(safe-area-inset-top))]">
          <span className="text-base font-semibold text-ivory">Reels</span>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="pointer-events-auto flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-ivory transition-colors hover:bg-ivory/10"
          >
            <X size={24} />
          </button>
        </div>

        {/* Action rail */}
        <div className="absolute bottom-[max(6.5rem,calc(env(safe-area-inset-bottom)+5.5rem))] right-2 flex flex-col items-center gap-3 text-ivory">
          <button
            type="button"
            onClick={() => toggle(current.slug)}
            aria-pressed={saved}
            aria-label={saved ? `Quitar ${current.name} de guardados` : `Guardar ${current.name}`}
            className="flex h-12 w-12 cursor-pointer flex-col items-center justify-center rounded-full transition-transform active:scale-90"
          >
            <Heart size={28} aria-hidden className={clsx("transition-[fill,color,transform] duration-300", saved && "scale-110 fill-[#e0474c] text-[#e0474c]")} />
            <span className="mt-0.5 text-[0.65rem]">{saved ? "Guardado" : "Guardar"}</span>
          </button>
          <Link
            href="/#faq"
            onClick={onClose}
            aria-label="Pregúntanos en el chat"
            className="flex h-12 w-12 flex-col items-center justify-center rounded-full"
          >
            <MessageCircle size={27} className="-scale-x-100" aria-hidden />
            <span className="mt-0.5 text-[0.65rem]">Preguntar</span>
          </Link>
          <button
            type="button"
            onClick={share}
            aria-label={`Compartir ${current.name}`}
            className="relative flex h-12 w-12 cursor-pointer flex-col items-center justify-center rounded-full"
          >
            <Send size={25} aria-hidden />
            <span className="mt-0.5 text-[0.65rem]">Enviar</span>
            {copied && (
              <span role="status" className="absolute right-14 top-2 whitespace-nowrap rounded-full bg-ivory px-3 py-1 text-xs text-ink">
                Enlace copiado
              </span>
            )}
          </button>
        </div>

        {burst > 0 && (
          <span key={burst} aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <Heart size={110} className="animate-heart-pop fill-white text-white drop-shadow-[0_8px_24px_rgba(0,0,0,0.35)]" />
          </span>
        )}
      </div>

      {/* Desktop ↑↓ controls beside the reel */}
      <div className="absolute right-6 top-1/2 hidden -translate-y-1/2 flex-col gap-3 sm:flex">
        <button
          type="button"
          onClick={() => goTo(active - 1)}
          disabled={active === 0}
          aria-label="Ritual anterior"
          className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-ivory/15 text-ivory transition-opacity hover:bg-ivory/25 disabled:opacity-30"
        >
          <ChevronUp size={22} />
        </button>
        <button
          type="button"
          onClick={() => goTo(active + 1)}
          disabled={active === reels.length - 1}
          aria-label="Ritual siguiente"
          className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-ivory/15 text-ivory transition-opacity hover:bg-ivory/25 disabled:opacity-30"
        >
          <ChevronDown size={22} />
        </button>
      </div>
    </div>,
    document.body,
  );
}
