"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import { addDays, format, isSameDay } from "date-fns";
import { es } from "date-fns/locale";
import { getAvailability } from "@/lib/api";
import { formatTime } from "@/lib/format";
import { chipClass } from "@/lib/ui";
import { useAutoRefresh } from "@/hooks/useAutoRefresh";
import type { AvailabilitySlot, Masseuse, Service } from "@/lib/types";
import { GroupLabel, StepHeading, railClass, wrapRailClass } from "./parts";

const DAYS_AHEAD = 14;
const EXTRA_TIME_OPTIONS = [0, 15, 30, 45];

const DAYPARTS = [
  { label: "Mañana", test: (h: number) => h < 12 },
  { label: "Tarde", test: (h: number) => h >= 12 && h < 18 },
  { label: "Noche", test: (h: number) => h >= 18 },
];

export function ScheduleStep({
  service,
  primary,
  secondary,
  date,
  onDateChange,
  selectedStart,
  onSelectSlot,
  extraMinutes,
  onExtraMinutesChange,
}: {
  service: Service;
  primary: Masseuse;
  secondary: Masseuse | null;
  date: Date;
  onDateChange: (d: Date) => void;
  selectedStart: string | null;
  onSelectSlot: (slot: AvailabilitySlot) => void;
  extraMinutes: number;
  onExtraMinutesChange: (m: number) => void;
}) {
  const [slots, setSlots] = useState<AvailabilitySlot[] | null>(null);
  const [loading, setLoading] = useState(true);

  const duration = service.durationMinutes + extraMinutes;
  const dateStr = format(date, "yyyy-MM-dd");

  // Both therapists must be free for a four-hands ritual: keep only the slots free for each.
  async function fetchSlots() {
    const primaryRes = await getAvailability(primary.id, dateStr, duration);
    let merged = primaryRes.data;
    if (secondary) {
      const secondaryRes = await getAvailability(secondary.id, dateStr, duration);
      const secondaryAvailable = new Set(secondaryRes.data.filter((s) => s.available).map((s) => s.start));
      merged = merged.map((s) => ({ ...s, available: s.available && secondaryAvailable.has(s.start) }));
    }
    return merged;
  }

  useEffect(() => {
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- resets slot state before refetching on date/masseuse change
    setLoading(true);
    setSlots(null);
    fetchSlots().then((merged) => {
      if (!cancelled) {
        setSlots(merged);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [primary.id, secondary, dateStr, duration]);

  // While the client decides, slots someone else just booked disappear on their own.
  useAutoRefresh(async () => setSlots(await fetchSlots()), 45_000, !loading);

  const today = new Date();
  const days = Array.from({ length: DAYS_AHEAD }, (_, i) => addDays(today, i));
  const available = slots?.filter((s) => s.available) ?? [];
  const who = secondary ? `${primary.stageName} y ${secondary.stageName}` : primary.stageName;

  return (
    <div>
      <StepHeading title="¿Cuándo te visitamos?" hint={`Solo ves los horarios en que ${who} ${secondary ? "están" : "está"} libre.`} />

      <p className="mt-7 text-sm font-semibold capitalize text-ink">{format(date, "MMMM yyyy", { locale: es })}</p>
      <div className={clsx(railClass, "mt-3")}>
        {days.map((d, i) => {
          const active = isSameDay(d, date);
          return (
            <button
              key={d.toISOString()}
              type="button"
              aria-pressed={active}
              aria-label={format(d, "EEEE d 'de' MMMM", { locale: es })}
              onClick={() => onDateChange(d)}
              className={clsx(
                "flex w-[3.75rem] shrink-0 cursor-pointer flex-col items-center gap-0.5 rounded-2xl border py-2.5 transition-colors duration-200",
                active ? "border-ink bg-ink text-ivory" : "border-ink/10 bg-marfil/60 text-ink hover:border-gold/60",
              )}
            >
              <span className={clsx("text-[0.65rem] font-semibold uppercase tracking-wide", active ? "text-champagne" : "text-ink-soft")}>
                {i === 0 ? "Hoy" : format(d, "EEE", { locale: es }).replace(".", "")}
              </span>
              <span className="font-serif text-lg font-semibold">{format(d, "d")}</span>
            </button>
          );
        })}
      </div>

      {service.allowsExtraTime && (
        <div className="mt-7">
          <GroupLabel>¿Un poco más de tiempo?</GroupLabel>
          <div className={clsx(wrapRailClass, "mt-3")}>
            {EXTRA_TIME_OPTIONS.map((m) => (
              <button
                key={m}
                type="button"
                aria-pressed={extraMinutes === m}
                onClick={() => onExtraMinutesChange(m)}
                className={clsx(chipClass(extraMinutes === m), "min-h-11 shrink-0 whitespace-nowrap")}
              >
                {m === 0 ? "Sin extra" : `+${m} min`}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 space-y-7" aria-live="polite" aria-busy={loading}>
        {loading ? (
          <div>
            <span className="sr-only">Consultando disponibilidad…</span>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-5" aria-hidden>
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="h-12 animate-pulse rounded-xl bg-ink/[0.06]" />
              ))}
            </div>
          </div>
        ) : available.length === 0 ? (
          <p className="rounded-2xl bg-marfil/70 px-5 py-6 text-center text-sm text-ink-soft">
            {isSameDay(date, today) ? "Hoy ya no quedan horarios." : "Este día no quedan horarios."} Prueba con otra fecha.
          </p>
        ) : (
          DAYPARTS.map((part) => {
            const list = available.filter((s) => part.test(new Date(s.start).getHours()));
            if (list.length === 0) return null;
            return (
              <div key={part.label} className="animate-fade-in">
                <GroupLabel>{part.label}</GroupLabel>
                <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5">
                  {list.map((s) => {
                    const on = selectedStart === s.start;
                    return (
                      <button
                        key={s.start}
                        type="button"
                        aria-pressed={on}
                        onClick={() => onSelectSlot(s)}
                        className={clsx(
                          "flex min-h-12 cursor-pointer items-center justify-center rounded-xl border text-sm font-medium transition-colors duration-200",
                          on ? "border-ink bg-ink text-ivory" : "border-ink/10 bg-marfil/60 text-ink hover:border-gold/60",
                        )}
                      >
                        {formatTime(s.start)}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
