"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { ArrowUpRight } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqJsonLd, SITE } from "@/lib/seo";
import { PHOTOS, photoAlt } from "@/lib/photos";
import { FAQS as ALL_FAQS, faqText } from "@/lib/faq";
import { FaqExplorer } from "./FaqExplorer";
import { useI18n } from "@/i18n/I18nProvider";

type Message = { id: number; from: "brand" | "client"; text: string };

const GREETING = {
  es: "Hola, somos L'AMOUR. ¿Qué te gustaría saber antes de reservar?",
  en: "Hi, this is L'AMOUR. What would you like to know before booking?",
};
const TYPING_MS = 900;

/**
 * FAQ in two layers. On top, a short direct-message conversation with the four
 * most common questions: the visitor taps one, it lands as their bubble,
 * L'AMOUR "is typing…", and the answer arrives with "Visto" — the warm, human
 * part. Below it, every question grouped by topic with search (FaqExplorer),
 * so nothing has to be tapped one by one to be found. The FAQPage data lists
 * them all, from the same source (lib/faq.ts).
 */
export function FaqSection() {
  const { t, href, lang } = useI18n();
  const FAQS = ALL_FAQS.filter((f) => f.quick).map((f) => ({ q: f.q[lang], a: f.a[lang] }));
  const [thread, setThread] = useState<Message[]>([
    { id: 0, from: "brand", text: GREETING[lang] },
    { id: 1, from: "client", text: FAQS[0].q },
    { id: 2, from: "brand", text: FAQS[0].a },
  ]);
  const [asked, setAsked] = useState<Set<number>>(new Set([0]));
  const [typing, setTyping] = useState(false);
  const nextId = useRef(3);
  const endRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);

  // Keep the newest message (and the quick replies under it) in view as the chat grows.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [thread, typing]);

  function ask(i: number) {
    if (typing || asked.has(i)) return;
    setAsked((s) => new Set(s).add(i));
    setThread((t) => [...t, { id: nextId.current++, from: "client", text: FAQS[i].q }]);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setTyping(true);
    window.setTimeout(
      () => {
        setTyping(false);
        setThread((t) => [...t, { id: nextId.current++, from: "brand", text: FAQS[i].a }]);
      },
      reduce ? 0 : TYPING_MS,
    );
  }

  const remaining = FAQS.map((f, i) => ({ ...f, i })).filter((f) => !asked.has(f.i));
  const lastClientId = [...thread].reverse().find((m) => m.from === "client")?.id;
  const lastId = thread[thread.length - 1].id;
  const whatsappHref = SITE.whatsapp ? `https://wa.me/${SITE.whatsapp}` : null;

  return (
    <section id="faq" className="py-16 sm:py-32">
      <JsonLd data={faqJsonLd(faqText(lang))} />
      <Container>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
          <div>
            <Reveal>
              <SectionHeading
                eyebrow={t("Preguntas frecuentes", "Frequently asked questions")}
                title={t("Resolvemos tus dudas", "We answer your questions")}
                description={t(
                  "Toca una pregunta en el chat o busca la tuya en la lista completa, más abajo.",
                  "Tap a question in the chat, or find yours in the full list below.",
                )}
              />
            </Reveal>
            <Reveal
              from="left"
              delay={0.15}
              className="mx-auto mt-8 hidden w-full max-w-xs overflow-hidden rounded-[1.5rem] shadow-xl lg:block"
            >
              <Image
                src={PHOTOS.oilBottle.src}
                alt={photoAlt(PHOTOS.oilBottle, lang)}
                width={PHOTOS.oilBottle.w}
                height={PHOTOS.oilBottle.h}
                sizes="(min-width: 1024px) 25vw, 0px"
                className="aspect-[3/4] w-full object-cover"
              />
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <div className="overflow-hidden rounded-[1.75rem] border border-ink/10 bg-marfil/75 shadow-[0_24px_60px_-36px_rgba(23,23,23,0.55)]">
              {/* Chat header */}
              <div className="flex items-center gap-3 border-b border-ink/10 px-5 py-4">
                <span className="relative">
                  <Image src="/icon.svg" alt="L'AMOUR" width={40} height={40} className="h-10 w-10 rounded-full" />
                  <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
                </span>
                <div className="leading-tight">
                  <p className="text-sm font-semibold text-ink">L&apos;AMOUR</p>
                  <p className="text-xs text-ink-soft">{t("Normalmente responde en minutos", "Usually replies within minutes")}</p>
                </div>
              </div>

              {/* Conversation */}
              <ol aria-live="polite" className="flex flex-col gap-2 px-4 py-5 sm:px-5">
                {thread.map((m) => (
                  <li key={m.id} className={clsx("flex flex-col", m.from === "client" ? "items-end" : "items-start")}>
                    <p
                      className={clsx(
                        "max-w-[85%] animate-fade-in px-4 py-2.5 text-[0.95rem] leading-relaxed",
                        m.from === "client"
                          ? "rounded-[1.25rem] rounded-br-md bg-ink text-ivory"
                          : "rounded-[1.25rem] rounded-bl-md bg-[#efe4cf] text-ink",
                      )}
                    >
                      <span className="sr-only">{m.from === "client" ? t("Tú: ", "You: ") : "L'AMOUR: "}</span>
                      {m.text}
                    </p>
                    {m.id === lastClientId && !typing && m.id !== lastId && (
                      <span className="mr-1 mt-1 text-[0.7rem] text-ink-soft">{t("Visto", "Seen")}</span>
                    )}
                  </li>
                ))}
                {typing && (
                  <li className="flex items-start">
                    <span className="sr-only">{t("L'AMOUR está escribiendo…", "L'AMOUR is typing…")}</span>
                    <span aria-hidden className="flex gap-1 rounded-[1.25rem] rounded-bl-md bg-[#efe4cf] px-4 py-3.5">
                      {[0, 1, 2].map((d) => (
                        <span
                          key={d}
                          className="h-2 w-2 animate-typing rounded-full bg-bronze/70"
                          style={{ animationDelay: `${d * 0.15}s` }}
                        />
                      ))}
                    </span>
                  </li>
                )}
              </ol>

              {/* Suggested questions (quick replies) */}
              <div ref={endRef} className="border-t border-ink/10 bg-ivory/60 px-4 py-4 sm:px-5">
                {remaining.length > 0 ? (
                  <>
                    <p className="mb-3 text-xs font-medium text-ink-soft">{t("Toca una pregunta", "Tap a question")}</p>
                    <div className="flex flex-wrap gap-2">
                      {remaining.map((f) => (
                        <button
                          key={f.i}
                          type="button"
                          onClick={() => ask(f.i)}
                          disabled={typing}
                          className="min-h-10 cursor-pointer rounded-full border border-gold/50 bg-marfil px-4 py-2 text-left text-sm text-ink transition-colors hover:border-gold hover:bg-champagne/30 disabled:opacity-50"
                        >
                          {f.q}
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm text-ink-soft">{t("¿Tienes otra pregunta?", "Any other question?")}</p>
                    {whatsappHref ? (
                      <a
                        href={whatsappHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-10 items-center gap-2 rounded-full bg-ink px-5 text-sm font-medium text-ivory"
                      >
                        <WhatsAppIcon size={17} />
                        {t("Escríbenos por WhatsApp", "Message us on WhatsApp")}
                      </a>
                    ) : (
                      <Link
                        href={href("/reservar")}
                        className="inline-flex min-h-10 items-center gap-2 rounded-full bg-ink px-5 text-sm font-medium text-ivory"
                      >
                        {t("Reservar mi ritual", "Book my ritual")}
                        <ArrowUpRight size={16} aria-hidden />
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </div>
          </Reveal>
        </div>

        <FaqExplorer />
      </Container>
    </section>
  );
}
