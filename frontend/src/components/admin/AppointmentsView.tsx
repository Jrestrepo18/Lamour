"use client";

import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import { Clock3, MapPin, NotebookPen, RefreshCw, Users } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { adminGetAppointments, adminUpdateAppointmentStatus, ApiError } from "@/lib/api";
import { capitalize, formatCOP, formatDateLong, formatTime } from "@/lib/format";
import type { Appointment, AppointmentStatus } from "@/lib/types";
import { chipClass } from "@/lib/ui";
import { wrapRailClass } from "@/components/booking/parts";
import { StatusBadge } from "./StatusBadge";
import { AdminPageHeader } from "./AdminPageHeader";
import { ConfirmDialog, ErrorBanner, LoadingBlock } from "./kit";

const TABS: { value: AppointmentStatus | "All"; label: string }[] = [
  { value: "Pending", label: "Pendientes" },
  { value: "Confirmed", label: "Confirmadas" },
  { value: "Completed", label: "Completadas" },
  { value: "Cancelled", label: "Canceladas" },
  { value: "NoShow", label: "No asistió" },
  { value: "All", label: "Todas" },
];

const PAYMENT: Record<string, string> = { Cash: "Efectivo", Transfer: "Transferencia", Card: "Datáfono" };

/** Colombian mobile numbers are typed without the country code; wa.me needs it. */
function clientWhatsApp(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return `https://wa.me/${digits.length === 10 ? `57${digits}` : digits}`;
}

/** Confirmation for the client, pre-written with the booking's details, ready to send from the admin's WhatsApp. */
function clientConfirmation(a: Appointment) {
  const firstName = a.clientName.trim().split(/\s+/)[0] ?? "";
  const team = a.secondMasseuseName ? `${a.masseuseName} y ${a.secondMasseuseName}` : a.masseuseName;
  const place = [[a.address, a.addressDetails].filter(Boolean).join(", "), [a.neighborhood, a.city].filter(Boolean).join(", ")]
    .filter(Boolean)
    .join(" · ");
  const lines = [
    `Hola ${firstName}, te escribimos de L'AMOUR ✨`,
    "",
    "Tu cita está confirmada:",
    `• ${a.serviceName} · ${a.durationMinutes} min`,
    `• ${capitalize(formatDateLong(a.startsAt))} a las ${formatTime(a.startsAt)}`,
    team ? `• Con ${team}` : null,
    place ? `• En ${place}` : null,
    `• Valor: ${formatCOP(a.totalPrice)} · Pago: ${PAYMENT[a.paymentMethod] ?? a.paymentMethod}`,
    "",
    "Si necesitas cambiar algo, respóndenos por aquí.",
  ].filter((l) => l !== null);
  return `${clientWhatsApp(a.clientPhone)}?text=${encodeURIComponent(lines.join("\n"))}`;
}

/** The client's personal review link, sent from the admin's WhatsApp once the session is completed. */
function reviewRequest(a: Appointment) {
  const firstName = a.clientName.trim().split(/\s+/)[0] ?? "";
  const text = `Hola ${firstName} 🌿 Gracias por dejarnos cuidarte. ¿Nos cuentas cómo te fue con tu ${a.serviceName}? Toma menos de un minuto: ${a.reviewUrl}`;
  return `${clientWhatsApp(a.clientPhone)}?text=${encodeURIComponent(text)}`;
}

function dayLabel(iso: string) {
  const day = iso.slice(0, 10);
  const today = new Date().toLocaleDateString("en-CA");
  const tomorrow = new Date(Date.now() + 86_400_000).toLocaleDateString("en-CA");
  if (day === today) return "Hoy";
  if (day === tomorrow) return "Mañana";
  return capitalize(formatDateLong(iso));
}

