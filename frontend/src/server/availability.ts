import "server-only";
import type { DocumentData, Transaction } from "firebase-admin/firestore";
import { COL, db } from "./db";
import { businessNow, CLOSING_HOUR, DEFAULT_INTERVAL, formatLocal, MINUTE, OPENING_HOUR, parseHm, parseLocal } from "./time";

/**
 * Bookable slots from a therapist's agenda in Firebase:
 *   terapeutas/{id}/disponibilidad   weekly blocks {diaSemana, horaInicio, horaFin} (several per day allowed)
 *   terapeutas/{id}.intervaloMin     step between possible session starts
 *   terapeutas/{id}.bufferMin        free time kept after every session (travel)
 *   terapeutas/{id}.diasLibres       [{fecha, motivo}] whole days off
 *   citaTerapeutas                   her sessions (activo = false once cancelled)
 * With no weekly blocks she works the business hours every day.
 */

export type Agenda = {
  isActive: boolean;
  interval: number;
  buffer: number;
  blocks: { day: number; start: number; end: number }[];
  daysOff: Set<string>;
};

export type Busy = { start: number; end: number }[];

export function blocksFromDisponibilidad(docs: DocumentData[]) {
  return docs
    .map((d) => ({ day: Number(d.diaSemana), start: parseHm(String(d.horaInicio)), end: parseHm(String(d.horaFin)) }))
    .filter((b): b is { day: number; start: number; end: number } => b.start !== null && b.end !== null);
}

export function agendaFrom(therapist: DocumentData | undefined, disponibilidad: DocumentData[]): Agenda | null {
  if (!therapist) return null;
  const interval = Number(therapist.intervaloMin);
  return {
    isActive: therapist.activa === true,
    interval: interval >= 5 ? interval : DEFAULT_INTERVAL,
    buffer: Number(therapist.bufferMin) || 0,
    blocks: blocksFromDisponibilidad(disponibilidad),
    daysOff: new Set(((therapist.diasLibres as { fecha: string }[] | undefined) ?? []).map((t) => t.fecha)),
  };
}

export function blocksFor(agenda: Agenda, date: string): { start: number; end: number }[] {
  if (agenda.daysOff.has(date)) return [];
  if (agenda.blocks.length === 0) return [{ start: OPENING_HOUR * 60, end: CLOSING_HOUR * 60 }];
  const weekday = new Date(parseLocal(`${date}T00:00:00`)).getUTCDay();
  return agenda.blocks.filter((b) => b.day === weekday && b.end > b.start).sort((a, b) => a.start - b.start);
}

/** Two sessions clash if they overlap once each is followed by the travel buffer. */
export function overlaps(busy: Busy, start: number, end: number, bufferMin: number) {
  const buffer = bufferMin * MINUTE;
  return busy.some((b) => start < b.end + buffer && end + buffer > b.start);
}

/** Her agenda (document + weekly blocks), optionally read inside a transaction. */
export async function loadAgenda(therapistId: string, tx?: Transaction): Promise<Agenda | null> {
  const ref = db().collection(COL.terapeutas).doc(therapistId);
  const dispo = ref.collection(COL.disponibilidad);
  const [doc, blocks] = tx ? await Promise.all([tx.get(ref), tx.get(dispo)]) : await Promise.all([ref.get(), dispo.get()]);
  return agendaFrom(doc.data(), blocks.docs.map((d) => d.data()));
}

/**
 * Her live sessions (citaTerapeutas with activo ≠ false) as local-time ranges.
 * Queried by therapist only — a spa's volume keeps this small, and it avoids a
 * composite index.
 */
export async function busyOf(therapistId: string, tx?: Transaction): Promise<Busy> {
  const query = db().collection(COL.citaTerapeutas).where("terapeutaId", "==", therapistId);
  const snap = tx ? await tx.get(query) : await query.get();
  return snap.docs
    .map((d) => d.data())
    .filter((s) => s.activo !== false && s.inicio && s.fin)
    .map((s) => {
      const offset = 5 * 3_600_000;
      return { start: s.inicio.toDate().getTime() - offset, end: s.fin.toDate().getTime() - offset };
    });
}

export async function daySlots(therapistId: string, date: string, durationMinutes: number) {
  const [agenda, taken] = await Promise.all([loadAgenda(therapistId), busyOf(therapistId)]);
  if (!agenda || !agenda.isActive) return [];

  const dayStart = parseLocal(`${date}T00:00:00`);
  const now = businessNow();
  const slots: { start: string; end: string; available: boolean }[] = [];

  for (const block of blocksFor(agenda, date)) {
    const blockEnd = dayStart + block.end * MINUTE;
    for (let cursor = dayStart + block.start * MINUTE; cursor + durationMinutes * MINUTE <= blockEnd; cursor += agenda.interval * MINUTE) {
      const end = cursor + durationMinutes * MINUTE;
      slots.push({
        start: formatLocal(cursor),
        end: formatLocal(end),
        available: cursor > now && !overlaps(taken, cursor, end, agenda.buffer),
      });
    }
  }
  return slots.sort((a, b) => a.start.localeCompare(b.start));
}

/**
 * Server-side guard for a booking: inside one of her working blocks that day,
 * not a day off, not in the past, and clear of her other sessions and their buffer.
 */
export function slotFits(agenda: Agenda, busy: Busy, startsAt: string, durationMinutes: number): boolean {
  const start = parseLocal(startsAt);
  if (Number.isNaN(start) || !agenda.isActive) return false;
  const date = startsAt.slice(0, 10);
  const dayStart = parseLocal(`${date}T00:00:00`);
  const end = start + durationMinutes * MINUTE;
  const inside = blocksFor(agenda, date).some((b) => start >= dayStart + b.start * MINUTE && end <= dayStart + b.end * MINUTE);
  return inside && start > businessNow() && !overlaps(busy, start, end, agenda.buffer);
}
