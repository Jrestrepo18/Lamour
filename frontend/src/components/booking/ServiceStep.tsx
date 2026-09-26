"use client";

import { useState } from "react";
import clsx from "clsx";
import { Check, Heart, Sparkles, Users } from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";
import type { Service, ServiceCategory } from "@/lib/types";
import { CATEGORY_SHORT, isAdultService } from "@/lib/catalog";
import { formatCOP, formatDuration } from "@/lib/format";
import { chipClass } from "@/lib/ui";
import { ServiceThumb, StepHeading, wrapRailClass } from "./parts";
import { useI18n } from "@/i18n/I18nProvider";

const SAVED_ID = "__guardados";

/** Share of a category's services that belong to the +18 section (0 = pure wellness, 1 = adult only). */
function adultShare(c: ServiceCategory) {
  if (c.services.length === 0) return 0;
  return c.services.filter((s) => isAdultService(s, c.slug)).length / c.services.length;
}

/**
 * Categories as a one-line chip rail (not five stacked rows on a phone) and
 * services as photo rows — the same "menu" rows the catalog uses — with a
 * round select mark on the right, like picking an item in Instagram.
 */
export function ServiceStep({
  categories,
  selected,
  onSelect,
}: {
  categories: ServiceCategory[];
  selected: Service | null;
  onSelect: (service: Service) => void;
}) {
  // Wellness first, adult (+18) rituals last: the step opens on a plain relaxation category, which is
  // what people arriving from Google or Instagram expect (and what those platforms' policies allow).
  const { t, lang } = useI18n();
  // Empty categories (every service moved elsewhere in the admin) get no chip — and would otherwise sort first.
  const ordered = categories.filter((c) => c.services.length > 0).sort((a, b) => adultShare(a) - adultShare(b));
  const [activeCategory, setActiveCategory] = useState(
    () => selected?.serviceCategoryId ?? ordered[0]?.id ?? "",
  );
  const { favorites } = useFavorites();

  // "♡ Guardados": the services the visitor saved while browsing, as a pseudo-category.
  const savedServices = categories.flatMap((c) => c.services).filter((s) => favorites.includes(s.slug));
  const savedCategory: ServiceCategory | null =
    savedServices.length > 0
      ? { id: SAVED_ID, name: t("Guardados", "Saved"), slug: "guardados", description: null, highlight: null, displayOrder: -1, isActive: true, services: savedServices }
      : null;
  const tabs = savedCategory ? [savedCategory, ...ordered] : ordered;
  const category = tabs.find((c) => c.id === activeCategory) ?? ordered[0];

  return (
    <div>
      <StepHeading
        title={t("Elige tu ritual", "Choose your ritual")}
        hint={t("Toca la experiencia que quieres vivir; puedes cambiarla cuando quieras.", "Tap the experience you'd like; you can change it any time.")}
      />

      <div className={clsx(wrapRailClass, "mt-6")} role="tablist" aria-label={t("Categorías", "Categories")}>
        {tabs.map((c) => (
          <button
            key={c.id}
            type="button"
            role="tab"
            aria-selected={c.id === activeCategory}
            onClick={() => setActiveCategory(c.id)}
            className={clsx(chipClass(c.id === activeCategory), "min-h-11 shrink-0 whitespace-nowrap")}
          >
            {c.id === SAVED_ID && <Heart size={13} className="mr-1.5 fill-[#c0392b] text-[#c0392b]" aria-hidden />}
            {CATEGORY_SHORT[lang][c.slug] ?? c.name}
            {c.id === SAVED_ID && <span className="ml-1.5 opacity-70">{savedServices.length}</span>}
          </button>
        ))}
      </div>

      {category?.highlight && (
        <p className="mt-4 flex items-start gap-2 text-sm text-bronze">
          <Sparkles size={15} className="mt-0.5 shrink-0" aria-hidden />
          {category.highlight}
        </p>
      )}

      <ul key={category?.id} className="mt-4 animate-fade-in">
        {category?.services.map((service) => {
          const isSelected = selected?.id === service.id;
          return (
            <li key={service.id}>
              <button
                type="button"
                aria-pressed={isSelected}
                onClick={() => onSelect(service)}
                className={clsx(
                  "-mx-3 flex w-[calc(100%+1.5rem)] cursor-pointer items-center gap-4 rounded-2xl px-3 py-3 text-left transition-colors duration-200",
                  isSelected ? "bg-marfil shadow-[0_0_0_1px_rgba(201,162,39,0.55)]" : "hover:bg-marfil/60",
                )}
              >
                <ServiceThumb
                  service={service}
                  categories={categories}
                  sizes="80px"
                  className="h-20 w-20 shrink-0 rounded-2xl"
                />
                <span className="min-w-0 flex-1">
                  <span className="block font-serif text-[1.05rem] font-semibold leading-snug text-ink">{service.name}</span>
                  <span className="mt-0.5 line-clamp-2 block text-[0.8rem] leading-snug text-ink-soft">
                    {service.shortDescription}
                  </span>
                  <span className="mt-1.5 flex flex-wrap items-center gap-x-2 text-[0.8rem] text-ink-soft">
                    <span>{formatDuration(service.durationMinutes)}</span>
                    {service.requiresTwoTherapists && (
                      <>
                        <span aria-hidden>·</span>
                        <span className="inline-flex items-center gap-1">
                          <Users size={12} aria-hidden />
                          {t("2 masajistas", "2 therapists")}
                        </span>
                      </>
                    )}
                    <span aria-hidden>·</span>
                    <span className="font-semibold text-ink">{formatCOP(service.price, lang)}</span>
                  </span>
                </span>
                <span
                  aria-hidden
                  className={clsx(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-[1.5px] transition-colors duration-200",
                    isSelected ? "border-ink bg-ink text-ivory" : "border-ink/25",
                  )}
                >
                  {isSelected && <Check size={13} strokeWidth={3} />}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
