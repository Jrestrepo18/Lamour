import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { CoverageParallaxPhoto } from "./CoverageParallaxPhoto";
import { CoverageSearch } from "./CoverageSearch";

/**
 * Coverage area: an Instagram-style place search that answers "do you come to
 * my area?" (see CoverageSearch). Phones get faint CSS "radar" rings behind it;
 * desktop keeps the parallax photo circle with pulsing rings beside it.
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

          {/* Instagram-style place search: answers "do you come to my area?" in one tap. */}
          <CoverageSearch />
        </Reveal>

        <div className="hidden lg:block">
          <CoverageParallaxPhoto />
        </div>
      </Container>
    </section>
  );
}
