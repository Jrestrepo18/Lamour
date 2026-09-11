import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Service } from "@/lib/types";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { formatCOP, formatDuration } from "@/lib/format";

export function FeaturedServices({ services }: { services: Service[] }) {
  if (services.length === 0) return null;

  return (
    <section className="bg-silk/40 py-28 sm:py-36">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6 border-b border-ink/10 pb-10">
          <Reveal from="left">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-terracotta">Lo más pedido</p>
            <h2 className="font-serif text-4xl leading-[1.05] text-ink sm:text-5xl">Rituales destacados</h2>
          </Reveal>
          <Reveal from="right" delay={0.1}>
            <Link
              href="/servicios"
              className="group inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft transition-colors hover:text-terracotta"
            >
              Ver catálogo completo
              <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </Reveal>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-x-10 sm:grid-cols-3">
          {services.map((service, i) => (
            <Reveal key={service.id} delay={0.1 * i} from={i % 2 === 0 ? "left" : "right"}>
              <Link
                href={`/reservar?service=${service.slug}`}
                className="group block border-t border-ink/10 py-8 transition-colors sm:border-t-0 sm:py-10"
              >
                <span className="font-serif text-sm text-gold">0{i + 1}</span>
                <h3 className="mt-3 font-serif text-2xl text-ink transition-colors group-hover:text-terracotta">
                  {service.name}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">{service.shortDescription}</p>
                <div className="mt-5 flex items-center justify-between text-xs text-ink-soft">
                  <span>{formatDuration(service.durationMinutes)}</span>
                  <span className="font-serif text-base text-ink">{formatCOP(service.price)}</span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
