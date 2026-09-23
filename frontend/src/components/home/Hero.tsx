import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MapPin, ShieldCheck } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Grain } from "@/components/ui/Grain";
import { PHOTOS } from "@/lib/photos";

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
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-ivory via-champagne/35 to-silk">
      <div className="pointer-events-none absolute -left-32 top-1/3 hidden h-[28rem] w-[28rem] rounded-full bg-gold/20 blur-[140px] lg:block" />
      <Grain />

      <Container className="relative grid lg:min-h-dvh lg:grid-cols-[1fr_0.95fr] lg:items-center lg:gap-16 lg:pb-12 lg:pt-28">
        {/* Photo — first on phones (full-bleed), right column on desktop */}
        <div className="relative -mx-5 h-[clamp(18rem,51svh,32rem)] overflow-hidden sm:-mx-8 lg:order-last lg:mx-0 lg:h-[min(80dvh,46rem)] lg:rounded-[2.5rem] lg:shadow-[0_40px_80px_-40px_rgba(43,32,25,0.55)]">
          <Image
            src={HERO.src}
            alt={HERO.alt}
            fill
            priority
            fetchPriority="high"
            sizes="(min-width: 1024px) 46vw, 100vw"
            className="animate-hero-settle object-cover object-[50%_35%]"
          />
          {/* Phone: soft wash under the transparent header + fade into the text sheet */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-ivory/80 to-transparent lg:hidden" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-espresso/25 to-transparent lg:hidden" />

          <p className="absolute left-5 top-[5.5rem] inline-flex animate-rise items-center gap-1.5 rounded-full bg-ivory/85 px-3 py-1.5 text-xs font-medium text-ink shadow-sm backdrop-blur [animation-delay:500ms] sm:left-8 lg:hidden">
            <MapPin size={12} className="text-bronze" aria-hidden />
            Medellín · a domicilio
          </p>

          {/* Desktop: glass note on the photo */}
          <div className="absolute bottom-6 left-6 hidden max-w-[16rem] animate-rise rounded-2xl border border-ivory/30 bg-ivory/75 p-4 shadow-lg backdrop-blur-md [animation-delay:700ms] lg:block">
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
        <div className="relative -mx-5 -mt-8 rounded-t-[2rem] bg-ivory px-5 pb-12 pt-7 sm:-mx-8 sm:px-8 lg:mx-0 lg:mt-0 lg:rounded-none lg:bg-transparent lg:p-0">
          <h1 className="eyebrow animate-rise">Spa de masajes a domicilio en Medellín</h1>
          <p className="mt-4 animate-rise font-serif text-[clamp(2.75rem,12.5vw,4.25rem)] font-bold leading-[0.92] tracking-tight [animation-delay:80ms] lg:text-display">
            <span className="block text-ink-soft">Estética</span>
            <span className="block text-ink">y Sentidos</span>
          </p>

          <p className="mt-4 max-w-md animate-rise text-base leading-relaxed text-ink-soft [animation-delay:160ms] sm:text-lg lg:mt-8">
            Rituales de masaje tántrico, relajación y terapia de pareja, llevados hasta la privacidad de tu
            espacio. Una pausa para respirar.
          </p>

          <div className="mt-6 flex animate-rise flex-col gap-3 [animation-delay:240ms] sm:flex-row sm:items-center sm:gap-6 lg:mt-10">
            <Link
              href="/reservar"
              className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-ink pl-7 pr-2 text-base font-semibold text-ivory shadow-[0_16px_36px_-16px_rgba(43,32,25,0.8)] transition-colors duration-300 hover:bg-espresso sm:justify-start"
            >
              Reservar mi experiencia
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold text-ink transition-transform duration-300 group-hover:rotate-45">
                <ArrowUpRight size={18} aria-hidden />
              </span>
            </Link>
            <Link
              href="/servicios"
              className="inline-flex min-h-11 items-center justify-center text-sm font-medium text-ink underline decoration-gold/60 decoration-1 underline-offset-8 transition-colors hover:decoration-ink"
            >
              Ver servicios y precios
            </Link>
          </div>

          <p className="mt-8 hidden animate-rise items-center gap-2 text-sm text-ink-soft [animation-delay:320ms] lg:flex">
            <MapPin size={14} className="text-bronze" aria-hidden />
            Medellín y su área metropolitana · 9:00 a.m. – 9:00 p.m.
          </p>
        </div>
      </Container>
    </section>
  );
}
