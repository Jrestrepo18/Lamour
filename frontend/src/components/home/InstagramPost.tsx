"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { ArrowUpRight, Heart, MessageCircle, Send } from "lucide-react";
import type { Photo } from "@/lib/photos";

/**
 * A photo presented as an Instagram post: avatar header, 4:5 image, action
 * row and caption. Every action is real — like (tap ♡ or double-tap the
 * photo, with the heart pop), comment (jumps to the FAQ chat), share (native
 * share sheet, or copies the link on desktop) and a shop-style "Reservar".
 * No invented like/comment counts.
 */
export function InstagramPost({
  photo,
  title,
  caption,
  tags,
  priorityIndex = 0,
}: {
  photo: Photo;
  title: string;
  caption: string;
  tags: string[];
  /** Offsets the photo's slow "reel" drift so neighbouring posts don't move in sync. */
  priorityIndex?: number;
}) {
  const [liked, setLiked] = useState(false);
  const [burst, setBurst] = useState(0);
  const [copied, setCopied] = useState(false);
  const lastTap = useRef(0);

  function onPhotoTap() {
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
    const data = { title: `L'AMOUR — ${title}`, text: caption, url };
    try {
      if (navigator.share) {
        await navigator.share(data);
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // User dismissed the share sheet — nothing to do.
    }
  }

  return (
    <article className="overflow-hidden rounded-[1.5rem] border border-ink/10 bg-white shadow-[0_24px_50px_-34px_rgba(43,32,25,0.6)]">
      {/* Header */}
      <header className="flex items-center gap-3 px-4 py-3">
        <span className="rounded-full bg-[conic-gradient(from_210deg,#d4af37,#e8d8b0,#9c7a26,#d4af37)] p-[2px]">
          <span className="block rounded-full bg-white p-[2px]">
            <Image src="/icon.svg" alt="" width={30} height={30} className="h-[30px] w-[30px] rounded-full" />
          </span>
        </span>
        <div className="min-w-0 leading-tight">
          <p className="text-sm font-semibold text-ink">L&apos;AMOUR</p>
          <p className="text-xs text-ink-soft">Medellín</p>
        </div>
      </header>

      {/* Photo — double tap to like */}
      <div className="relative aspect-[4/5] touch-manipulation overflow-hidden bg-silk" onPointerUp={onPhotoTap}>
        <div className="absolute inset-0 animate-kenburns" style={{ animationDelay: `-${priorityIndex * 3}s` }}>
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 82vw"
            className="object-cover"
          />
        </div>
        {burst > 0 && (
          <span key={burst} aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <Heart size={88} className="animate-heart-pop fill-white text-white drop-shadow-[0_8px_24px_rgba(0,0,0,0.35)]" />
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 px-2 pt-1.5">
        <button
          type="button"
          onClick={() => setLiked((v) => !v)}
          aria-pressed={liked}
          aria-label={liked ? `Quitar me gusta de ${title}` : `Me gusta ${title}`}
          className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full transition-transform active:scale-90"
        >
          <Heart
            size={24}
            aria-hidden
            className={clsx("transition-[color,fill,transform] duration-300", liked ? "scale-110 fill-[#c0392b] text-[#c0392b]" : "text-ink")}
          />
        </button>
        <Link
          href="/#faq"
          aria-label="Pregúntanos en el chat"
          className="flex h-11 w-11 items-center justify-center rounded-full text-ink"
        >
          <MessageCircle size={23} className="-scale-x-100" aria-hidden />
        </Link>
        <button
          type="button"
          onClick={share}
          aria-label={`Compartir ${title}`}
          className="relative flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-ink"
        >
          <Send size={22} aria-hidden />
          {copied && (
            <span role="status" className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-ink px-3 py-1 text-xs text-ivory">
              Enlace copiado
            </span>
          )}
        </button>
        <Link
          href="/reservar"
          className="ml-auto inline-flex min-h-9 items-center gap-1 rounded-full bg-ink px-4 text-xs font-semibold text-ivory transition-colors hover:bg-espresso"
        >
          Reservar
          <ArrowUpRight size={14} aria-hidden />
        </Link>
      </div>

      {/* Caption */}
      <div className="px-4 pb-5 pt-2">
        <h3 className="sr-only">{title}</h3>
        <p className="text-sm leading-relaxed text-ink">
          <span className="font-semibold">L&apos;AMOUR</span> <span className="font-semibold">{title}</span> — {caption}
        </p>
        <p className="mt-1.5 text-sm text-bronze">{tags.map((t) => `#${t}`).join(" ")}</p>
      </div>
    </article>
  );
}
