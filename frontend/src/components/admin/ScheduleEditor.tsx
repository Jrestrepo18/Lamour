"use client";

import { useState } from "react";
import clsx from "clsx";
import { CalendarOff, Copy, Plus, X } from "lucide-react";
import type { MasseuseSchedule, WorkingBlock } from "@/lib/types";
import { fieldClass } from "@/lib/ui";
import { ChipChoice } from "./kit";

/** Monday first, as people read a week; values follow JS/.NET numbering (0 = domingo). */
const WEEK = [
  { day: 1, label: "Lunes" },
  { day: 2, label: "Martes" },
  { day: 3, label: "Miércoles" },
  { day: 4, label: "Jueves" },
  { day: 5, label: "Viernes" },
  { day: 6, label: "Sábado" },
  { day: 0, label: "Domingo" },
];

const DEFAULT_BLOCK = { start: "09:00", end: "21:00" };

const INTERVALS = [15, 30, 45, 60, 90].map((m) => ({ value: m, label: m < 60 ? `${m} min` : m === 60 ? "1 h" : "1 h 30" }));
const BUFFERS = [0, 15, 30, 45, 60, 90].map((m) => ({
  value: m,
  label: m === 0 ? "Sin pausa" : m < 60 ? `${m} min` : m === 60 ? "1 h" : "1 h 30",
}));

