import { Eye, HeartHandshake } from "lucide-react";
import type { ServiceCategory } from "@/lib/types";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { LinkButton } from "@/components/ui/Button";
import { formatCOP, formatDuration } from "@/lib/format";
import { ServiceCard } from "./ServiceCard";

export function CouplesSection({ category }: { category: ServiceCategory }) {
  const voyerista = category.services.find((s) => s.slug === "masaje-voyerista");
  const rest = category.services.filter((s) => s.slug !== "masaje-voyerista");

  return (
    <section id="pareja" className="bg-ink py-28 sm:py-36">
      <Container>
        <div className="border-b border-ivory/10 pb-10">
          <Reveal from="left">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-champagne">
              Experiencias en Pareja
            </p>
            <h2 className="font-serif text-4xl italic leading-[1.05] text-ivory text-balance sm:text-6xl">
              {category.name}
            </h2>
          </Reveal>
          {category.description && (
            <Reveal from="right" delay={0.1} className="mt-4 max-w-lg">
              <p className="text-sm leading-relaxed text-ivory/60">{category.description}</p>
            </Reveal>
          )}
        </div>

        {voyerista && (
          <Reveal delay={0.15}>
            <div className="mt-14 grid overflow-hidden rounded-[2rem] border border-gold/20 bg-gradient-to-br from-[#1c1712] via-ink to-[#1c1712] shadow-2xl md:grid-cols-2">
              <div className="relative flex flex-col justify-center gap-5 p-10 sm:p-14">
                <div className="flex items-center gap-2 text-gold">
                  <Eye size={20} />
                  <span className="text-xs font-semibold uppercase tracking-[0.3em]">El Arte de Mirar</span>
                </div>
                <h3 className="font-serif text-3xl italic text-ivory sm:text-4xl">{voyerista.name}</h3>
                <p className="text-sm leading-relaxed text-ivory/65">
                  Conexión a través de los sentidos: uno de los dos se entrega por completo a la relajación
                  mientras el otro observa cada movimiento, alimentando la fantasía y la complicidad de la
                  pareja.
                </p>
                <div className="flex items-center gap-6 text-sm text-ivory/55">
                  <span>{formatDuration(voyerista.durationMinutes)}</span>
                  <span className="font-serif text-xl text-champagne">{formatCOP(voyerista.price)}</span>
                </div>
                <LinkButton href={`/reservar?service=${voyerista.slug}`} size="md" className="w-fit">
                  Vivir esta experiencia
                </LinkButton>
              </div>
              <div className="relative hidden min-h-[24rem] items-center justify-center overflow-hidden bg-gradient-to-br from-champagne/15 via-gold/10 to-transparent md:flex">
                <div className="absolute -right-16 -top-16 h-72 w-72 rounded-full bg-terracotta/20 blur-3xl" />
                <HeartHandshake size={130} strokeWidth={0.7} className="relative text-gold/40" />
              </div>
            </div>
          </Reveal>
        )}

        <div className="mt-6">
          {rest.map((service, i) => (
            <Reveal key={service.id} delay={0.08 * i} from={i % 2 === 0 ? "left" : "right"}>
              <ServiceCard service={service} tone="dark" />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
