"use client";

import { useEffect, useState } from "react";
import { AlertCircle, Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { adminDeleteMasseuse, adminGetMasseuses, adminUpsertMasseuse, ApiError } from "@/lib/api";
import type { MasseuseAdmin } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

const EMPTY_FORM = { stageName: "", bio: "", photoUrl: "", whatsAppNumber: "", displayOrder: 0, isActive: true };

export function MasseusesView({ token }: { token: string }) {
  const [items, setItems] = useState<MasseuseAdmin[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<MasseuseAdmin | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  async function load() {
    setError(null);
    try {
      setItems(await adminGetMasseuses(token));
    } catch (err) {
      setError(
        err instanceof ApiError
          ? "No se pudo cargar el equipo."
          : "No se pudo conectar con el servidor de la API .NET.",
      );
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial fetch on mount, not a render loop
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  function openNew() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  }

  function openEdit(m: MasseuseAdmin) {
    setEditing(m);
    setForm({
      stageName: m.stageName,
      bio: m.bio ?? "",
      photoUrl: m.photoUrl ?? "",
      whatsAppNumber: m.whatsAppNumber,
      displayOrder: m.displayOrder,
      isActive: m.isActive,
    });
    setShowForm(true);
  }

  async function handleSave() {
    setSaving(true);
    try {
      const payload = {
        stageName: form.stageName.trim(),
        bio: form.bio.trim() || null,
        photoUrl: form.photoUrl.trim() || null,
        whatsAppNumber: form.whatsAppNumber.trim(),
        displayOrder: form.displayOrder,
        isActive: form.isActive,
      };
      const saved = await adminUpsertMasseuse(payload, token, editing?.id);
      setItems((prev) => {
        if (!prev) return [saved];
        return editing ? prev.map((m) => (m.id === saved.id ? saved : m)) : [...prev, saved];
      });
      setShowForm(false);
    } catch {
      setError("No se pudo guardar la masajista.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("¿Eliminar esta masajista? Ya no aparecerá en la web pública.")) return;
    try {
      await adminDeleteMasseuse(id, token);
      setItems((prev) => prev?.filter((m) => m.id !== id) ?? null);
    } catch {
      setError("No se pudo eliminar. Puede tener citas asociadas.");
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl text-ink">Masajistas</h1>
          <p className="text-sm text-ink-soft">Administra quién aparece disponible en la web pública.</p>
        </div>
        <Button size="md" onClick={openNew}>
          <Plus size={16} />
          Nueva masajista
        </Button>
      </div>

      {error && (
        <div className="mt-6 flex items-start gap-2 rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          {error}
        </div>
      )}

      {!items && !error && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-gold" size={26} />
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items?.map((m) => (
          <div key={m.id} className="rounded-2xl border border-silk bg-white/60 p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-serif text-lg text-ink">{m.stageName}</p>
                <p className="text-xs text-ink-soft">{m.whatsAppNumber}</p>
              </div>
              <span
                className={
                  "rounded-full px-2 py-0.5 text-[0.65rem] font-sans font-semibold " +
                  (m.isActive ? "bg-emerald-100 text-emerald-700" : "bg-silk text-ink-soft")
                }
              >
                {m.isActive ? "Activa" : "Oculta"}
              </span>
            </div>
            {m.bio && <p className="mt-2 line-clamp-2 text-xs text-ink-soft">{m.bio}</p>}
            <div className="mt-4 flex gap-2 border-t border-silk pt-3">
              <button
                type="button"
                onClick={() => openEdit(m)}
                className="flex items-center gap-1 rounded-full border border-silk px-3 py-1.5 text-xs text-ink-soft hover:border-gold/40"
              >
                <Pencil size={12} /> Editar
              </button>
              <button
                type="button"
                onClick={() => handleDelete(m.id)}
                className="flex items-center gap-1 rounded-full border border-red-200 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50"
              >
                <Trash2 size={12} /> Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <Modal title={editing ? "Editar masajista" : "Nueva masajista"} onClose={() => setShowForm(false)}>
          <div className="space-y-3">
            <Field label="Nombre artístico">
              <input
                className="w-full rounded-lg border border-silk px-3 py-2 text-sm outline-none focus:border-gold"
                value={form.stageName}
                onChange={(e) => setForm((f) => ({ ...f, stageName: e.target.value }))}
              />
            </Field>
            <Field label="Número de WhatsApp (con indicativo, sin +)">
              <input
                className="w-full rounded-lg border border-silk px-3 py-2 text-sm outline-none focus:border-gold"
                placeholder="573001234567"
                value={form.whatsAppNumber}
                onChange={(e) => setForm((f) => ({ ...f, whatsAppNumber: e.target.value }))}
              />
            </Field>
            <Field label="Biografía corta">
              <textarea
                className="min-h-20 w-full resize-none rounded-lg border border-silk px-3 py-2 text-sm outline-none focus:border-gold"
                value={form.bio}
                onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
              />
            </Field>
            <Field label="URL de foto (opcional)">
              <input
                className="w-full rounded-lg border border-silk px-3 py-2 text-sm outline-none focus:border-gold"
                value={form.photoUrl}
                onChange={(e) => setForm((f) => ({ ...f, photoUrl: e.target.value }))}
              />
            </Field>
            <label className="flex items-center gap-2 text-sm text-ink">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
                className="h-4 w-4 accent-[var(--color-gold)]"
              />
              Visible en la web pública
            </label>

            <Button className="w-full justify-center" disabled={saving} onClick={handleSave}>
              {saving ? "Guardando…" : "Guardar"}
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1 text-xs font-sans font-medium text-ink-soft">
      {label}
      {children}
    </label>
  );
}
