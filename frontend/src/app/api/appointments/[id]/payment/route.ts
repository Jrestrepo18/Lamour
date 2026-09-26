import type { PaymentMethod } from "@/lib/types";
import { fail, idParam, ok, optStr, readJson, requireAdmin, route } from "@/server/http";
import { recordPayment } from "@/server/repo";

const METHODS: PaymentMethod[] = ["Cash", "Transfer", "Card"];
type Ctx = { params: Promise<{ id: string }> };

/** Admin: records the payment actually received for a booking (method, COP or USD, amount). */
export const PUT = route(async (request: Request, { params }: Ctx) => {
  const admin = requireAdmin(request);
  if (admin instanceof Response) return admin;
  const id = idParam((await params).id);
  const b = await readJson(request);
  if (!id || !b) return fail("Solicitud no válida.");
  const method = b.method as PaymentMethod;
  const currency = b.currency === "USD" ? "USD" : b.currency === "COP" ? "COP" : null;
  const amount = Math.round(Number(b.amount) * 100) / 100;
  if (!METHODS.includes(method)) return fail("Elige cómo pagó.");
  if (!currency) return fail("Elige la moneda.");
  if (!(amount > 0) || amount > 100_000_000) return fail("Escribe el monto recibido.");
  const updated = await recordPayment(id, { method, currency, amount, note: optStr(b.note)?.slice(0, 200) ?? null });
  if (!updated) return fail("Cita no encontrada.", 404);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- therapists' phones stay server-side
  const { masseuseWhatsApp, secondMasseuseWhatsApp, ...appointment } = updated;
  return ok(appointment);
});
