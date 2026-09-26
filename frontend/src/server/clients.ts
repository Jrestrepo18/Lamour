import "server-only";
import { FieldValue, type DocumentData } from "firebase-admin/firestore";
import type { Client } from "@/lib/types";
import { COL, db } from "./db";
import { dateToLocal } from "./time";

/*
 * Firestore: clientes/{E.164 phone}
 *   nombre, telefono, email, notasInternas, aceptaMarketing, fechaConsentimiento,
 *   origen, refCampana, creadoEn.
 * The list also includes anyone who booked before their client record existed:
 * every cita carries clienteId + clienteNombre, so no one is left out.
 */

const iso = (v: unknown) => (v && typeof v === "object" && "toDate" in v ? (v as { toDate(): Date }).toDate().toISOString() : null);

export async function listClients(): Promise<Client[]> {
  const store = db();
  const [clientes, citas, servicios] = await Promise.all([
    store.collection(COL.clientes).get(),
    store.collection(COL.citas).get(),
    store.collection(COL.servicios).get(),
  ]);
  const serviceName = new Map(servicios.docs.map((s) => [s.id, (s.get("nombre") as string) ?? s.id]));

  const byId = new Map<string, Client>();
  const blank = (phone: string, name: string): Client => ({
    phone,
    name,
    notes: "",
    acceptsMarketing: false,
    consentAt: null,
    createdAt: null,
    bookings: 0,
    completed: 0,
    totalSpent: 0,
    lastVisit: null,
    lastService: null,
  });

  for (const c of clientes.docs) {
    const d = c.data();
    byId.set(c.id, {
      ...blank(c.id, d.nombre ?? ""),
      notes: d.notasInternas ?? "",
      acceptsMarketing: d.aceptaMarketing === true,
      consentAt: iso(d.fechaConsentimiento),
      createdAt: iso(d.creadoEn),
    });
  }

  for (const c of citas.docs) {
    const d: DocumentData = c.data();
    const phone: string = d.clienteId ?? "";
    if (!phone) continue;
    const client = byId.get(phone) ?? blank(phone, d.clienteNombre ?? "");
    if (!client.name) client.name = d.clienteNombre ?? "";
    if (d.estado === "CANCELADA") {
      byId.set(phone, client);
      continue;
    }
    client.bookings += 1;
    const start = d.inicio?.toDate?.() as Date | undefined;
    if (d.estado === "COMPLETADA") {
      client.completed += 1;
      client.totalSpent += Number(d.precioAcordado) || 0;
    }
    if (start && (!client.lastVisit || dateToLocal(start) > client.lastVisit)) {
      client.lastVisit = dateToLocal(start);
      client.lastService = serviceName.get(d.servicioId) ?? null;
    }
    byId.set(phone, client);
  }

  return [...byId.values()].sort((a, b) => (b.lastVisit ?? "").localeCompare(a.lastVisit ?? "") || a.name.localeCompare(b.name));
}

/**
 * Admin edits: name, internal notes, and the promotions consent the client gave
 * (booking checkbox or by WhatsApp). Turning consent on stamps the date; off clears it.
 */
export async function updateClient(phone: string, change: { name?: string; notes?: string; acceptsMarketing?: boolean }) {
  const ref = db().collection(COL.clientes).doc(phone);
  const snap = await ref.get();
  const patch: DocumentData = {};
  if (change.name !== undefined) patch.nombre = change.name;
  if (change.notes !== undefined) patch.notasInternas = change.notes;
  if (change.acceptsMarketing !== undefined && change.acceptsMarketing !== (snap.get("aceptaMarketing") === true)) {
    patch.aceptaMarketing = change.acceptsMarketing;
    patch.fechaConsentimiento = change.acceptsMarketing ? FieldValue.serverTimestamp() : null;
  }
  if (!snap.exists) {
    Object.assign(patch, { telefono: phone, email: null, origen: "WEB", refCampana: null, creadoEn: FieldValue.serverTimestamp() });
    patch.nombre ??= "";
    patch.notasInternas ??= "";
    patch.aceptaMarketing ??= false;
    patch.fechaConsentimiento ??= null;
  }
  await ref.set(patch, { merge: true });
}
