"use client";

import { useState } from "react";
import clsx from "clsx";
import { ArrowUpRight, Clock3, Sparkle, Users } from "lucide-react";
import type { Service } from "@/lib/types";
import { formatCOP, formatDuration } from "@/lib/format";
import { LinkButton } from "@/components/ui/Button";
import { DetailModal } from "./DetailModal";

/** Boxed catalog card — click opens the full detail (gallery, long description, highlights, CTA). */
export function ServiceCard({ service, tone = "light" }: { service: Service; tone?: "light" | "dark" }) {
  const [open, setOpen] = useState(false);
  const dark = tone === "dark";
  const gallery = service.imageUrl ? [service.imageUrl, ...service.imageGallery] : service.imageGallery;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={clsx(
          "group flex w-full flex-col overflow-hidden rounded-[1.75rem] border text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl",
          dark
            ? "border-ivory/10 bg-white/[0.03] hover:border-champagne/30"
            : "border-ink/10 bg-white/60 hover:border-gold/30",
        )}
      >
        <div
          className={clsx(
            "relative aspect-[4/3] w-full overflow-hidden",
            dark ? "bg-gradient-to-br from-champagne/10 to-transparent" : "bg-gradient-to-br from-champagne/50 to-gold/15",
          )}
        >
          {service.imageUrl ? (
            <img
              src={service.imageUrl}
              alt={service.name}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Sparkle size={40} strokeWidth={1.2} className={dark ? "text-champagne/40" : "text-gold/40"} />
            </div>
          )}

          {service.requiresTwoTherapists && (
            <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-ivory/90 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wide text-gold-dark shadow">
              <Users size={11} /> 2 masajistas
            </span>
          )}

          <span
            className={clsx(
              "absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full opacity-0 shadow-md backdrop-blur transition-all duration-300 group-hover:opacity-100",
              dark ? "bg-ink/80 text-champagne" : "bg-ivory/90 text-ink",
            )}
          >
            <ArrowUpRight size={16} />
          </span>
        </div>

        <div className="flex flex-1 flex-col p-5">
          <h3
            className={clsx(
              "font-serif text-xl transition-colors",
              dark ? "text-ivory group-hover:text-champagne" : "text-ink group-hover:text-terracotta",
            )}
          >
            {service.name}
          </h3>
          <p className={clsx("mt-2 line-clamp-2 text-sm leading-relaxed", dark ? "text-ivory/55" : "text-ink-soft")}>
            {service.shortDescription}
          </p>
          <div className="mt-4 flex items-center justify-between text-xs">
            <span className={clsx("flex items-center gap-1.5", dark ? "text-ivory/50" : "text-ink-soft")}>
              <Clock3 size={13} className="text-gold" />
              {formatDuration(service.durationMinutes)}
            </span>
            <span className={clsx("font-serif text-lg", dark ? "text-champagne" : "text-ink")}>
              {formatCOP(service.price)}
            </span>
          </div>
        </div>
      </button>

      <DetailModal
        open={open}
        onClose={() => setOpen(false)}
        eyebrow={service.isCoupleExperience ? "Experiencia en pareja" : undefined}
        title={service.name}
        gallery={gallery}
        fallback={
          <div className="flex h-full w-full items-center justify-center">
            <Sparkle size={64} strokeWidth={1} className="text-gold/40" />
          </div>
        }
      >
        <p className="text-sm leading-relaxed text-ink-soft">{service.longDescription ?? service.shortDescription}</p>

        {service.highlights.length > 0 && (
          <ul className="mt-4 space-y-1.5">
            {service.highlights.map((h) => (
              <li key={h} className="flex items-start gap-2 text-sm text-ink-soft">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gold" />
                {h}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-5 flex items-center gap-6 text-sm text-ink-soft">
          <span className="flex items-center gap-1.5">
            <Clock3 size={14} className="text-gold" />
            {formatDuration(service.durationMinutes)}
          </span>
          <span className="font-serif text-xl text-ink">{formatCOP(service.price)}</span>
        </div>

        <LinkButton href={`/reservar?service=${service.slug}`} className="mt-6">
          Reservar este servicio
          <ArrowUpRight size={16} />
        </LinkButton>
      </DetailModal>
    </>
  );
}
