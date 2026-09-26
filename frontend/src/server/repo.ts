import "server-only";
import { FieldValue, Timestamp, type DocumentData } from "firebase-admin/firestore";
import type {
  Appointment,
  AppointmentStatus,
  Masseuse,
  MasseuseAdmin,
  MasseuseSchedule,
  PaymentMethod,
  Service,
  ServiceCategory,
} from "@/lib/types";
import { busyOf, loadAgenda, slotFits } from "./availability";
import { COL, db } from "./db";
import { hashAdminPassword, reviewToken } from "./auth";
import { reviewedAppointmentIds } from "./reviews";
import { absoluteUrl } from "@/lib/seo";
import { dateToLocal, formatHm, localToDate } from "./time";

/*
 * The site's shapes ↔ the Firebase model (Spanish field names). Fields the
 * site needs that the model didn't have are added alongside the originals:
 *   servicios:  descripcionLarga, fotoUrl, fotos, incluye, opcionVestidura, experienciaPareja
 *   terapeutas: fotos, intervaloMin, bufferMin, diasLibres
 *   citas:      barrio, ciudad, detallesDireccion, metodoPago, minutosExtra, vestiduraSensorial, confirmadaEn
 */

// ---------- Enum mapping ----------

const STATUS_TO_DB: Record<AppointmentStatus, string> = {
  Pending: "PENDIENTE",
  Confirmed: "CONFIRMADA",
  Completed: "COMPLETADA",
  Cancelled: "CANCELADA",
  NoShow: "NO_ASISTIO",
};
const STATUS_FROM_DB = Object.fromEntries(Object.entries(STATUS_TO_DB).map(([k, v]) => [v, k])) as Record<string, AppointmentStatus>;

const PAYMENT_TO_DB: Record<PaymentMethod, string> = { Cash: "EFECTIVO", Transfer: "TRANSFERENCIA", Card: "DATAFONO" };
const PAYMENT_FROM_DB: Record<string, PaymentMethod> = { EFECTIVO: "Cash", TRANSFERENCIA: "Transfer", NEQUI: "Transfer", DATAFONO: "Card" };

// ---------- Mapping ----------

const toService = (id: string, d: DocumentData): Service => ({
  id,
  serviceCategoryId: d.categoria ?? "",
  name: d.nombre ?? "",
  slug: d.slug ?? id,
  shortDescription: d.descripcion ?? "",
  longDescription: d.descripcionLarga ?? null,
  durationMinutes: Number(d.duracionMin) || 60,
  price: Number(d.precio) || 0,
  imageUrl: d.fotoUrl ?? null,
  imageGallery: d.fotos ?? [],
  highlights: d.incluye ?? [],
  requiresTwoTherapists: Number(d.numTerapeutas) >= 2,
  hasSensoryDressOption: d.opcionVestidura === true,
  allowsExtraTime: d.permiteExtension === true,
  isCoupleExperience: d.experienciaPareja === true,
  displayOrder: Number(d.orden) || 0,
  isActive: d.activo !== false,
});

function ageFrom(birth: Timestamp | null | undefined): number | null {
  if (!birth?.toDate) return null;
  const b = birth.toDate();
  const now = new Date();
  let age = now.getUTCFullYear() - b.getUTCFullYear();
  if (now.getUTCMonth() < b.getUTCMonth() || (now.getUTCMonth() === b.getUTCMonth() && now.getUTCDate() < b.getUTCDate())) age--;
  return age;
}

const toMasseuseAdmin = (id: string, d: DocumentData): MasseuseAdmin => ({
  id,
  stageName: d.nombreArtistico ?? "",
  age: ageFrom(d.fechaNacimiento),
  bio: d.bio || null,
  photoUrl: d.fotoUrl ?? null,
  photoGallery: d.fotos ?? [],
  displayOrder: Number(d.orden) || 0,
  isActive: d.activa === true,
  serviceIds: d.servicioIds ?? [],
  offersHomeVisits: d.noDomicilios !== true,
  whatsAppNumber: d.telefono ?? "",
  imageConsent: d.consentimientoImagen === true,
});

