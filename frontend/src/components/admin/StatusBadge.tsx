import clsx from "clsx";
import type { AppointmentStatus } from "@/lib/types";

const STYLES: Record<AppointmentStatus, string> = {
  Pending: "bg-amber-100 text-amber-800 border-amber-300",
  Confirmed: "bg-emerald-100 text-emerald-800 border-emerald-300",
  Completed: "bg-blue-100 text-blue-800 border-blue-300",
  Cancelled: "bg-red-100 text-red-700 border-red-300",
};

const LABELS: Record<AppointmentStatus, string> = {
  Pending: "Pendiente",
  Confirmed: "Confirmada",
  Completed: "Completada",
  Cancelled: "Cancelada",
};

export function StatusBadge({ status }: { status: AppointmentStatus }) {
  return (
    <span className={clsx("rounded-full border px-2.5 py-1 text-[0.65rem] font-sans font-semibold uppercase tracking-wide", STYLES[status])}>
      {LABELS[status]}
    </span>
  );
}
