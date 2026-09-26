import type { Masseuse } from "@/lib/types";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { MasseuseCard } from "./MasseuseCard";
import { getI18n } from "@/i18n/server";

export async function MasseusesSection({ masseuses }: { masseuses: Masseuse[] }) {
  const { t } = await getI18n();
  const active = masseuses.filter((m) => m.isActive);

  return (
    <section className="py-12 sm:py-32">
      <Container>
        {active.length === 0 ? (
          <p className="mx-auto max-w-md text-center text-base leading-relaxed text-ink-soft">
            {t(
              "Estamos actualizando los perfiles de nuestro equipo. Mientras tanto, puedes reservar y te asignaremos la terapeuta ideal para tu ritual.",
              "We're updating our team's profiles. In the meantime, you can book and we'll match you with the ideal therapist for your ritual.",
            )}
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
