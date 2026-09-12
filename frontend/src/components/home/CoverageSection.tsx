import { CheckCircle2, MapPin } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { LinkButton } from "@/components/ui/Button";

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
    <section id="cobertura" className="py-24">
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

        <Reveal delay={0.15}>
          <div className="relative mx-auto aspect-square w-full max-w-md rounded-full border border-gold/25 bg-gradient-to-br from-ivory to-champagne/30 shadow-inner">
            <div className="absolute inset-6 rounded-full border border-gold/20" />
            <div className="absolute inset-14 rounded-full border border-gold/15" />
            <div className="absolute inset-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-gold text-ivory shadow-lg">
              <MapPin size={26} />
            </div>
            <span className="absolute left-1/2 top-8 -translate-x-1/2 text-xs font-sans font-medium uppercase tracking-widest text-[var(--tone-body)]">
              Bello
            </span>
            <span className="absolute bottom-10 left-10 text-xs font-sans font-medium uppercase tracking-widest text-[var(--tone-body)]">
              Itagüí
            </span>
            <span className="absolute bottom-10 right-8 text-xs font-sans font-medium uppercase tracking-widest text-[var(--tone-body)]">
              Envigado
            </span>
            <span className="absolute right-6 top-1/2 -translate-y-1/2 text-xs font-sans font-medium uppercase tracking-widest text-[var(--tone-body)]">
              Rionegro
            </span>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
