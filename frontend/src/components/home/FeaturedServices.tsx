import Link from "next/link";
import { ArrowUpRight, Droplet, Eye, Sparkles } from "lucide-react";
import type { Service } from "@/lib/types";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { formatCOP, formatDuration } from "@/lib/format";

const VISUALS = [
  { icon: Droplet, className: "bg-gradient-to-br from-gold/35 to-champagne/40 text-gold-dark" },
  { icon: Sparkles, className: "bg-gradient-to-br from-terracotta/20 to-champagne/35 text-terracotta" },
  { icon: Eye, className: "bg-gradient-to-br from-ink to-ink/70 text-champagne" },
];

export function FeaturedServices({ services }: { services: Service[] }) {
  if (services.length === 0) return null;

  return (
    <section className="py-28 sm:py-36">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6 border-b border-ink/10 pb-10">
          <Reveal from="left">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-terracotta">Lo más pedido</p>
            <h2 className="font-serif text-4xl leading-[1.05] text-ink sm:text-5xl">Rituales destacados</h2>
          </Reveal>
          <Reveal from="right" delay={0.1}>
            <Link
              href="/servicios"
              className="group inline-flex items-center gap-1.5 text-sm font-medium text-[var(--tone-body)] transition-colors hover:text-terracotta"
            >
              Ver catálogo completo
              <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </Reveal>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {services.map((service, i) => {
            const visual = VISUALS[i % VISUALS.length];
            return (
              <Reveal key={service.id} delay={0.1 * i} from={i % 2 === 0 ? "left" : "right"}>
                <Link
                  href={`/reservar?service=${service.slug}`}
                  className="group relative flex h-full flex-col rounded-[1.75rem] border border-ink/10 bg-white/60 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-gold/30 hover:shadow-xl sm:p-7"
                >
                  <span className="absolute right-6 top-6 flex h-9 w-9 items-center justify-center rounded-full bg-ivory/90 text-ink opacity-0 shadow-md backdrop-blur transition-all duration-300 group-hover:opacity-100">
                    <ArrowUpRight size={16} />
                  </span>

                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl shadow-sm transition-transform duration-500 ease-out group-hover:scale-105 ${visual.className}`}
                  >
                    <visual.icon size={22} strokeWidth={1.5} />
                  </div>

                  <h3 className="mt-5 pr-8 font-serif text-2xl text-ink transition-colors group-hover:text-terracotta">
                    {service.name}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--tone-body)]">{service.shortDescription}</p>

                  <div className="mt-5 flex items-center justify-between border-t border-ink/10 pt-4 text-xs text-[var(--tone-body)]">
                    <span>{formatDuration(service.durationMinutes)}</span>
                    <span className="font-serif text-base text-ink">{formatCOP(service.price)}</span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
