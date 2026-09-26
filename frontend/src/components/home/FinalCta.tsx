import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { Container } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { ParallaxMedia } from "@/components/motion/ParallaxMedia";
import { PHOTOS } from "@/lib/photos";
import { getI18n } from "@/i18n/server";

/**
 * Closing call to action over a full-strength photograph. The darkening is
 * targeted — a soft vignette behind the copy for legibility and a fade into
 * the footer's ink at the bottom — and the top edge dissolves into whatever
 * background precedes it, so there is never a hard seam above this section.
 */
export async function FinalCta({ className }: { className?: string }) {
  const { t, href } = await getI18n();
  // `className` lets a page paint the same background as the section above (e.g. a tinted
  // catalog section), so the photo's fade starts from exactly that colour.
  return (
    <section
      className={clsx(
        "relative isolate flex min-h-[80svh] items-center overflow-hidden py-28 sm:min-h-[72vh] sm:py-36",
        className,
      )}
    >
      {/* Photo + shading share one mask that fades them in from fully transparent at the
          top edge — so whatever sits above (ivory, silk, or the home page's scroll tint)
          flows straight into the photo with no seam, on every page. The bottom fades
          to the footer's ink. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 [mask-image:linear-gradient(to_bottom,transparent_0%,rgba(0,0,0,0.06)_7%,rgba(0,0,0,0.22)_14%,rgba(0,0,0,0.5)_22%,rgba(0,0,0,0.8)_30%,#000_38%)]"
      >
        <div className="absolute inset-0 overflow-hidden">
          <ParallaxMedia mode="through" distance={10}>
            <Image src={PHOTOS.footBw.src} alt="" fill sizes="100vw" className="object-cover object-[50%_35%]" />
          </ParallaxMedia>
        </div>
        <div
          className="absolute inset-0"
          style={{
            background: [
              // soft dark pool behind the text, fading out toward the edges
              "radial-gradient(ellipse 75% 60% at 50% 55%, rgba(16,16,16,0.6) 0%, rgba(16,16,16,0.34) 55%, rgba(16,16,16,0.1) 100%)",
              // lead-out into the footer's ink
              "linear-gradient(to bottom, rgba(23,23,23,0) 72%, #171717 100%)",
            ].join(", "),
          }}
        />
      </div>

      <Container className="relative text-center [text-shadow:0_2px_24px_rgba(16,16,16,0.55)]">
        <Reveal>
          <p className="eyebrow justify-center !text-champagne">{t("Tu momento te espera", "Your moment awaits")}</p>
          <h2 className="mx-auto mt-5 max-w-2xl font-serif text-4xl font-semibold leading-tight tracking-tight text-ivory text-balance sm:text-6xl">
            {t("Regálate una pausa. Regálate L'AMOUR.", "Give yourself a pause. Give yourself L'AMOUR.")}
          </h2>
          <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-ivory/90 sm:text-lg">
            {t(
              "Reserva en minutos y recibe una experiencia diseñada para tus sentidos, en la comodidad de tu hogar.",
              "Book in minutes and enjoy an experience designed for your senses, in the comfort of your home.",
            )}
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-4 [text-shadow:none] sm:flex-row">
            <LinkButton href={href("/reservar")} size="lg" variant="light" className="w-full max-w-xs sm:w-auto">
              {t("Reservar ahora", "Book now")}
            </LinkButton>
            <Link
              href={href("/servicios")}
              className="inline-flex min-h-11 items-center text-sm font-medium text-ivory underline decoration-gold/70 underline-offset-8 transition-colors hover:decoration-ivory"
            >
              {t("Explorar servicios", "Explore services")}
            </Link>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
