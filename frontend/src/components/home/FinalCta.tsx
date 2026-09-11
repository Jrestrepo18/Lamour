import { Container } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

export function FinalCta() {
  return (
    <section className="relative overflow-hidden bg-ink py-24">
      <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-[40rem] -translate-x-1/2 rounded-full bg-gold/10 blur-[120px]" />
      <Container className="relative text-center">
        <Reveal>
          <p className="text-xs font-sans font-semibold uppercase tracking-[0.35em] text-gold">Tu momento te espera</p>
          <h2 className="mx-auto mt-4 max-w-2xl font-serif text-3xl text-ivory sm:text-4xl">
            Regálate una pausa. Regálate L&apos;AMOUR.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-ivory/60">
            Reserva en minutos y recibe una experiencia diseñada para tus sentidos, en la comodidad de tu hogar.
          </p>
          <LinkButton href="/reservar" size="lg" className="mt-8">
            Reservar Ahora
          </LinkButton>
        </Reveal>
      </Container>
    </section>
  );
}
