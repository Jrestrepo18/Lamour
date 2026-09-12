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
              Simple, discreto, a tu ritmo
            </h2>
          </Reveal>
          <Reveal from="right" delay={0.1} className="mt-4 max-w-md">
            <p className="text-sm leading-relaxed text-[var(--tone-body)]">
              Un proceso simple, discreto y en tiempo real para agendar tu ritual L&apos;AMOUR.
            </p>
          </Reveal>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <Reveal key={step.title} delay={0.08 * i} from={asymmetricDirection(i)}>
              <div className="flex h-full flex-col rounded-[1.75rem] border border-ink/10 bg-white/60 p-6 shadow-sm">
                <div className={`flex h-14 w-14 items-center justify-center rounded-full ${ACCENTS[step.accent]}`}>
                  <step.icon size={22} strokeWidth={1.6} />
                </div>
                <h3 className="mt-5 font-serif text-xl text-ink">{step.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--tone-body)]">{step.text}</p>
                <span className="mt-4 font-serif text-sm text-gold">0{i + 1}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
