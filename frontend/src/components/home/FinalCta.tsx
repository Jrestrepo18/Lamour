import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

export function FinalCta() {
  return (
    <section className="relative overflow-hidden bg-ink py-24">
      <Image
        src="/images/foot-massage-bw.jpg"
        alt=""
        aria-hidden
        fill
        sizes="100vw"
        className="-z-20 object-cover opacity-35"
      />
      {/* Same real-gradient-over-photo approach as the caramel→ink handoff above this
          section: one deliberate blend (photo + color wash), not translucent layers left
          to interact by accident — that's what caused the muddy band fixed earlier. */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(to bottom, rgba(184,154,115,0.85) 0%, rgba(74,53,39,0.92) 35%, #2b2019 72%)",
        }}
      />
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
