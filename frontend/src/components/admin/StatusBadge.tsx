import clsx from "clsx";
import type { AppointmentStatus } from "@/lib/types";

const STYLES: Record<AppointmentStatus, string> = {
  Pending: "bg-gold/15 text-bronze border-gold/40",
  Confirmed: "bg-emerald-50 text-emerald-800 border-emerald-200",
  Completed: "bg-silk text-ink border-ink/15",
  Cancelled: "bg-red-50 text-red-700 border-red-200",
  NoShow: "bg-ink/[0.06] text-ink-soft border-ink/15",
};

const LABELS: Record<AppointmentStatus, string> = {
  Pending: "Pendiente",
  Confirmed: "Confirmada",
  Completed: "Completada",
  Cancelled: "Cancelada",
  NoShow: "No asistió",
};

export function StatusBadge({ status }: { status: AppointmentStatus }) {
  return (
    <span className={clsx("rounded-full border px-2.5 py-1 text-[0.7rem] font-semibold uppercase tracking-wide", STYLES[status])}>
      {LABELS[status]}
    </span>
  );
}
