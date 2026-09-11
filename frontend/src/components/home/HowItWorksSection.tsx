import { CalendarCheck, MapPinned, Sparkles, UserRound } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

const STEPS = [
  { icon: Sparkles, title: "Elige tu Servicio", text: "Explora el catálogo y selecciona el ritual perfecto para ti." },
  { icon: UserRound, title: "Elige tu Masajista", text: "Conoce a nuestro equipo y elige con quién vivir la experiencia." },
  { icon: CalendarCheck, title: "Elige tu Horario", text: "Consulta disponibilidad en tiempo real y agenda sin cruces." },
  { icon: MapPinned, title: "Recibe en tu Espacio", text: "Confirma tus datos y dirección; nosotros llegamos a ti." },
];

export function HowItWorksSection() {
  return (
    <section className="py-24">
      <Container>
        <SectionHeading
          eyebrow="Reserva en 4 pasos"
          title="Tu experiencia, a tu manera"
          description="Un proceso simple, discreto y en tiempo real para agendar tu ritual L'AMOUR."
        />
        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <Reveal key={step.title} delay={0.1 * i} className="relative">
              <div className="flex flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gold/10 text-gold-dark">
                  <step.icon size={26} strokeWidth={1.5} />
                </div>
                <span className="mt-4 font-serif text-sm italic text-gold-dark">Paso {i + 1}</span>
                <h3 className="mt-1 font-serif text-lg text-ink">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{step.text}</p>
              </div>
              {i < STEPS.length - 1 && (
                <div className="absolute right-[-1rem] top-8 hidden h-px w-8 bg-gradient-to-r from-gold/40 to-transparent lg:block" />
              )}
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
