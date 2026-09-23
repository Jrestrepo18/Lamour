import type { Masseuse } from "@/lib/types";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { MasseuseCard } from "./MasseuseCard";

export function MasseusesSection({ masseuses }: { masseuses: Masseuse[] }) {
  const active = masseuses.filter((m) => m.isActive);

  return (
    <section className="py-12 sm:py-32">
      <Container>
        {active.length === 0 ? (
          <p className="mx-auto max-w-md text-center text-base leading-relaxed text-ink-soft">
            Estamos actualizando los perfiles de nuestro equipo. Mientras tanto, puedes reservar y te asignaremos
            la terapeuta ideal para tu ritual.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
            {active.map((m, i) => (
              <Reveal key={m.id} delay={0.06 * (i % 3)}>
                <MasseuseCard masseuse={m} />
              </Reveal>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
