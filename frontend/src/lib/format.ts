import type { Locale } from "@/i18n/config";

const TAG = { es: "es-CO", en: "en-US" } as const;

/** "$ 180.000" in Spanish; "COP 180,000" in English, so visitors don't read it as dollars. */
export function formatCOP(value: number, lang: Locale = "es"): string {
  return new Intl.NumberFormat(TAG[lang], {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest === 0 ? `${hours} h` : `${hours} h ${rest} min`;
}

export function formatTime(iso: string, lang: Locale = "es"): string {
  return new Intl.DateTimeFormat(TAG[lang], { hour: "numeric", minute: "2-digit", hour12: true }).format(
    new Date(iso),
  );
}

export function formatDateLong(iso: string, lang: Locale = "es"): string {
  return new Intl.DateTimeFormat(TAG[lang], {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date(iso));
}

/** Upper-cases only the first letter ("viernes, 25 de…" → "Viernes, 25 de…"); CSS `capitalize` would hit every word. */
export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
