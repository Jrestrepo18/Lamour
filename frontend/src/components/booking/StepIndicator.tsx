import clsx from "clsx";
import { Check } from "lucide-react";

const STEPS = ["Servicio", "Masajista", "Horario", "Tus Datos", "Confirmación"];

export function StepIndicator({ current }: { current: number }) {
  return (
    <ol aria-label="Progreso de la reserva" className="flex w-full items-center">
      {STEPS.map((label, i) => {
        const step = i + 1;
        const done = step < current;
        const active = step === current;
        return (
          <li
            key={label}
            aria-current={active ? "step" : undefined}
            className="flex flex-1 items-center last:flex-none"
          >
            <div className="flex flex-col items-center gap-1.5">
              <span
                className={clsx(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-sans font-semibold transition-colors",
                  done && "border-ink bg-ink text-ivory",
                  active && "border-gold bg-gold/15 text-ink ring-4 ring-gold/15",
                  !done && !active && "border-ink/15 text-ink-soft",
                )}
              >
                {done ? <Check size={14} /> : step}
              </span>
              <span
                className={clsx(
                  "hidden text-[0.65rem] font-sans uppercase tracking-wider sm:block",
                  active ? "font-semibold text-ink" : "text-ink-soft",
                )}
              >
                {label}
              </span>
            </div>
            {step < STEPS.length && (
              <div aria-hidden className={clsx("mx-2 h-px flex-1 transition-colors", done ? "bg-gold" : "bg-ink/10")} />
            )}
          </li>
        );
      })}
    </ol>
  );
}
