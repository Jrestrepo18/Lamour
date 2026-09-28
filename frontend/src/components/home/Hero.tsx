import Image from "next/image";
import Link from "next/link";
import { MapPin, ShieldCheck } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Grain } from "@/components/ui/Grain";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { HeroMotion } from "./HeroMotion";
import { PHOTOS } from "@/lib/photos";
import { SITE } from "@/lib/seo";
import { getI18n } from "@/i18n/server";

const HERO = PHOTOS.heroStones;
/** The photo's own backdrop (sampled from its edges), so the desktop crop blends into it seamlessly. */
const PHOTO_BG = "#bcb2a6";

/**
 * Photographic hero, designed mobile-first (the main acquisition channel).
 *
 * The photo is a full-screen backdrop *under* the copy, fixed in place: when
 * the visitor scrolls, the headline and everything after it rise over the
 * photo and cover it, like a sheet sliding over a still image. Phones: stones
 * in the upper half, copy at the bottom over a soft ivory fade. Desktop: the
 * stones sit on the right, the copy on the left over the same warm beige.
 *
 * Server component with CSS-only entrance animations: nothing here waits for
 * JavaScript, so the photo and headline paint (and count as LCP) immediately.
 * HeroMotion only hides the fixed photo once the page has covered it.
 */
