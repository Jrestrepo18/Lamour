import { AlertCircle, CalendarClock, CreditCard, MapPin, NotebookPen, User } from "lucide-react";
import type { Masseuse, Service, ServiceCategory } from "@/lib/types";
import { capitalize, formatCOP, formatDateLong, formatDuration, formatTime } from "@/lib/format";
import type { ClientDetails } from "./types";
import { ServiceThumb, StepHeading, StoryAvatar } from "./parts";

const PAYMENT_LABELS: Record<string, string> = {
  Cash: "Efectivo",
  Transfer: "Transferencia",
  Card: "Datáfono",
};

/**
 * The booking previewed as a post before it's "published": the ritual's photo
 * with its name, the therapist as the post's author, and every detail as a
 * row with its own "Cambiar" that jumps straight back to that step.
 */
export function SummaryStep({
  categories,
  service,
  primary,
  secondary,
  startsAt,
  details,
  error,
  onEdit,
}: {
  categories: ServiceCategory[];
  service: Service;
  primary: Masseuse;
  secondary: Masseuse | null;
  startsAt: string;
  details: ClientDetails;
  error: string | null;
  onEdit: (step: number) => void;
}) {
  const duration = service.durationMinutes + details.extraMinutes;
  const team = secondary ? `${primary.stageName} y ${secondary.stageName}` : primary.stageName;

  const rows = [
    {
      icon: CalendarClock,
      label: "Cuándo",
      value: (
        <>
          {capitalize(formatDateLong(startsAt))} · {formatTime(startsAt)}
        </>
      ),
      step: 3,
    },
    {
      icon: MapPin,
      label: "Dónde",
      value: (
        <>
          {details.address}
          {details.addressDetails && `, ${details.addressDetails}`}
          <span className="block text-ink-soft">
            {details.neighborhood}, {details.city}
          </span>
        </>
      ),
      step: 4,
    },
    { icon: User, label: "A nombre de", value: `${details.clientName} · ${details.clientPhone}`, step: 4 },
    {
      icon: CreditCard,
      label: "Pago",
      value: `${PAYMENT_LABELS[details.paymentMethod]}${
        service.hasSensoryDressOption && details.sensoryDressRequested ? " · con vestidura sensorial" : ""
      }`,
      step: 4,
    },
    ...(details.notes ? [{ icon: NotebookPen, label: "Notas", value: details.notes, step: 4 }] : []),
  ];

  return (
    <div>
      <StepHeading title="Así quedará tu cita" hint="Revísala con calma. Puedes cambiar cualquier dato antes de enviarla." />

      <article className="-mx-5 mt-7 overflow-hidden bg-marfil sm:mx-0 sm:rounded-[1.75rem] sm:shadow-[0_18px_40px_-32px_rgba(23,23,23,0.5)] sm:ring-1 sm:ring-ink/10">
        {/* Author row */}
        <div className="flex items-center gap-3 px-5 py-3.5">
          <span className="flex -space-x-4">
            <StoryAvatar masseuse={primary} size={34} ring />
            {secondary && <StoryAvatar masseuse={secondary} size={34} ring />}
          </span>
          <span className="min-w-0 flex-1 leading-tight">
            <span className="block truncate text-sm font-semibold text-ink">{team}</span>
            <span className="block text-xs text-ink-soft">A domicilio · {details.city}</span>
          </span>
          <button
            type="button"
            onClick={() => onEdit(2)}
            className="min-h-11 cursor-pointer px-1 text-sm font-semibold text-bronze"
          >
            Cambiar
          </button>
        </div>

        {/* The ritual */}
        <div className="relative aspect-[4/3] sm:aspect-[16/9]">
          <div className="absolute inset-0">
            <ServiceThumb
              service={service}
              categories={categories}
              sizes="(min-width: 640px) 42rem, 100vw"
              className="h-full w-full"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-espresso/75 via-espresso/10 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5 text-ivory">
            <div className="min-w-0">
              <p className="font-serif text-2xl font-semibold leading-tight">{service.name}</p>
              <p className="mt-1 text-sm text-ivory/80">
                {formatDuration(duration)}
                {details.extraMinutes > 0 && ` · incluye +${details.extraMinutes} min`}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onEdit(1)}
              className="min-h-11 shrink-0 cursor-pointer rounded-full bg-ivory/15 px-4 text-sm font-semibold text-ivory"
            >
              Cambiar
            </button>
          </div>
        </div>

        {/* Details */}
        <dl className="divide-y divide-ink/[0.07] px-5">
          {rows.map((row) => (
            <div key={row.label} className="flex items-start gap-3.5 py-4">
              <row.icon size={18} className="mt-0.5 shrink-0 text-bronze" aria-hidden />
              <div className="min-w-0 flex-1">
                <dt className="text-xs text-ink-soft">{row.label}</dt>
                <dd className="mt-0.5 break-words text-[0.95rem] text-ink">{row.value}</dd>
              </div>
              <button
                type="button"
                onClick={() => onEdit(row.step)}
                aria-label={`Cambiar ${row.label.toLowerCase()}`}
                className="-mr-1 min-h-11 shrink-0 cursor-pointer px-1 text-sm font-semibold text-bronze"
              >
                Cambiar
              </button>
            </div>
          ))}
        </dl>

        <div className="flex items-baseline justify-between border-t border-ink/10 px-5 py-4">
          <span className="text-sm text-ink-soft">Total</span>
          <span className="font-serif text-2xl font-semibold text-ink">{formatCOP(service.price)}</span>
        </div>
      </article>

      {error && (
        <div role="alert" className="mt-5 flex items-start gap-2 rounded-2xl bg-gold/10 p-4 text-sm text-bronze">
          <AlertCircle size={16} className="mt-0.5 shrink-0" aria-hidden />
          {error}
        </div>
      )}

      <p className="mt-5 text-xs leading-relaxed text-ink-soft">
        Al enviarla, tu cita queda <strong className="text-ink">pendiente</strong> hasta que nuestro equipo la valide y
        te escriba para confirmar los detalles finales.
      </p>
    </div>
  );
}
