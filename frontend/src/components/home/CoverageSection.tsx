import Image from "next/image";
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
          <div className="relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-full border border-gold/25 shadow-xl">
            <Image
              src="/images/spa-bath-tray.jpg"
              alt="Ritual de baño con velas, sales y aceites"
              fill
              sizes="(min-width: 1024px) 28rem, 90vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-ink/25" />
            <div className="absolute inset-6 rounded-full border border-ivory/30" />
            <div className="absolute inset-14 rounded-full border border-ivory/20" />
            <div className="absolute inset-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-gold text-ivory shadow-lg">
              <MapPin size={26} />
            </div>
            <span className="absolute left-1/2 top-8 -translate-x-1/2 text-xs font-sans font-medium uppercase tracking-widest text-ivory drop-shadow-md">
              Bello
            </span>
            <span className="absolute bottom-10 left-10 text-xs font-sans font-medium uppercase tracking-widest text-ivory drop-shadow-md">
              Itagüí
            </span>
            <span className="absolute bottom-10 right-8 text-xs font-sans font-medium uppercase tracking-widest text-ivory drop-shadow-md">
              Envigado
            </span>
            <span className="absolute right-6 top-1/2 -translate-y-1/2 text-xs font-sans font-medium uppercase tracking-widest text-ivory drop-shadow-md">
              Rionegro
            </span>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
