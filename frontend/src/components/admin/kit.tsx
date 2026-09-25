"use client";

import { useState, type ReactNode } from "react";
import clsx from "clsx";
import { AlertCircle, Loader2 } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { chipClass } from "@/lib/ui";

/** On/off row, same switch as the booking flow's "vestidura sensorial". */
export function SwitchRow({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 py-3">
      <span className="text-sm text-ink">
        {label}
        {hint && <span className="block text-xs text-ink-soft">{hint}</span>}
      </span>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="peer sr-only" />
      <span
        aria-hidden
        className="relative h-7 w-12 shrink-0 rounded-full bg-ink/15 transition-colors duration-200 after:absolute after:left-0.5 after:top-0.5 after:h-6 after:w-6 after:rounded-full after:bg-marfil after:shadow after:transition-transform after:duration-200 peer-checked:bg-ink peer-checked:after:translate-x-5 peer-focus-visible:ring-2 peer-focus-visible:ring-bronze"
      />
    </label>
  );
}

/** Single choice among a few values, as chips. */
export function ChipChoice<T extends string | number>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div role="radiogroup" aria-label={label}>
      <p className="text-sm font-medium text-ink">{label}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={String(o.value)}
            type="button"
            role="radio"
            aria-checked={value === o.value}
            onClick={() => onChange(o.value)}
            className={clsx(chipClass(value === o.value), "min-h-10")}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function ErrorBanner({ children }: { children: ReactNode }) {
  return (
    <div role="alert" className="flex items-start gap-2 rounded-2xl bg-red-50 p-4 text-sm text-red-700">
      <AlertCircle size={16} className="mt-0.5 shrink-0" aria-hidden />
      <div>{children}</div>
    </div>
  );
}

export function LoadingBlock({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center py-20" role="status">
      <Loader2 className="animate-spin text-bronze" size={26} aria-hidden />
      <span className="sr-only">{label}</span>
    </div>
  );
}

/** Primary + secondary action pair for a Modal footer. */
export function SheetActions({
  primaryLabel,
  busyLabel,
  busy,
  disabled,
  onPrimary,
  onCancel,
  danger,
  cancelLabel = "Cancelar",
}: {
  cancelLabel?: string;
  primaryLabel: string;
  busyLabel: string;
  busy: boolean;
  disabled?: boolean;
  onPrimary: () => void;
  onCancel: () => void;
  danger?: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={onCancel}
        className="min-h-12 cursor-pointer rounded-full px-5 text-sm font-semibold text-ink-soft transition-colors hover:text-ink"
      >
        {cancelLabel}
      </button>
      <button
        type="button"
        onClick={onPrimary}
        disabled={busy || disabled}
        className={clsx(
          "flex min-h-12 flex-1 cursor-pointer items-center justify-center gap-2 rounded-full text-[0.95rem] font-semibold transition-[transform,opacity] active:scale-[0.98] disabled:opacity-50",
          danger ? "bg-red-700 text-white" : "bg-ink text-ivory shadow-[0_12px_28px_-14px_rgba(16,16,16,0.7)]",
        )}
      >
        {busy && <Loader2 size={16} className="animate-spin" aria-hidden />}
        {busy ? busyLabel : primaryLabel}
      </button>
    </div>
  );
}

/** In-app confirmation (replaces window.confirm, which looks foreign and blocks the page). */
export function ConfirmDialog({
  title,
  message,
  confirmLabel,
  onConfirm,
  onClose,
}: {
  title: string;
  message: ReactNode;
  confirmLabel: string;
  onConfirm: () => Promise<void> | void;
  onClose: () => void;
}) {
  const [busy, setBusy] = useState(false);
  return (
    <Modal
      title={title}
      onClose={onClose}
      size="sm"
      footer={
        <SheetActions
          primaryLabel={confirmLabel}
          busyLabel="Un momento…"
          busy={busy}
          danger
          cancelLabel="Volver"
          onCancel={onClose}
          onPrimary={async () => {
            setBusy(true);
            try {
              await onConfirm();
            } finally {
              setBusy(false);
            }
          }}
        />
      }
    >
      <div className="text-[0.95rem] leading-relaxed text-ink-soft">{message}</div>
    </Modal>
  );
}
