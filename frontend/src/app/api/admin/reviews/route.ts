import { fail, int, ok, optStr, readJson, refreshPublicPages, requireAdmin, route, str } from "@/server/http";
import { createManualReview, listReviewsAdmin } from "@/server/reviews";

export const GET = route(async (request: Request) => {
  const admin = requireAdmin(request);
  if (admin instanceof Response) return admin;
  return ok(await listReviewsAdmin());
});

/** A real review received by WhatsApp or on Google, typed in by the admin with the client's consent. */
export const POST = route(async (request: Request) => {
  const admin = requireAdmin(request);
  if (admin instanceof Response) return admin;
  const b = await readJson(request);
  const displayName = str(b?.displayName).slice(0, 40);
  const text = str(b?.text).slice(0, 600);
  const rating = int(b?.rating);
  const date = str(b?.date);
  const source = b?.source === "google" ? "google" : "whatsapp";
  if (!displayName) return fail("Escribe el nombre con el que aparece (p. ej. María G.).");
  if (text.length < 10) return fail("Escribe el texto de la opinión.");
  if (rating < 1 || rating > 5) return fail("Elige de 1 a 5 estrellas.");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return fail("Indica la fecha de la opinión.");
  if (b?.consent !== true) return fail("Confirma que es una opinión real y que la clienta autorizó publicarla.");

  const created = await createManualReview({
    displayName,
    text,
    rating,
    date,
    source,
    city: optStr(b?.city)?.slice(0, 60) ?? null,
    serviceName: optStr(b?.serviceName)?.slice(0, 80) ?? null,
  });
  refreshPublicPages();
  return ok(created, 201);
});
