import "server-only";

/**
 * Appointment times are "wall clock" times in Colombia ("2026-09-28T15:00:00",
 * no offset) — what the client picks and what the therapist reads. They're
 * handled as naive local values: parsed as if UTC purely for arithmetic, never
 * converted, so the server's own time zone can't shift them.
 */
export const BUSINESS_TZ = "America/Bogota";
export const OPENING_HOUR = 9;
export const CLOSING_HOUR = 21;
export const DEFAULT_INTERVAL = 30;

const LOCAL_RE = /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})(?::(\d{2}))?/;

/** "2026-09-28T15:00:00" → ms on a naive (UTC-based) timeline, or NaN. */
export function parseLocal(value: string): number {
  const m = LOCAL_RE.exec(value);
  if (!m) return NaN;
  return Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +(m[6] ?? 0));
}

export function formatLocal(ms: number): string {
  return new Date(ms).toISOString().slice(0, 19);
}

/** "2026-09-28" → ms at 00:00 of that day, or NaN. */
export function parseDate(value: string): number {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) ? parseLocal(`${value}T00:00:00`) : NaN;
}

/** Current wall-clock time in Colombia on the same naive timeline. */
export function businessNow(): number {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-CA", {
      timeZone: BUSINESS_TZ,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(new Date())
      .map((p) => [p.type, p.value]),
  );
  return Date.UTC(+parts.year, +parts.month - 1, +parts.day, +parts.hour, +parts.minute, +parts.second);
}

export const MINUTE = 60_000;
export const DAY = 86_400_000;

/** "HH:mm" (00:00–24:00) → minutes from midnight, or null. */
export function parseHm(value: string): number | null {
  if (value === "24:00") return 1440;
  const m = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(value);
  return m ? +m[1] * 60 + +m[2] : null;
}

export function formatHm(minute: number): string {
  return `${String(Math.floor(minute / 60)).padStart(2, "0")}:${String(minute % 60).padStart(2, "0")}`;
}

/** Spanish long date for messages: "lunes 28 de septiembre, 3:00 p. m." */
export function describeLocal(value: string): string {
  const d = new Date(parseLocal(value));
  const date = new Intl.DateTimeFormat("es-CO", { timeZone: "UTC", weekday: "long", day: "numeric", month: "long" }).format(d);
  const time = new Intl.DateTimeFormat("es-CO", { timeZone: "UTC", hour: "numeric", minute: "2-digit", hour12: true }).format(d);
  return `${date}, ${time}`;
}

/** Colombia is UTC−5 all year (no daylight saving), so local ↔ instant is a fixed shift. */
const OFFSET_MS = 5 * 3_600_000;

/** "2026-09-28T15:00:00" (Colombia) → the real instant, for Firestore timestamps (inicio / fin). */
export function localToDate(local: string): Date {
  return new Date(parseLocal(local) + OFFSET_MS);
}

/** A Firestore timestamp / Date → "2026-09-28T15:00:00" in Colombia. */
export function dateToLocal(date: Date): string {
  return formatLocal(date.getTime() - OFFSET_MS);
}
