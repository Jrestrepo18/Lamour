import { CheckCircle2 } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { LinkButton } from "@/components/ui/Button";
import { CoverageParallaxPhoto } from "./CoverageParallaxPhoto";

const MUNICIPIOS = [
  "Medellín",
  "Envigado",
  "Sabaneta",
  "Itagüí",
  "Bello",
  "La Estrella",
  "Caldas",
  "Rionegro",
];

export function CoverageSection() {
  return (
    <section id="cobertura" className="py-20">
      <Container className="grid items-center gap-12 lg:grid-cols-2">
        <Reveal>
          <SectionHeading
            align="left"
            eyebrow="Cobertura"
            title="Llevamos L'AMOUR hasta tu puerta"
            description="Atendemos citas a domicilio en Medellín y todo su Valle de Aburrá, con la misma discreción y calidad en cada rincón de la ciudad."
          />
          <ul className="mt-8 grid grid-cols-2 gap-3">
            {MUNICIPIOS.map((m) => (
              <li key={m} className="flex items-center gap-2 text-sm text-[var(--tone-body)]">
                <CheckCircle2 size={16} className="shrink-0 text-gold-dark" />
                {m}
              </li>
            ))}
          </ul>
          <LinkButton href="/reservar" className="mt-8">
            Consultar disponibilidad en mi zona
          </LinkButton>
        </Reveal>

        <CoverageParallaxPhoto />
      </Container>
    </section>
  );
}
