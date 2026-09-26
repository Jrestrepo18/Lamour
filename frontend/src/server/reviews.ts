import "server-only";
import { FieldValue, type DocumentData } from "firebase-admin/firestore";
import type { Review, ReviewAdmin, ReviewSource, ReviewStatus, ReviewSummary } from "@/lib/types";
import { isAdultService } from "@/lib/catalog";
import { COL, db } from "./db";
import { dateToLocal } from "./time";

/*
 * Firestore: resenas/{id}
 *   Reviews from a booking use the booking code as id (LA-0012), so each booking can be
 *   reviewed once. Reviews copied from a real WhatsApp message or Google get an auto id.
 *   Fields: nombreVisible, ciudad, servicioNombre, estrellas, texto, fecha, origen,
 *   verificada, respuesta, estado (PENDIENTE | PUBLICADA | OCULTA), citaId, consentimiento, creadoEn.
 */

const RESENAS = "resenas";

const STATUS_TO_DB: Record<ReviewStatus, string> = { Pending: "PENDIENTE", Published: "PUBLICADA", Hidden: "OCULTA" };
const STATUS_FROM_DB: Record<string, ReviewStatus> = { PENDIENTE: "Pending", PUBLICADA: "Published", OCULTA: "Hidden" };
const SOURCE_TO_DB: Record<ReviewSource, string> = { appointment: "CITA", whatsapp: "WHATSAPP", google: "GOOGLE" };
const SOURCE_FROM_DB: Record<string, ReviewSource> = { CITA: "appointment", WHATSAPP: "whatsapp", GOOGLE: "google" };

const toReview = (id: string, d: DocumentData): Review => ({
  id,
  displayName: d.nombreVisible ?? "Cliente",
  city: d.ciudad ?? null,
  serviceName: d.servicioNombre ?? null,
  rating: Math.min(5, Math.max(1, Number(d.estrellas) || 5)),
  text: d.texto ?? "",
  date: d.fecha ?? "",
  source: SOURCE_FROM_DB[d.origen] ?? "whatsapp",
  verified: d.verificada === true,
  reply: d.respuesta || null,
});

const toReviewAdmin = (id: string, d: DocumentData): ReviewAdmin => ({
  ...toReview(id, d),
  status: STATUS_FROM_DB[d.estado] ?? "Pending",
  appointmentId: d.citaId ?? null,
  createdAt: d.creadoEn?.toDate?.().toISOString() ?? "",
});

/**
 * Public: the published reviews and their real average (nothing is filtered by rating).
 * Reviews of +18 rituals keep their words but not the ritual's name, so general pages
 * (the home page) never name an adult service.
 */
export async function publishedReviews(): Promise<ReviewSummary> {
  const snap = await db().collection(RESENAS).where("estado", "==", "PUBLICADA").get();
  const reviews = snap.docs
    .map((d) => {
      const r = toReview(d.id, d.data());
      return d.get("servicioAdultos") === true ? { ...r, serviceName: null } : r;
    })
    .sort((a, b) => b.date.localeCompare(a.date));
  const average = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;
  return { count: reviews.length, average: Math.round(average * 10) / 10, reviews: reviews.slice(0, 80) };
}

