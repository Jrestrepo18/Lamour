import { isValidReviewToken } from "@/server/auth";
import { bool, fail, idParam, int, ok, readJson, route, str } from "@/server/http";
import { reviewContext, submitAppointmentReview } from "@/server/reviews";

/**
 * Public: a client reviews their own completed booking through the personal link
 * the admin sent them (booking code + signature). One review per booking.
 */
export const POST = route(async (request: Request) => {
  const b = await readJson(request);
  const appointmentId = idParam(str(b?.appointmentId));
  const token = str(b?.token);
  if (!appointmentId || !token || !isValidReviewToken(appointmentId, token)) {
    return fail("Este enlace de opinión no es válido.", 403);
  }

  const rating = int(b?.rating);
  const text = str(b?.text).replace(/\s+\n/g, "\n").slice(0, 600);
  const displayName = str(b?.displayName).slice(0, 40);
  if (rating < 1 || rating > 5) return fail("Elige de 1 a 5 estrellas.");
  if (text.length < 10) return fail("Cuéntanos un poco más (mínimo 10 caracteres).");
  if (!displayName) return fail("Escribe cómo quieres aparecer.");
  if (!bool(b?.consent)) return fail("Necesitamos tu autorización para publicar la opinión.");

  const ctx = await reviewContext(appointmentId);
  if (!ctx) return fail("No encontramos esa cita.", 404);
  if (!ctx.completed) return fail("Podrás opinar cuando tu cita esté completada.", 409);

  const result = await submitAppointmentReview(ctx, { rating, text, displayName });
  if (result === "duplicate") return fail("Ya recibimos tu opinión sobre esta cita. ¡Gracias!", 409);
  return ok({ ok: true }, 201);
});