export async function Hero() {
  const { t, href, lang } = await getI18n();
  const whatsappHref = SITE.whatsapp
    ? `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(
        t("Hola, me gustaría reservar un ritual en L'AMOUR.", "Hi, I'd like to book a ritual at L'AMOUR."),
      )}`
    : null;

  return (
    <section data-hero className="relative">
      <HeroMotion />

      {/* Fixed backdrop: stays still while the page scrolls up over it. */}
      <div data-hero-bg className="fixed inset-x-0 top-0 z-0 h-[100lvh] overflow-hidden" style={{ backgroundColor: PHOTO_BG }}>
        <div className="absolute inset-0 lg:left-[36%]">
          <Image
            src={HERO.src}
            alt={lang === "en" ? HERO.altEn : HERO.alt}
            fill
            priority
            fetchPriority="high"
            sizes="(min-width: 1024px) 64vw, 100vw"
            className="animate-hero-settle object-cover object-[50%_38%]"
          />
          {/* Desktop: the photo's left edge melts into its own backdrop colour */}
          <div
            className="pointer-events-none absolute inset-y-0 left-0 hidden w-1/3 lg:block"
            style={{ background: `linear-gradient(to right, ${PHOTO_BG}, transparent)` }}
          />
        </div>
        {/* Legibility: a soft wash under the header, an ivory fade under the copy */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-ivory/70 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[64%] bg-gradient-to-t from-ivory via-ivory/85 to-transparent lg:hidden" />
        <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-[62%] bg-gradient-to-r from-ivory/90 via-ivory/55 to-transparent lg:block" />
        <Grain />
      </div>

      {/* Phones: the hero fills the *whole* screen, including the strip behind the browser
          bars (100lvh); the copy's bottom padding lifts the hours line clear of them. */}
      <Container className="relative z-10 flex min-h-[100lvh] flex-col justify-end pb-[max(4.5rem,calc(100lvh-100svh+env(safe-area-inset-bottom)+1.75rem))] pt-28 lg:justify-center lg:pb-16 [@media(max-height:520px)]:pb-6 [@media(max-height:520px)]:pt-20">
        <p className="mb-auto inline-flex w-fit [@media(max-height:520px)]:hidden animate-rise items-center gap-1.5 rounded-full bg-ivory/90 px-3 py-1.5 text-xs font-medium text-ink shadow-sm [animation-delay:500ms] lg:hidden">
          <MapPin size={12} className="text-bronze" aria-hidden />
          {t("Medellín · a domicilio", "Medellín · at your place")}
        </p>

        <div className="max-w-xl">
          <h1 className="eyebrow animate-rise">{t("Spa de masajes a domicilio en Medellín", "In-home massage spa in Medellín")}</h1>
          <p className="mt-4 animate-rise font-serif text-[clamp(2.25rem,min(12.5vw,8.5svh),4.25rem)] font-bold leading-[0.92] tracking-tight [animation-delay:80ms] lg:text-display">
            <span className="block whitespace-nowrap text-ink-soft">{t("Estética", "Aesthetics")}</span>
            <span className="block whitespace-nowrap text-ink">{t("y Sentidos", "& Senses")}</span>
          </p>

          <p className="mt-4 max-w-md animate-rise text-base leading-relaxed text-ink-soft [animation-delay:160ms] sm:text-lg lg:mt-8 [@media(max-height:520px)]:hidden">
            {t(
              "Rituales de masaje, relajación y terapias en pareja, llevados hasta la privacidad de tu espacio. Una pausa para respirar.",
              "Massage, relaxation and couples rituals, brought to the privacy of your own space. A pause to breathe.",
            )}
          </p>

          {/* Instagram business-profile action row: two twin buttons, then a quiet status line. */}
          <div className="mt-7 grid max-w-md animate-rise grid-cols-2 gap-2 [animation-delay:240ms] lg:mt-10 [@media(max-height:520px)]:mt-4">
            <Link
              href={href("/reservar")}
              className="inline-flex min-h-12 items-center justify-center rounded-xl bg-ink px-4 text-[0.95rem] font-semibold text-ivory shadow-[0_12px_28px_-16px_rgba(23,23,23,0.8)] transition-colors duration-200 hover:bg-espresso active:scale-[0.98]"
            >
              {t("Reservar", "Book")}
            </Link>
            {whatsappHref ? (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-ink/15 bg-marfil/70 px-4 text-[0.95rem] font-semibold text-ink transition-colors duration-200 hover:bg-marfil active:scale-[0.98]"
              >
                <WhatsAppIcon size={19} className="text-[#25D366]" />
                {t("Mensaje", "Message")}
              </a>
            ) : (
              <Link
                href={href("/servicios")}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-ink/15 bg-marfil/70 px-4 text-[0.95rem] font-semibold text-ink transition-colors duration-200 hover:bg-marfil active:scale-[0.98]"
              >
                {t("Ver servicios", "See services")}
              </Link>
            )}
          </div>

          <p className="mt-4 flex animate-rise flex-wrap items-center gap-x-2 gap-y-1 text-sm text-ink-soft [animation-delay:320ms]">
            <span className="relative flex h-2 w-2" aria-hidden>
              <span className="absolute inset-0 animate-ping rounded-full bg-emerald-500/60" />
              <span className="relative h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            {whatsappHref ? t("Responde en minutos", "Replies in minutes") : t("Reservas en línea", "Online booking")} · 9:00 a.m. – 9:00 p.m.
            {whatsappHref && (
              <>
                <span aria-hidden>·</span>
                <Link href={href("/servicios")} className="font-medium text-ink underline decoration-gold/60 underline-offset-4 hover:decoration-ink">
                  {t("Ver servicios", "See services")}
                </Link>
              </>
            )}
          </p>
        </div>

        {/* Desktop: glass note over the photo */}
        <div className="absolute bottom-10 right-28 hidden max-w-[16rem] animate-rise rounded-2xl border border-ivory/40 bg-ivory/85 p-4 shadow-lg backdrop-blur-sm [animation-delay:700ms] lg:block">
          <p className="flex items-center gap-2 text-sm font-semibold text-ink">
            <ShieldCheck size={16} className="text-bronze" aria-hidden />
            {t("Discreción total", "Complete discretion")}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-ink-soft">
            {t("Sin señalética ni uniformes. Solo tu experiencia, en tu espacio.", "No signage, no uniforms. Just your experience, in your space.")}
          </p>
        </div>

        {/* Desktop scroll cue: a slow line inviting the first scroll; fades as soon as it starts. */}
        <div data-hero-cue aria-hidden className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 lg:flex">
          <span className="text-[0.6rem] font-semibold uppercase tracking-[0.35em] text-ink-soft">{t("Desliza", "Scroll")}</span>
          <span className="relative h-10 w-px overflow-hidden bg-ink/15">
            <span className="absolute inset-x-0 top-0 h-1/2 animate-scroll-cue bg-bronze" />
          </span>
        </div>
      </Container>
    </section>
  );
}
