"use client";

import clsx from "clsx";
import { fieldClass, labelClass } from "@/lib/ui";
import type { ChangeEvent } from "react";
import type { PaymentMethod, Service } from "@/lib/types";
import type { ClientDetails } from "./types";

const PAYMENT_OPTIONS: { value: PaymentMethod; label: string }[] = [
  { value: "Cash", label: "Efectivo" },
  { value: "Transfer", label: "Transferencia" },
  { value: "Card", label: "Tarjeta (datáfono)" },
];

// text-base (16px), not text-sm — anything smaller makes iOS Safari zoom the
// whole page in when the field is focused, which then has to be manually
// zoomed back out. That zoom-jump is exactly the kind of thing that tanks
// completion on the one form in this flow that has to work on a phone.
const inputClass = fieldClass;

export function DetailsStep({
  service,
  details,
  onChange,
}: {
  service: Service;
  details: ClientDetails;
  onChange: (details: ClientDetails) => void;
}) {
  function set<K extends keyof ClientDetails>(key: K, value: ClientDetails[K]) {
    onChange({ ...details, [key]: value });
  }

  function handle(key: keyof ClientDetails) {
    return (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => set(key, e.target.value as never);
  }

  return (
    <div>
      <h2 className="font-serif text-2xl font-semibold tracking-tight text-ink sm:text-3xl">Tus datos</h2>
      <p className="mt-1 text-sm text-ink-soft">Necesitamos esta información para confirmar tu cita a domicilio.</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className={labelClass}>
          Nombre completo
          <input
            className={inputClass}
            value={details.clientName}
            onChange={handle("clientName")}
            placeholder="Ej. María González"
            autoComplete="name"
            required
          />
        </label>

        <label className={labelClass}>
          Teléfono / WhatsApp
          <input
            className={inputClass}
            value={details.clientPhone}
            onChange={handle("clientPhone")}
            placeholder="Ej. 300 123 4567"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            required
          />
        </label>

        <label className={`${labelClass} sm:col-span-2`}>
          Dirección
          <input
            className={inputClass}
            value={details.address}
            onChange={handle("address")}
            placeholder="Calle, carrera, número"
            autoComplete="street-address"
            required
          />
        </label>

        <label className={labelClass}>
          Barrio
          <input
            className={inputClass}
            value={details.neighborhood}
            onChange={handle("neighborhood")}
            placeholder="Ej. El Poblado"
            required
          />
        </label>

        <label className={labelClass}>
          Ciudad / Municipio
          <input
            className={inputClass}
            value={details.city}
            onChange={handle("city")}
            autoComplete="address-level2"
            required
          />
        </label>

        <label className={`${labelClass} sm:col-span-2`}>
          Detalles de la dirección (opcional)
          <input
            className={inputClass}
            value={details.addressDetails}
            onChange={handle("addressDetails")}
            placeholder="Apto, torre, referencia de acceso"
          />
        </label>

        <label className={`${labelClass} sm:col-span-2`}>
          Notas para la masajista (opcional)
          <textarea
            className={clsx(inputClass, "min-h-20 resize-none")}
            value={details.notes}
            onChange={handle("notes")}
            placeholder="Alergias, preferencias, indicaciones de acceso al edificio…"
          />
        </label>
      </div>

      {service.hasSensoryDressOption && (
        <label className="mt-6 flex items-center gap-3 rounded-xl border border-ink/15 px-4 py-3.5">
          <input
            type="checkbox"
            checked={details.sensoryDressRequested}
            onChange={(e) => set("sensoryDressRequested", e.target.checked)}
            className="h-4 w-4 accent-[var(--color-gold)]"
          />
          <span className="text-sm text-ink">
            Deseo la sesión con <strong>vestidura sensorial</strong> (en panty)
          </span>
        </label>
      )}

      <div className="mt-6">
        <p className="mb-3 text-sm font-medium text-ink">Método de pago</p>
        <div className="flex flex-wrap gap-2">
          {PAYMENT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              aria-pressed={details.paymentMethod === opt.value}
              onClick={() => set("paymentMethod", opt.value)}
              className={clsx(
                "inline-flex min-h-11 items-center justify-center rounded-full border px-4 py-2 text-xs font-sans",
                details.paymentMethod === opt.value
                  ? "border-ink bg-ink text-ivory"
                  : "border-ink/15 text-ink-soft hover:border-gold",
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
