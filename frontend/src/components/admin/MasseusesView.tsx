"use client";

import { useEffect, useState } from "react";
import { AlertCircle, Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { adminDeleteMasseuse, adminGetMasseuses, adminUpsertMasseuse, ApiError } from "@/lib/api";
import type { MasseuseAdmin } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { fieldClass, labelClass, surfaceClass } from "@/lib/ui";
import { ImageUploadField } from "./ImageUploadField";
import { GalleryUploadField } from "./GalleryUploadField";
import { AdminPageHeader } from "./AdminPageHeader";

const EMPTY_FORM = {
  stageName: "",
  age: "",
  bio: "",
  photoUrl: "",
  photoGallery: [] as string[],
  whatsAppNumber: "",
  displayOrder: 0,
  isActive: true,
};

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
      age: m.age != null ? String(m.age) : "",
      bio: m.bio ?? "",
      photoUrl: m.photoUrl ?? "",
      photoGallery: m.photoGallery,
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
        age: form.age.trim() ? Number(form.age) : null,
        bio: form.bio.trim() || null,
        photoUrl: form.photoUrl.trim() || null,
        photoGallery: form.photoGallery.map((u) => u.trim()).filter(Boolean),
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
      <AdminPageHeader
        title="Masajistas"
        description="Administra quién aparece disponible en la web pública."
        action={
          <Button onClick={openNew}>
            <Plus size={16} aria-hidden />
            Nueva masajista
          </Button>
        }
      />

      {error && (
        <div className="mt-6 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700" role="alert">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          {error}
        </div>
      )}

      {!items && !error && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-bronze" size={26} aria-label="Cargando" />
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items?.map((m) => (
          <div key={m.id} className={`${surfaceClass} p-6`}>
            <div className="flex items-start justify-between">
              <div>
                <p className="font-serif text-lg text-ink">
                  {m.stageName}
                  {m.age != null && <span className="ml-1.5 text-xs font-sans text-ink-soft">{m.age} años</span>}
                </p>
                <p className="text-xs text-ink-soft">{m.whatsAppNumber}</p>
              </div>
              <span
                className={
                  "rounded-full px-2 py-0.5 text-[0.65rem] font-sans font-semibold " +
                  (m.isActive ? "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200" : "bg-silk text-ink-soft")
                }
              >
                {m.isActive ? "Activa" : "Oculta"}
              </span>
            </div>
            {m.bio && <p className="mt-2 line-clamp-2 text-xs text-ink-soft">{m.bio}</p>}
            <div className="mt-4 flex gap-2 border-t border-ink/15 pt-3">
              <button
                type="button"
                onClick={() => openEdit(m)}
                className="inline-flex min-h-9 cursor-pointer items-center gap-1.5 rounded-full border border-ink/15 px-3.5 text-xs text-ink-soft transition-colors hover:border-gold hover:text-ink"
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
                className={fieldClass}
                value={form.stageName}
                onChange={(e) => setForm((f) => ({ ...f, stageName: e.target.value }))}
              />
            </Field>
            <Field label="Edad (opcional)">
              <input
                type="number"
                className={fieldClass}
                value={form.age}
                onChange={(e) => setForm((f) => ({ ...f, age: e.target.value }))}
              />
            </Field>
            <Field label="Número de WhatsApp (con indicativo, sin +)">
              <input
                className={fieldClass}
                placeholder="573001234567"
                value={form.whatsAppNumber}
                onChange={(e) => setForm((f) => ({ ...f, whatsAppNumber: e.target.value }))}
              />
            </Field>
            <Field label="Biografía corta">
              <textarea
                className={`${fieldClass} min-h-20 resize-none`}
                value={form.bio}
                onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
              />
            </Field>
            <ImageUploadField
              label="Foto principal"
              value={form.photoUrl}
              onChange={(url) => setForm((f) => ({ ...f, photoUrl: url }))}
              token={token}
            />
            <GalleryUploadField
              label="Galería adicional (para el carrusel del modal de detalle)"
              urls={form.photoGallery}
              onChange={(urls) => setForm((f) => ({ ...f, photoGallery: urls }))}
              token={token}
            />
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
    <label className={labelClass}>
      {label}
      {children}
    </label>
  );
}
