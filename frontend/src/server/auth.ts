import "server-only";
import bcrypt from "bcryptjs";
import { serverSecret } from "./db";
import { createHash, createHmac, pbkdf2Sync, randomBytes, randomUUID, timingSafeEqual } from "node:crypto";

// ---------- Passwords ----------
// usuarios in Firebase store bcrypt hashes ("$2b$…"); PBKDF2 "salt.key" hashes from the
// former .NET API are still accepted.

const ITERATIONS = 100_000;
const KEY_SIZE = 32;

export function hashPassword(password: string): string {
  const salt = randomBytes(16);
  const key = pbkdf2Sync(password, salt, ITERATIONS, KEY_SIZE, "sha256");
  return `${salt.toString("base64")}.${key.toString("base64")}`;
}

/** bcrypt, cost 12 — the format usuarios already uses. */
export function hashAdminPassword(password: string): string {
  return bcrypt.hashSync(password, 12);
}

export function verifyPassword(password: string, hashed: string): boolean {
  if (/^\$2[aby]\$/.test(hashed)) return bcrypt.compareSync(password, hashed);
  const [saltB64, keyB64] = hashed.split(".");
  if (!saltB64 || !keyB64) return false;
  const expected = Buffer.from(keyB64, "base64");
  const actual = pbkdf2Sync(password, Buffer.from(saltB64, "base64"), ITERATIONS, expected.length, "sha256");
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

// ---------- Session tokens (JWT, HS256) ----------

const TOKEN_HOURS = 8;
const ISSUER = "lamour";

/**
 * Signing key: JWT_SECRET when set; otherwise derived from the Firebase
 * service-account private key, a secret only the server has — so a deploy is
 * secure without one more variable to configure.
 */
function signingKey(): Buffer {
  const explicit = process.env.JWT_SECRET;
  if (explicit) return Buffer.from(explicit);
  const secret = serverSecret();
  if (!secret) throw new Error("Falta JWT_SECRET o FIREBASE_SERVICE_ACCOUNT para firmar sesiones.");
  return createHash("sha256").update(`lamour-session:${secret}`).digest();
}

/**
 * Short signature for a booking's personal review link: only whoever received the link
 * can review that booking, and codes can't be guessed or enumerated.
 */
export function reviewToken(appointmentId: string): string {
  return createHmac("sha256", signingKey()).update(`review:${appointmentId}`).digest("base64url").slice(0, 22);
}

export function isValidReviewToken(appointmentId: string, token: string): boolean {
  const expected = Buffer.from(reviewToken(appointmentId));
  const given = Buffer.from(token);
  return given.length === expected.length && timingSafeEqual(given, expected);
}

const b64url = (input: Buffer | string) => Buffer.from(input).toString("base64url");

export type AdminClaims = { sub: string; name: string; role: string; exp: number };

export function signToken(user: { username: string; fullName: string; role: string }) {
  const expiresAt = new Date(Date.now() + TOKEN_HOURS * 3_600_000);
  const header = b64url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = b64url(
    JSON.stringify({
      sub: user.username,
      name: user.fullName,
      role: user.role,
      iss: ISSUER,
      jti: randomUUID(),
      exp: Math.floor(expiresAt.getTime() / 1000),
    }),
  );
  const signature = createHmac("sha256", signingKey()).update(`${header}.${payload}`).digest("base64url");
  return { token: `${header}.${payload}.${signature}`, expiresAt: expiresAt.toISOString() };
}

export function verifyToken(token: string): AdminClaims | null {
  const [header, payload, signature] = token.split(".");
  if (!header || !payload || !signature) return null;
  const expected = createHmac("sha256", signingKey()).update(`${header}.${payload}`).digest();
  const given = Buffer.from(signature, "base64url");
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return null;
  try {
    const claims = JSON.parse(Buffer.from(payload, "base64url").toString()) as AdminClaims & { iss?: string };
    if (claims.iss !== ISSUER || typeof claims.exp !== "number" || claims.exp * 1000 < Date.now()) return null;
    return claims;
  } catch {
    return null;
  }
}

/** The admin behind a request's "Authorization: Bearer …" header, or null. */
export function adminFromRequest(request: Request): AdminClaims | null {
  const auth = request.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return null;
  return verifyToken(auth.slice(7));
}
