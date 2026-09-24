"use client";

import { useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import { ArrowUpRight, Clock3, Users } from "lucide-react";
import type { Service } from "@/lib/types";
import { formatCOP, formatDuration } from "@/lib/format";
import { fallbackPhoto } from "@/lib/photos";
import { LinkButton } from "@/components/ui/Button";
import { FavoriteButton } from "@/components/ui/FavoriteButton";
import { DetailModal } from "./DetailModal";

/**
 * Catalog card — click opens the full detail (gallery, long description,
 * highlights, CTA). Services without an uploaded photo borrow a matching
 * image from the brand's own photography, so the catalog never shows an
 * empty placeholder box.
 */
export function ServiceCard({
  service,
  categorySlug,
  index = 0,
  tone = "light",
}: {
  service: Service;
  categorySlug?: string;
  index?: number;
  tone?: "light" | "dark";
}) {
  const [open, setOpen] = useState(false);
  const dark = tone === "dark";
  const gallery = service.imageUrl ? [service.imageUrl, ...service.imageGallery] : service.imageGallery;
  const stand = fallbackPhoto(categorySlug, index);

  return (
    <>
      {/* One element, two layouts: a compact "menu" row on phones (thumbnail, name,
          one-line description, duration · price) and a photo card from sm up. The ♡ sits
          beside it (not inside — buttons can't nest), over the row's end / the card photo. */}
      <div className="relative h-full">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        className={clsx(
          "group flex h-full w-full cursor-pointer items-center gap-4 border-b py-4 pr-12 text-left transition-[transform,box-shadow,border-color] duration-500 ease-out",
          "sm:flex-col sm:items-stretch sm:gap-0 sm:overflow-hidden sm:rounded-[1.75rem] sm:border sm:py-0 sm:pr-0 sm:hover:-translate-y-1",
          dark
            ? "border-ivory/10 sm:bg-white/[0.04] sm:hover:border-champagne/30 sm:hover:shadow-[0_30px_60px_-30px_rgba(0,0,0,0.8)]"
            : "border-ink/10 sm:bg-white/70 sm:shadow-[0_18px_40px_-32px_rgba(43,32,25,0.5)] sm:hover:border-gold/40 sm:hover:shadow-[0_30px_60px_-30px_rgba(43,32,25,0.55)]",
        )}
      >
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-silk sm:aspect-[4/3] sm:h-auto sm:w-full sm:rounded-none">
          {service.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- admin-uploaded image served by the API host
            <img
              src={service.imageUrl}
              alt={service.name}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          ) : (
            <Image
              src={stand.src}
              alt={stand.alt}
              fill
              sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 80px"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          )}
          <div className="pointer-events-none absolute inset-0 hidden bg-gradient-to-t from-espresso/35 via-transparent to-transparent sm:block" />

          {service.requiresTwoTherapists && (
            <span
              className="absolute bottom-1 right-1 inline-flex items-center gap-0.5 rounded-full bg-ivory/90 px-1.5 py-0.5 text-[0.65rem] font-semibold text-ink sm:hidden"
            >
              <Users size={10} aria-hidden />
              <span aria-hidden>2</span>
              <span className="sr-only">2 masajistas</span>
            </span>
          )}
          {service.requiresTwoTherapists && (
            <span className="absolute left-4 top-4 hidden items-center gap-1.5 rounded-full bg-ivory/90 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-wide text-ink sm:inline-flex">
              <Users size={12} aria-hidden /> 2 masajistas
            </span>
          )}

          <span
            aria-hidden
            className="absolute bottom-4 right-4 hidden h-10 w-10 items-center justify-center rounded-full bg-ivory/90 text-ink shadow-md transition-transform duration-300 group-hover:rotate-45 sm:flex"
          >
            <ArrowUpRight size={17} />
          </span>
        </div>

        <div className="flex min-w-0 flex-1 flex-col sm:p-6">
          <h3
            className={clsx(
              "font-serif text-base font-semibold leading-snug sm:text-xl",
              dark ? "text-ivory" : "text-ink",
            )}
          >
            {service.name}
          </h3>
          <p
            className={clsx(
              "mt-1 line-clamp-1 text-sm leading-relaxed sm:mt-2 sm:line-clamp-2 sm:flex-1",
              dark ? "text-ivory/70" : "text-ink-soft",
            )}
          >
            {service.shortDescription}
          </p>
          <div
            className={clsx(
              "mt-1.5 flex items-center gap-3 text-xs sm:mt-5 sm:justify-between sm:border-t sm:pt-4 sm:text-sm",
              dark ? "border-ivory/10 text-ivory/70" : "border-ink/10 text-ink-soft",
            )}
          >
            <span className="flex items-center gap-1.5 whitespace-nowrap">
              <Clock3 size={14} className={clsx("shrink-0", dark ? "text-champagne" : "text-bronze")} aria-hidden />
              {formatDuration(service.durationMinutes)}
            </span>
            <span
              className={clsx(
                "ml-auto font-serif text-sm font-semibold sm:ml-0 sm:text-lg",
                dark ? "text-champagne" : "text-ink",
              )}
            >
              {formatCOP(service.price)}
            </span>
          </div>
        </div>

      </button>
      <FavoriteButton
        slug={service.slug}
        name={service.name}
        tone={dark ? "dark" : "plain"}
        className="absolute right-0 top-1/2 -translate-y-1/2 sm:hidden"
      />
      <FavoriteButton slug={service.slug} name={service.name} className="absolute right-4 top-4 hidden sm:flex" />
      </div>

      <DetailModal
        open={open}
        onClose={() => setOpen(false)}
        eyebrow={service.isCoupleExperience ? "Experiencia en pareja" : formatDuration(service.durationMinutes)}
        title={service.name}
        favorite={{ slug: service.slug, name: service.name }}
        gallery={gallery}
        fallback={<Image src={stand.src} alt={stand.alt} fill sizes="(min-width: 640px) 42rem, 100vw" className="object-cover" />}
        footer={
          <LinkButton href={`/reservar?service=${service.slug}`} className="w-full">
            Reservar este servicio
            <ArrowUpRight size={16} />
          </LinkButton>
        }
      >
        <p className="text-base leading-relaxed text-ink-soft">{service.longDescription ?? service.shortDescription}</p>

        <div className="flex items-center gap-6 rounded-2xl bg-silk/50 px-5 py-4 text-sm text-ink-soft">
          <span className="flex items-center gap-1.5">
            <Clock3 size={15} className="text-bronze" aria-hidden />
            {formatDuration(service.durationMinutes)}
          </span>
          {service.requiresTwoTherapists && (
            <span className="flex items-center gap-1.5">
              <Users size={15} className="text-bronze" aria-hidden />2 masajistas
            </span>
          )}
          <span className="ml-auto font-serif text-xl font-semibold text-ink">{formatCOP(service.price)}</span>
        </div>

        {service.highlights.length > 0 && (
          <div>
            <p className="eyebrow">Incluye</p>
            <ul className="mt-3 space-y-2">
              {service.highlights.map((h) => (
                <li key={h} className="flex items-start gap-2.5 text-sm text-ink-soft">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold" aria-hidden />
                  {h}
                </li>
              ))}
            </ul>
          </div>
        )}
      </DetailModal>
    </>
  );
}
