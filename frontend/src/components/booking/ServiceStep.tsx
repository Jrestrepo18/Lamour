"use client";

import { useState } from "react";
import clsx from "clsx";
import { Check, Clock3, Users } from "lucide-react";
import type { Service, ServiceCategory } from "@/lib/types";
import { formatCOP, formatDuration } from "@/lib/format";

export function ServiceStep({
  categories,
  selected,
  onSelect,
}: {
  categories: ServiceCategory[];
  selected: Service | null;
  onSelect: (service: Service) => void;
}) {
  const [activeCategory, setActiveCategory] = useState(categories[0]?.id ?? 0);
  const category = categories.find((c) => c.id === activeCategory) ?? categories[0];

  return (
    <div>
      <h2 className="font-serif text-2xl font-semibold tracking-tight text-ink sm:text-3xl">Elige tu servicio</h2>
      <p className="mt-1 text-sm text-ink-soft">Selecciona la experiencia que deseas vivir.</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setActiveCategory(c.id)}
            className={clsx(
              "inline-flex min-h-11 items-center justify-center rounded-full border px-4 py-2 text-xs font-sans font-medium uppercase tracking-wide transition-colors",
              c.id === activeCategory
                ? "border-ink bg-ink text-ivory"
                : "border-ink/15 bg-white/50 text-ink-soft hover:border-gold hover:text-ink",
            )}
          >
            {c.name}
          </button>
        ))}
      </div>

      {category?.highlight && (
        <p className="mt-4 rounded-xl border border-gold/30 bg-gold/10 px-4 py-2.5 text-xs text-bronze">
          {category.highlight}
        </p>
      )}

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {category?.services.map((service) => {
          const isSelected = selected?.id === service.id;
          return (
            <button
              key={service.id}
              type="button"
              onClick={() => onSelect(service)}
              className={clsx(
                "flex cursor-pointer flex-col rounded-2xl border p-5 text-left transition-[border-color,background-color,box-shadow] duration-200",
                isSelected ? "border-gold bg-gold/10 shadow-[0_0_0_1px_var(--color-gold)]" : "border-ink/10 bg-white/60 hover:border-gold/50",
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-serif text-lg font-semibold text-ink">{service.name}</h3>
                {isSelected && (
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink text-ivory">
                    <Check size={13} />
                  </span>
                )}
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-ink-soft">{service.shortDescription}</p>
              <div className="mt-4 flex items-center justify-between text-xs text-ink-soft">
                <span className="flex items-center gap-1">
                  <Clock3 size={13} className="text-bronze" />
                  {formatDuration(service.durationMinutes)}
                </span>
                {service.requiresTwoTherapists && (
                  <span className="flex items-center gap-1">
                    <Users size={13} className="text-bronze" />2 masajistas
                  </span>
                )}
                <span className="font-serif text-base text-ink">{formatCOP(service.price)}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
