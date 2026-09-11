import Link from "next/link";
import clsx from "clsx";
import { ArrowUpRight, Clock3, Users } from "lucide-react";
import type { Service } from "@/lib/types";
import { formatCOP, formatDuration } from "@/lib/format";

/** Editorial "menu row" presentation — no boxed card, just generous space and a hairline divider. */
export function ServiceCard({ service, tone = "light" }: { service: Service; tone?: "light" | "dark" }) {
  const dark = tone === "dark";

  return (
    <Link
      href={`/reservar?service=${service.slug}`}
      className={clsx(
        "group relative grid grid-cols-1 items-start gap-3 border-b py-8 transition-colors duration-300 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-6",
        dark ? "border-ivory/10 hover:bg-white/[0.03]" : "border-ink/10 hover:bg-terracotta/[0.04]",
      )}
    >
      {/* Reading-indicator bar: grows from the middle on hover, like a wine-list row lighting up. */}
      <span
        aria-hidden
        className={clsx(
          "absolute left-0 top-1/2 h-0 w-[3px] -translate-y-1/2 transition-all duration-500 ease-out group-hover:h-2/3",
          dark ? "bg-champagne" : "bg-terracotta",
        )}
      />

      <div className="px-1 transition-transform duration-300 group-hover:translate-x-1.5">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h3
            className={clsx(
              "font-serif text-2xl transition-colors sm:text-[1.75rem]",
              dark ? "text-ivory group-hover:text-champagne" : "text-ink group-hover:text-terracotta",
            )}
          >
            {service.name}
          </h3>
          {service.requiresTwoTherapists && (
            <span title="2 masajistas" className="inline-flex items-center gap-1 text-[0.65rem] uppercase tracking-wider text-gold">
              <Users size={12} />2 masajistas
            </span>
          )}
        </div>

        <p className={clsx("mt-2 max-w-xl text-sm leading-relaxed", dark ? "text-ivory/55" : "text-ink-soft")}>
          {service.shortDescription}
        </p>

        {service.highlights.length > 0 && (
          <p className={clsx("mt-2 text-xs", dark ? "text-ivory/35" : "text-ink-soft/70")}>
            {service.highlights.slice(0, 2).join(" · ")}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between gap-6 px-1 sm:flex-col sm:items-end sm:justify-center sm:gap-2">
        <div className={clsx("flex items-center gap-1.5 text-xs", dark ? "text-ivory/50" : "text-ink-soft")}>
          <Clock3 size={13} className="text-gold" />
          {formatDuration(service.durationMinutes)}
        </div>
        <span className={clsx("font-serif text-xl", dark ? "text-champagne" : "text-ink")}>{formatCOP(service.price)}</span>
        <span
          className={clsx(
            "flex h-8 w-8 items-center justify-center rounded-full border opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:-translate-y-0.5",
            dark ? "border-champagne/40 text-champagne" : "border-terracotta/40 text-terracotta",
          )}
        >
          <ArrowUpRight size={15} />
        </span>
      </div>
    </Link>
  );
}
