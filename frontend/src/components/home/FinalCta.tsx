import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { ParallaxMedia } from "@/components/motion/ParallaxMedia";
import { PHOTOS } from "@/lib/photos";

/**
 * Closing call to action over a full-strength photograph. Instead of one heavy
 * wash over the whole image, the darkening is targeted: a short caramel fade
 * at the top (continuing the scroll tint above), a soft dark vignette only
 * behind the copy (for legibility), and a fade into the footer's ink at the
 * bottom — so the photo itself stays visible.
 */
export function FinalCta() {
  return (
    <section className="relative isolate flex min-h-[78svh] items-center overflow-hidden bg-ink py-28 sm:min-h-[70vh] sm:py-36">
      <div className="absolute inset-0 -z-20 overflow-hidden">
        <ParallaxMedia mode="through" distance={10}>
          <Image src={PHOTOS.footBw.src} alt="" aria-hidden fill sizes="100vw" className="object-cover object-[50%_35%]" />
        </ParallaxMedia>
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background: [
            // soft dark pool behind the text, fading out toward the edges
            "radial-gradient(ellipse 75% 60% at 50% 52%, rgba(20,13,8,0.58) 0%, rgba(20,13,8,0.32) 55%, rgba(20,13,8,0.08) 100%)",
            // short caramel lead-in at the top, ink lead-out into the footer
            "linear-gradient(to bottom, rgba(184,154,115,0.9) 0%, rgba(184,154,115,0) 18%, rgba(43,32,25,0) 80%, #2b2019 100%)",
          ].join(", "),
        }}
      />

      <Container className="relative text-center [text-shadow:0_2px_24px_rgba(20,13,8,0.55)]">
        <Reveal>
          <p className="eyebrow justify-center !text-champagne">Tu momento te espera</p>
          <h2 className="mx-auto mt-5 max-w-2xl font-serif text-4xl font-semibold leading-tight tracking-tight text-ivory text-balance sm:text-6xl">
            Regálate una pausa. Regálate L&apos;AMOUR.
          </h2>
          <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-ivory/90 sm:text-lg">
            Reserva en minutos y recibe una experiencia diseñada para tus sentidos, en la comodidad de tu hogar.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-4 [text-shadow:none] sm:flex-row">
            <LinkButton href="/reservar" size="lg" variant="light" className="w-full max-w-xs sm:w-auto">
              Reservar ahora
            </LinkButton>
            <Link
              href="/servicios"
              className="inline-flex min-h-11 items-center text-sm font-medium text-ivory underline decoration-gold/70 underline-offset-8 transition-colors hover:decoration-ivory"
            >
              Explorar servicios
            </Link>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
