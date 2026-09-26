"use client";

import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import { AlertTriangle, FileSpreadsheet, Pencil } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { wrapRailClass } from "@/components/booking/parts";
import { useAutoRefresh } from "@/hooks/useAutoRefresh";
import { adminGetAppointments, adminRecordPayment } from "@/lib/api";
import { formatCOP } from "@/lib/format";
import type { Appointment, PaymentCurrency, PaymentMethod } from "@/lib/types";
import { chipClass, fieldClass } from "@/lib/ui";
import { AdminPageHeader } from "./AdminPageHeader";
import { ErrorBanner, LoadingBlock } from "./kit";
import { formatMoney, METHOD_LABEL, PaymentDialog } from "./PaymentDialog";

type Period = "today" | "week" | "month" | "lastMonth" | "custom";
const PERIODS: { value: Period; label: string }[] = [
  { value: "today", label: "Hoy" },
  { value: "week", label: "Esta semana" },
  { value: "month", label: "Este mes" },
  { value: "lastMonth", label: "Mes pasado" },
  { value: "custom", label: "Rango" },
];
const METHODS: PaymentMethod[] = ["Cash", "Transfer", "Card"];

/** Today's date in Colombia ("YYYY-MM-DD"), whatever the device's time zone. */
const bogotaToday = () => new Date().toLocaleDateString("en-CA", { timeZone: "America/Bogota" });
const shift = (ymd: string, days: number) => {
  const d = new Date(`${ymd}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
};

function rangeOf(period: Period, from: string, to: string): [string, string] {
  const today = bogotaToday();
  if (period === "today") return [today, today];
  if (period === "week") {
    const weekday = (new Date(`${today}T12:00:00Z`).getUTCDay() + 6) % 7; // Monday = 0
    return [shift(today, -weekday), today];
  }
  if (period === "month") return [`${today.slice(0, 8)}01`, today];
  if (period === "lastMonth") {
    const firstThis = `${today.slice(0, 8)}01`;
    const lastPrev = shift(firstThis, -1);
    return [`${lastPrev.slice(0, 8)}01`, lastPrev];
  }
  return [from || today, to || today];
}

/** The payment on record, or — until it's recorded — what was agreed when booking (in pesos). */
function paymentOf(a: Appointment): { method: PaymentMethod; currency: PaymentCurrency; amount: number; recorded: boolean } {
  return a.payment
    ? { method: a.payment.method, currency: a.payment.currency, amount: a.payment.amount, recorded: true }
    : { method: a.paymentMethod, currency: "COP", amount: a.totalPrice, recorded: false };
}

type Totals = Record<PaymentCurrency, number>;
const zero = (): Totals => ({ COP: 0, USD: 0 });

function Money({ totals, strong }: { totals: Totals; strong?: boolean }) {
  if (!totals.COP && !totals.USD) return <span className="text-ink-soft">—</span>;
  return (
    <span className={clsx("tabular-nums", strong && "font-semibold text-ink")}>
      {totals.COP > 0 && <span className="block">{formatCOP(totals.COP)}</span>}
      {totals.USD > 0 && <span className="block">{formatMoney(totals.USD, "USD")}</span>}
    </span>
  );
}

function exportCsv(rows: Appointment[], from: string, to: string) {
  const cell = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;
  const header = ["Fecha", "Código", "Cliente", "Servicio", "Masajista", "Método", "Moneda", "Monto", "Valor acordado (COP)", "Registrado", "Nota"];
  const lines = rows.map((a) => {
    const p = paymentOf(a);
    return [
      a.startsAt.slice(0, 16).replace("T", " "),
      a.id,
      a.clientName,
      a.serviceName,
      [a.masseuseName, a.secondMasseuseName].filter(Boolean).join(" y "),
      METHOD_LABEL[p.method],
      p.currency,
      p.amount,
      a.totalPrice,
      p.recorded ? "Sí" : "No (estimado)",
      a.payment?.note ?? "",
    ]
      .map(cell)
      .join(";");
  });
  const csv = "﻿" + [header.map(cell).join(";"), ...lines].join("\r\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `facturacion-lamour-${from}_a_${to}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Billing: what came in during a period, split by method (cash, transfer, card) and
 * currency (pesos or dollars), and how much cash each therapist should be holding —
 * the client pays her at the end of the session. Only completed appointments count;
 * one without a recorded payment is counted at its agreed price and flagged.
 */
export function BillingView({ token }: { token: string }) {
  const [appointments, setAppointments] = useState<Appointment[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<Period>("month");
  const [from, setFrom] = useState(() => `${bogotaToday().slice(0, 8)}01`);
  const [to, setTo] = useState(bogotaToday);
  const [onlyPending, setOnlyPending] = useState(false);
  const [paying, setPaying] = useState<Appointment | null>(null);

  async function load(silent = false) {
    if (!silent) setError(null);
    try {
      setAppointments(await adminGetAppointments(token));
    } catch {
      if (!silent) setError("No se pudo cargar la facturación.");
    }
  }

  useAutoRefresh(() => load(true), 30_000, paying === null);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial fetch on mount
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const [start, end] = rangeOf(period, from, to);

  const { rows, byMethod, total, byTherapist, unrecorded } = useMemo(() => {
    const rows = (appointments ?? [])
      .filter((a) => a.status === "Completed")
      .filter((a) => {
        const day = a.startsAt.slice(0, 10);
        return day >= start && day <= end;
      })
      .sort((a, b) => b.startsAt.localeCompare(a.startsAt));
    const byMethod: Record<PaymentMethod, Totals> = { Cash: zero(), Transfer: zero(), Card: zero() };
    const total = zero();
    const therapists = new Map<string, { name: string; cash: Totals; count: number }>();
    for (const a of rows) {
      const p = paymentOf(a);
      byMethod[p.method][p.currency] += p.amount;
      total[p.currency] += p.amount;
      const t = therapists.get(a.masseuseId) ?? { name: a.masseuseName || "Sin asignar", cash: zero(), count: 0 };
      t.count += 1;
      if (p.method === "Cash") t.cash[p.currency] += p.amount;
      therapists.set(a.masseuseId, t);
    }
    return {
      rows,
      byMethod,
      total,
      byTherapist: [...therapists.values()].sort((x, y) => y.cash.COP - x.cash.COP || y.cash.USD - x.cash.USD),
      unrecorded: rows.filter((a) => !a.payment).length,
    };
  }, [appointments, start, end]);

  const list = onlyPending ? rows.filter((a) => !a.payment) : rows;
  const dateLabel = (ymd: string) =>
    new Date(`${ymd}T12:00:00Z`).toLocaleDateString("es-CO", { day: "numeric", month: "short", timeZone: "UTC" });

  return (
    <div>
      <AdminPageHeader
        title="Facturación"
        description="Lo que entró por citas completadas: en efectivo, por transferencia o datáfono, en pesos o en dólares, y cuánto efectivo tiene cada masajista."
        action={
          <Button variant="secondary" onClick={() => exportCsv(rows, start, end)} disabled={rows.length === 0}>
            <FileSpreadsheet size={16} aria-hidden />
            Excel
          </Button>
        }
      />

      <div className={clsx(wrapRailClass, "mt-6")}>
        {PERIODS.map((p) => (
          <button
            key={p.value}
            type="button"
            onClick={() => setPeriod(p.value)}
            aria-pressed={period === p.value}
            className={clsx(chipClass(period === p.value), "min-h-10 shrink-0 whitespace-nowrap")}
          >
            {p.label}
          </button>
        ))}
      </div>
      {period === "custom" && (
        <div className="mt-3 grid max-w-md grid-cols-2 gap-3">
          <label className="text-xs font-medium text-ink-soft">
            Desde
            <input type="date" value={from} max={to} onChange={(e) => setFrom(e.target.value)} className={clsx(fieldClass, "mt-1")} />
          </label>
          <label className="text-xs font-medium text-ink-soft">
            Hasta
            <input type="date" value={to} min={from} onChange={(e) => setTo(e.target.value)} className={clsx(fieldClass, "mt-1")} />
          </label>
        </div>
      )}
      <p className="mt-2 text-xs text-ink-soft">
        {start === end ? dateLabel(start) : `${dateLabel(start)} – ${dateLabel(end)}`} · {rows.length}{" "}
        {rows.length === 1 ? "cita completada" : "citas completadas"}
      </p>

      {error && <div className="mt-6"><ErrorBanner>{error}</ErrorBanner></div>}
      {!appointments && !error && <LoadingBlock label="Cargando facturación" />}

      {appointments && (
        <>
          {/* Totals by method and currency */}
          <section className="mt-6 overflow-hidden rounded-2xl bg-marfil ring-1 ring-ink/[0.07]">
            <div className="grid grid-cols-2 divide-x divide-ink/10 border-b border-ink/10">
              <div className="p-4 sm:p-5">
                <p className="text-xs font-medium text-ink-soft">Total en pesos</p>
                <p className="mt-1 font-serif text-2xl font-semibold tabular-nums text-ink sm:text-3xl">{formatCOP(total.COP)}</p>
              </div>
              <div className="p-4 sm:p-5">
                <p className="text-xs font-medium text-ink-soft">Total en dólares</p>
                <p className="mt-1 font-serif text-2xl font-semibold tabular-nums text-ink sm:text-3xl">{formatMoney(total.USD, "USD")}</p>
              </div>
            </div>
            <table className="w-full text-sm">
              <thead className="text-xs text-ink-soft">
                <tr>
                  <th scope="col" className="px-4 py-2.5 text-left font-semibold sm:px-5">Método</th>
                  <th scope="col" className="px-4 py-2.5 text-right font-semibold">Pesos (COP)</th>
                  <th scope="col" className="px-4 py-2.5 text-right font-semibold sm:px-5">Dólares (USD)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/[0.06] border-t border-ink/[0.06]">
                {METHODS.map((m) => (
                  <tr key={m}>
                    <th scope="row" className="px-4 py-3 text-left font-semibold text-ink sm:px-5">{METHOD_LABEL[m]}</th>
                    <td className="px-4 py-3 text-right tabular-nums text-ink">{byMethod[m].COP ? formatCOP(byMethod[m].COP) : "—"}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-ink sm:px-5">
                      {byMethod[m].USD ? formatMoney(byMethod[m].USD, "USD") : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {unrecorded > 0 && (
            <button
              type="button"
              onClick={() => setOnlyPending(true)}
              className="mt-4 flex w-full cursor-pointer items-start gap-2 rounded-2xl bg-gold/10 p-4 text-left text-sm text-bronze"
            >
              <AlertTriangle size={16} className="mt-0.5 shrink-0" aria-hidden />
              <span>
                <strong>{unrecorded} {unrecorded === 1 ? "cita completada no tiene" : "citas completadas no tienen"} el pago registrado.</strong>{" "}
                Se cuentan con el valor y método acordados al reservar (en pesos). Toca para verlas y registrar lo que pagaron.
              </span>
            </button>
          )}

          {/* Cash per therapist */}
          <section className="mt-8">
            <h2 className="font-serif text-xl font-semibold text-ink">Efectivo por masajista</h2>
            <p className="mt-1 text-sm text-ink-soft">La clienta le paga a la masajista al terminar: esto es lo que cada una debería entregar.</p>
            {byTherapist.length === 0 ? (
              <p className="mt-4 text-sm text-ink-soft">Sin citas completadas en este periodo.</p>
            ) : (
              <ul className="mt-4 divide-y divide-ink/[0.07] rounded-2xl bg-marfil ring-1 ring-ink/[0.07]">
                {byTherapist.map((t) => (
                  <li key={t.name} className="flex items-center justify-between gap-4 px-4 py-3.5 sm:px-5">
                    <span>
                      <span className="block font-semibold text-ink">{t.name}</span>
                      <span className="text-xs text-ink-soft">
                        {t.count} {t.count === 1 ? "cita" : "citas"}
                      </span>
                    </span>
                    <span className="text-right">
                      <Money totals={t.cash} strong />
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Movements */}
          <section className="mt-8">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <h2 className="font-serif text-xl font-semibold text-ink">Movimientos</h2>
              <div className="flex gap-2">
                <button type="button" onClick={() => setOnlyPending(false)} aria-pressed={!onlyPending} className={clsx(chipClass(!onlyPending), "min-h-9")}>
                  Todos {rows.length}
                </button>
                <button type="button" onClick={() => setOnlyPending(true)} aria-pressed={onlyPending} className={clsx(chipClass(onlyPending), "min-h-9")}>
                  Sin registrar {unrecorded}
                </button>
              </div>
            </div>
            <div className="relative isolate mt-4 overflow-x-auto rounded-2xl bg-marfil ring-1 ring-ink/[0.07]">
              <table className="w-full min-w-[40rem] border-separate border-spacing-0 text-left text-sm">
                <thead className="bg-ivory/80 text-xs text-ink-soft [&_th]:border-b [&_th]:border-ink/10">
                  <tr>
                    <th scope="col" className="px-4 py-3 font-semibold">Fecha</th>
                    <th scope="col" className="px-3 py-3 font-semibold">Cliente · servicio</th>
                    <th scope="col" className="px-3 py-3 font-semibold">Masajista</th>
                    <th scope="col" className="px-3 py-3 font-semibold">Método</th>
                    <th scope="col" className="px-3 py-3 text-right font-semibold">Monto</th>
                    <th scope="col" className="px-4 py-3"><span className="sr-only">Editar</span></th>
                  </tr>
                </thead>
                <tbody className="[&_tr+tr_td]:border-t [&_tr+tr_td]:border-ink/[0.06]">
                  {list.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-10 text-center text-ink-soft">
                        {onlyPending ? "Todos los pagos de este periodo están registrados." : "Sin citas completadas en este periodo."}
                      </td>
                    </tr>
                  )}
                  {list.map((a) => {
                    const p = paymentOf(a);
                    return (
                      <tr key={a.id}>
                        <td className="whitespace-nowrap px-4 py-3 tabular-nums text-ink">
                          {dateLabel(a.startsAt.slice(0, 10))}
                          <span className="block text-xs text-ink-soft">{a.id}</span>
                        </td>
                        <td className="px-3 py-3">
                          <span className="block font-semibold text-ink">{a.clientName}</span>
                          <span className="block max-w-[14rem] truncate text-xs text-ink-soft">{a.serviceName}</span>
                        </td>
                        <td className="px-3 py-3 text-ink">{[a.masseuseName, a.secondMasseuseName].filter(Boolean).join(" y ")}</td>
                        <td className="px-3 py-3">
                          <span className="block text-ink">{METHOD_LABEL[p.method]}</span>
                          {!p.recorded && <span className="text-xs font-semibold text-bronze">Sin registrar</span>}
                          {a.payment?.note && <span className="block max-w-[12rem] truncate text-xs text-ink-soft">{a.payment.note}</span>}
                        </td>
                        <td className={clsx("whitespace-nowrap px-3 py-3 text-right font-semibold tabular-nums", p.recorded ? "text-ink" : "text-ink-soft")}>
                          {formatMoney(p.amount, p.currency)}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            type="button"
                            onClick={() => setPaying(a)}
                            className="inline-flex min-h-9 cursor-pointer items-center gap-1.5 rounded-full border border-ink/10 bg-ivory px-3 text-xs font-semibold text-ink hover:border-gold/50"
                          >
                            <Pencil size={12} aria-hidden />
                            {p.recorded ? "Editar" : "Registrar"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}

      {paying && (
        <PaymentDialog
          appointment={paying}
          title="Pago recibido"
          onClose={() => setPaying(null)}
          onSave={async (payment) => {
            const saved = await adminRecordPayment(paying.id, payment, token);
            setAppointments((prev) => prev?.map((x) => (x.id === paying.id ? { ...x, payment: saved.payment } : x)) ?? null);
            setPaying(null);
          }}
        />
      )}
    </div>
  );
}
