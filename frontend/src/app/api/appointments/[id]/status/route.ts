import type { AppointmentStatus } from "@/lib/types";
import { fail, idParam, ok, readJson, requireAdmin, route } from "@/server/http";
import { reviewLink, setAppointmentStatus } from "@/server/repo";
import { assignmentLink } from "@/server/whatsapp";

const STATUSES: AppointmentStatus[] = ["Pending", "Confirmed", "Completed", "Cancelled", "NoShow"];
type Ctx = { params: Promise<{ id: string }> };

export const PUT = route(async (request: Request, { params }: Ctx) => {
  const admin = requireAdmin(request);
  if (admin instanceof Response) return admin;
  const id = idParam((await params).id);
  const body = await readJson(request);
  const status = body?.status as AppointmentStatus;
  if (!id) return fail("Cita no válida.", 404);
  if (!STATUSES.includes(status)) return fail("Estado no válido.");

  const updated = await setAppointmentStatus(id, status);
  if (!updated) return fail("Cita no encontrada.", 404);
  const { masseuseWhatsApp, secondMasseuseWhatsApp, ...base } = updated;
  // Same shape as the admin list: a completed booking carries the client's review link right away.
  const appointment = {
    ...base,
    reviewed: false,
    reviewUrl: status === "Completed" ? reviewLink(id, base.language) : null,
  };

  const confirmed = status === "Confirmed";
  return ok({
    appointment,
    // No link without a number on file (the admin can add it in the therapist's profile).
    whatsAppLink: confirmed && masseuseWhatsApp ? assignmentLink(appointment, masseuseWhatsApp, appointment.masseuseName) : "",
    secondWhatsAppLink:
      confirmed && secondMasseuseWhatsApp && appointment.secondMasseuseName
        ? assignmentLink(appointment, secondMasseuseWhatsApp, appointment.secondMasseuseName)
        : null,
  });
});
