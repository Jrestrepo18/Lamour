const STEPS = [
  { title: "Elige tu servicio", text: "Selecciona tu ritual al reservar en línea." },
  { title: "Elige tu masajista", text: "Conoce al equipo y elige con quién vivir la experiencia." },
  { title: "Elige tu horario", text: "Consulta la disponibilidad en tiempo real, de 9:00 a.m. a 9:00 p.m." },
  { title: "Recibe en tu espacio", text: "Te confirmamos por WhatsApp y llegamos a tu dirección, con total discreción." },
];

/** The four booking steps as a compact grid — used on service and municipality pages. */
export function BookingSteps({ title, className }: { title: string; className?: string }) {
  return (
    <div className={className}>
      <h2 className="font-serif text-2xl font-semibold tracking-tight text-ink sm:text-3xl">{title}</h2>
      <ol className="mt-6 grid gap-4 sm:grid-cols-2">
        {STEPS.map((step, i) => (
          <li key={step.title} className="rounded-2xl border border-ink/10 bg-white/60 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-bronze">Paso {i + 1}</p>
            <p className="mt-2 font-semibold text-ink">{step.title}</p>
            <p className="mt-1 text-sm leading-relaxed text-ink-soft">{step.text}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
