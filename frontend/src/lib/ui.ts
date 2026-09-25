/**
 * Shared class recipes so every form and surface — booking flow, login and
 * admin — looks and behaves the same. Import these instead of re-typing
 * border/focus/padding combinations per component.
 */

/** Text input, select and textarea. 16px text (no iOS zoom), soft gold focus ring. */
export const fieldClass =
  "w-full rounded-xl border border-ink/15 bg-white/80 px-4 py-3 text-base text-ink placeholder:text-ink-soft/60 outline-none transition-[border-color,box-shadow] duration-200 focus:border-gold focus:ring-4 focus:ring-gold/15 disabled:opacity-60";

/** Visible label wrapping its field (never placeholder-only). */
export const labelClass = "flex flex-col gap-1.5 text-sm font-medium text-ink";

/** Raised content surface (cards, panels, form shells). */
export const surfaceClass =
  "rounded-[1.75rem] border border-ink/10 bg-white/70 shadow-[0_18px_40px_-32px_rgba(23,23,23,0.5)]";

/** Pill toggle / filter chip. */
export function chipClass(active: boolean) {
  return [
    "inline-flex min-h-10 cursor-pointer items-center justify-center rounded-full border px-4 py-2 text-xs font-medium tracking-wide transition-colors duration-200",
    active ? "border-ink bg-ink text-ivory" : "border-ink/15 bg-white/50 text-ink-soft hover:border-gold hover:text-ink",
  ].join(" ");
}
