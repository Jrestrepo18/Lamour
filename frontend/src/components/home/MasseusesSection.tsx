import type { Masseuse } from "@/lib/types";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { asymmetricDirection } from "@/lib/motion";
import { MasseuseCard } from "./MasseuseCard";

export function MasseusesSection({ masseuses }: { masseuses: Masseuse[] }) {
  const active = masseuses.filter((m) => m.isActive);
  if (active.length === 0) return null;

  return (
    <section className="py-28 sm:py-36">
      <Container>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {active.map((m, i) => (
            <Reveal key={m.id} delay={0.08 * (i % 4)} from={asymmetricDirection(i)}>
              <MasseuseCard masseuse={m} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
