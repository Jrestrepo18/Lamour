import type { PaymentMethod } from "@/lib/types";
import { bool, fail, id, int, ok, optStr, readJson, requireAdmin, route, str } from "@/server/http";
import { createAppointmentIfFree, getMasseuseForBooking, getServiceForBooking, listAppointments } from "@/server/repo";
import { parseLocal } from "@/server/time";

const PAYMENTS: PaymentMethod[] = ["Cash", "Transfer", "Card"];

/** Public: a client's booking request. Everything that matters is re-checked here, never trusted from the form. */
export const POST = route(async (request: Request) => {
  const b = await readJson(request);
  if (!b) return fail("Solicitud no válida.");

  const clientName = str(b.clientName);
  const clientPhone = str(b.clientPhone);
  const address = str(b.address);
  const neighborhood = str(b.neighborhood);
  const startsAt = str(b.startsAt).slice(0, 19);
  if (clientName.length < 2 || clientPhone.replace(/\D/g, "").length < 7 || address.length < 4 || neighborhood.length < 2) {
    return fail("Faltan datos de contacto o de dirección.");
  }
  if (Number.isNaN(parseLocal(startsAt))) return fail("Horario no válido.");
  const paymentMethod = PAYMENTS.includes(b.paymentMethod as PaymentMethod) ? (b.paymentMethod as PaymentMethod) : "Cash";

  const serviceId = id(b.serviceId);
  const service = serviceId ? await getServiceForBooking(serviceId) : null;
  if (!service || !service.isActive) return fail("Servicio no válido.");

  const masseuseId = id(b.masseuseId);
  const masseuse = masseuseId ? await getMasseuseForBooking(masseuseId) : null;
  if (!masseuse || !masseuse.isActive || !masseuse.offersHomeVisits) return fail("Masajista no válida.");
  if (masseuse.serviceIds.length > 0 && !masseuse.serviceIds.includes(service.id)) return fail("Esta masajista no realiza ese servicio.");

  const therapistIds = [masseuse.id];
  if (service.requiresTwoTherapists) {
    const secondId = id(b.secondMasseuseId);
    const second = secondId ? await getMasseuseForBooking(secondId) : null;
    if (!second) return fail("Este servicio requiere una segunda masajista.");
    if (!second.isActive || !second.offersHomeVisits || second.id === masseuse.id) return fail("Segunda masajista no válida.");
    therapistIds.push(second.id);
  }

  const extraMinutes = service.allowsExtraTime ? Math.min(Math.max(0, int(b.extraMinutes)), 120) : 0;
  const duration = service.durationMinutes + extraMinutes;

  const result = await createAppointmentIfFree({
    serviceId: service.id,
    therapistIds,
    clientName: clientName.slice(0, 120),
    clientPhone: clientPhone.slice(0, 40),
    address: address.slice(0, 200),
    addressDetails: optStr(b.addressDetails)?.slice(0, 200) ?? null,
    neighborhood: neighborhood.slice(0, 120),
    city: str(b.city).slice(0, 80) || "Medellín",
    notes: optStr(b.notes)?.slice(0, 1000) ?? null,
    sensoryDressRequested: bool(b.sensoryDressRequested) && service.hasSensoryDressOption,
    extraMinutes,
    paymentMethod,
    startsAt,
    durationMinutes: duration,
    totalPrice: service.price,
    acceptsMarketing: bool(b.acceptsMarketing),
  });
  if ("takenBy" in result) {
    return fail(
      result.takenBy === "first"
        ? "Ese horario ya no está disponible para esta masajista."
        : "Ese horario ya no está disponible para la segunda masajista.",
      409,
    );
  }
  return ok(result, 201);
});

export const GET = route(async (request: Request) => {
  const admin = requireAdmin(request);
  if (admin instanceof Response) return admin;
  return ok(await listAppointments());
});
