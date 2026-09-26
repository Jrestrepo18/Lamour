"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { formatCOP } from "@/lib/format";
import type { Appointment, PaymentCurrency, PaymentMethod } from "@/lib/types";
import { fieldClass, labelClass } from "@/lib/ui";
import { ChipChoice, ErrorBanner, SheetActions } from "./kit";

export const METHOD_LABEL: Record<PaymentMethod, string> = { Cash: "Efectivo", Transfer: "Transferencia", Card: "Datáfono" };

/** "$ 150.000" or "US$ 40" — dollars are never shown as if they were pesos. */
export function formatMoney(amount: number, currency: PaymentCurrency) {
  return currency === "USD"
    ? `US$ ${amount.toLocaleString("es-CO", { maximumFractionDigits: 2 })}`
    : formatCOP(amount);
}

/**
 * What the client actually paid: method, currency (cash is sometimes in dollars)
 * and the amount in that currency. Opens pre-filled with what was agreed when booking.
 */
export function PaymentDialog({
  appointment: a,
  title = "Registrar pago",
  confirmLabel = "Guardar pago",
  onSave,
  onClose,
}: {
  appointment: Appointment;
  title?: string;
  confirmLabel?: string;
  onSave: (payment: { method: PaymentMethod; currency: PaymentCurrency; amount: number; note: string | null }) => Promise<void>;
  onClose: () => void;
}) {
  const p = a.payment;
  const [method, setMethod] = useState<PaymentMethod>(p?.method ?? a.paymentMethod);
  const [currency, setCurrency] = useState<PaymentCurrency>(p?.currency ?? "COP");
  const [amount, setAmount] = useState(p ? String(p.amount) : String(a.totalPrice));
  const [note, setNote] = useState(p?.note ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const value = Number(amount.replace(/[^\d.]/g, ""));

  function changeCurrency(c: PaymentCurrency) {
    setCurrency(c);
    // The agreed price is in pesos: switching to dollars asks for the dollar amount instead.
    if (c === "USD" && amount === String(a.totalPrice)) setAmount("");
    if (c === "COP" && !amount) setAmount(String(a.totalPrice));
  }

  async function save() {
    if (!(value > 0)) {
      setError(currency === "USD" ? "Escribe cuántos dólares recibió." : "Escribe el monto recibido.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await onSave({ method, currency, amount: value, note: note.trim() || null });
    } catch {
      setError("No se pudo guardar el pago. Inténtalo de nuevo.");
      setBusy(false);
    }
  }

  return (
    <Modal
      title={title}
      subtitle={`${a.serviceName} · ${a.clientName} · valor acordado ${formatCOP(a.totalPrice)}`}
      onClose={onClose}
      size="sm"
      footer={<SheetActions primaryLabel={confirmLabel} busyLabel="Guardando…" busy={busy} onPrimary={save} onCancel={onClose} />}
    >
      <div className="space-y-6">
        {error && <ErrorBanner>{error}</ErrorBanner>}
        <ChipChoice
          label="¿Cómo pagó?"
          value={method}
          onChange={setMethod}
          options={(Object.keys(METHOD_LABEL) as PaymentMethod[]).map((m) => ({ value: m, label: METHOD_LABEL[m] }))}
        />
        <ChipChoice
          label="Moneda"
          value={currency}
          onChange={changeCurrency}
          options={[
            { value: "COP", label: "Pesos (COP)" },
            { value: "USD", label: "Dólares (USD)" },
          ]}
        />
        <label className={labelClass}>
          {currency === "USD" ? "Dólares recibidos" : "Pesos recibidos"}
          <span className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft">
              {currency === "USD" ? "US$" : "$"}
            </span>
            <input
              className={`${fieldClass} ${currency === "USD" ? "pl-14" : "pl-8"} tabular-nums`}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              inputMode="decimal"
              placeholder={currency === "USD" ? "40" : String(a.totalPrice)}
            />
          </span>
          {value > 0 && <span className="text-xs font-normal text-ink-soft">{formatMoney(value, currency)}</span>}
        </label>
        <label className={labelClass}>
          <span>
            Nota <span className="font-normal text-ink-soft">(opcional)</span>
          </span>
          <input
            className={fieldClass}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            maxLength={200}
            placeholder={currency === "USD" ? "Ej. tasa 4.000, incluye propina" : "Ej. incluye propina, pagó una parte"}
          />
        </label>
      </div>
    </Modal>
  );
}
