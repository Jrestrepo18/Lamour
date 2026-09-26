import { getI18n } from "@/i18n/server";

/** The four booking steps as a compact grid — used on service and municipality pages. */
export async function BookingSteps({ title, className }: { title: string; className?: string }) {
  const { t } = await getI18n();
  const steps = [
    { title: t("Elige tu servicio", "Choose your service"), text: t("Selecciona tu ritual al reservar en línea.", "Pick your ritual when you book online.") },
    { title: t("Elige tu masajista", "Choose your therapist"), text: t("Conoce al equipo y elige con quién vivir la experiencia.", "Meet the team and choose who will guide your experience.") },
    {
      title: t("Elige tu horario", "Choose your time"),
      text: t("Consulta la disponibilidad en tiempo real, de 9:00 a.m. a 9:00 p.m.", "See real-time availability, 9:00 a.m. to 9:00 p.m."),
    },
    {
      title: t("Recibe en tu espacio", "Relax at your place"),
      text: t(
        "Te confirmamos por WhatsApp y llegamos a tu dirección, con total discreción.",
        "We confirm on WhatsApp and arrive at your address — home, apartment or hotel — with complete discretion.",
      ),
    },
  ];
  return (
    <div className={className}>
      <h2 className="font-serif text-2xl font-semibold tracking-tight text-ink sm:text-3xl">{title}</h2>
      <ol className="mt-6 grid gap-4 sm:grid-cols-2">
        {steps.map((step, i) => (
          <li key={step.title} className="rounded-2xl border border-ink/10 bg-white/60 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-bronze">
              {t("Paso", "Step")} {i + 1}
            </p>
            <p className="mt-2 font-semibold text-ink">{step.title}</p>
            <p className="mt-1 text-sm leading-relaxed text-ink-soft">{step.text}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
