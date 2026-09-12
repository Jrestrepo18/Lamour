"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import type { Masseuse } from "@/lib/types";
import { LinkButton } from "@/components/ui/Button";
import { DetailModal } from "./DetailModal";

function initials(name: string) {
  return name.slice(0, 1).toUpperCase();
}

export function MasseuseCard({ masseuse }: { masseuse: Masseuse }) {
  const [open, setOpen] = useState(false);
  const gallery = masseuse.photoUrl ? [masseuse.photoUrl, ...masseuse.photoGallery] : masseuse.photoGallery;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group flex w-full flex-col overflow-hidden rounded-[1.75rem] border border-ink/10 bg-white/60 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-gold/30 hover:shadow-xl"
      >
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-gradient-to-br from-champagne/50 to-gold/15">
          {masseuse.photoUrl ? (
            <img
              src={masseuse.photoUrl}
              alt={masseuse.stageName}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="font-serif text-6xl text-gold-dark/70">{initials(masseuse.stageName)}</span>
            </div>
          )}
          <span className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-ivory/90 text-ink opacity-0 shadow-md backdrop-blur transition-all duration-300 group-hover:opacity-100">
            <ArrowUpRight size={16} />
          </span>
        </div>

        <div className="flex-1 p-5">
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="font-serif text-xl text-ink transition-colors group-hover:text-terracotta">
              {masseuse.stageName}
            </h3>
            {masseuse.age != null && (
              <span className="shrink-0 text-xs font-medium text-ink-soft">{masseuse.age} años</span>
            )}
          </div>
          {masseuse.bio && <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-soft">{masseuse.bio}</p>}
        </div>
      </button>

      <DetailModal
        open={open}
        onClose={() => setOpen(false)}
        eyebrow={masseuse.age != null ? `${masseuse.age} años` : undefined}
        title={masseuse.stageName}
        gallery={gallery}
        fallback={
          <div className="flex h-full w-full items-center justify-center">
            <span className="font-serif text-8xl text-gold-dark/60">{initials(masseuse.stageName)}</span>
          </div>
        }
      >
        {masseuse.bio && <p className="text-sm leading-relaxed text-ink-soft">{masseuse.bio}</p>}
        <LinkButton href={`/reservar?masseuse=${masseuse.id}`} className="mt-6">
          Reservar con {masseuse.stageName}
          <ArrowUpRight size={16} />
        </LinkButton>
      </DetailModal>
    </>
  );
}
