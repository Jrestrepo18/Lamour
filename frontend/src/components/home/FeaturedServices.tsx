"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Clapperboard } from "lucide-react";
import type { Service } from "@/lib/types";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PHOTOS } from "@/lib/photos";
import { formatCOP } from "@/lib/format";
import { ReelViewer, type Reel } from "./ReelViewer";

// The hero already uses the oil-pour photo, so the signature ritual leads with a different frame.
const VISUALS = [PHOTOS.handsBack, PHOTOS.hotStone, PHOTOS.candles];

/**
 * "Rituales destacados" as a Reels shelf: tall 9:16 thumbnails (slow drift,
 * reel icon, name and price over the photo). Tapping one opens the
 * full-screen Reels viewer on that ritual, where you swipe up/down between
 * them. Phones: a swipeable row with the next reel peeking in; desktop: all
 * three side by side.
 */
export function FeaturedServices({ services }: { services: Service[] }) {
  const [open, setOpen] = useState<number | null>(null);
  if (services.length === 0) return null;

  const reels: Reel[] = services.map((service, i) => ({ service, photo: VISUALS[i % VISUALS.length] }));

  return (
    <section className="py-16 sm:py-32">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Reveal>
            <SectionHeading
              eyebrow="Lo más pedido"
              title="Rituales destacados"
              description="Nuestras experiencias favoritas. Toca un reel para verlo completo."
            />
          </Reveal>
          <Reveal delay={0.1}>
            <Link
              href="/servicios"
              className="group inline-flex items-center gap-1.5 text-sm font-medium text-ink underline decoration-gold/60 underline-offset-8 transition-colors hover:decoration-ink"
            >
              Ver catálogo completo
              <ArrowUpRight size={16} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </Reveal>
        </div>

        {/* overflow-y-hidden: a horizontal carousel must not become a vertical scroller too
            (overflow-x:auto alone makes overflow-y auto), or vertical swipes get trapped. */}
        <ul className="-mx-5 mt-8 flex snap-x snap-mandatory gap-3 overflow-x-auto overflow-y-hidden scroll-px-5 px-5 pb-2 [scrollbar-width:none] sm:-mx-8 sm:mt-12 sm:scroll-px-8 sm:px-8 md:mx-0 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0 [&::-webkit-scrollbar]:hidden">
          {reels.map(({ service, photo }, i) => (
            <li key={service.id} className="w-[62%] max-w-[16rem] shrink-0 snap-start md:w-auto md:max-w-none">
              <Reveal delay={0.08 * i}>
                <button
                  type="button"
                  onClick={() => setOpen(i)}
                  aria-haspopup="dialog"
                  aria-label={`Ver reel: ${service.name}, ${formatCOP(service.price)}`}
                  className="group relative block aspect-[9/16] w-full cursor-pointer overflow-hidden rounded-[1.25rem] bg-silk text-left shadow-[0_24px_50px_-30px_rgba(43,32,25,0.6)] md:rounded-[1.5rem]"
                >
                  <span className="absolute inset-0 animate-kenburns" style={{ animationDelay: `-${i * 5}s` }}>
                    {service.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element -- admin-uploaded image served by the API host
                      <img src={service.imageUrl} alt="" loading="lazy" className="h-full w-full object-cover" />
                    ) : (
                      <Image src={photo.src} alt="" fill sizes="(min-width: 768px) 30vw, 62vw" className="object-cover" />
                    )}
                  </span>
                  <span className="pointer-events-none absolute inset-0 bg-gradient-to-b from-espresso/35 via-transparent to-espresso/85" />

                  <span className="absolute right-3 top-3 text-ivory" aria-hidden>
                    <Clapperboard size={20} />
                  </span>

                  <span className="absolute inset-x-0 bottom-0 p-4 md:p-6">
                    <span className="block font-serif text-lg font-semibold leading-tight text-ivory md:text-2xl">
                      {service.name}
                    </span>
                    <span className="mt-1 block text-sm font-medium text-champagne">{formatCOP(service.price)}</span>
                  </span>

                  {/* Play affordance on hover (desktop) */}
                  <span
                    aria-hidden
                    className="absolute left-1/2 top-1/2 hidden h-14 w-14 -translate-x-1/2 -translate-y-1/2 scale-90 items-center justify-center rounded-full bg-ivory/90 text-ink opacity-0 shadow-lg transition-[opacity,transform] duration-300 group-hover:scale-100 group-hover:opacity-100 md:flex"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                      <path d="M8 5.5v13l11-6.5z" />
                    </svg>
                  </span>
                </button>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>

      {open !== null && <ReelViewer reels={reels} start={open} onClose={() => setOpen(null)} />}
    </section>
  );
}
