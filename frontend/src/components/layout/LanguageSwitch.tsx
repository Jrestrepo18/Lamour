"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { localePath, stripLocale } from "@/i18n/config";
import { useI18n } from "@/i18n/I18nProvider";

/**
 * ES | EN toggle to the same page in the other language. Each option is a real
 * link (crawlable, works without JS) marked with its own `lang` and `hreflang`.
 */
export function LanguageSwitch({ className, tone = "light" }: { className?: string; tone?: "light" | "dark" }) {
  const pathname = usePathname() ?? "/";
  const { lang, t } = useI18n();
  const base = stripLocale(pathname);
  const options = [
    { code: "es", label: "ES", name: "Español", href: base },
    { code: "en", label: "EN", name: "English", href: localePath("en", base) },
  ] as const;

  return (
    <nav
      aria-label={t("Idioma", "Language")}
      className={clsx(
        "flex items-center rounded-full border p-0.5 text-xs font-semibold",
        tone === "dark" ? "border-ivory/20" : "border-ink/15",
        className,
      )}
    >
      {options.map((o) => {
        const active = o.code === lang;
        return (
          <Link
            key={o.code}
            href={o.href}
            hrefLang={o.code}
            lang={o.code}
            aria-label={o.name}
            aria-current={active ? "true" : undefined}
            className={clsx(
              "flex h-8 min-w-9 items-center justify-center rounded-full px-2 tracking-wide transition-colors",
              active
                ? tone === "dark"
                  ? "bg-ivory text-ink"
                  : "bg-ink text-ivory"
                : tone === "dark"
                  ? "text-ivory/70 hover:text-ivory"
                  : "text-ink-soft hover:text-ink",
            )}
          >
            {o.label}
          </Link>
        );
      })}
    </nav>
  );
}
