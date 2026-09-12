import { Quote } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { ScrollFocusText } from "@/components/home/ScrollFocusText";

export function Manifesto() {
  return (
    <section className="relative overflow-hidden py-28 sm:py-40">
      <Quote
        aria-hidden
        strokeWidth={0.6}
        className="pointer-events-none absolute -left-6 top-10 text-gold/10 sm:left-0 sm:top-6"
        size={200}
      />
      <div className="pointer-events-none absolute -right-24 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-terracotta/10 blur-[100px]" />

      <Container className="relative max-w-4xl">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-terracotta">Nuestra filosofía</p>
        </Reveal>
        <Reveal delay={0.1}>
          <ScrollFocusText className="mt-6 font-serif text-3xl leading-[1.25] text-ink text-balance sm:text-5xl sm:leading-[1.2]">
            Creemos en la pausa. En el contacto consciente. En regalarte, sin salir de casa, una experiencia
            que despierta <span className="bg-gradient-to-r from-terracotta to-gold-dark bg-clip-text text-transparent">cada sentido.</span>
          </ScrollFocusText>
        </Reveal>
        <Reveal delay={0.2} className="mt-10 max-w-lg border-l-2 border-gold/30 pl-6">
          <p className="text-sm leading-relaxed text-[var(--tone-body)]">
            Cada ritual L&apos;AMOUR es ejecutado por terapeutas certificadas, en un marco de absoluto respeto,
            consentimiento y confidencialidad — para que lo único que tengas que hacer sea entregarte a la
            experiencia.
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
