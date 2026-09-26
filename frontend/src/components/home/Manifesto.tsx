import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { ScrollFocusText } from "@/components/home/ScrollFocusText";
import { StatueFigure } from "@/components/three/StatueFigure";
import { getI18n } from "@/i18n/server";

/**
 * "Creemos en la pausa" — the brand's philosophy, with the meditating statue
 * as its visual. On phones the order is quote → statue → promise, so the
 * figure lands as a breathing pause between the two blocks of text; on
 * desktop the statue holds the right column across both.
 */
export async function Manifesto() {
  const { t } = await getI18n();
  return (
    <section className="relative overflow-hidden py-16 sm:py-28">
      <Container className="relative">
        <div className="grid grid-cols-1 gap-y-8 lg:grid-cols-[1.15fr_1fr] lg:gap-x-16 lg:gap-y-10">
          <div className="lg:self-end">
            <Reveal>
              <p className="eyebrow">{t("Nuestra filosofía", "Our philosophy")}</p>
            </Reveal>
            <Reveal delay={0.1}>
              <ScrollFocusText className="mt-6 font-serif text-[1.75rem] leading-[1.22] text-ink text-balance sm:text-5xl sm:leading-[1.15]">
                {t(
                  "Creemos en la pausa. En el contacto consciente. En regalarte, sin salir de casa, una experiencia que despierta",
                  "We believe in the pause. In mindful touch. In giving yourself, without leaving home, an experience that awakens",
                )}{" "}
                <span className="bg-gradient-to-r from-bronze to-[#a8871a] bg-clip-text font-semibold text-transparent">
                  {t("cada sentido.", "every sense.")}
                </span>
              </ScrollFocusText>
            </Reveal>
          </div>

          <StatueFigure className="mx-auto aspect-[4/5] w-4/5 max-w-sm sm:max-w-md lg:col-start-2 lg:w-full lg:row-span-2 lg:row-start-1 lg:max-w-none lg:self-center" />

          <Reveal delay={0.15} className="max-w-lg border-l-2 border-gold/40 pl-6 lg:self-start">
            <p className="text-base leading-relaxed text-[var(--tone-body)]">
              {t(
                "Cada ritual L'AMOUR es ejecutado por terapeutas certificadas, en un marco de absoluto respeto, consentimiento y confidencialidad — para que lo único que tengas que hacer sea entregarte a la experiencia.",
                "Every L'AMOUR ritual is performed by certified therapists, with complete respect, consent and confidentiality — so the only thing left for you to do is surrender to the experience.",
              )}
            </p>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
