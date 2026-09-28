"use client";

import { useId, useMemo, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { ArrowUpRight, Search, X } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { wrapRailClass } from "@/components/booking/parts";
import { FAQ_CATEGORIES, FAQS, type FaqCategory } from "@/lib/faq";
import { normalizePlace } from "@/lib/coverage";
import { SITE } from "@/lib/seo";
import { chipClass } from "@/lib/ui";
import { useI18n } from "@/i18n/I18nProvider";

/**
 * Every question, readable at a glance: topic chips, a small search and native
 * <details> rows (all answers are in the HTML — readable without JavaScript, by
 * screen readers and by search engines). Each answer ends with its next step,
 * and a search with no match hands the question straight to WhatsApp.
 */
export function FaqExplorer() {
  const { t, href, lang } = useI18n();
  const [category, setCategory] = useState<FaqCategory | "all">("all");
  const [query, setQuery] = useState("");
  const searchId = useId();

  const q = normalizePlace(query);
  const list = useMemo(
    () =>
      FAQS.filter((f) => category === "all" || f.category === category).filter(
        (f) => !q || normalizePlace(`${f.q[lang]} ${f.a[lang]}`).includes(q),
      ),
    [category, q, lang],
  );

  const askHref = SITE.whatsapp
    ? `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(
        query.trim() ? t(`Hola, tengo una pregunta: ${query.trim()}`, `Hi, I have a question: ${query.trim()}`) : t("Hola, tengo una pregunta.", "Hi, I have a question."),
      )}`
    : null;

  return (
    <div className="mt-16 sm:mt-20">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h3 className="font-serif text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          {t("Todas las preguntas", "All questions")}
        </h3>
        <label htmlFor={searchId} className="relative block w-full sm:w-72">
          <span className="sr-only">{t("Buscar una pregunta", "Search a question")}</span>
          <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft" aria-hidden />
          <input
            id={searchId}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("Busca: pago, hotel, cancelar…", "Search: payment, hotel, cancel…")}
            className="h-11 w-full rounded-full bg-ink/[0.06] pl-10 pr-10 text-base text-ink outline-none placeholder:text-ink-soft/70 focus:bg-marfil focus:ring-2 focus:ring-gold/40 sm:text-sm [&::-webkit-search-cancel-button]:hidden"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label={t("Borrar búsqueda", "Clear search")}
              className="absolute right-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-ink-soft hover:bg-ink/10"
            >
              <X size={14} aria-hidden />
            </button>
          )}
        </label>
      </div>

      <div className={clsx(wrapRailClass, "mt-5")} role="group" aria-label={t("Temas", "Topics")}>
        {[{ id: "all" as const, label: { es: "Todas", en: "All" } }, ...FAQ_CATEGORIES].map((c) => (
          <button
            key={c.id}
            type="button"
            aria-pressed={category === c.id}
            onClick={() => setCategory(c.id)}
            className={clsx(chipClass(category === c.id), "min-h-10 shrink-0 whitespace-nowrap")}
          >
            {c.label[lang]}
          </button>
        ))}
      </div>

      <p className="sr-only" aria-live="polite">
        {t(`${list.length} preguntas`, `${list.length} questions`)}
      </p>

      {list.length > 0 ? (
        <ul className="mt-6 divide-y divide-ink/10 border-y border-ink/10">
          {list.map((f) => (
            <li key={f.id}>
              <details className="group py-1">
                <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-3 text-left font-semibold text-ink [&::-webkit-details-marker]:hidden">
                  <span className="text-[0.98rem] sm:text-base">{f.q[lang]}</span>
                  <span
                    aria-hidden
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gold/50 text-lg leading-none text-bronze transition-transform duration-300 group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <div className="pb-5 pr-12">
                  <p className="max-w-2xl text-[0.95rem] leading-relaxed text-[var(--tone-body)]">{f.a[lang]}</p>
                  {f.cta && (
                    <Link
                      href={href(f.cta.href)}
                      className="mt-3 inline-flex min-h-10 items-center gap-1.5 text-sm font-semibold text-ink underline decoration-gold/60 underline-offset-4 hover:decoration-ink"
                    >
                      {f.cta.label[lang]}
                      <ArrowUpRight size={15} aria-hidden />
                    </Link>
                  )}
                </div>
              </details>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-6 rounded-2xl bg-marfil/70 p-5 text-sm text-ink-soft">
          {t("No encontramos esa pregunta, pero con gusto te respondemos.", "We couldn't find that question, but we'll gladly answer it.")}
        </p>
      )}

      {askHref && (
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-[1.5rem] bg-marfil/70 px-5 py-4 ring-1 ring-ink/[0.07]">
          <p className="text-sm text-ink">
            <span className="font-semibold">{t("¿No encontraste tu pregunta?", "Didn't find your question?")}</span>{" "}
            <span className="text-ink-soft">{t("Escríbenos, respondemos en minutos.", "Message us, we reply within minutes.")}</span>
          </p>
          <a
            href={askHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#25D366] px-5 text-sm font-semibold text-white"
          >
            <WhatsAppIcon size={17} />
            {t("Preguntar por WhatsApp", "Ask on WhatsApp")}
          </a>
        </div>
      )}
    </div>
  );
}