/** Public profile: no phone, and no photos unless she authorised publishing them. */
function toMasseuse(id: string, d: DocumentData): Masseuse {
  const { whatsAppNumber: _phone, imageConsent, ...rest } = toMasseuseAdmin(id, d);
  void _phone;
  return imageConsent ? rest : { ...rest, photoUrl: null, photoGallery: [] };
}

const byOrder = <T extends { displayOrder: number; id: string }>(a: T, b: T) =>
  a.displayOrder - b.displayOrder || a.id.localeCompare(b.id);

const col = (name: string) => db().collection(name);

// ---------- Public catalog ----------

export async function listCategories(activeOnly = true): Promise<ServiceCategory[]> {
  const [cats, svcs] = await Promise.all([col(COL.categorias).get(), col(COL.servicios).get()]);
  const services = svcs.docs.map((d) => toService(d.id, d.data())).filter((s) => !activeOnly || s.isActive).sort(byOrder);
  return cats.docs
    .map((c) => ({
      id: c.id,
      name: c.get("nombre") ?? c.id,
      slug: c.get("slug") ?? c.id,
      description: c.get("descripcion") ?? null,
      highlight: c.get("destacado") ?? null,
      displayOrder: Number(c.get("orden")) || 0,
      isActive: c.get("activa") !== false,
      services: services.filter((s) => s.serviceCategoryId === c.id),
    }))
    .filter((c) => !activeOnly || c.isActive)
    .sort(byOrder);
}

export async function listMasseuses(activeOnly = true): Promise<Masseuse[]> {
  const snap = await col(COL.terapeutas).get();
  return snap.docs.map((d) => toMasseuse(d.id, d.data())).filter((m) => !activeOnly || m.isActive).sort(byOrder);
}

// ---------- Admin: team ----------

export async function listMasseusesAdmin(): Promise<MasseuseAdmin[]> {
  const snap = await col(COL.terapeutas).get();
  return snap.docs.map((d) => toMasseuseAdmin(d.id, d.data())).sort(byOrder);
}

export type MasseuseInput = Omit<MasseuseAdmin, "id" | "serviceIds" | "offersHomeVisits">;

/** Age → an approximate birth date (1 January), only when the age actually changes. */
function birthFor(age: number | null, current: Timestamp | null | undefined) {
  if (age === null) return current ?? null;
  if (ageFrom(current) === age) return current;
  return Timestamp.fromDate(new Date(Date.UTC(new Date().getUTCFullYear() - age, 0, 1)));
}

const therapistFields = (m: MasseuseInput, birth: Timestamp | null | undefined) => ({
  nombreArtistico: m.stageName,
  fechaNacimiento: birthFor(m.age, birth),
  bio: m.bio ?? "",
  fotoUrl: m.photoUrl,
  fotos: m.photoGallery,
  telefono: m.whatsAppNumber,
  consentimientoImagen: m.imageConsent,
  activa: m.isActive,
  orden: m.displayOrder,
});

export async function createMasseuse(m: MasseuseInput): Promise<MasseuseAdmin> {
  const ref = col(COL.terapeutas).doc();
  const data = {
    ...therapistFields(m, null),
    nombreLegal: null,
    documentoVerificado: false,
    fechaVerificacion: null,
    limites: "",
    noDomicilios: false,
    comisionPct: null,
    colorAgenda: "#8C6E4A",
    servicioIds: [],
    intervaloMin: 30,
    bufferMin: 0,
    diasLibres: [],
    creadoEn: FieldValue.serverTimestamp(),
  };
  await ref.set(data);
  return toMasseuseAdmin(ref.id, (await ref.get()).data()!);
}

export async function updateMasseuse(id: string, m: MasseuseInput): Promise<MasseuseAdmin | null> {
  const ref = col(COL.terapeutas).doc(id);
  const snap = await ref.get();
  if (!snap.exists) return null;
  await ref.update(therapistFields(m, snap.get("fechaNacimiento")));
  return toMasseuseAdmin(id, (await ref.get()).data()!);
}