/** Every 15 minutes from 5:00 to 24:00. */
const TIMES = Array.from({ length: (24 - 5) * 4 + 1 }, (_, i) => {
  const total = 5 * 60 + i * 15;
  const value = `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
  return { value, label: timeLabel(value) };
});

export function timeLabel(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  if (h === 24) return "12:00 a. m.";
  const suffix = h < 12 ? "a. m." : "p. m.";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${suffix}`;
}

const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

/** First problem in the week, in words, or null when it can be saved. */
export function scheduleProblem(schedule: MasseuseSchedule): string | null {
  for (const { day, label } of WEEK) {
    const blocks = schedule.workingHours
      .filter((b) => b.dayOfWeek === day)
      .sort((a, b) => toMinutes(a.start) - toMinutes(b.start));
    for (const b of blocks) {
      if (toMinutes(b.end) <= toMinutes(b.start)) return `${label}: cada bloque debe terminar después de empezar.`;
    }
    for (let i = 1; i < blocks.length; i++) {
      if (toMinutes(blocks[i].start) < toMinutes(blocks[i - 1].end)) return `${label}: hay bloques que se cruzan.`;
    }
  }
  return null;
}

export function ScheduleEditor({
  schedule,
  onChange,
}: {
  schedule: MasseuseSchedule;
  onChange: (schedule: MasseuseSchedule) => void;
}) {
  const [newOff, setNewOff] = useState({ date: "", note: "" });
  const custom = schedule.workingHours.length > 0;
  const today = new Date().toLocaleDateString("en-CA");

  function setBlocks(day: number, blocks: Omit<WorkingBlock, "dayOfWeek">[]) {
    onChange({
      ...schedule,
      workingHours: [
        ...schedule.workingHours.filter((b) => b.dayOfWeek !== day),
        ...blocks.map((b) => ({ ...b, dayOfWeek: day })),
      ],
    });
  }

  function copyToAll(day: number) {
    const source = schedule.workingHours.filter((b) => b.dayOfWeek === day);
    const workingDays = WEEK.filter((w) => schedule.workingHours.some((b) => b.dayOfWeek === w.day)).map((w) => w.day);
    onChange({
      ...schedule,
      workingHours: workingDays.flatMap((d) => source.map((b) => ({ ...b, dayOfWeek: d }))),
    });
  }

  function addOff() {
    if (!newOff.date || schedule.timeOff.some((t) => t.date === newOff.date)) return;
    onChange({
      ...schedule,
      timeOff: [...schedule.timeOff, { date: newOff.date, note: newOff.note.trim() || null }].sort((a, b) =>
        a.date.localeCompare(b.date),
      ),
    });
    setNewOff({ date: "", note: "" });
  }

  const upcomingOff = schedule.timeOff.filter((t) => t.date >= today);

  return (
    <div className="space-y-8">
      {/* Sessions */}
      <section className="space-y-5">
        <ChipChoice
          label="Las sesiones pueden empezar cada"
          options={INTERVALS}
          value={schedule.slotIntervalMinutes}
          onChange={(v) => onChange({ ...schedule, slotIntervalMinutes: v })}
        />
        <div>
          <ChipChoice
            label="Tiempo libre entre citas"
            options={BUFFERS}
            value={schedule.bufferMinutes}
            onChange={(v) => onChange({ ...schedule, bufferMinutes: v })}
          />
          <p className="mt-2 text-xs text-ink-soft">Para el traslado a la siguiente dirección y preparar el espacio.</p>
        </div>
      </section>

      {/* Week */}
      <section>
        <p className="text-sm font-medium text-ink">Días y horas de trabajo</p>
        {!custom ? (
          <div className="mt-3 rounded-2xl bg-marfil p-4">
            <p className="text-sm text-ink">Usa el horario general: todos los días de 9:00 a. m. a 9:00 p. m.</p>
            <button
              type="button"
              onClick={() =>
                onChange({
                  ...schedule,
                  workingHours: WEEK.filter((w) => w.day !== 0).map((w) => ({ dayOfWeek: w.day, ...DEFAULT_BLOCK })),
                })
              }
              className="mt-3 inline-flex min-h-10 cursor-pointer items-center gap-1.5 rounded-full bg-ink px-4 text-sm font-semibold text-ivory"
            >
              Personalizar su horario
            </button>
          </div>
        ) : (
          <ul className="mt-2 divide-y divide-ink/[0.07]">
            {WEEK.map(({ day, label }) => {
              const blocks = schedule.workingHours
                .filter((b) => b.dayOfWeek === day)
                .sort((a, b) => toMinutes(a.start) - toMinutes(b.start));
              const works = blocks.length > 0;
              return (
                <li key={day} className="py-3">
                  <div className="flex items-center justify-between gap-3">
                    <label className="flex cursor-pointer items-center gap-3">
                      <input
                        type="checkbox"
                        checked={works}
                        onChange={(e) => setBlocks(day, e.target.checked ? [DEFAULT_BLOCK] : [])}
                        className="peer sr-only"
                      />
                      <span
                        aria-hidden
                        className="relative h-6 w-10 shrink-0 rounded-full bg-ink/15 transition-colors after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-marfil after:shadow after:transition-transform peer-checked:bg-ink peer-checked:after:translate-x-4 peer-focus-visible:ring-2 peer-focus-visible:ring-bronze"
                      />
                      <span className={clsx("text-[0.95rem] font-semibold", works ? "text-ink" : "text-ink-soft")}>{label}</span>
                    </label>
                    {works ? (
                      <button
                        type="button"
                        onClick={() => copyToAll(day)}
                        className="inline-flex min-h-9 cursor-pointer items-center gap-1 rounded-full px-2 text-xs font-semibold text-bronze"
                      >
                        <Copy size={13} aria-hidden /> Copiar a sus días
                      </button>
                    ) : (
                      <span className="text-sm text-ink-soft">Descansa</span>
                    )}
                  </div>

                  {works && (
                    <div className="mt-2.5 space-y-2 pl-[3.25rem]">
                      {blocks.map((b, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <TimeSelect
                            label={`${label}, bloque ${i + 1}, desde`}
                            value={b.start}
                            onChange={(v) => setBlocks(day, blocks.map((x, j) => (j === i ? { ...x, start: v } : x)))}
                          />
                          <span className="text-ink-soft" aria-hidden>–</span>
                          <TimeSelect
                            label={`${label}, bloque ${i + 1}, hasta`}
                            value={b.end}
                            onChange={(v) => setBlocks(day, blocks.map((x, j) => (j === i ? { ...x, end: v } : x)))}
                          />
                          {blocks.length > 1 && (
                            <button
                              type="button"
                              onClick={() => setBlocks(day, blocks.filter((_, j) => j !== i))}
                              aria-label={`Quitar bloque ${i + 1} del ${label.toLowerCase()}`}
                              className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full text-ink-soft hover:bg-silk/60 hover:text-ink"
                            >
                              <X size={16} />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => {
                          const last = blocks[blocks.length - 1];
                          const start = Math.min(toMinutes(last.end) + 60, 23 * 60);
                          const end = Math.min(start + 180, 24 * 60);
                          const fmt = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
                          setBlocks(day, [...blocks, { start: fmt(start), end: fmt(end) }]);
                        }}
                        className="inline-flex min-h-9 cursor-pointer items-center gap-1 text-xs font-semibold text-ink-soft hover:text-ink"
                      >
                        <Plus size={13} aria-hidden /> Agregar otro bloque (p. ej. después de almuerzo)
                      </button>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
        {custom && (
          <button
            type="button"
            onClick={() => onChange({ ...schedule, workingHours: [] })}
            className="mt-2 min-h-9 cursor-pointer text-xs font-semibold text-ink-soft underline underline-offset-4 hover:text-ink"
          >
            Volver al horario general
          </button>
        )}
      </section>

      {/* Days off */}
      <section>
        <p className="text-sm font-medium text-ink">Días libres</p>
        <p className="mt-0.5 text-xs text-ink-soft">Vacaciones o citas personales: ese día no aparece disponible.</p>

        {upcomingOff.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-2">
            {upcomingOff.map((t) => (
              <li key={t.date} className="inline-flex items-center gap-1.5 rounded-full bg-marfil py-1.5 pl-3 pr-1.5 text-sm text-ink ring-1 ring-ink/10">
                <CalendarOff size={14} className="text-bronze" aria-hidden />
                <span className="first-letter:uppercase">
                  {new Date(`${t.date}T12:00:00`).toLocaleDateString("es-CO", { weekday: "short", day: "numeric", month: "short" })}
                </span>
                {t.note && <span className="text-ink-soft">· {t.note}</span>}
                <button
                  type="button"
                  onClick={() => onChange({ ...schedule, timeOff: schedule.timeOff.filter((x) => x.date !== t.date) })}
                  aria-label={`Quitar día libre ${t.date}`}
                  className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-ink-soft hover:bg-silk hover:text-ink"
                >
                  <X size={13} />
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-3 grid grid-cols-[1fr_auto] gap-2 sm:grid-cols-[10rem_1fr_auto]">
          <input
            type="date"
            min={today}
            value={newOff.date}
            onChange={(e) => setNewOff((o) => ({ ...o, date: e.target.value }))}
            aria-label="Fecha del día libre"
            className={clsx(fieldClass, "col-span-2 sm:col-span-1")}
          />
          <input
            value={newOff.note}
            onChange={(e) => setNewOff((o) => ({ ...o, note: e.target.value }))}
            placeholder="Motivo (opcional)"
            aria-label="Motivo del día libre"
            className={fieldClass}
          />
          <button
            type="button"
            onClick={addOff}
            disabled={!newOff.date}
            className="min-h-12 cursor-pointer rounded-xl bg-ink px-4 text-sm font-semibold text-ivory disabled:opacity-40"
          >
            Agregar
          </button>
        </div>
      </section>
    </div>
  );
}

function TimeSelect({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <select
      aria-label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="min-h-11 w-full min-w-0 cursor-pointer appearance-none rounded-xl border border-ink/15 bg-marfil px-2 text-center text-base text-ink outline-none focus:border-gold focus:ring-4 focus:ring-gold/15 sm:text-sm"
    >
      {TIMES.map((t) => (
        <option key={t.value} value={t.value}>
          {t.label}
        </option>
      ))}
    </select>
  );
}
