"use client";

import clsx from "clsx";
import { useI18n } from "@/i18n/I18nProvider";

const STEP_LABELS = {
  es: ["Servicio", "Masajista", "Horario", "Tus datos", "Confirmar"],
  en: ["Service", "Therapist", "Time", "Your details", "Confirm"],
};

/**
 * Progress as Instagram story bars: one segment per step, filled in ink once
 * done and in gold while current. Finished segments are buttons, so the
 * visitor can hop back to any earlier step.
 */
export function StepIndicator({ current, onJump }: { current: number; onJump: (step: number) => void }) {
  const { t, lang } = useI18n();
  const STEPS = STEP_LABELS[lang];
  return (
    <nav aria-label={t("Progreso de la reserva", "Booking progress")}>
      <ol className="flex gap-1.5">
        {STEPS.map((label, i) => {
          const step = i + 1;
          const done = step < current;
          const active = step === current;
          return (
            <li key={label} className="flex-1" aria-current={active ? "step" : undefined}>
              <button
                type="button"
                disabled={!done}
                onClick={() => onJump(step)}
                aria-label={done ? `${t("Volver a", "Back to")} ${label}` : `${label}${active ? t(" (paso actual)", " (current step)") : ""}`}
                className="block w-full cursor-pointer py-2 disabled:cursor-default"
              >
                <span className="block h-[3px] overflow-hidden rounded-full bg-ink/10">
                  <span
                    className={clsx(
                      "block h-full rounded-full transition-[width,background-color] duration-500 ease-out",
                      done ? "w-full bg-ink" : active ? "w-full bg-gold" : "w-0",
                    )}
                  />
                </span>
              </button>
            </li>
          );
        })}
      </ol>
      <p className="mt-1 flex items-baseline justify-between text-xs">
        <span className="font-semibold uppercase tracking-[0.22em] text-bronze">{STEPS[current - 1]}</span>
        <span className="text-ink-soft">
          {t("Paso", "Step")} {current} {t("de", "of")} {STEPS.length}
        </span>
      </p>
    </nav>
  );
}
