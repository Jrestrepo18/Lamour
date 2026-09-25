import "server-only";
import type { Appointment } from "@/lib/types";
import { describeLocal } from "./time";

const PAYMENT: Record<string, string> = { Cash: "Efectivo", Transfer: "Transferencia", Card: "Tarjeta (datáfono)" };

/** wa.me link pre-filled with the booking, so the admin forwards it to the assigned therapist in one tap. */
export function assignmentLink(a: Appointment, therapistNumber: string, therapistName: string): string {
  const lines = [
    `Hola ${therapistName}! Tienes una nueva cita confirmada en L'AMOUR:`,
    "",
    `Servicio: ${a.serviceName}`,
    `Fecha y hora: ${describeLocal(a.startsAt)}`,
    `Duración: ${a.durationMinutes} min`,
    `Cliente: ${a.clientName} (${a.clientPhone})`,
    `Dirección: ${a.address}, ${a.neighborhood}, ${a.city}`,
    a.addressDetails ? `Detalles dirección: ${a.addressDetails}` : null,
    `Pago: ${PAYMENT[a.paymentMethod] ?? a.paymentMethod}`,
    a.sensoryDressRequested ? "Incluye vestidura sensorial" : null,
    a.extraMinutes > 0 ? `Tiempo adicional: ${a.extraMinutes} min` : null,
    a.notes ? `Notas: ${a.notes}` : null,
    "",
    "Por favor confirma recibido.",
  ].filter((l) => l !== null);
  return `https://wa.me/${therapistNumber.replace(/\D/g, "")}?text=${encodeURIComponent(lines.join("\n"))}`;
}
