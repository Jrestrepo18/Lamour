import clsx from "clsx";

export const STEPS = ["Servicio", "Masajista", "Horario", "Tus datos", "Confirmar"];

/**
 * Progress as Instagram story bars: one segment per step, filled in ink once
 * done and in gold while current. Finished segments are buttons, so the
 * visitor can hop back to any earlier step.
 */
export function StepIndicator({ current, onJump }: { current: number; onJump: (step: number) => void }) {
  return (
    <nav aria-label="Progreso de la reserva">
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
                aria-label={done ? `Volver a ${label}` : `${label}${active ? " (paso actual)" : ""}`}
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
          Paso {current} de {STEPS.length}
        </span>
      </p>
    </nav>
  );
}
