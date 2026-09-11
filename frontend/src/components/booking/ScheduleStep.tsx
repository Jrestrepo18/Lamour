"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import { Loader2 } from "lucide-react";
import { addDays, format, isSameDay } from "date-fns";
import { es } from "date-fns/locale";
import { getAvailability } from "@/lib/api";
import { formatTime } from "@/lib/format";
import type { AvailabilitySlot, Masseuse, Service } from "@/lib/types";

const DAYS_AHEAD = 14;
const EXTRA_TIME_OPTIONS = [0, 15, 30, 45];

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
  const [isDemo, setIsDemo] = useState(false);

  const duration = service.durationMinutes + extraMinutes;
  const dateStr = format(date, "yyyy-MM-dd");

  useEffect(() => {
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- resets slot state before refetching on date/masseuse change
    setLoading(true);
    setSlots(null);

    async function load() {
      const primaryRes = await getAvailability(primary.id, dateStr, duration);
      let merged = primaryRes.data;
      let demo = primaryRes.isDemo;

      if (secondary) {
        const secondaryRes = await getAvailability(secondary.id, dateStr, duration);
        demo = demo || secondaryRes.isDemo;
        const secondaryAvailable = new Set(
          secondaryRes.data.filter((s) => s.available).map((s) => s.start),
        );
        merged = merged.map((s) => ({ ...s, available: s.available && secondaryAvailable.has(s.start) }));
      }

      if (!cancelled) {
        setSlots(merged);
        setIsDemo(demo);
        setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [primary.id, secondary, dateStr, duration]);

  const days = Array.from({ length: DAYS_AHEAD }, (_, i) => addDays(new Date(), i));

  return (
    <div>
      <h2 className="font-serif text-2xl italic text-ink">Elige tu horario</h2>
      <p className="mt-1 text-sm text-ink-soft">Disponibilidad en tiempo real, sin cruces de agenda.</p>

      {service.allowsExtraTime && (
        <div className="mt-6">
          <p className="mb-2 text-xs font-sans font-semibold uppercase tracking-wide text-gold-dark">
            Tiempo adicional (opcional)
          </p>
          <div className="flex gap-2">
            {EXTRA_TIME_OPTIONS.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => onExtraMinutesChange(m)}
                className={clsx(
                  "rounded-full border px-4 py-2 text-xs font-sans",
                  extraMinutes === m ? "border-gold bg-gold text-ivory" : "border-silk text-ink-soft hover:border-gold/40",
                )}
              >
                {m === 0 ? "Sin extra" : `+${m} min`}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 -mx-1 flex gap-2 overflow-x-auto pb-2">
        {days.map((d) => {
          const active = isSameDay(d, date);
          return (
            <button
              key={d.toISOString()}
              type="button"
              onClick={() => onDateChange(d)}
              className={clsx(
                "flex shrink-0 flex-col items-center rounded-xl border px-3.5 py-2.5 transition-colors",
                active ? "border-gold bg-gold text-ivory" : "border-silk text-ink-soft hover:border-gold/40",
              )}
            >
              <span className="text-[0.6rem] font-sans uppercase tracking-wide">
                {format(d, "EEE", { locale: es })}
              </span>
              <span className="font-serif text-base">{format(d, "d")}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-6">
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-12 text-sm text-ink-soft">
            <Loader2 size={18} className="animate-spin text-gold" />
            Consultando disponibilidad de {primary.stageName}
            {secondary ? ` y ${secondary.stageName}` : ""}…
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
            {slots
              ?.filter((s) => s.available)
              .map((s) => (
                <button
                  key={s.start}
                  type="button"
                  onClick={() => onSelectSlot(s)}
                  className={clsx(
                    "rounded-lg border px-3 py-2.5 text-sm font-sans transition-colors",
                    selectedStart === s.start
                      ? "border-gold bg-gold text-ivory"
                      : "border-silk text-ink hover:border-gold/40",
                  )}
                >
                  {formatTime(s.start)}
                </button>
              ))}
          </div>
        )}

        {!loading && slots?.every((s) => !s.available) && (
          <p className="py-8 text-center text-sm text-ink-soft">
            No hay horarios disponibles este día. Prueba otra fecha.
          </p>
        )}

        {isDemo && (
          <p className="mt-4 text-xs text-ink-soft/60">
            Mostrando horarios de demostración — conecta la API para ver disponibilidad real.
          </p>
        )}
      </div>
    </div>
  );
}
