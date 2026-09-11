import { AlertCircle, CalendarClock, MapPin, Sparkles, Users } from "lucide-react";
import type { Masseuse, Service } from "@/lib/types";
import { formatCOP, formatDateLong, formatDuration, formatTime } from "@/lib/format";
import type { ClientDetails } from "./types";

const PAYMENT_LABELS: Record<string, string> = {
  Cash: "Efectivo",
  Transfer: "Transferencia",
  Card: "Tarjeta (datáfono)",
};

export function SummaryStep({
  service,
  primary,
  secondary,
  startsAt,
  details,
  error,
}: {
  service: Service;
  primary: Masseuse;
  secondary: Masseuse | null;
  startsAt: string;
  details: ClientDetails;
  error: string | null;
}) {
  const total = service.price;
  const duration = service.durationMinutes + details.extraMinutes;

  return (
    <div>
      <h2 className="font-serif text-2xl italic text-ink">Confirma tu experiencia</h2>
      <p className="mt-1 text-sm text-ink-soft">Revisa los detalles antes de enviar tu solicitud de reserva.</p>

      <div className="mt-6 space-y-4 rounded-2xl border border-silk bg-white/60 p-6">
        <div className="flex items-start justify-between gap-3 border-b border-silk pb-4">
          <div className="flex items-start gap-3">
            <Sparkles size={18} className="mt-0.5 shrink-0 text-gold" />
            <div>
              <p className="font-serif text-lg italic text-ink">{service.name}</p>
              <p className="text-xs text-ink-soft">{formatDuration(duration)}</p>
            </div>
          </div>
          <span className="font-serif text-xl text-ink">{formatCOP(total)}</span>
        </div>

        <div className="flex items-start gap-3 border-b border-silk pb-4">
          <Users size={18} className="mt-0.5 shrink-0 text-gold" />
          <p className="text-sm text-ink">
            {primary.stageName}
            {secondary ? ` y ${secondary.stageName}` : ""}
          </p>
        </div>

        <div className="flex items-start gap-3 border-b border-silk pb-4">
          <CalendarClock size={18} className="mt-0.5 shrink-0 text-gold" />
          <p className="text-sm capitalize text-ink">
            {formatDateLong(startsAt)} · {formatTime(startsAt)}
          </p>
        </div>

        <div className="flex items-start gap-3">
          <MapPin size={18} className="mt-0.5 shrink-0 text-gold" />
          <div className="text-sm text-ink">
            <p>{details.clientName} · {details.clientPhone}</p>
            <p className="text-ink-soft">
              {details.address}, {details.neighborhood}, {details.city}
            </p>
            {details.addressDetails && <p className="text-ink-soft">{details.addressDetails}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 border-t border-silk pt-4 text-xs text-ink-soft">
          <p>Pago: <span className="text-ink">{PAYMENT_LABELS[details.paymentMethod]}</span></p>
          {service.hasSensoryDressOption && (
            <p>Vestidura sensorial: <span className="text-ink">{details.sensoryDressRequested ? "Sí" : "No"}</span></p>
          )}
        </div>

        {details.notes && (
          <p className="rounded-lg bg-silk/50 p-3 text-xs text-ink-soft">
            <strong className="text-ink">Notas:</strong> {details.notes}
          </p>
        )}
      </div>

      {error && (
        <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          {error}
        </div>
      )}

      <p className="mt-4 text-xs text-ink-soft/70">
        Al confirmar, tu solicitud quedará como <strong>pendiente</strong> hasta que nuestro equipo la valide y te
        contacte para verificar los detalles finales.
      </p>
    </div>
  );
}
