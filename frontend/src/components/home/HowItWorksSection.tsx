import { CalendarClock, Home, Sparkles, UserRound } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const STEPS = [
  { title: "Elige tu servicio", text: "Explora el catálogo y selecciona el ritual perfecto para ti.", icon: Sparkles },
  { title: "Elige tu masajista", text: "Conoce a nuestro equipo y elige con quién vivir la experiencia.", icon: UserRound },
  { title: "Elige tu horario", text: "Consulta disponibilidad en tiempo real y agenda sin cruces.", icon: CalendarClock },
  { title: "Recibe en tu espacio", text: "Confirma tus datos y dirección; nosotros llegamos a ti.", icon: Home },
];

/**
 * The booking process as a numbered timeline: one gold hairline running
 * through four stations (horizontal on desktop, vertical on mobile), a
 * single accent color throughout, and a CTA that closes the section.
 */
export function HowItWorksSection() {
  return (
    <section id="como-funciona" className="py-16 sm:py-32">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Reserva en 4 pasos"
            title="Simple, discreto, a tu ritmo"
            description="Un proceso claro y en tiempo real para agendar tu ritual L'AMOUR, sin llamadas ni esperas."
          />
        </Reveal>

        <ol className="relative mt-10 grid grid-cols-1 gap-7 sm:mt-14 sm:gap-10 lg:grid-cols-4 lg:gap-8">
          {/* Connecting hairline: vertical on mobile, horizontal from lg up. */}
          <span
            aria-hidden
            className="absolute bottom-6 left-6 top-6 w-px sm:left-7 bg-gradient-to-b from-gold/60 via-gold/30 to-transparent lg:bottom-auto lg:left-7 lg:right-0 lg:top-7 lg:h-px lg:w-auto lg:bg-gradient-to-r"
          />
          {STEPS.map((step, i) => (
            <li key={step.title} className="relative">
              <Reveal delay={0.08 * i} className="flex gap-4 sm:gap-5 lg:block">
                <span className="relative z-10 flex h-12 w-12 shrink-0 sm:h-14 sm:w-14 items-center justify-center rounded-full border border-gold/40 bg-ivory text-bronze shadow-[0_10px_24px_-14px_rgba(43,32,25,0.45)]">
                  <step.icon size={21} strokeWidth={1.6} aria-hidden />
                </span>
                <div className="pt-1 lg:mt-7 lg:pt-0">
                  <p className="text-[0.7rem] font-semibold tracking-[0.3em] text-bronze">PASO 0{i + 1}</p>
                  <h3 className="mt-1 font-serif text-lg font-semibold text-ink sm:mt-2 sm:text-xl">{step.title}</h3>
                  <p className="mt-1 max-w-xs text-sm leading-relaxed text-[var(--tone-body)] sm:mt-2">{step.text}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>

        <Reveal delay={0.2} className="mt-10 sm:mt-14">
          <LinkButton href="/reservar" size="lg" className="w-full sm:w-auto">
            Empezar mi reserva
          </LinkButton>
        </Reveal>
      </Container>
    </section>
  );
}
