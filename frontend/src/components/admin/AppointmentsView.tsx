"use client";

import { useEffect, useState } from "react";
import { AlertCircle, Loader2, MapPin, MessageCircle, Phone, RefreshCw, Users } from "lucide-react";
import { adminGetAppointments, adminUpdateAppointmentStatus, ApiError } from "@/lib/api";
import { formatCOP, formatDateLong, formatTime } from "@/lib/format";
import type { Appointment, AppointmentStatus } from "@/lib/types";
import { StatusBadge } from "./StatusBadge";
import { AdminPageHeader } from "./AdminPageHeader";
import { chipClass, surfaceClass } from "@/lib/ui";
import { Button } from "@/components/ui/Button";

const TABS: { value: AppointmentStatus | "All"; label: string }[] = [
  { value: "Pending", label: "Pendientes" },
  { value: "Confirmed", label: "Confirmadas" },
  { value: "Completed", label: "Completadas" },
  { value: "Cancelled", label: "Canceladas" },
  { value: "All", label: "Todas" },
];

export function AppointmentsView({ token }: { token: string }) {
  const [appointments, setAppointments] = useState<Appointment[] | null>(null);
  const [tab, setTab] = useState<AppointmentStatus | "All">("Pending");
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [whatsappLinks, setWhatsappLinks] = useState<{ id: number; links: string[] } | null>(null);

  async function load() {
    setError(null);
    try {
      const data = await adminGetAppointments(token);
      setAppointments(data.sort((a, b) => a.startsAt.localeCompare(b.startsAt)));
    } catch (err) {
      setError(
        err instanceof ApiError
          ? "No se pudo cargar las citas. Verifica tu sesión."
          : "No se pudo conectar con el servidor de la API .NET. Asegúrate de que el backend esté corriendo.",
      );
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial fetch on mount, not a render loop
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function updateStatus(id: number, status: AppointmentStatus) {
    setBusyId(id);
    try {
      const result = await adminUpdateAppointmentStatus(id, status, token);
      setAppointments((prev) => prev?.map((a) => (a.id === id ? result.appointment : a)) ?? null);
      if (status === "Confirmed") {
        const links = [result.whatsAppLink, result.secondWhatsAppLink].filter(Boolean) as string[];
        setWhatsappLinks({ id, links });
      }
    } catch {
      setError("No se pudo actualizar el estado de la cita.");
    } finally {
      setBusyId(null);
    }
  }

  const filtered = appointments?.filter((a) => tab === "All" || a.status === tab) ?? [];

  return (
    <div>
      <AdminPageHeader
        title="Citas"
        description="Gestiona las reservas y confirma la asignación a cada masajista."
        action={
          <Button variant="secondary" size="sm" onClick={load}>
            <RefreshCw size={14} aria-hidden />
            Actualizar
          </Button>
        }
      />

      <div className="mt-8 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.value}
            type="button"
            onClick={() => setTab(t.value)}
            aria-pressed={tab === t.value}
            className={chipClass(tab === t.value)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="mt-6 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700" role="alert">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          {error}
        </div>
      )}

      {!appointments && !error && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-bronze" size={26} aria-label="Cargando" />
        </div>
      )}

      {appointments && filtered.length === 0 && !error && (
        <p className="mt-10 text-center text-sm text-ink-soft">No hay citas en esta categoría.</p>
      )}

      <div className="mt-6 space-y-3">
        {filtered.map((a) => (
          <div key={a.id} className={`${surfaceClass} p-6`}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-serif text-lg font-semibold text-ink">{a.serviceName}</p>
                  <StatusBadge status={a.status} />
                </div>
                <p className="mt-1 text-sm capitalize text-ink-soft">
                  {formatDateLong(a.startsAt)} · {formatTime(a.startsAt)} ({a.durationMinutes} min)
                </p>
              </div>
              <span className="font-serif text-lg font-semibold text-ink">{formatCOP(a.totalPrice)}</span>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 text-sm text-ink-soft sm:grid-cols-2">
              <p className="flex items-center gap-2">
                <Users size={14} className="text-bronze" aria-hidden />
                {a.masseuseName}
                {a.secondMasseuseName ? ` y ${a.secondMasseuseName}` : ""}
              </p>
              <p className="flex items-center gap-2">
                <Phone size={14} className="text-bronze" aria-hidden />
                {a.clientName} · {a.clientPhone}
              </p>
              <p className="flex items-start gap-2 sm:col-span-2">
                <MapPin size={14} className="mt-0.5 shrink-0 text-bronze" />
                {a.address}, {a.neighborhood}, {a.city}
              </p>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-ink/10 pt-4">
              {a.status === "Pending" && (
                <Button size="sm" disabled={busyId === a.id} onClick={() => updateStatus(a.id, "Confirmed")}>
                  {busyId === a.id ? "Confirmando…" : "Confirmar cita"}
                </Button>
              )}
              {a.status === "Confirmed" && (
                <Button variant="secondary" size="sm" disabled={busyId === a.id} onClick={() => updateStatus(a.id, "Completed")}>
                  Marcar como completada
                </Button>
              )}
              {(a.status === "Pending" || a.status === "Confirmed") && (
                <Button variant="danger" size="sm" disabled={busyId === a.id} onClick={() => updateStatus(a.id, "Cancelled")}>
                  Cancelar
                </Button>
              )}

              {whatsappLinks?.id === a.id &&
                whatsappLinks.links.map((link, i) => (
                  <a
                    key={link}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-9 items-center gap-1.5 rounded-full bg-emerald-700 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-emerald-800"
                  >
                    <MessageCircle size={14} />
                    Avisar por WhatsApp {whatsappLinks.links.length > 1 ? `(${i === 0 ? "1ª" : "2ª"} masajista)` : ""}
                  </a>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
