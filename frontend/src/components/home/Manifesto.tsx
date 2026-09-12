import { Quote } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { FadeInImage } from "@/components/ui/FadeInImage";
import { Reveal } from "@/components/ui/Reveal";
import { ScrollFocusText } from "@/components/home/ScrollFocusText";

export function Manifesto() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      <Quote
        aria-hidden
        strokeWidth={0.6}
        className="pointer-events-none absolute -left-6 top-10 text-gold/10 sm:left-0 sm:top-6"
        size={200}
      />
      <div className="pointer-events-none absolute -right-24 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-terracotta/10 blur-[100px]" />

      <Container className="relative">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
          <div className="max-w-4xl">
            <Reveal>
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-terracotta">Nuestra filosofía</p>
            </Reveal>
            <Reveal delay={0.1}>
              <ScrollFocusText className="mt-6 font-serif text-3xl leading-[1.25] text-ink text-balance sm:text-5xl sm:leading-[1.2]">
                Creemos en la pausa. En el contacto consciente. En regalarte, sin salir de casa, una experiencia
                que despierta{" "}
                <span className="bg-gradient-to-r from-terracotta to-gold-dark bg-clip-text text-transparent">
                  cada sentido.
                </span>
              </ScrollFocusText>
            </Reveal>
            <Reveal delay={0.2} className="mt-10 max-w-lg border-l-2 border-gold/30 pl-6">
              <p className="text-sm leading-relaxed text-[var(--tone-body)]">
                Cada ritual L&apos;AMOUR es ejecutado por terapeutas certificadas, en un marco de absoluto respeto,
                consentimiento y confidencialidad — para que lo único que tengas que hacer sea entregarte a la
                experiencia.
              </p>
            </Reveal>
          </div>

          <Reveal from="right" delay={0.15} className="mx-auto w-40 -rotate-1 overflow-hidden rounded-[1.5rem] shadow-xl sm:w-56 lg:mx-0 lg:w-full">
            <FadeInImage
              src="/images/essential-oil-bottle.jpg"
              alt="Aceite esencial en un frasco de vidrio ámbar"
              width={3000}
              height={4500}
              sizes="(min-width: 1024px) 30vw, 224px"
              className="aspect-[3/4] w-full object-cover"
            />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
