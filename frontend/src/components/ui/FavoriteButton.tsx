"use client";

import { Heart } from "lucide-react";
import clsx from "clsx";
import { useFavorites } from "@/hooks/useFavorites";
import { useI18n } from "@/i18n/I18nProvider";

/** ♡ toggle for a service. `tone` adapts it to photo (glass) or plain surfaces. */
export function FavoriteButton({
  slug,
  name,
  tone = "glass",
  className,
}: {
  slug: string;
  name: string;
  tone?: "glass" | "plain" | "dark";
  className?: string;
}) {
  const { isFavorite, toggle } = useFavorites();
  const { t } = useI18n();
  const saved = isFavorite(slug);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        toggle(slug);
      }}
      aria-pressed={saved}
      aria-label={saved ? t(`Quitar ${name} de guardados`, `Remove ${name} from saved`) : t(`Guardar ${name}`, `Save ${name}`)}
      className={clsx(
        "flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition-[transform,background-color] duration-200 active:scale-90",
        tone === "glass" && "bg-ivory/90 shadow-md",
        tone === "plain" && "hover:bg-silk/60",
        tone === "dark" && "hover:bg-ivory/10",
        className,
      )}
    >
      <Heart
        size={18}
        aria-hidden
        className={clsx(
          "transition-[color,fill,transform] duration-300",
          saved ? "scale-110 fill-[#c0392b] text-[#c0392b]" : tone === "dark" ? "text-champagne" : "text-ink",
        )}
      />
    </button>
  );
}
