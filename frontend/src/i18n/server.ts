import { lang as rootLang } from "next/root-params";
import { DEFAULT_LOCALE, isLocale, localePath, translator, type Locale } from "./config";

/** The page's language in any Server Component, without passing it down as a prop. */
export async function getLang(): Promise<Locale> {
  const value = await rootLang();
  return isLocale(value) ? value : DEFAULT_LOCALE;
}

/** `t` for copy, `lang`, and `href` to keep links in the current language. */
export async function getI18n() {
  const lang = await getLang();
  return { lang, t: translator(lang), href: (path: string) => localePath(lang, path) };
}
