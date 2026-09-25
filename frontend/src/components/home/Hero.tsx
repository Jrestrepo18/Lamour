import Image from "next/image";
import Link from "next/link";
import { MapPin, ShieldCheck } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Grain } from "@/components/ui/Grain";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { ParallaxMedia } from "@/components/motion/ParallaxMedia";
import { PHOTOS } from "@/lib/photos";
import { SITE } from "@/lib/seo";

const HERO = PHOTOS.oilBack;

/**
 * Photographic hero, designed mobile-first (the main acquisition channel).
 *
 * Phone: the photo runs full-bleed across the top ~60% of the screen and the
 * copy rises over it as an ivory sheet, with a full-width CTA in thumb reach.
 * Desktop: editorial split — copy on the warm gradient, the photo as a tall
 * rounded frame on the right with a small glass "discretion" note.
 *
 * Server component with CSS-only entrance animations: nothing here waits for
 * JavaScript, so the photo and headline paint (and count as LCP) immediately.
 * The 3D statue now lives in the Manifesto section.
 */
export function Hero() {
  const whatsappHref = SITE.whatsapp
    ? `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent("Hola, me gustaría reservar un ritual en L'AMOUR.")}`
    : null;

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-ivory via-champagne/35 to-silk">
      <div className="pointer-events-none absolute -left-32 top-1/3 hidden h-[28rem] w-[28rem] rounded-full bg-gold/20 blur-[140px] lg:block" />
      <Grain />

      {/* Phones: the hero fills the *whole* screen, including the strip behind the browser
          bars (100lvh) — iOS Safari's floating toolbar is translucent, so with 100svh the next
          section showed through underneath it on first load. The photo flexes to fill whatever
          the copy leaves; the copy's bottom padding (below) lifts the hours line clear of the
          bars, so the hero ends at the hours line and nothing from the next section peeks in. */}
      <Container className="relative flex min-h-[100lvh] flex-col lg:grid lg:min-h-dvh lg:grid-cols-[1fr_0.95fr] lg:items-center lg:gap-16 lg:pb-12 lg:pt-28">
        {/* Photo — first on phones (full-bleed), right column on desktop */}
        <div className="relative -mx-5 min-h-56 flex-1 overflow-hidden sm:-mx-8 lg:order-last lg:flex-none lg:mx-0 lg:h-[min(80dvh,46rem)] lg:rounded-[2.5rem] lg:shadow-[0_40px_80px_-40px_rgba(23,23,23,0.55)]">
          <ParallaxMedia>
            <Image
              src={HERO.src}
              alt={HERO.alt}
              fill
              priority
              fetchPriority="high"
              sizes="(min-width: 1024px) 46vw, 100vw"
              className="animate-hero-settle object-cover object-[50%_35%]"
            />
          </ParallaxMedia>
          {/* Phone: soft wash under the transparent header + fade into the text sheet */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-ivory/80 to-transparent lg:hidden" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-espresso/25 to-transparent lg:hidden" />

          <p className="absolute left-5 top-[5.5rem] inline-flex animate-rise items-center gap-1.5 rounded-full bg-ivory/95 px-3 py-1.5 text-xs font-medium text-ink shadow-sm [animation-delay:500ms] sm:left-8 lg:hidden">
            <MapPin size={12} className="text-bronze" aria-hidden />
            Medellín · a domicilio
          </p>

          {/* Desktop: glass note on the photo */}
          <div className="absolute bottom-6 left-6 hidden max-w-[16rem] animate-rise rounded-2xl border border-ivory/30 bg-ivory/95 p-4 shadow-lg [animation-delay:700ms] lg:block">
            <p className="flex items-center gap-2 text-sm font-semibold text-ink">
              <ShieldCheck size={16} className="text-bronze" aria-hidden />
              Discreción total
            </p>
            <p className="mt-1 text-xs leading-relaxed text-ink-soft">
              Sin señalética ni uniformes. Solo tu experiencia, en tu espacio.
            </p>
          </div>
        </div>

        {/* Copy — an ivory sheet rising over the photo on phones, plain column on desktop */}
        <div className="relative -mx-5 -mt-8 shrink-0 rounded-t-[2rem] bg-ivory px-5 pb-[max(4.5rem,calc(100lvh-100svh+env(safe-area-inset-bottom)+1.75rem))] pt-7 sm:-mx-8 sm:px-8 lg:mx-0 lg:mt-0 lg:rounded-none lg:bg-transparent lg:p-0">
          <h1 className="eyebrow animate-rise">Spa de masajes a domicilio en Medellín</h1>
          <p className="mt-4 animate-rise font-serif text-[clamp(2.75rem,12.5vw,4.25rem)] font-bold leading-[0.92] tracking-tight [animation-delay:80ms] lg:text-display">
            <span className="block text-ink-soft">Estética</span>
            <span className="block text-ink">y Sentidos</span>
          </p>

          <p className="mt-4 max-w-md animate-rise text-base leading-relaxed text-ink-soft [animation-delay:160ms] sm:text-lg lg:mt-8">
            Rituales de masaje tántrico, relajación y terapia de pareja, llevados hasta la privacidad de tu
            espacio. Una pausa para respirar.
          </p>

          {/* Instagram business-profile action row: two twin buttons, then a quiet status line. */}
          <div className="mt-7 grid max-w-md animate-rise grid-cols-2 gap-2 [animation-delay:240ms] lg:mt-10">
            <Link
              href="/reservar"
              className="inline-flex min-h-12 items-center justify-center rounded-xl bg-ink px-4 text-[0.95rem] font-semibold text-ivory shadow-[0_12px_28px_-16px_rgba(23,23,23,0.8)] transition-colors duration-200 hover:bg-espresso active:scale-[0.98]"
            >
              Reservar
            </Link>
            {whatsappHref ? (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-ink/15 bg-marfil/70 px-4 text-[0.95rem] font-semibold text-ink transition-colors duration-200 hover:bg-marfil active:scale-[0.98]"
              >
                <WhatsAppIcon size={19} className="text-[#25D366]" />
                Mensaje
              </a>
            ) : (
              <Link
                href="/servicios"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-ink/15 bg-marfil/70 px-4 text-[0.95rem] font-semibold text-ink transition-colors duration-200 hover:bg-marfil active:scale-[0.98]"
              >
                Ver servicios
              </Link>
            )}
          </div>

          <p className="mt-4 flex animate-rise flex-wrap items-center gap-x-2 gap-y-1 text-sm text-ink-soft [animation-delay:320ms]">
            <span className="relative flex h-2 w-2" aria-hidden>
              <span className="absolute inset-0 animate-ping rounded-full bg-emerald-500/60" />
              <span className="relative h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            {whatsappHref ? "Responde en minutos" : "Reservas en línea"} · 9:00 a.m. – 9:00 p.m.
            {whatsappHref && (
              <>
                <span aria-hidden>·</span>
                <Link href="/servicios" className="font-medium text-ink underline decoration-gold/60 underline-offset-4 hover:decoration-ink">
                  Ver servicios
                </Link>
              </>
            )}
          </p>
        </div>
      </Container>
    </section>
  );
}
