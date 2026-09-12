import { Container } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

export function FinalCta() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#b89a73] via-[#4a3527] to-ink py-24">
      {/* The glow sits low, on the section's already-solid dark portion, instead of at
          top-0 where it used to overlap the caramel→ink transition above — stacking two
          translucent warm layers there was compositing into a muddy olive band. */}
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-64 w-[40rem] -translate-x-1/2 translate-y-1/3 rounded-full bg-gold/10 blur-[120px]" />
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
