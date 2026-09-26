"use client";

import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import { BadgeCheck, ChevronLeft, ChevronRight, Star } from "lucide-react";
import type { Review, ReviewSummary } from "@/lib/types";
import { Container } from "@/components/ui/Container";

/** Real reviews show from the first one; with none, the section stays hidden (nothing is invented). */
const MIN_TO_SHOW = 1;
const ROTATE_MS = 7000;

function Stars({ value, size = 15 }: { value: number; size?: number }) {
  return (
    <span className="inline-flex gap-0.5" aria-label={`${value} de 5 estrellas`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} size={size} aria-hidden className={n <= Math.round(value) ? "fill-gold text-gold" : "text-ink/15"} />
      ))}
    </span>
  );
}

function monthYear(date: string) {
  if (!/^\d{4}-\d{2}/.test(date)) return "";
  const d = new Date(`${date.slice(0, 7)}-15T12:00:00`);
  return d.toLocaleDateString("es-CO", { month: "short", year: "numeric" });
}

function ReviewCard({ r }: { r: Review }) {
  return (
    <figure className="flex h-full flex-col rounded-[1.5rem] bg-marfil p-6 ring-1 ring-ink/[0.07]">
      <Stars value={r.rating} />
      <blockquote className="mt-4 flex-1 text-[0.98rem] leading-relaxed text-ink">
        <p className="line-clamp-6">“{r.text}”</p>
      </blockquote>
      {r.reply && (
        <p className="mt-4 border-l-2 border-gold/50 pl-3 text-sm text-[var(--tone-body)]">
          <span className="font-semibold text-ink">L&apos;AMOUR: </span>
          {r.reply}
        </p>
      )}
      <figcaption className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-ink/[0.07] pt-4 text-sm">
        <span className="font-semibold text-ink">{r.displayName}</span>
        {r.city && <span className="text-ink-soft">· {r.city}</span>}
        {r.verified && (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-bronze">
            <BadgeCheck size={14} className="fill-gold text-ivory" aria-hidden />
            Cita verificada
          </span>
        )}
        <span className="w-full text-xs text-ink-soft">
          {[r.serviceName, monthYear(r.date)].filter(Boolean).join(" · ")}
        </span>
      </figcaption>
    </figure>
  );
}

/**
 * "Opiniones reales": the real average and count, then the reviews themselves
 * rotating on their own — one card on phones, three from md up — in a fresh
 * random order on each visit, with a story-style progress line. Pauses while
 * touched, hovered or focused, and doesn't rotate for reduced-motion users.
 */
export function ReviewsSection({ summary }: { summary: ReviewSummary }) {
  const [order, setOrder] = useState<Review[]>(summary.reviews);
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(1);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);

  // Shuffle after mount (the server render keeps a stable order, so hydration matches).
  useEffect(() => {
    const copy = [...summary.reviews];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- random order must only be chosen on the client
    setOrder(copy);
  }, [summary.reviews]);

  useEffect(() => {
    const wide = window.matchMedia("(min-width: 768px)");
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      setPerPage(wide.matches ? 3 : 1);
      setReduced(motion.matches);
    };
    sync();
    wide.addEventListener("change", sync);
    motion.addEventListener("change", sync);
    return () => {
      wide.removeEventListener("change", sync);
      motion.removeEventListener("change", sync);
    };
  }, []);

  // Never more columns than reviews: one or two sit centred instead of leaving empty slots.
  const columns = Math.min(perPage, order.length);
  const pages = Math.max(1, Math.ceil(order.length / perPage));
  const current = page % pages;
  const visible = useMemo(() => order.slice(current * perPage, current * perPage + perPage), [order, current, perPage]);

  useEffect(() => {
    if (paused || reduced || pages < 2) return;
    const t = setTimeout(() => setPage((p) => (p + 1) % pages), ROTATE_MS);
    return () => clearTimeout(t);
  }, [page, paused, reduced, pages]);

  if (summary.count < MIN_TO_SHOW) return null;

  const go = (delta: number) => setPage((p) => (p + delta + pages) % pages);

  return (
    <section aria-labelledby="opiniones-title" className="py-20 sm:py-28">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow">Opiniones reales</p>
            <h2 id="opiniones-title" className="mt-4 font-serif text-[clamp(2rem,6vw,3rem)] font-semibold leading-[1.05] tracking-tight text-ink">
              Lo que cuentan de L&apos;AMOUR
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-serif text-5xl font-semibold tabular-nums text-ink">{summary.average.toFixed(1).replace(".", ",")}</span>
            <span className="grid gap-1">
              <Stars value={summary.average} size={17} />
              <span className="text-sm text-ink-soft">
                {summary.count} {summary.count === 1 ? "opinión" : "opiniones"} de clientas
              </span>
            </span>
          </div>
        </div>

        <div
          className="mt-10"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
          onTouchStart={() => setPaused(true)}
          onTouchEnd={() => setPaused(false)}
        >
          <div
            key={`${current}-${perPage}`}
            className={clsx(
              "grid animate-fade-in gap-4",
              columns >= 3 && "md:grid-cols-3",
              columns === 2 && "mx-auto max-w-4xl md:grid-cols-2",
              columns <= 1 && "mx-auto max-w-xl",
            )}
            aria-live="polite"
          >
            {visible.map((r) => (
              <ReviewCard key={r.id} r={r} />
            ))}
          </div>

          {pages > 1 && (
            <div className="mt-6 flex items-center gap-4">
              <button type="button" onClick={() => go(-1)} aria-label="Opiniones anteriores" className={arrow}>
                <ChevronLeft size={18} aria-hidden />
              </button>
              <div className="h-[3px] flex-1 overflow-hidden rounded-full bg-ink/10" aria-hidden>
                <span
                  key={`${current}-${paused}-${reduced}`}
                  className={clsx("block h-full rounded-full bg-gold", !paused && !reduced && "origin-left animate-[story-progress_7s_linear_forwards]")}
                  style={paused || reduced ? { width: `${((current + 1) / pages) * 100}%` } : undefined}
                />
              </div>
              <span className="text-xs tabular-nums text-ink-soft">
                {current + 1}/{pages}
              </span>
              <button type="button" onClick={() => go(1)} aria-label="Más opiniones" className={arrow}>
                <ChevronRight size={18} aria-hidden />
              </button>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}

const arrow =
  "flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full border border-ink/10 bg-marfil text-ink transition-colors hover:border-gold/60";
