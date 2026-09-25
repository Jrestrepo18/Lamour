"use client";

import clsx from "clsx";
import { BadgeCheck, Check } from "lucide-react";
import type { Masseuse, Service } from "@/lib/types";
import { StepHeading, StoryAvatar } from "./parts";

/**
 * The team as story avatars: tap one and her ring lights up gold. Four-hands
 * rituals take two taps — the first becomes the lead therapist (badge 1),
 * the second her partner (badge 2); tapping a chosen one again releases her.
 */
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
  onSelectPrimary: (m: Masseuse | null) => void;
  onSelectSecondary: (m: Masseuse | null) => void;
}) {
  const needsTwo = service.requiresTwoTherapists;
  // Only therapists who do this ritual (servicioIds; empty = all) and visit homes (the site only books a domicilio).
  const active = masseuses.filter(
    (m) => m.isActive && m.offersHomeVisits && (m.serviceIds.length === 0 || m.serviceIds.includes(service.id)),
  );

  function toggle(m: Masseuse) {
    if (!needsTwo) {
      onSelectPrimary(m);
      return;
    }
    if (primary?.id === m.id) {
      // Releasing the lead promotes the partner, so "1" is always filled first.
      onSelectPrimary(secondary);
      onSelectSecondary(null);
    } else if (secondary?.id === m.id) {
      onSelectSecondary(null);
    } else if (!primary) {
      onSelectPrimary(m);
    } else {
      onSelectSecondary(m);
    }
  }

  const chosen = [primary, secondary].filter(Boolean) as Masseuse[];

  return (
    <div>
      <StepHeading
        title={needsTwo ? "Elige a tus dos terapeutas" : "¿Con quién quieres vivirlo?"}
        hint={
          needsTwo
            ? "Este ritual lo hacen dos terapeutas a la vez. La primera que toques será la principal."
            : "Todas son terapeutas certificadas del equipo L'AMOUR."
        }
      />

      <ul className="mt-8 grid grid-cols-3 gap-x-3 gap-y-6 sm:grid-cols-4">
        {active.map((m) => {
          const order = primary?.id === m.id ? 1 : secondary?.id === m.id ? 2 : 0;
          const selected = order > 0;
          return (
            <li key={m.id}>
              <button
                type="button"
                aria-pressed={selected}
                onClick={() => toggle(m)}
                className="group flex w-full cursor-pointer flex-col items-center text-center"
              >
                <span className="relative">
                  <StoryAvatar
                    masseuse={m}
                    size={76}
                    ring={selected}
                    className={clsx("transition-transform duration-300", selected ? "scale-105" : "group-active:scale-95")}
                  />
                  {selected && (
                    <span
                      aria-hidden
                      className="absolute -bottom-0.5 -right-0.5 flex h-7 w-7 animate-sticker-pop items-center justify-center rounded-full border-[3px] border-ivory bg-ink text-xs font-bold text-ivory"
                    >
                      {needsTwo ? order : <Check size={13} strokeWidth={3} />}
                    </span>
                  )}
                </span>
                <span className="mt-2.5 flex items-center gap-1 text-sm font-semibold text-ink">
                  {m.stageName}
                  <BadgeCheck size={14} className="fill-gold text-ivory" aria-label="verificada" />
                </span>
                {m.age != null && <span className="text-xs text-ink-soft">{m.age} años</span>}
              </button>
            </li>
          );
        })}
      </ul>

      <p className="mt-8 min-h-5 text-sm text-ink-soft" aria-live="polite">
        {chosen.length === 0
          ? needsTwo
            ? "Toca dos perfiles."
            : "Toca un perfil para elegirla."
          : needsTwo && chosen.length === 1
            ? `${chosen[0].stageName} será la principal. Elige a su compañera.`
            : `Vivirás tu ritual con ${chosen.map((c) => c.stageName).join(" y ")}.`}
      </p>
    </div>
  );
}
