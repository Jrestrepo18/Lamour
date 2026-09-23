import { MapPin } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { LinkButton } from "@/components/ui/Button";
import { CoverageParallaxPhoto } from "./CoverageParallaxPhoto";

const MUNICIPIOS = ["Medellín", "Envigado", "Sabaneta", "Itagüí", "Bello", "La Estrella", "Caldas", "Rionegro"];

/**
 * Coverage area. Phones: municipality chips over faint CSS "radar" rings (the
 * same coverage idea as the desktop photo circle, at a fraction of the height).
 * Desktop: list + the parallax photo circle with pulsing rings.
 */
export function CoverageSection() {
  return (
    <section id="cobertura" className="relative overflow-hidden py-16 sm:py-32">
      {/* Phone-only radar backdrop */}
      <div aria-hidden className="pointer-events-none absolute -right-40 top-6 h-80 w-80 lg:hidden">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="absolute inset-0 rounded-full border border-gold/40 animate-radar-pulse"
            style={{ animationDelay: `${i}s` }}
          />
        ))}
        <span className="absolute inset-[38%] rounded-full bg-gold/15" />
      </div>

      <Container className="relative grid items-center gap-14 lg:grid-cols-2">
        <Reveal>
          <SectionHeading
            eyebrow="Cobertura"
            title="Llevamos L'AMOUR hasta tu puerta"
            description="Atendemos citas a domicilio en Medellín y todo su Valle de Aburrá, con la misma discreción y calidad en cada rincón de la ciudad."
          />

          {/* Phones: chips */}
          <ul className="mt-7 flex flex-wrap gap-2 lg:hidden">
            {MUNICIPIOS.map((m) => (
              <li
                key={m}
                className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-ink/10 bg-white/60 px-3.5 text-sm text-ink backdrop-blur-sm"
              >
                <MapPin size={13} className="text-bronze" aria-hidden />
                {m}
              </li>
            ))}
          </ul>

          {/* Desktop: two-column list */}
          <ul className="mt-9 hidden grid-cols-2 gap-x-8 gap-y-3.5 border-t border-ink/10 pt-7 lg:grid">
            {MUNICIPIOS.map((m) => (
              <li key={m} className="flex items-center gap-3 text-base text-[var(--tone-body)]">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                {m}
              </li>
            ))}
          </ul>

          <LinkButton href="/reservar" size="lg" className="mt-8 w-full sm:mt-9 sm:w-auto">
            Consultar disponibilidad en mi zona
          </LinkButton>
        </Reveal>

        <div className="hidden lg:block">
          <CoverageParallaxPhoto />
        </div>
      </Container>
    </section>
  );
}