/** Deletes her, or only deactivates her when she has sessions on record (the history keeps her name). */
export async function deleteMasseuse(id: string): Promise<boolean> {
  const ref = col(COL.terapeutas).doc(id);
  if (!(await ref.get()).exists) return false;
  const used = await col(COL.citaTerapeutas).where("terapeutaId", "==", id).limit(1).get();
  if (!used.empty) {
    await ref.update({ activa: false });
    return true;
  }
  const blocks = await ref.collection(COL.disponibilidad).get();
  const batch = db().batch();
  blocks.docs.forEach((d) => batch.delete(d.ref));
  batch.delete(ref);
  await batch.commit();
  return true;
}

export async function masseuseExists(id: string) {
  return (await col(COL.terapeutas).doc(id).get()).exists;
}

export async function getSchedule(id: string): Promise<MasseuseSchedule | null> {
  const ref = col(COL.terapeutas).doc(id);
  const [doc, blocks] = await Promise.all([ref.get(), ref.collection(COL.disponibilidad).get()]);
  if (!doc.exists) return null;
  const hours = blocks.docs
    .map((b) => ({ dayOfWeek: Number(b.get("diaSemana")), start: String(b.get("horaInicio")), end: String(b.get("horaFin")) }))
    .sort((a, b) => a.dayOfWeek - b.dayOfWeek || a.start.localeCompare(b.start));
  return {
    slotIntervalMinutes: Number(doc.get("intervaloMin")) || 30,
    bufferMinutes: Number(doc.get("bufferMin")) || 0,
    workingHours: hours,
    timeOff: ((doc.get("diasLibres") ?? []) as { fecha: string; motivo: string | null }[])
      .map((t) => ({ date: t.fecha, note: t.motivo ?? null }))
      .sort((a, b) => a.date.localeCompare(b.date)),
  };
}

/** Replaces her agenda in one batch: the disponibilidad subcollection plus the session settings. */
export async function saveSchedule(
  id: string,
  interval: number,
  buffer: number,
  blocks: { day: number; start: number; end: number }[],
  timeOff: { date: string; note: string | null }[],
) {
  const ref = col(COL.terapeutas).doc(id);
  const existing = await ref.collection(COL.disponibilidad).get();
  const batch = db().batch();
  existing.docs.forEach((d) => batch.delete(d.ref));
  for (const b of blocks) {
    batch.set(ref.collection(COL.disponibilidad).doc(), {
      diaSemana: b.day,
      horaInicio: formatHm(b.start),
      horaFin: formatHm(b.end),
    });
  }
  batch.update(ref, {
    intervaloMin: interval,
    bufferMin: buffer,
    diasLibres: timeOff.map((t) => ({ fecha: t.date, motivo: t.note })),
  });
  await batch.commit();
}

// ---------- Admin: services ----------

export async function listServicesAdmin(): Promise<Service[]> {
  const snap = await col(COL.servicios).get();
  return snap.docs
    .map((d) => toService(d.id, d.data()))
    .sort((a, b) => a.serviceCategoryId.localeCompare(b.serviceCategoryId) || byOrder(a, b));
}

export type ServiceInput = Omit<Service, "id">;

export async function categoryExists(id: string) {
  return (await col(COL.categorias).doc(id).get()).exists;
}

export class DuplicateSlug extends Error {
  code = "23505";
}

const serviceFields = (s: ServiceInput) => ({
  nombre: s.name,
  slug: s.slug,
  categoria: s.serviceCategoryId,
  descripcion: s.shortDescription,
  descripcionLarga: s.longDescription,
  duracionMin: s.durationMinutes,
  precio: s.price,
  numTerapeutas: s.requiresTwoTherapists ? 2 : 1,
  permiteExtension: s.allowsExtraTime,
  opcionVestidura: s.hasSensoryDressOption,
  experienciaPareja: s.isCoupleExperience,
  fotoUrl: s.imageUrl,
  fotos: s.imageGallery,
  incluye: s.highlights,
  activo: s.isActive,
  orden: s.displayOrder,
});

async function assertSlugFree(slug: string, exceptId?: string) {
  const same = await col(COL.servicios).where("slug", "==", slug).get();
  if (same.docs.some((d) => d.id !== exceptId)) throw new DuplicateSlug("slug");
}

