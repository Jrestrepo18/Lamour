import { SITE } from "@/lib/seo";

/**
 * Identity of the business as the Estatuto del Consumidor (Ley 1480 de 2011, art. 50) and the
 * data-protection rules (Decreto 1074 de 2015, art. 2.2.2.25.3.1) require it to be published.
 * Both legal pages and the footer read from here, so the business data is filled in once.
 *
 * Fields still `null` show a visible "[pendiente]" marker on the site until they are completed.
 */
export const LEGAL = {
  /** Registered name: the owner's full name if a persona natural, or the company name (e.g. "L'AMOUR S.A.S."). */
  legalName: null as string | null,
  tradeName: "L'AMOUR — Estética y Sentidos",
  /** NIT with verification digit, as in the RUT (e.g. "901.234.567-8"). */
  nit: null as string | null,
  /** Address for judicial notices (dirección de notificación judicial), as registered in the RUT / Cámara de Comercio. */
  address: null as string | null,
  city: "Medellín, Antioquia, Colombia",
  /** Mailbox for data-protection requests and PQR. */
  email: null as string | null,
  whatsapp: SITE.whatsapp,
  /** Date these documents take effect (dd de mes de aaaa). Update it — and the version — whenever the text changes. */
  effectiveDate: "28 de septiembre de 2026",
  effectiveDateEn: "28 September 2026",
  /** Stored with every booking as proof of which text the client authorised. */
  policyVersion: "2026-09-28",
} as const;

export const PENDING = "[pendiente]";

/** "+57 323 666 9426" from "573236669426". */
export function formatPhone(e164Digits: string) {
  const m = e164Digits.match(/^57(\d{3})(\d{3})(\d{4})$/);
  return m ? `+57 ${m[1]} ${m[2]} ${m[3]}` : `+${e164Digits}`;
}