export async function listReviewsAdmin(): Promise<ReviewAdmin[]> {
  const snap = await db().collection(RESENAS).get();
  return snap.docs.map((d) => toReviewAdmin(d.id, d.data())).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function reviewedAppointmentIds(): Promise<Set<string>> {
  const snap = await db().collection(RESENAS).where("origen", "==", "CITA").select().get();
  return new Set(snap.docs.map((d) => d.id));
}

/** "María Fernanda Gómez" → "María G." */
export function shortName(fullName: string): string {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "Cliente";
  const first = parts[0][0].toUpperCase() + parts[0].slice(1).toLowerCase();
  return parts.length > 1 ? `${first} ${parts[parts.length - 1][0].toUpperCase()}.` : first;
}

export type ReviewContext = {
  appointmentId: string;
  adultService: boolean;
  firstName: string;
  suggestedName: string;
  serviceName: string;
  city: string | null;
  date: string;
  alreadyReviewed: boolean;
  completed: boolean;
};

/** What the review page needs to know about the booking behind a link. */
export async function reviewContext(appointmentId: string): Promise<ReviewContext | null> {
  const store = db();
  const [cita, existing] = await Promise.all([
    store.collection(COL.citas).doc(appointmentId).get(),
    store.collection(RESENAS).doc(appointmentId).get(),
  ]);
  const c = cita.data();
  if (!c) return null;
  const [service, client] = await Promise.all([
    store.collection(COL.servicios).doc(c.servicioId).get(),
    c.clienteId ? store.collection(COL.clientes).doc(c.clienteId).get() : Promise.resolve(null),
  ]);
  const name: string = client?.get("nombre") ?? c.clienteNombre ?? "";
  return {
    appointmentId,
    adultService: isAdultService({ slug: String(c.servicioId) }, String(service.get("categoria") ?? "")),
    firstName: name.trim().split(/\s+/)[0] ?? "",
    suggestedName: shortName(name),
    serviceName: service.get("nombre") ?? c.servicioId,
    city: c.ciudad ?? null,
    date: c.inicio?.toDate ? dateToLocal(c.inicio.toDate()).slice(0, 10) : "",
    alreadyReviewed: existing.exists,
    completed: c.estado === "COMPLETADA",
  };
}

/**
 * A client's own review from their link. It arrives pending: the admin publishes it,
 * but may not edit it (only reply or hide) — the words stay the client's.
 */
export async function submitAppointmentReview(
  ctx: ReviewContext,
  input: { rating: number; text: string; displayName: string },
): Promise<"created" | "duplicate"> {
  const ref = db().collection(RESENAS).doc(ctx.appointmentId);
  try {
    await ref.create({
      nombreVisible: input.displayName,
      ciudad: ctx.city,
      servicioNombre: ctx.serviceName,
      servicioAdultos: ctx.adultService,
      estrellas: input.rating,
      texto: input.text,
      fecha: new Date().toISOString().slice(0, 10),
      origen: "CITA",
      verificada: true,
      respuesta: null,
      estado: "PENDIENTE",
      citaId: ctx.appointmentId,
      consentimiento: true,
      creadoEn: FieldValue.serverTimestamp(),
    });
    return "created";
  } catch (err) {
    if ((err as { code?: number }).code === 6) return "duplicate"; // ALREADY_EXISTS
    throw err;
  }
}

export type ManualReviewInput = {
  displayName: string;
  city: string | null;
  serviceName: string | null;
  rating: number;
  text: string;
  date: string;
  source: Exclude<ReviewSource, "appointment">;
};

/** A real review received elsewhere (WhatsApp message, Google), entered by the admin with the client's consent. */
export async function createManualReview(r: ManualReviewInput): Promise<ReviewAdmin> {
  const ref = db().collection(RESENAS).doc();
  await ref.set({
    nombreVisible: r.displayName,
    ciudad: r.city,
    servicioNombre: r.serviceName,
    estrellas: r.rating,
    texto: r.text,
    fecha: r.date,
    origen: SOURCE_TO_DB[r.source],
    verificada: false,
    respuesta: null,
    estado: "PUBLICADA",
    citaId: null,
    consentimiento: true,
    creadoEn: FieldValue.serverTimestamp(),
  });
  return toReviewAdmin(ref.id, (await ref.get()).data()!);
}

export async function updateReview(id: string, change: { status?: ReviewStatus; reply?: string | null }) {
  const ref = db().collection(RESENAS).doc(id);
  if (!(await ref.get()).exists) return null;
  await ref.update({
    ...(change.status ? { estado: STATUS_TO_DB[change.status] } : {}),
    ...(change.reply !== undefined ? { respuesta: change.reply } : {}),
  });
  return toReviewAdmin(id, (await ref.get()).data()!);
}

/** Only for reviews typed in by the admin (a mistake); a client's own review can only be hidden. */
export async function deleteManualReview(id: string): Promise<"deleted" | "not-found" | "client-review"> {
  const ref = db().collection(RESENAS).doc(id);
  const snap = await ref.get();
  if (!snap.exists) return "not-found";
  if (snap.get("origen") === "CITA") return "client-review";
  await ref.delete();
  return "deleted";
}
