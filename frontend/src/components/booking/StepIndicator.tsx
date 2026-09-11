import clsx from "clsx";
import { Check } from "lucide-react";

const STEPS = ["Servicio", "Masajista", "Horario", "Tus Datos", "Confirmación"];

export function StepIndicator({ current }: { current: number }) {
  return (
    <ol className="flex w-full items-center">
      {STEPS.map((label, i) => {
        const step = i + 1;
        const done = step < current;
        const active = step === current;
        return (
          <li key={label} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <span
                className={clsx(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-sans font-semibold transition-colors",
                  done && "border-gold bg-gold text-ivory",
                  active && "border-gold text-gold-dark",
                  !done && !active && "border-silk text-ink-soft/50",
                )}
              >
                {done ? <Check size={14} /> : step}
              </span>
              <span
                className={clsx(
                  "hidden text-[0.65rem] font-sans uppercase tracking-wider sm:block",
                  active ? "text-ink" : "text-ink-soft/50",
                )}
              >
                {label}
              </span>
            </div>
            {step < STEPS.length && (
              <div className={clsx("mx-2 h-px flex-1", done ? "bg-gold" : "bg-silk")} />
            )}
          </li>
        );
      })}
    </ol>
  );
}
