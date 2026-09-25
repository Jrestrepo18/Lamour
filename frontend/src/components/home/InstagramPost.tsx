"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { ArrowUpRight, ChevronLeft, ChevronRight, Heart, MessageCircle, Send } from "lucide-react";
import type { Photo } from "@/lib/photos";

export type PostSlide = { title: string; caption: string; tags: string[]; photo: Photo };

/**
 * A single Instagram *carousel* post, laid out as part of the page (no card
 * frame): full-bleed on phones, a wide column on desktop. One header, one photo area you swipe
 * through (native scroll-snap), the "n/5" pill and dot indicators, and a
 * caption that changes with each photo. Every action is real — like (tap ♡
 * or double-tap the photo, heart pop), comment (jumps to the FAQ chat),
 * share (native share sheet, or copies the link on desktop) and a shop-style
 * "Reservar". No invented like/comment counts.
 *
 * `active`/`onActiveChange` are optional so a parent can drive the slide
 * (e.g. an index list beside the post on desktop).
 */
export function InstagramPost({
  slides,
  active: controlled,
  onActiveChange,
}: {
  slides: PostSlide[];
  active?: number;
  onActiveChange?: (i: number) => void;
}) {
  const [internal, setInternal] = useState(0);
  const active = controlled ?? internal;
  const setActive = useCallback(
    (i: number) => {
      setInternal(i);
      onActiveChange?.(i);
    },
    [onActiveChange],
  );

  const [liked, setLiked] = useState(false);
  const [burst, setBurst] = useState(0);
  const [copied, setCopied] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const lastTap = useRef(0);
  const downAt = useRef<{ x: number; y: number } | null>(null);
  // Target of an in-flight programmatic scroll (arrows, dots, index): intermediate
  // positions are ignored so the caption doesn't flicker through the slides passed.
  const jumpingTo = useRef<number | null>(null);
  const jumpTimer = useRef<number | undefined>(undefined);
  function startJump(index: number) {
    jumpingTo.current = index;
    // Safety net: never let a jump block swiping if the scroll gets interrupted.
    window.clearTimeout(jumpTimer.current);
    jumpTimer.current = window.setTimeout(() => (jumpingTo.current = null), 1200);
  }
  const slide = slides[active];

  // When a parent changes the slide (desktop index list), bring the photo strip along.
  useEffect(() => {
    const track = trackRef.current;
    if (controlled === undefined || !track || track.clientWidth === 0) return;
    if (Math.round(track.scrollLeft / track.clientWidth) !== controlled && jumpingTo.current === null) {
      startJump(controlled);
      track.scrollTo({ left: controlled * track.clientWidth, behavior: "smooth" });
    }
  }, [controlled]);

  function goTo(i: number) {
    const track = trackRef.current;
    if (!track) return;
    const index = Math.max(0, Math.min(slides.length - 1, i));
    setActive(index);
    if (Math.round(track.scrollLeft / track.clientWidth) === index) return;
    startJump(index);
    track.scrollTo({ left: index * track.clientWidth, behavior: "smooth" });
  }

  function onScroll() {
    const track = trackRef.current;
    if (!track || track.clientWidth === 0) return;
    const i = Math.round(track.scrollLeft / track.clientWidth);
    if (jumpingTo.current !== null) {
      if (i === jumpingTo.current) jumpingTo.current = null;
      return;
    }
    if (i !== active) setActive(i);
  }

  // Double tap to like — only real taps count, never the end of a swipe.
  function onPointerDown(e: React.PointerEvent) {
    downAt.current = { x: e.clientX, y: e.clientY };
  }
  function onPointerUp(e: React.PointerEvent) {
    const d = downAt.current;
    if ((e.target as Element).closest("button")) return;
    if (!d || Math.abs(e.clientX - d.x) > 10 || Math.abs(e.clientY - d.y) > 10) return;
    const now = Date.now();
    if (now - lastTap.current < 320) {
      setLiked(true);
      setBurst((b) => b + 1);
      lastTap.current = 0;
    } else {
      lastTap.current = now;
    }
  }

  async function share() {
    const url = `${window.location.origin}/#sentidos`;
    try {
      if (navigator.share) {
        await navigator.share({ title: `L'AMOUR — ${slide.title}`, text: slide.caption, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Share sheet dismissed — nothing to do.
    }
  }

  return (
    <article
      aria-roledescription="carrusel"
      aria-label="Publicación de L'AMOUR: un ritual para cada sentido"
      className="w-full"
    >
      {/* Header */}
      <header className="flex items-center gap-3 px-5 py-3 sm:px-8 lg:px-0 lg:pt-0">
        <span className="rounded-full bg-[conic-gradient(from_210deg,#c9a227,#d6b978,#a8871a,#c9a227)] p-[2px]">
          <span className="block rounded-full bg-ivory p-[2px]">
            <Image src="/icon.svg" alt="" width={32} height={32} className="h-8 w-8 rounded-full" />
          </span>
        </span>
        <div className="min-w-0 leading-tight">
          <p className="text-sm font-semibold text-ink">L&apos;AMOUR</p>
          <p className="text-xs text-ink-soft">Medellín</p>
        </div>
      </header>

      {/* Photos — one swipeable strip inside the same post */}
      <div className="relative overflow-hidden lg:rounded-[1.25rem]" onPointerDown={onPointerDown} onPointerUp={onPointerUp}>
        <div
          ref={trackRef}
          onScroll={onScroll}
          className="flex aspect-[4/5] touch-manipulation snap-x snap-mandatory overflow-x-auto overflow-y-hidden overscroll-x-contain bg-silk [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {slides.map((s, i) => (
            <div
              key={s.title}
              role="group"
              aria-roledescription="foto"
              aria-label={`${i + 1} de ${slides.length}: ${s.title}`}
              className="relative h-full w-full flex-none snap-center overflow-hidden"
            >
              <div className="absolute inset-0 animate-kenburns" style={{ animationDelay: `-${i * 3}s` }}>
                <Image
                  src={s.photo.src}
                  alt={s.photo.alt}
                  fill
                  sizes="(min-width: 1024px) 31rem, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
          ))}
        </div>

        {/* "n/5" pill, like Instagram's carousel counter */}
        <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-espresso/65 px-2.5 py-1 text-xs font-medium tabular-nums text-ivory">
          {active + 1}/{slides.length}
        </span>

        {/* Arrows (Instagram desktop has them; they also make it usable without swiping) */}
        <button
          type="button"
          onClick={() => goTo(active - 1)}
          disabled={active === 0}
          aria-label="Foto anterior"
          className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-ivory/85 text-ink shadow-md transition-opacity disabled:pointer-events-none disabled:opacity-0"
        >
          <ChevronLeft size={18} aria-hidden />
        </button>
        <button
          type="button"
          onClick={() => goTo(active + 1)}
          disabled={active === slides.length - 1}
          aria-label="Foto siguiente"
          className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-ivory/85 text-ink shadow-md transition-opacity disabled:pointer-events-none disabled:opacity-0"
        >
          <ChevronRight size={18} aria-hidden />
        </button>

        {burst > 0 && (
          <span key={burst} aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <Heart size={96} className="animate-heart-pop fill-white text-white drop-shadow-[0_8px_24px_rgba(0,0,0,0.35)]" />
          </span>
        )}
      </div>

      {/* Actions + dots */}
      <div className="relative flex items-center gap-1 px-2.5 pt-1.5 sm:px-5.5 lg:-ml-2.5 lg:px-0">
        <button
          type="button"
          onClick={() => setLiked((v) => !v)}
          aria-pressed={liked}
          aria-label={liked ? "Quitar me gusta" : "Me gusta"}
          className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full transition-transform active:scale-90"
        >
          <Heart
            size={24}
            aria-hidden
            className={clsx(
              "transition-[color,fill,transform] duration-300",
              liked ? "scale-110 fill-[#c0392b] text-[#c0392b]" : "text-ink",
            )}
          />
        </button>
        <Link href="/#faq" aria-label="Pregúntanos en el chat" className="flex h-11 w-11 items-center justify-center rounded-full text-ink">
          <MessageCircle size={23} className="-scale-x-100" aria-hidden />
        </Link>
        <button
          type="button"
          onClick={share}
          aria-label="Compartir"
          className="relative flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-ink"
        >
          <Send size={22} aria-hidden />
          {copied && (
            <span role="status" className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-ink px-3 py-1 text-xs text-ivory">
              Enlace copiado
            </span>
          )}
        </button>

        {/* Dot indicators, centered under the photo */}
        <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 gap-1.5">
          {slides.map((s, i) => (
            <button
              key={s.title}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Ir a la foto ${i + 1}: ${s.title}`}
              aria-current={i === active}
              className={clsx(
                "relative h-1.5 w-1.5 cursor-pointer rounded-full transition-colors duration-300 before:absolute before:-inset-2 before:content-['']",
                i === active ? "bg-bronze" : "bg-ink/20",
              )}
            />
          ))}
        </div>

        <Link
          href="/reservar"
          className="ml-auto inline-flex min-h-9 items-center gap-1 rounded-full bg-ink px-4 text-xs font-semibold text-ivory transition-colors hover:bg-espresso"
        >
          Reservar
          <ArrowUpRight size={14} aria-hidden />
        </Link>
      </div>

      {/* Caption — changes with each photo */}
      <div className="min-h-[7rem] px-5 pb-2 pt-2 sm:px-8 lg:px-0" aria-live="polite">
        <div key={active} className="animate-fade-in">
          <h3 className="sr-only">{slide.title}</h3>
          <p className="text-sm leading-relaxed text-ink">
            <span className="font-semibold">L&apos;AMOUR</span> <span className="font-semibold">{slide.title}</span> —{" "}
            {slide.caption}
          </p>
          <p className="mt-1.5 text-sm text-bronze">{slide.tags.map((t) => `#${t}`).join(" ")}</p>
        </div>
      </div>
    </article>
  );
}
