"use client";

import clsx from "clsx";
import { ChevronDown } from "lucide-react";
import type { ChangeEvent } from "react";
import { fieldClass, labelClass } from "@/lib/ui";
import { MUNICIPIOS } from "@/lib/coverage";
import type { PaymentMethod, Service } from "@/lib/types";
import type { ClientDetails } from "./types";
import { GroupLabel, StepHeading } from "./parts";
import { useI18n } from "@/i18n/I18nProvider";

const PAYMENT_OPTIONS: { value: PaymentMethod; label: { es: string; en: string } }[] = [
  { value: "Cash", label: { es: "Efectivo", en: "Cash" } },
  { value: "Transfer", label: { es: "Transferencia", en: "Transfer" } },
  { value: "Card", label: { es: "Datáfono", en: "Card" } },
];

// Fields keep text-base (16px): anything smaller makes iOS Safari zoom the page on focus.
const inputClass = fieldClass;

/** The one real form in the flow, split into three short groups so it never reads as paperwork. */
export function DetailsStep({
  service,
  details,
  onChange,
}: {
  service: Service;
  details: ClientDetails;
  onChange: (details: ClientDetails) => void;
}) {
  const { t, lang, href } = useI18n();
  function set<K extends keyof ClientDetails>(key: K, value: ClientDetails[K]) {
    onChange({ ...details, [key]: value });
  }

  function handle(key: keyof ClientDetails) {
    return (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => set(key, e.target.value as never);
  }

  const cities = MUNICIPIOS.includes(details.city) ? MUNICIPIOS : [details.city, ...MUNICIPIOS];

  return (
    <div>
      <StepHeading
        title={t("Casi listo", "Almost done")}
        hint={t("Solo lo necesario para confirmar tu cita y llegar a ti.", "Just what we need to confirm your appointment and reach you.")}
      />

      <fieldset className="mt-8 space-y-4">
        <legend className="mb-4">
          <GroupLabel>{t("Contacto", "Contact")}</GroupLabel>
        </legend>
        <label className={labelClass}>
          {t("Nombre", "Name")}
          <input
            className={inputClass}
            value={details.clientName}
            onChange={handle("clientName")}
            placeholder={t("Como quieres que te llamemos", "What should we call you?")}
            autoComplete="name"
            required
          />
        </label>
        <label className={labelClass}>
          WhatsApp
          <input
            className={inputClass}
            value={details.clientPhone}
            onChange={handle("clientPhone")}
            placeholder={t("300 123 4567", "+1 555 123 4567")}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            required
          />
          <span className="text-xs font-normal text-ink-soft">
            {t(
              "Por aquí te confirmamos la cita.",
              "We'll confirm your appointment here. If your number isn't Colombian, include the country code (e.g. +1).",
            )}
          </span>
        </label>
      </fieldset>

      <fieldset className="mt-9 space-y-4">
        <legend className="mb-4">
          <GroupLabel>{t("¿Dónde te visitamos?", "Where should we come?")}</GroupLabel>
        </legend>
        <label className={labelClass}>
          {t("Dirección", "Address")}
          <input
            className={inputClass}
            value={details.address}
            onChange={handle("address")}
            placeholder={t("Calle, carrera, número", "Street address or hotel name")}
            autoComplete="street-address"
            required
          />
        </label>
        <label className={labelClass}>
          <span>
            {t("Apto, torre o referencia", "Apartment, room or landmark")}{" "}
            <span className="font-normal text-ink-soft">{t("(opcional)", "(optional)")}</span>
          </span>
          <input
            className={inputClass}
            value={details.addressDetails}
            onChange={handle("addressDetails")}
            placeholder={t("Ej. Torre 2, apto 1204", "E.g. Room 1204")}
          />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className={labelClass}>
            {t("Barrio", "Neighbourhood")}
            <input
              className={inputClass}
              value={details.neighborhood}
              onChange={handle("neighborhood")}
              placeholder="El Poblado"
              required
            />
          </label>
          <label className={labelClass}>
            {t("Municipio", "City / town")}
            <span className="relative">
              <select
                className={clsx(inputClass, "cursor-pointer appearance-none pr-10")}
                value={details.city}
                onChange={handle("city")}
                autoComplete="address-level2"
              >
                {cities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <ChevronDown size={16} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-soft" aria-hidden />
            </span>
          </label>
        </div>
      </fieldset>

      <fieldset className="mt-9 space-y-4">
        <legend className="mb-4">
          <GroupLabel>{t("Tu experiencia", "Your experience")}</GroupLabel>
        </legend>

        {service.hasSensoryDressOption && (
          <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl bg-marfil/70 px-4 py-3.5">
            <span className="text-sm text-ink">
              {t("Vestidura sensorial", "Sensory attire")}
              <span className="block text-xs text-ink-soft">{t("La sesión se realiza en panty.", "The therapist performs the session in underwear.")}</span>
            </span>
            <input
              type="checkbox"
              checked={details.sensoryDressRequested}
              onChange={(e) => set("sensoryDressRequested", e.target.checked)}
              className="peer sr-only"
            />
            <span
              aria-hidden
              className="relative h-7 w-12 shrink-0 rounded-full bg-ink/15 transition-colors duration-200 after:absolute after:left-0.5 after:top-0.5 after:h-6 after:w-6 after:rounded-full after:bg-marfil after:shadow after:transition-transform after:duration-200 peer-checked:bg-ink peer-checked:after:translate-x-5 peer-focus-visible:ring-2 peer-focus-visible:ring-bronze"
            />
          </label>
        )}

        <label className={labelClass}>
          <span>
            {t("Algo que tu terapeuta deba saber", "Anything your therapist should know")}{" "}
            <span className="font-normal text-ink-soft">{t("(opcional)", "(optional)")}</span>
          </span>
          <textarea
            className={clsx(inputClass, "min-h-24 resize-none")}
            value={details.notes}
            onChange={handle("notes")}
            placeholder={t("Alergias, zonas a evitar, cómo entrar al edificio…", "Allergies, areas to avoid, how to get into the building or hotel…")}
          />
        </label>

        <div>
          <p className="mb-2 text-sm font-medium text-ink" id="pago-label">
            {t("¿Cómo prefieres pagar?", "How would you like to pay?")}
          </p>
          <div role="radiogroup" aria-labelledby="pago-label" className="grid grid-cols-3 gap-1 rounded-2xl bg-ink/[0.06] p-1">
            {PAYMENT_OPTIONS.map((opt) => {
              const on = details.paymentMethod === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => set("paymentMethod", opt.value)}
                  className={clsx(
                    "min-h-11 cursor-pointer rounded-xl text-sm font-medium transition-[background-color,color,box-shadow] duration-200",
                    on ? "bg-marfil text-ink shadow-[0_2px_8px_-2px_rgba(23,23,23,0.2)]" : "text-ink-soft hover:text-ink",
                  )}
                >
                  {opt.label[lang]}
                </button>
              );
            })}
          </div>
        </div>

        <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-ink-soft">
          <input
            type="checkbox"
            checked={details.acceptsMarketing}
            onChange={(e) => set("acceptsMarketing", e.target.checked)}
            className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer accent-ink"
          />
          <span>
            {t("Quiero recibir promociones de L'AMOUR por WhatsApp", "I'd like to receive L'AMOUR promotions on WhatsApp")}{" "}
            <span className="text-ink-soft/80">{t("(opcional)", "(optional)")}</span>.{" "}
            {t("Puedes darte de baja cuando quieras respondiendo “NO”.", "You can opt out any time by replying “NO”.")}{" "}
            <a href={href("/legal/privacidad")} target="_blank" className="underline decoration-gold/60 underline-offset-4 hover:text-ink">
              {t("Privacidad", "Privacy")}
            </a>
          </span>
        </label>
      </fieldset>
    </div>
  );
}
