"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { adminChangePassword, ApiError } from "@/lib/api";
import { getAdminToken } from "@/lib/admin-auth";
import { Modal } from "@/components/ui/Modal";
import { fieldClass, labelClass } from "@/lib/ui";
import { ErrorBanner, SheetActions } from "./kit";

/** The signed-in admin changes their own password (current one required). */
export function ChangePasswordDialog({ onClose }: { onClose: () => void }) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [repeat, setRepeat] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function save() {
    if (next.length < 10) return setError("La nueva contraseña debe tener al menos 10 caracteres.");
    if (next !== repeat) return setError("La confirmación no coincide con la nueva contraseña.");
    const token = getAdminToken();
    if (!token) return setError("Tu sesión venció. Vuelve a ingresar.");
    setBusy(true);
    setError(null);
    try {
      await adminChangePassword(current, next, token);
      setDone(true);
      setTimeout(onClose, 1200);
    } catch (err) {
      setError(
        err instanceof ApiError && err.status === 400 && err.message
          ? err.message
          : "No se pudo cambiar la contraseña. Inténtalo de nuevo.",
      );
    } finally {
      setBusy(false);
    }
  }

  const type = show ? "text" : "password";

  return (
    <Modal
      title="Cambiar contraseña"
      subtitle="La usarás la próxima vez que ingreses al panel."
      onClose={onClose}
      size="sm"
      footer={
        <SheetActions
          primaryLabel={done ? "¡Contraseña cambiada!" : "Guardar contraseña"}
          busyLabel="Guardando…"
          busy={busy}
          disabled={done || !current || !next || !repeat}
          onPrimary={save}
          onCancel={onClose}
        />
      }
    >
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          save();
        }}
      >
        <input type="text" name="username" autoComplete="username" hidden readOnly value="" />
        <label className={labelClass}>
          Contraseña actual
          <input data-autofocus type={type} className={fieldClass} value={current} onChange={(e) => setCurrent(e.target.value)} autoComplete="current-password" />
        </label>
        <label className={labelClass}>
          Nueva contraseña
          <input type={type} className={fieldClass} value={next} onChange={(e) => setNext(e.target.value)} autoComplete="new-password" />
          <span className="text-xs font-normal text-ink-soft">Mínimo 10 caracteres.</span>
        </label>
        <label className={labelClass}>
          Repite la nueva contraseña
          <input type={type} className={fieldClass} value={repeat} onChange={(e) => setRepeat(e.target.value)} autoComplete="new-password" />
        </label>
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          className="inline-flex min-h-10 cursor-pointer items-center gap-1.5 text-sm font-semibold text-ink-soft hover:text-ink"
        >
          {show ? <EyeOff size={15} aria-hidden /> : <Eye size={15} aria-hidden />}
          {show ? "Ocultar contraseñas" : "Mostrar contraseñas"}
        </button>
        {error && <ErrorBanner>{error}</ErrorBanner>}
        <button type="submit" hidden />
      </form>
    </Modal>
  );
}