/** New services are stored under their slug, like the existing ones. */
export async function createService(s: ServiceInput): Promise<Service> {
  await assertSlugFree(s.slug);
  const ref = col(COL.servicios).doc(s.slug);
  await ref.create({ ...serviceFields(s), bufferMin: 0, permiteDomicilio: true, precioExtension30: 0 }).catch((err) => {
    if (err?.code === 6) throw new DuplicateSlug("slug"); // ALREADY_EXISTS
    throw err;
  });
  return toService(ref.id, (await ref.get()).data()!);
}

export async function updateService(id: string, s: ServiceInput): Promise<Service | null> {
  const ref = col(COL.servicios).doc(id);
  if (!(await ref.get()).exists) return null;
  await assertSlugFree(s.slug, id);
  await ref.update(serviceFields(s));
  return toService(id, (await ref.get()).data()!);
}

export async function deleteService(id: string): Promise<boolean> {
  const ref = col(COL.servicios).doc(id);
  if (!(await ref.get()).exists) return false;
  const used = await col(COL.citas).where("servicioId", "==", id).limit(1).get();
  if (used.empty) await ref.delete();
  else await ref.update({ activo: false });
  return true;
}

// ---------- Booking ----------

export async function getServiceForBooking(id: string) {
  const snap = await col(COL.servicios).doc(id).get();
  return snap.exists ? toService(id, snap.data()!) : null;
}

export async function getMasseuseForBooking(id: string) {
  const snap = await col(COL.terapeutas).doc(id).get();
  return snap.exists ? toMasseuseAdmin(id, snap.data()!) : null;
}

export type AppointmentInput = {
  serviceId: string;
  therapistIds: string[];
  clientName: string;
  clientPhone: string;
  address: string;
  addressDetails: string | null;
  neighborhood: string;
  city: string;
  notes: string | null;
  sensoryDressRequested: boolean;
  extraMinutes: number;
  paymentMethod: PaymentMethod;
  startsAt: string;
  durationMinutes: number;
  totalPrice: number;
  acceptsMarketing: boolean;
};

/** Colombian numbers are typed without the country code; clientes are keyed by E.164 ("+573001234567"). */
export function clientKey(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return `+${digits.length === 10 ? `57${digits}` : digits}`;
}

/**
 * Creates the booking only if every therapist is still free, checked inside a
 * Firestore transaction — two clients tapping the same slot at once can't both
 * get it. Writes the cita (next LA-#### code), one citaTerapeutas per therapist,
 * and the client record the first time they book. Reports which therapist is
 * no longer free otherwise.
 */
export async function createAppointmentIfFree(a: AppointmentInput): Promise<Appointment | { takenBy: "first" | "second" }> {
  const store = db();
  const counterRef = store.collection(COL.meta).doc("contadores");
  const clientRef = store.collection(COL.clientes).doc(clientKey(a.clientPhone));
  const start = localToDate(a.startsAt);
  const end = new Date(start.getTime() + a.durationMinutes * 60_000);

  const code = await store.runTransaction(async (tx) => {
    // Reads first (Firestore transactions require every read before any write).
    for (const [i, id] of a.therapistIds.entries()) {
      const [agenda, busy] = await Promise.all([loadAgenda(id, tx), busyOf(id, tx)]);
      if (!agenda || !slotFits(agenda, busy, a.startsAt, a.durationMinutes)) return { takenBy: i === 0 ? "first" : "second" } as const;
    }
    const [counter, client] = await Promise.all([tx.get(counterRef), tx.get(clientRef)]);

    const next = (Number(counter.get("citas")) || 0) + 1;
    const code = `LA-${String(next).padStart(4, "0")}`;
    const now = FieldValue.serverTimestamp();

    tx.set(counterRef, { citas: next }, { merge: true });
    if (!client.exists) {
      tx.set(clientRef, {
        nombre: a.clientName,
        telefono: clientRef.id,
        email: null,
        notasInternas: "",
        aceptaMarketing: a.acceptsMarketing,
        fechaConsentimiento: a.acceptsMarketing ? now : null,
        origen: "WEB",
        refCampana: null,
        creadoEn: now,
      });
    } else if (a.acceptsMarketing && client.get("aceptaMarketing") !== true) {
      // Opting in again on a later booking; never switches an existing consent off.
      tx.update(clientRef, { aceptaMarketing: true, fechaConsentimiento: now });
    }
    tx.create(store.collection(COL.citas).doc(code), {
      codigo: code,
      clienteId: clientRef.id,
      clienteNombre: a.clientName,
      servicioId: a.serviceId,
      modalidad: "DOMICILIO",
      direccion: a.address,
      detallesDireccion: a.addressDetails,
      barrio: a.neighborhood,
      ciudad: a.city,
      direccionPurgadaEn: null,
      inicio: Timestamp.fromDate(start),
      fin: Timestamp.fromDate(end),
      estado: "PENDIENTE",
      precioAcordado: a.totalPrice,
      metodoPago: PAYMENT_TO_DB[a.paymentMethod],
      minutosExtra: a.extraMinutes,
      vestiduraSensorial: a.sensoryDressRequested,
      notas: a.notes ?? "",
      checkInAt: null,
      checkOutAt: null,
      confirmadaEn: null,
      creadoEn: now,
      actualizadoEn: now,
    });
    for (const therapistId of a.therapistIds) {
      tx.create(store.collection(COL.citaTerapeutas).doc(), {
        citaId: code,
        terapeutaId: therapistId,
        inicio: Timestamp.fromDate(start),
        fin: Timestamp.fromDate(end),
        activo: true,
        aceptadaAt: null,
        slotLockIds: [],
      });
    }
    return code;
  });

  if (typeof code !== "string") return code;
  return (await getAppointment(code))!;
}

