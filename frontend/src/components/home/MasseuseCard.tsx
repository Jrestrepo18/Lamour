"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import type { Masseuse } from "@/lib/types";
import { MasseuseProfile } from "./MasseuseProfile";

function initials(name: string) {
  return name.slice(0, 1).toUpperCase();
}

/** Elegant stand-in portrait: a framed gold monogram on a warm champagne field. */
function Monogram({ name }: { name: string }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-champagne via-silk to-champagne/60">
      <div className="absolute inset-3 rounded-[1rem] border border-gold/40 sm:inset-4 sm:rounded-[1.25rem]" />
      <div className="flex h-20 w-20 items-center justify-center rounded-full border border-gold/60 bg-ivory/50 sm:h-28 sm:w-28">
        <span className="font-serif text-4xl font-semibold text-bronze sm:text-5xl">{initials(name)}</span>
      </div>
    </div>
  );
}

export function MasseuseCard({ masseuse }: { masseuse: Masseuse }) {
  const [open, setOpen] = useState(false);
  // An uploaded photo that fails to load falls back to the monogram instead of a broken-image icon.
  const [photoFailed, setPhotoFailed] = useState(false);
  const showPhoto = !!masseuse.photoUrl && !photoFailed;
  const gallery = showPhoto ? [masseuse.photoUrl!, ...masseuse.photoGallery] : masseuse.photoGallery;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        className="group relative block aspect-[3/4] w-full cursor-pointer overflow-hidden rounded-[1.25rem] bg-silk text-left shadow-[0_18px_40px_-30px_rgba(43,32,25,0.55)] transition-[transform,box-shadow] duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgba(43,32,25,0.6)] sm:rounded-[1.75rem]"
      >
        {showPhoto ? (
          // eslint-disable-next-line @next/next/no-img-element -- admin-uploaded image served by the API host
          <img
            src={masseuse.photoUrl!}
            alt={masseuse.stageName}
            loading="lazy"
            decoding="async"
            onError={() => setPhotoFailed(true)}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <Monogram name={masseuse.stageName} />
        )}

        {/* Name and age sit on the portrait itself — saves a whole text block of height on phones. */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-espresso/85 via-espresso/10 to-transparent" />
        <span
          aria-hidden
          className="absolute right-3 top-3 hidden h-10 w-10 items-center justify-center rounded-full bg-ivory/90 text-ink shadow-md transition-transform duration-300 group-hover:rotate-45 sm:flex"
        >
          <ArrowUpRight size={16} />
        </span>
        <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6">
          <h3 className="font-serif text-lg font-semibold leading-tight text-ivory sm:text-2xl">{masseuse.stageName}</h3>
          {masseuse.age != null && <p className="mt-0.5 text-xs text-ivory/80 sm:text-sm">{masseuse.age} años</p>}
          {masseuse.bio && (
            <p className="mt-2 hidden text-sm leading-relaxed text-ivory/80 sm:line-clamp-2">{masseuse.bio}</p>
          )}
        </div>
      </button>

      {open && <MasseuseProfile masseuse={masseuse} photos={gallery} onClose={() => setOpen(false)} />}
    </>
  );
}
