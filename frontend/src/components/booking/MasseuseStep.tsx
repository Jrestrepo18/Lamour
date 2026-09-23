"use client";

import clsx from "clsx";
import { Check } from "lucide-react";
import type { Masseuse, Service } from "@/lib/types";

function initials(name: string) {
  return name.slice(0, 1).toUpperCase();
}

export function MasseuseStep({
  masseuses,
  service,
  primary,
  secondary,
  onSelectPrimary,
  onSelectSecondary,
}: {
  masseuses: Masseuse[];
  service: Service;
  primary: Masseuse | null;
  secondary: Masseuse | null;
  onSelectPrimary: (m: Masseuse) => void;
  onSelectSecondary: (m: Masseuse | null) => void;
}) {
  const needsTwo = service.requiresTwoTherapists;
  const active = masseuses.filter((m) => m.isActive);

  return (
    <div>
      <h2 className="font-serif text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
        {needsTwo ? "Elige tus dos masajistas" : "Elige tu masajista"}
      </h2>
      <p className="mt-1 text-sm text-ink-soft">
        {needsTwo
          ? `${service.name} requiere dos terapeutas trabajando en conjunto.`
          : "Conoce a nuestro equipo certificado y elige con quién vivir la experiencia."}
      </p>

      <div className="mt-6">
        {needsTwo && (
          <p className="mb-3 text-xs font-sans font-semibold uppercase tracking-wide text-bronze">
            Masajista principal
          </p>
        )}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {active.map((m) => {
            const isPrimary = primary?.id === m.id;
            const isSecondary = secondary?.id === m.id;
            return (
              <button
                key={m.id}
                type="button"
                aria-pressed={isPrimary}
                onClick={() => onSelectPrimary(m)}
                disabled={isSecondary}
                className={clsx(
                  "flex flex-col items-center rounded-2xl border p-4 text-center transition-all disabled:opacity-30",
                  isPrimary ? "border-gold bg-gold/10" : "border-ink/15 hover:border-gold",
                )}
              >
                <span className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border-2 border-gold/40 bg-gradient-to-br from-champagne/50 to-gold/20 font-serif text-xl text-bronze">
                  {m.photoUrl ? (
                    <img src={m.photoUrl} alt="" loading="lazy" className="h-full w-full object-cover" />
                  ) : (
                    initials(m.stageName)
                  )}
                  {isPrimary && (
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-ink text-ivory">
                      <Check size={11} />
                    </span>
                  )}
                </span>
                <span className="mt-2 font-serif text-sm text-ink">{m.stageName}</span>
              </button>
            );
          })}
        </div>
      </div>

      {needsTwo && (
        <div className="mt-8">
          <p className="mb-3 text-xs font-sans font-semibold uppercase tracking-wide text-bronze">
            Segunda masajista
          </p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {active.map((m) => {
              const isPrimary = primary?.id === m.id;
              const isSecondary = secondary?.id === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  aria-pressed={isSecondary}
                  onClick={() => onSelectSecondary(isSecondary ? null : m)}
                  disabled={isPrimary}
                  className={clsx(
                    "flex flex-col items-center rounded-2xl border p-4 text-center transition-all disabled:opacity-30",
                    isSecondary ? "border-gold bg-gold/10" : "border-ink/15 hover:border-gold",
                  )}
                >
                  <span className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border-2 border-gold/40 bg-gradient-to-br from-champagne/50 to-gold/20 font-serif text-xl text-bronze">
                    {m.photoUrl ? (
                      <img src={m.photoUrl} alt="" loading="lazy" className="h-full w-full object-cover" />
                    ) : (
                      initials(m.stageName)
                    )}
                    {isSecondary && (
                      <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-ink text-ivory">
                        <Check size={11} />
                      </span>
                    )}
                  </span>
                  <span className="mt-2 font-serif text-sm text-ink">{m.stageName}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
