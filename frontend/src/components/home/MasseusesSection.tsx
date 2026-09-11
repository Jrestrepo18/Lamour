import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Masseuse } from "@/lib/types";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { asymmetricDirection } from "@/lib/motion";

function initials(name: string) {
  return name.slice(0, 1).toUpperCase();
}

export function MasseusesSection({ masseuses }: { masseuses: Masseuse[] }) {
  const active = masseuses.filter((m) => m.isActive);
  if (active.length === 0) return null;

  return (
    <section className="py-28 sm:py-36">
      <Container>
        <div className="grid grid-cols-1 gap-y-2 sm:grid-cols-2 lg:grid-cols-1">
          {active.map((m, i) => (
            <Reveal key={m.id} delay={0.08 * (i % 4)} from={asymmetricDirection(i)}>
              <Link
                href={`/reservar?masseuse=${m.id}`}
                className="group grid grid-cols-1 items-center gap-6 border-b border-ink/10 py-10 transition-colors hover:bg-terracotta/[0.04] sm:grid-cols-[auto_1fr_auto] lg:py-12"
              >
                <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-2 border-gold/40 bg-gradient-to-br from-champagne/50 to-gold/20 font-serif text-3xl italic text-gold-dark transition-transform duration-300 group-hover:scale-105">
                  {initials(m.stageName)}
                </span>

                <div>
                  <h3 className="font-serif text-2xl italic text-ink transition-colors group-hover:text-terracotta sm:text-3xl">
                    {m.stageName}
                  </h3>
                  {m.bio && <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-soft">{m.bio}</p>}
                </div>

                <span className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border border-ink/10 text-ink-soft opacity-0 transition-all duration-300 group-hover:border-terracotta group-hover:text-terracotta group-hover:opacity-100 sm:flex">
                  <ArrowUpRight size={17} />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
