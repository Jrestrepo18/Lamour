/**
 * Two languages. Spanish is the default and keeps the site's original URLs
 * (/servicios); English lives under /en (/en/servicios). The proxy maps the
 * unprefixed URLs onto the [lang] segment, so both are the same routes.
 */
export const LOCALES = ["es", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "es";

export const isLocale = (value: string | undefined): value is Locale => LOCALES.includes(value as Locale);

/** BCP 47 tags for <html lang>, Open Graph and hreflang. */
export const LOCALE_TAG: Record<Locale, string> = { es: "es-CO", en: "en" };
export const OG_LOCALE: Record<Locale, string> = { es: "es_CO", en: "en_US" };

/** "/servicios" → "/en/servicios" in English; unchanged in Spanish. Hashes and queries pass through. */
export function localePath(lang: Locale, path: string) {
  if (lang === DEFAULT_LOCALE || !path.startsWith("/")) return path;
  if (path === "/") return "/en";
  if (path.startsWith("/#") || path.startsWith("/?")) return `/en${path.slice(1)}`;
  return `/en${path}`;
}

/**
 * The current page's path without its locale prefix ("/en/servicios" → "/servicios").
 * Also strips "/es": on the server a Spanish page renders under its internal
 * (rewritten) path, while the browser shows it unprefixed.
 */
export function stripLocale(pathname: string) {
  for (const lang of LOCALES) {
    if (pathname === `/${lang}`) return "/";
    if (pathname.startsWith(`/${lang}/`)) return pathname.slice(lang.length + 1);
  }
  return pathname;
}

/**
 * Inline bilingual copy: `t("Reservar", "Book")`. Keeps both languages side by side
 * in the component that shows them, so a text never drifts out of sync with its layout.
 */
export type Translate = <T>(es: T, en: T) => T;
export const translator = (lang: Locale): Translate => (es, en) => (lang === "en" ? en : es);
