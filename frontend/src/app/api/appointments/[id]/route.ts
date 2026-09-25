import { fail, idParam, ok, requireAdmin, route } from "@/server/http";
import { getAppointment } from "@/server/repo";

type Ctx = { params: Promise<{ id: string }> };

export const GET = route(async (request: Request, { params }: Ctx) => {
  const admin = requireAdmin(request);
  if (admin instanceof Response) return admin;
  const id = idParam((await params).id);
  const found = id ? await getAppointment(id) : null;
  if (!found) return fail("Cita no encontrada.", 404);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- therapists' phone numbers stay server-side
  const { masseuseWhatsApp, secondMasseuseWhatsApp, ...appointment } = found;
  return ok(appointment);
});
