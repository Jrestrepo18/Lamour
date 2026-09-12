import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Masseuse } from "@/lib/types";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { asymmetricDirection } from "@/lib/motion";
import { MasseuseCard } from "./MasseuseCard";

/**
 * Mirrors FeaturedServices' role for the team. No section-level ambiance
 * photo here — these are fictional demo personas, and pairing a real stock
 * model's face with one of their names would misrepresent that real person.
 * MasseuseCard already falls back to an initials avatar when there's no real
 * photoUrl on file; that stays untouched. The card grid itself carries the
 * section visually.
 */
export function MasseusesTeaser({ masseuses }: { masseuses: Masseuse[] }) {
  const active = masseuses.filter((m) => m.isActive).slice(0, 3);
  if (active.length === 0) return null;

  return (
    <section id="masajistas" className="py-20 sm:py-28">
      <Container>
        <div className="border-b border-ink/10 pb-10">
          <Reveal from="left">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-terracotta">Nuestro equipo</p>
            <h2 className="max-w-xl font-serif text-4xl leading-[1.05] text-ink text-balance sm:text-5xl">
              Elige con quién vivir la experiencia
            </h2>
          </Reveal>
          <Reveal from="right" delay={0.1} className="mt-4 max-w-md">
            <p className="text-sm leading-relaxed text-[var(--tone-body)]">
              Terapeutas certificadas, seleccionadas por su técnica, presencia y absoluta discreción.
            </p>
          </Reveal>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {active.map((m, i) => (
            <Reveal key={m.id} delay={0.1 * i} from={asymmetricDirection(i)}>
              <MasseuseCard masseuse={m} />
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2} className="mt-10">
          <Link
            href="/masajistas"
            className="group inline-flex items-center gap-1.5 text-sm font-medium text-[var(--tone-body)] transition-colors hover:text-terracotta"
          >
            Ver equipo completo
            <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </Reveal>
      </Container>
    </section>
  );
}
