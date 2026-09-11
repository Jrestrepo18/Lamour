import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

export function Manifesto() {
  return (
    <section className="py-28 sm:py-40">
      <Container className="max-w-4xl">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-terracotta">Nuestra filosofía</p>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-6 font-serif text-3xl italic leading-[1.25] text-ink text-balance sm:text-5xl sm:leading-[1.2]">
            Creemos en la pausa. En el contacto consciente. En regalarte, sin salir de casa, una experiencia
            que despierta <span className="text-terracotta">cada sentido.</span>
          </p>
        </Reveal>
        <Reveal delay={0.2} className="mt-10 max-w-lg">
          <p className="text-sm leading-relaxed text-ink-soft">
            Cada ritual L&apos;AMOUR es ejecutado por terapeutas certificadas, en un marco de absoluto respeto,
            consentimiento y confidencialidad — para que lo único que tengas que hacer sea entregarte a la
            experiencia.
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
