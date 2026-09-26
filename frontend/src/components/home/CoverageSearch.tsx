"use client";

import { useId, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Check, MapPin, Search, X } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { MUNICIPIOS, normalizePlace } from "@/lib/coverage";
import { SITE } from "@/lib/seo";
import { useI18n } from "@/i18n/I18nProvider";

const SUGGESTED = 4;

/**
 * "¿Llegamos a tu zona?" as Instagram's place search: a rounded grey search
 * field, results shown like place results (pin avatar + name + "A domicilio"),
 * and — once a municipality is chosen — an Instagram story "location sticker"
 * pops in with the answer and a booking link that carries the city through to
 * the booking form. Accent-insensitive ("itagui" finds Itagüí). A place we
 * don't cover gets a kind answer and a way to ask, never a dead end.
 */
export function CoverageSearch() {
  const { t, href } = useI18n();
  const [query, setQuery] = useState("");
  const [picked, setPicked] = useState<string | null>(null);
  const inputId = useId();
  const listId = useId();

  const matches = useMemo(() => {
    const q = normalizePlace(query);
    if (!q) return MUNICIPIOS.slice(0, SUGGESTED);
    return MUNICIPIOS.filter((m) => normalizePlace(m).includes(q));
  }, [query]);

  const noMatch = query.trim().length > 1 && matches.length === 0;
  const whatsappHref = SITE.whatsapp
    ? `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(t(`Hola, ¿llegan a ${query.trim()}?`, `Hi, do you come to ${query.trim()}?`))}`
    : null;

  function pick(m: string) {
    setPicked(m);
    setQuery("");
  }

  if (picked) {
    return (
      <div className="mt-8" aria-live="polite">
        {/* Instagram story "location sticker" */}
        <span className="inline-flex origin-bottom-left animate-sticker-pop items-center gap-2 rounded-xl bg-marfil px-4 py-2.5 shadow-[0_12px_30px_-12px_rgba(23,23,23,0.5)]">
          <MapPin size={18} className="text-bronze" aria-hidden />
          <span className="bg-gradient-to-r from-bronze to-[#a8871a] bg-clip-text text-base font-extrabold uppercase tracking-wide text-transparent">
            {picked}
          </span>
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white">
            <Check size={13} strokeWidth={3} aria-hidden />
          </span>
        </span>
        <p className="mt-4 text-base text-ink">
          <span className="font-semibold">{t(`Sí llegamos a ${picked}.`, `Yes, we come to ${picked}.`)}</span>{" "}
          <span className="text-[var(--tone-body)]">{t("Tu ritual, en la privacidad de tu espacio.", "Your ritual, in the privacy of your space.")}</span>
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
          <Link
            href={href(`/reservar?city=${encodeURIComponent(picked)}`)}
            className="inline-flex min-h-12 items-center gap-2 rounded-full bg-ink px-6 text-sm font-semibold text-ivory shadow-[0_12px_28px_-14px_rgba(23,23,23,0.8)] transition-colors hover:bg-espresso"
          >
            {t("Reservar en", "Book in")} {picked}
            <ArrowUpRight size={16} aria-hidden />
          </Link>
          <button
            type="button"
            onClick={() => setPicked(null)}
            className="min-h-11 cursor-pointer text-sm font-medium text-ink underline decoration-gold/60 underline-offset-8 hover:decoration-ink"
          >
            {t("Buscar otra zona", "Search another area")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 max-w-md">
      <label htmlFor={inputId} className="text-sm font-semibold text-ink">
        {t("¿Llegamos a tu zona?", "Do we come to your area?")}
      </label>
      <div className="relative mt-2">
        <Search size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft" aria-hidden />
        <input
          id={inputId}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && matches.length === 1) pick(matches[0]);
          }}
          placeholder={t("Busca tu municipio", "Search your town")}
          autoComplete="off"
          aria-controls={listId}
          className="h-12 w-full rounded-xl bg-ink/[0.06] pl-11 pr-10 text-base text-ink placeholder:text-ink-soft/70 outline-none transition-[background-color,box-shadow] focus:bg-marfil focus:ring-2 focus:ring-gold/40 [&::-webkit-search-cancel-button]:hidden"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label={t("Borrar búsqueda", "Clear search")}
            className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-ink-soft hover:bg-ink/10"
          >
            <X size={15} aria-hidden />
          </button>
        )}
      </div>

      <p className="sr-only" aria-live="polite">
        {noMatch ? t("Sin resultados", "No results") : `${matches.length} ${t("resultados", "results")}`}
      </p>

      {noMatch ? (
        <div className="mt-3 rounded-xl bg-marfil/70 p-4 text-sm text-ink">
          <p>
            {t("Aún no llegamos a", "We don't cover")} <span className="font-semibold">{query.trim()}</span>
            {t(" todavía, pero escríbenos y lo revisamos contigo.", " yet, but message us and we'll look into it with you.")}
          </p>
          {whatsappHref ? (
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex min-h-10 items-center gap-2 rounded-full bg-[#25D366] px-4 text-sm font-medium text-white"
            >
              <WhatsAppIcon size={17} />
              {t("Preguntar por WhatsApp", "Ask on WhatsApp")}
            </a>
          ) : (
            <Link href={href("/#faq")} className="mt-3 inline-flex min-h-10 items-center text-sm font-semibold text-bronze underline underline-offset-4">
              {t("Ver preguntas frecuentes", "See the FAQ")}
            </Link>
          )}
        </div>
      ) : (
        <ul id={listId} className="mt-2">
          {matches.map((m) => (
            <li key={m}>
              <button
                type="button"
                onClick={() => pick(m)}
                className="flex min-h-14 w-full cursor-pointer items-center gap-3 rounded-xl px-2 text-left transition-colors hover:bg-marfil/60"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-ink/10 bg-marfil text-ink">
                  <MapPin size={17} aria-hidden />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-ink">{m}</span>
                  <span className="block text-xs text-ink-soft">{t("Antioquia · A domicilio", "Antioquia · We come to you")}</span>
                </span>
              </button>
            </li>
          ))}
          {!query && (
            <li className="px-2 pt-1 text-xs text-ink-soft">
              {t(
                `y ${MUNICIPIOS.length - SUGGESTED} municipios más del Valle de Aburrá`,
                `and ${MUNICIPIOS.length - SUGGESTED} more towns in the Aburrá Valley`,
              )}
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