type Joined = Appointment & { masseuseWhatsApp: string; secondMasseuseWhatsApp: string | null };

/** Builds the site's appointment view from a cita plus its therapists, service and client. */
function joinAppointment(
  id: string,
  c: DocumentData,
  sessions: DocumentData[],
  therapists: Map<string, DocumentData>,
  services: Map<string, DocumentData>,
  clients: Map<string, DocumentData>,
): Joined {
  const ordered = sessions.slice().sort((x, y) => (x.terapeutaId < y.terapeutaId ? -1 : 1));
  const [first, second] = ordered;
  const start: Date = c.inicio.toDate();
  const end: Date = c.fin.toDate();
  const client = clients.get(c.clienteId);
  const t1 = first ? therapists.get(first.terapeutaId) : undefined;
  const t2 = second ? therapists.get(second.terapeutaId) : undefined;
  return {
    id,
    serviceId: c.servicioId,
    serviceName: services.get(c.servicioId)?.nombre ?? c.servicioId,
    masseuseId: first?.terapeutaId ?? "",
    masseuseName: t1?.nombreArtistico ?? "",
    secondMasseuseId: second?.terapeutaId ?? null,
    secondMasseuseName: t2?.nombreArtistico ?? null,
    clientName: client?.nombre ?? c.clienteNombre ?? "",
    clientPhone: client?.telefono ?? c.clienteId ?? "",
    address: c.direccion ?? "",
    addressDetails: c.detallesDireccion ?? null,
    neighborhood: c.barrio ?? "",
    city: c.ciudad ?? "",
    notes: c.notas || null,
    sensoryDressRequested: c.vestiduraSensorial === true,
    extraMinutes: Number(c.minutosExtra) || 0,
    paymentMethod: PAYMENT_FROM_DB[c.metodoPago] ?? "Cash",
    startsAt: dateToLocal(start),
    endsAt: dateToLocal(end),
    durationMinutes: Math.round((end.getTime() - start.getTime()) / 60_000),
    totalPrice: Number(c.precioAcordado) || 0,
    status: STATUS_FROM_DB[c.estado] ?? "Pending",
    createdAt: c.creadoEn?.toDate?.().toISOString() ?? "",
    confirmedAt: c.confirmadaEn?.toDate?.().toISOString() ?? null,
    masseuseWhatsApp: t1?.telefono ?? "",
    secondMasseuseWhatsApp: t2?.telefono ?? null,
  };
}

const mapOf = (docs: FirebaseFirestore.QueryDocumentSnapshot[]) => new Map(docs.map((d) => [d.id, d.data()]));

