import { CalendarClock, Home, Sparkles, UserRound } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { asymmetricDirection } from "@/lib/motion";

const STEPS = [
  {
    title: "Elige tu servicio",
    text: "Explora el catálogo y selecciona el ritual perfecto para ti.",
    icon: Sparkles,
    accent: "gold" as const,
  },
  {
    title: "Elige tu masajista",
    text: "Conoce a nuestro equipo y elige con quién vivir la experiencia.",
    icon: UserRound,
    accent: "terracotta" as const,
  },
  {
    title: "Elige tu horario",
    text: "Consulta disponibilidad en tiempo real y agenda sin cruces.",
    icon: CalendarClock,
    accent: "champagne" as const,
  },
  {
    title: "Recibe en tu espacio",
    text: "Confirma tus datos y dirección; nosotros llegamos a ti.",
    icon: Home,
    accent: "gold" as const,
  },
];

const ACCENTS = {
  gold: "bg-gold/15 text-gold-dark",
  terracotta: "bg-terracotta/12 text-terracotta",
  champagne: "bg-champagne/60 text-gold-dark",
};

export function HowItWorksSection() {
  return (
    <section className="py-28 sm:py-36">
      <Container>
        <div className="border-b border-ink/10 pb-10">
          <Reveal from="left">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-terracotta">
              Reserva en 4 pasos
            </p>
            <h2 className="font-serif text-4xl leading-[1.05] text-ink text-balance sm:text-5xl">
              Tu experiencia, a tu manera
            </h2>
          </Reveal>
          <Reveal from="right" delay={0.1} className="mt-4 max-w-md">
            <p className="text-sm leading-relaxed text-ink-soft">
              Un proceso simple, discreto y en tiempo real para agendar tu ritual L&apos;AMOUR.
            </p>
          </Reveal>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <Reveal key={step.title} delay={0.08 * i} from={asymmetricDirection(i)}>
              <div className="border-t border-ink/10 py-8 pr-6 lg:border-t-0 lg:border-l lg:py-2 lg:pl-8 lg:pt-1 first:lg:border-l-0 first:lg:pl-0">
                <div className={`flex h-14 w-14 items-center justify-center rounded-full ${ACCENTS[step.accent]}`}>
                  <step.icon size={22} strokeWidth={1.6} />
                </div>
                <span className="mt-4 block font-serif text-sm text-gold">0{i + 1}</span>
                <h3 className="mt-1 font-serif text-xl text-ink">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{step.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
