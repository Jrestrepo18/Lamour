"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { DEFAULT_LOCALE, localePath, translator, type Locale } from "./config";

const LangContext = createContext<Locale>(DEFAULT_LOCALE);

export function I18nProvider({ lang, children }: { lang: Locale; children: ReactNode }) {
  return <LangContext.Provider value={lang}>{children}</LangContext.Provider>;
}

/** Client-side twin of getI18n(): `t` for copy, `lang`, and `href` for links in the current language. */
export function useI18n() {
  const lang = useContext(LangContext);
  return useMemo(() => ({ lang, t: translator(lang), href: (path: string) => localePath(lang, path) }), [lang]);
}