export async function getAppointment(id: string): Promise<Joined | null> {
  const store = db();
  const cita = await store.collection(COL.citas).doc(id).get();
  if (!cita.exists) return null;
  const c = cita.data()!;
  const sessions = (await store.collection(COL.citaTerapeutas).where("citaId", "==", id).get()).docs.map((d) => d.data());
  const [therapistDocs, service, client] = await Promise.all([
    Promise.all(sessions.map((s) => store.collection(COL.terapeutas).doc(s.terapeutaId).get())),
    store.collection(COL.servicios).doc(c.servicioId).get(),
    c.clienteId ? store.collection(COL.clientes).doc(c.clienteId).get() : Promise.resolve(null),
  ]);
  return joinAppointment(
    id,
    c,
    sessions,
    new Map(therapistDocs.filter((t) => t.exists).map((t) => [t.id, t.data()!])),
    new Map(service.exists ? [[service.id, service.data()!]] : []),
    new Map(client?.exists ? [[client.id, client.data()!]] : []),
  );
}

/** Admin list. Completed bookings carry the client's personal review link. */
export async function listAppointments(): Promise<Appointment[]> {
  const [citas, sessions, therapists, services, clients, reviewed] = await Promise.all([
    col(COL.citas).get(),
    col(COL.citaTerapeutas).get(),
    col(COL.terapeutas).get(),
    col(COL.servicios).get(),
    col(COL.clientes).get(),
    reviewedAppointmentIds(),
  ]);
  const byCita = new Map<string, DocumentData[]>();
  sessions.docs.forEach((s) => byCita.set(s.get("citaId"), [...(byCita.get(s.get("citaId")) ?? []), s.data()]));
  const t = mapOf(therapists.docs);
  const sv = mapOf(services.docs);
  const cl = mapOf(clients.docs);
  return citas.docs
    .filter((c) => c.get("inicio") && c.get("fin"))
    .map((c) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars -- therapists' phones stay server-side
      const { masseuseWhatsApp, secondMasseuseWhatsApp, ...a } = joinAppointment(c.id, c.data(), byCita.get(c.id) ?? [], t, sv, cl);
      const completed = a.status === "Completed";
      return {
        ...a,
        reviewed: reviewed.has(c.id),
        reviewUrl: completed ? absoluteUrl(`/opinion/${encodeURIComponent(c.id)}?t=${reviewToken(c.id)}`) : null,
      };
    })
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt));
}

/** Status change; a cancellation also releases the therapists' time (citaTerapeutas.activo = false). */
export async function setAppointmentStatus(id: string, status: AppointmentStatus) {
  const store = db();
  const ref = store.collection(COL.citas).doc(id);
  if (!(await ref.get()).exists) return null;
  const batch = store.batch();
  batch.update(ref, {
    estado: STATUS_TO_DB[status],
    actualizadoEn: FieldValue.serverTimestamp(),
    ...(status === "Confirmed" ? { confirmadaEn: FieldValue.serverTimestamp() } : {}),
  });
  if (status === "Cancelled") {
    const sessions = await store.collection(COL.citaTerapeutas).where("citaId", "==", id).get();
    sessions.docs.forEach((s) => batch.update(s.ref, { activo: false }));
  }
  await batch.commit();
  return getAppointment(id);
}

// ---------- Admin users ----------

/** usuarios/{usuario en minúsculas}: login is case-insensitive; inactive users can't sign in. */
export async function findAdmin(username: string) {
  const snap = await col(COL.usuarios).doc(username.trim().toLowerCase()).get();
  const d = snap.data();
  if (!d || d.activo === false) return undefined;
  return { username: snap.id, password_hash: String(d.passwordHash ?? ""), full_name: String(d.nombre ?? snap.id), role: String(d.rol ?? "ADMIN") };
}

/** Stores a new bcrypt hash (same format as the rest of usuarios). */
export async function changeAdminPassword(username: string, password: string) {
  await col(COL.usuarios).doc(username).update({
    passwordHash: hashAdminPassword(password),
    claveActualizadaEn: FieldValue.serverTimestamp(),
  });
}

/** Health check: Firestore reachable and the catalog in place. */
export async function ping() {
  const [services, therapists] = await Promise.all([col(COL.servicios).count().get(), col(COL.terapeutas).count().get()]);
  return { servicios: services.data().count, terapeutas: therapists.data().count };
}