export function AppointmentsView({ token }: { token: string }) {
  const [appointments, setAppointments] = useState<Appointment[] | null>(null);
  const [tab, setTab] = useState<AppointmentStatus | "All">("Pending");
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [whatsappLinks, setWhatsappLinks] = useState<{ id: string; links: string[] } | null>(null);
  const [cancelling, setCancelling] = useState<Appointment | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  async function load() {
    setError(null);
    setRefreshing(true);
    try {
      const data = await adminGetAppointments(token);
      setAppointments(data.sort((a, b) => a.startsAt.localeCompare(b.startsAt)));
    } catch (err) {
      setError(
        err instanceof ApiError
          ? "No se pudieron cargar las citas."
          : "No se pudo conectar con el servidor. Revisa que la API esté encendida.",
      );
    } finally {
      setRefreshing(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial fetch on mount, not a render loop
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function updateStatus(id: string, status: AppointmentStatus): Promise<boolean> {
    setBusyId(id);
    try {
      const result = await adminUpdateAppointmentStatus(id, status, token);
      setAppointments((prev) => prev?.map((a) => (a.id === id ? result.appointment : a)) ?? null);
      if (status === "Confirmed") {
        const links = [result.whatsAppLink, result.secondWhatsAppLink].filter(Boolean) as string[];
        setWhatsappLinks({ id, links });
      }
      return true;
    } catch {
      setError("No se pudo actualizar la cita.");
      return false;
    } finally {
      setBusyId(null);
    }
  }

  /**
   * One tap: confirms the booking and opens the client's WhatsApp with the confirmation
   * already written. The tab is opened during the tap (browsers block pop-ups opened later)
   * and only pointed at WhatsApp once the confirmation is saved; if saving fails it closes.
   */
  async function confirmAndNotify(a: Appointment) {
    const link = clientConfirmation(a);
    const tab = window.open("", "_blank");
    const saved = await updateStatus(a.id, "Confirmed");
    if (!saved) {
      tab?.close();
      return;
    }
    if (tab) tab.location.assign(link);
    else window.location.assign(link);
  }

  const counts = useMemo(() => {
    const c: Record<string, number> = { All: appointments?.length ?? 0 };
    for (const a of appointments ?? []) c[a.status] = (c[a.status] ?? 0) + 1;
    return c;
  }, [appointments]);

  // Keep a just-confirmed appointment on screen (with its WhatsApp buttons) even though it left "Pendientes".
  const filtered = (appointments ?? []).filter((a) => tab === "All" || a.status === tab || whatsappLinks?.id === a.id);
  const byDay = filtered.reduce<{ day: string; items: Appointment[] }[]>((acc, a) => {
    const day = a.startsAt.slice(0, 10);
    const group = acc.find((g) => g.day === day);
    if (group) group.items.push(a);
    else acc.push({ day, items: [a] });
    return acc;
  }, []);

  return (
    <div>
      <AdminPageHeader
        title="Citas"
        description="Confirma cada reserva y avísale a la masajista por WhatsApp."
        action={
          <button
            type="button"
            onClick={load}
            aria-label="Actualizar citas"
            className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-ink/10 bg-marfil text-ink transition-colors hover:border-gold/50"
          >
            <RefreshCw size={17} className={clsx(refreshing && "animate-spin")} aria-hidden />
          </button>
        }
      />

      <div className={clsx(wrapRailClass, "mt-6")}>
        {TABS.map((t) => (
          <button
            key={t.value}
            type="button"
            onClick={() => {
              setTab(t.value);
              setWhatsappLinks(null);
            }}
            aria-pressed={tab === t.value}
            className={clsx(chipClass(tab === t.value), "min-h-10 shrink-0 whitespace-nowrap")}
          >
            {t.label}
            {counts[t.value] ? <span className="ml-1.5 opacity-60">{counts[t.value]}</span> : null}
          </button>
        ))}
      </div>

      {error && <div className="mt-6"><ErrorBanner>{error}</ErrorBanner></div>}
      {!appointments && !error && <LoadingBlock label="Cargando citas" />}

      {appointments && filtered.length === 0 && !error && (
        <p className="mt-14 text-center text-sm text-ink-soft">No hay citas aquí por ahora.</p>
      )}

      {byDay.map(({ day, items }) => (
        <section key={day} className="mt-8">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-bronze">{dayLabel(items[0].startsAt)}</p>
          <ul className="mt-3 space-y-3">
            {items.map((a) => (
              <li key={a.id} className="animate-fade-in rounded-[1.5rem] bg-marfil p-5 ring-1 ring-ink/[0.07]">
                <div className="flex items-start gap-4">
                  <div className="flex w-16 shrink-0 flex-col items-center rounded-2xl bg-ivory py-2 ring-1 ring-ink/[0.07]">
                    <span className="font-serif text-lg font-semibold leading-tight text-ink">{formatTime(a.startsAt).replace(/\s?[ap]\.\s?m\./, "")}</span>
                    <span className="text-[0.65rem] font-semibold uppercase text-ink-soft">
                      {/a\.\s?m\./.test(formatTime(a.startsAt)) ? "a. m." : "p. m."}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-ink">{a.serviceName}</p>
                      <StatusBadge status={a.status} />
                    </div>
                    <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink-soft">
                      <span className="inline-flex items-center gap-1">
                        <Clock3 size={13} aria-hidden />
                        {a.durationMinutes} min
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Users size={13} aria-hidden />
                        {a.masseuseName}
                        {a.secondMasseuseName ? ` y ${a.secondMasseuseName}` : ""}
                      </span>
                      <span className="font-semibold text-ink">{formatCOP(a.totalPrice)}</span>
                    </p>
                  </div>
                </div>

                <div className="mt-4 space-y-1.5 border-t border-ink/[0.07] pt-4 text-sm">
                  <p className="flex items-center justify-between gap-3">
                    <span className="min-w-0 truncate text-ink">
                      <span className="font-semibold">{a.clientName}</span> · {a.clientPhone}
                    </span>
                    <a
                      href={clientWhatsApp(a.clientPhone)}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Escribir a ${a.clientName} por WhatsApp`}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white"
                    >
                      <WhatsAppIcon size={17} />
                    </a>
                  </p>
                  <p className="flex items-start gap-2 text-ink-soft">
                    <MapPin size={14} className="mt-0.5 shrink-0" aria-hidden />
                    <span>
                      {[[a.address, a.addressDetails].filter(Boolean).join(", "), [a.neighborhood, a.city].filter(Boolean).join(", ")]
                        .filter(Boolean)
                        .join(" · ") || "Sin dirección registrada"}
                    </span>
                  </p>
                  <p className="text-ink-soft">
                    Pago: {PAYMENT[a.paymentMethod] ?? a.paymentMethod}
                    {a.sensoryDressRequested && " · Vestidura sensorial"}
                    {a.extraMinutes > 0 && ` · +${a.extraMinutes} min`}
                  </p>
                  {a.notes && (
                    <p className="flex items-start gap-2 rounded-xl bg-ivory p-3 text-ink-soft">
                      <NotebookPen size={14} className="mt-0.5 shrink-0" aria-hidden />
                      {a.notes}
                    </p>
                  )}
                </div>

                {(a.status === "Pending" || a.status === "Confirmed" || a.status === "Completed" || whatsappLinks?.id === a.id) && (
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    {a.status === "Pending" && a.clientPhone && (
                      <button
                        type="button"
                        disabled={busyId === a.id}
                        onClick={() => confirmAndNotify(a)}
                        className="inline-flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-full bg-[#25D366] px-5 text-[0.95rem] font-semibold text-white shadow-[0_10px_24px_-12px_rgba(37,211,102,0.8)] disabled:opacity-50 sm:w-auto"
                      >
                        <WhatsAppIcon size={17} />
                        {busyId === a.id ? "Confirmando…" : "Confirmar y avisar al cliente"}
                      </button>
                    )}
                    {a.status === "Pending" && (
                      <button
                        type="button"
                        disabled={busyId === a.id}
                        onClick={() => updateStatus(a.id, "Confirmed")}
                        className={clsx(
                          "min-h-11 cursor-pointer rounded-full px-4 text-sm font-semibold disabled:opacity-50",
                          a.clientPhone ? "text-ink-soft hover:text-ink" : "flex-1 bg-ink px-5 text-ivory sm:flex-none",
                        )}
                      >
                        {a.clientPhone ? "Solo confirmar" : busyId === a.id ? "Confirmando…" : "Confirmar"}
                      </button>
                    )}
                    {a.status === "Confirmed" && whatsappLinks?.id !== a.id && (
                      <button
                        type="button"
                        disabled={busyId === a.id}
                        onClick={() => updateStatus(a.id, "Completed")}
                        className="min-h-11 flex-1 cursor-pointer rounded-full border border-ink/15 bg-ivory px-5 text-sm font-semibold text-ink disabled:opacity-50 sm:flex-none"
                      >
                        Marcar completada
                      </button>
                    )}
                    {a.status === "Completed" && a.reviewUrl && !a.reviewed && a.clientPhone && (
                      <a
                        href={reviewRequest(a)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full border border-[#25D366] bg-ivory px-5 text-sm font-semibold text-[#128C4B] sm:flex-none"
                      >
                        <WhatsAppIcon size={17} />
                        Pedir opinión
                      </a>
                    )}
                    {a.status === "Completed" && a.reviewed && (
                      <span className="inline-flex min-h-11 items-center gap-1.5 px-2 text-sm font-semibold text-bronze">★ Opinión recibida</span>
                    )}
                    {a.status === "Confirmed" && whatsappLinks?.id !== a.id && (
                      <button
                        type="button"
                        disabled={busyId === a.id}
                        onClick={() => updateStatus(a.id, "NoShow")}
                        className="min-h-11 cursor-pointer rounded-full px-4 text-sm font-semibold text-ink-soft disabled:opacity-50"
                      >
                        No asistió
                      </button>
                    )}
                    {whatsappLinks?.id === a.id &&
                      whatsappLinks.links.map((link, i) => (
                        <a
                          key={link}
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 text-sm font-semibold text-white sm:flex-none"
                        >
                          <WhatsAppIcon size={17} />
                          Avisar a {i === 0 ? a.masseuseName : a.secondMasseuseName}
                        </a>
                      ))}
                    {(a.status === "Pending" || a.status === "Confirmed") && (
                      <button
                        type="button"
                        disabled={busyId === a.id}
                        onClick={() => setCancelling(a)}
                        className="min-h-11 cursor-pointer rounded-full px-4 text-sm font-semibold text-red-700 disabled:opacity-50"
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </section>
      ))}

      {cancelling && (
        <ConfirmDialog
          title="¿Cancelar esta cita?"
          message={
            <>
              <p>
                {cancelling.serviceName} de <strong className="text-ink">{cancelling.clientName}</strong>,{" "}
                {formatDateLong(cancelling.startsAt)} a las {formatTime(cancelling.startsAt)}
              </p>
              <p className="mt-2">El horario quedará libre de nuevo.</p>
            </>
          }
          confirmLabel="Cancelar cita"
          onClose={() => setCancelling(null)}
          onConfirm={async () => {
            await updateStatus(cancelling.id, "Cancelled");
            setCancelling(null);
          }}
        />
      )}
    </div>
  );
}
