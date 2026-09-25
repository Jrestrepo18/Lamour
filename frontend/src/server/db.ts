import "server-only";
import { readFileSync } from "node:fs";
import { cert, getApps, initializeApp, type App, type ServiceAccount } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

/**
 * Firebase project "spaapp-adaee": Firestore holds the data (servicios,
 * categorias, terapeutas + disponibilidad, citas, citaTerapeutas, clientes,
 * pagos, usuarios) and Storage the photos. The server uses the Admin SDK with
 * a service-account key:
 *   FIREBASE_SERVICE_ACCOUNT       the key's JSON (raw or base64) — set in Vercel
 *   FIREBASE_SERVICE_ACCOUNT_FILE  path to the JSON file — local development (git-ignored)
 */
export const FIREBASE_PROJECT_ID = "spaapp-adaee";
export const STORAGE_BUCKET = process.env.FIREBASE_STORAGE_BUCKET ?? "spaapp-adaee.firebasestorage.app";

type Key = ServiceAccount & { private_key?: string; project_id?: string };

function readServiceAccount(): Key | null {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (raw) {
    const text = raw.trim().startsWith("{") ? raw : Buffer.from(raw, "base64").toString("utf8");
    return JSON.parse(text) as Key;
  }
  const file = process.env.FIREBASE_SERVICE_ACCOUNT_FILE;
  if (file) return JSON.parse(readFileSync(file, "utf8")) as Key;
  return null;
}

let cachedKey: Key | null | undefined;
function serviceAccount(): Key | null {
  if (cachedKey === undefined) cachedKey = readServiceAccount();
  return cachedKey;
}

export function isDatabaseConfigured(): boolean {
  return serviceAccount() !== null;
}

/** Secret material session tokens can be derived from when JWT_SECRET isn't set. */
export function serverSecret(): string | null {
  return serviceAccount()?.private_key ?? null;
}

export class DatabaseNotConfigured extends Error {
  constructor() {
    super("La base de datos no está configurada (falta FIREBASE_SERVICE_ACCOUNT).");
    this.name = "DatabaseNotConfigured";
  }
}

function app(): App {
  const existing = getApps().find((a) => a.name === "lamour");
  if (existing) return existing;
  const key = serviceAccount();
  if (!key) throw new DatabaseNotConfigured();
  return initializeApp(
    { credential: cert(key), projectId: key.project_id ?? FIREBASE_PROJECT_ID, storageBucket: STORAGE_BUCKET },
    "lamour",
  );
}

export function db(): Firestore {
  return getFirestore(app());
}

export function bucket() {
  return getStorage(app()).bucket(STORAGE_BUCKET);
}

/** Collection names of the existing Firebase model. */
export const COL = {
  categorias: "categorias",
  servicios: "servicios",
  terapeutas: "terapeutas",
  disponibilidad: "disponibilidad",
  citas: "citas",
  citaTerapeutas: "citaTerapeutas",
  clientes: "clientes",
  usuarios: "usuarios",
  meta: "meta",
} as const;
