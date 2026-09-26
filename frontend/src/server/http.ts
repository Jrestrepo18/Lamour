import "server-only";
import { revalidatePath } from "next/cache";
import { adminFromRequest, type AdminClaims } from "./auth";
import { DatabaseNotConfigured } from "./db";

/** Plain-text error body — the admin shows these messages to the user as they are. */
export const fail = (message: string, status = 400) =>
  new Response(message, { status, headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" } });

export const ok = (data: unknown, status = 200) =>
  Response.json(data, { status, headers: { "Cache-Control": "no-store" } });

/**
 * Wraps a route handler: a missing database is a 503 (the site falls back to
 * its demo catalog), a duplicate slug a 400 in words, anything else a logged 500.
 */
export function route<A extends unknown[]>(fn: (...args: A) => Promise<Response>) {
  return async (...args: A): Promise<Response> => {
    try {
      return await fn(...args);
    } catch (err) {
      if (err instanceof DatabaseNotConfigured) return fail(err.message, 503);
      if ((err as { code?: string })?.code === "23505") return fail("Ya existe un registro con ese nombre o dirección (slug).");
      console.error("[api]", err);
      return fail("Error interno del servidor.", 500);
    }
  };
}

/** The signed-in admin, or a 401 response to return as is. */
export function requireAdmin(request: Request): AdminClaims | Response {
  return adminFromRequest(request) ?? fail("Sesión no válida o vencida.", 401);
}

export async function readJson<T = Record<string, unknown>>(request: Request): Promise<T | null> {
  try {
    return (await request.json()) as T;
  } catch {
    return null;
  }
}

/** A Firestore document id from a dynamic segment (no slashes, sane length), or null. */
export function idParam(value: string): string | null {
  const id = decodeURIComponent(value ?? "").trim();
  return id && id.length <= 120 && !id.includes("/") ? id : null;
}

/** Admin edits show on the public pages right away instead of waiting for the next revalidation. */
export function refreshPublicPages() {
  revalidatePath("/", "layout");
  // The public site lives under the [lang] root layout (/servicios is /es/servicios inside).
  revalidatePath("/[lang]", "layout");
}

export const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
export const optStr = (v: unknown) => (typeof v === "string" && v.trim() ? v.trim() : null);
export const id = (v: unknown) => (typeof v === "string" || typeof v === "number" ? idParam(String(v)) : null);
export const int = (v: unknown, fallback = 0) => (Number.isFinite(Number(v)) ? Math.trunc(Number(v)) : fallback);
export const bool = (v: unknown) => v === true;
export const strList = (v: unknown) =>
  Array.isArray(v) ? v.filter((x): x is string => typeof x === "string").map((x) => x.trim()).filter(Boolean) : [];
