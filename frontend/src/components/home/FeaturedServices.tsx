import Link from "next/link";
import { ArrowUpRight, Droplet, Eye, Sparkles } from "lucide-react";
import type { Service } from "@/lib/types";
import { Container } from "@/components/ui/Container";
import { FadeInImage } from "@/components/ui/FadeInImage";
import { Reveal } from "@/components/ui/Reveal";
import { formatCOP, formatDuration } from "@/lib/format";

const VISUALS = [
  {
    icon: Droplet,
    photo: "/images/massage-oil-pour-back.jpg",
    alt: "Aceite tibio deslizándose sobre la espalda",
    w: 3648,
    h: 5472,
    badge: "bg-gold text-espresso",
  },
  {
    icon: Sparkles,
    photo: "/images/hot-stone-massage.jpg",
    alt: "Piedras de jade sobre la espalda durante una terapia",
    w: 2048,
    h: 2536,
    badge: "bg-terracotta text-ivory",
  },
  {
    icon: Eye,
    photo: "/images/spa-ambiance-candles.jpg",
    alt: "Velas encendidas en un ambiente íntimo",
    w: 5184,
    h: 3456,
    badge: "bg-ink text-champagne",
  },
];

export function FeaturedServices({ services }: { services: Service[] }) {
  if (services.length === 0) return null;

  return (
    <section className="py-20 sm:py-28">
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
                  className="group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-ink/10 bg-white/60 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-gold/30 hover:shadow-xl"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden">
                    <FadeInImage
                      src={visual.photo}
                      alt={visual.alt}
                      width={visual.w}
                      height={visual.h}
                      sizes="(min-width: 640px) 33vw, 100vw"
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    />
                    <div
                      className={`absolute bottom-3 left-3 flex h-11 w-11 items-center justify-center rounded-full shadow-lg ${visual.badge}`}
                    >
                      <visual.icon size={20} strokeWidth={1.5} />
                    </div>
                    <span className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-ivory/90 text-ink opacity-0 shadow-md backdrop-blur transition-all duration-300 group-hover:opacity-100">
                      <ArrowUpRight size={16} />
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-6 sm:p-7">
                    <h3 className="font-serif text-2xl text-ink transition-colors group-hover:text-terracotta">
                      {service.name}
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--tone-body)]">{service.shortDescription}</p>

                    <div className="mt-5 flex items-center justify-between border-t border-ink/10 pt-4 text-xs text-[var(--tone-body)]">
                      <span>{formatDuration(service.durationMinutes)}</span>
                      <span className="font-serif text-base text-ink">{formatCOP(service.price)}</span>
                    </div>
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
