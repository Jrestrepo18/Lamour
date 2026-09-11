"use client";

import { useEffect, useState } from "react";
import { AlertCircle, Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { adminDeleteService, adminGetServices, adminUpsertService, ApiError, getServiceCategories } from "@/lib/api";
import type { Service, ServiceCategory } from "@/lib/types";
import { formatCOP, formatDuration } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

type FormState = {
  serviceCategoryId: number;
  name: string;
  slug: string;
  shortDescription: string;
  longDescription: string;
  durationMinutes: number;
  price: number;
  imageUrl: string;
  highlights: string;
  requiresTwoTherapists: boolean;
  hasSensoryDressOption: boolean;
  allowsExtraTime: boolean;
  isCoupleExperience: boolean;
  displayOrder: number;
  isActive: boolean;
};

function emptyForm(categoryId: number): FormState {
  return {
    serviceCategoryId: categoryId,
    name: "",
    slug: "",
    shortDescription: "",
    longDescription: "",
    durationMinutes: 60,
    price: 150000,
    imageUrl: "",
    highlights: "",
    requiresTwoTherapists: false,
    hasSensoryDressOption: false,
    allowsExtraTime: false,
    isCoupleExperience: false,
    displayOrder: 0,
    isActive: true,
  };
}

export function ServicesView({ token }: { token: string }) {
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [services, setServices] = useState<Service[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Service | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm(0));
  const [saving, setSaving] = useState(false);

  async function load() {
    setError(null);
    try {
      const [cats, svcs] = await Promise.all([getServiceCategories(), adminGetServices(token)]);
      setCategories(cats.data);
      setServices(svcs);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? "No se pudo cargar los servicios."
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
    setForm(emptyForm(categories[0]?.id ?? 0));
    setShowForm(true);
  }

  function openEdit(s: Service) {
    setEditing(s);
    setForm({
      serviceCategoryId: s.serviceCategoryId,
      name: s.name,
      slug: s.slug,
      shortDescription: s.shortDescription,
      longDescription: s.longDescription ?? "",
      durationMinutes: s.durationMinutes,
      price: s.price,
      imageUrl: s.imageUrl ?? "",
      highlights: s.highlights.join("; "),
      requiresTwoTherapists: s.requiresTwoTherapists,
      hasSensoryDressOption: s.hasSensoryDressOption,
      allowsExtraTime: s.allowsExtraTime,
      isCoupleExperience: s.isCoupleExperience,
      displayOrder: s.displayOrder,
      isActive: s.isActive,
    });
    setShowForm(true);
  }

  async function handleSave() {
    setSaving(true);
    try {
      const payload = {
        serviceCategoryId: form.serviceCategoryId,
        name: form.name.trim(),
        slug: form.slug.trim() || form.name.trim().toLowerCase().replace(/\s+/g, "-"),
        shortDescription: form.shortDescription.trim(),
        longDescription: form.longDescription.trim() || null,
        durationMinutes: form.durationMinutes,
        price: form.price,
        imageUrl: form.imageUrl.trim() || null,
        highlights: form.highlights.split(";").map((h) => h.trim()).filter(Boolean),
        requiresTwoTherapists: form.requiresTwoTherapists,
        hasSensoryDressOption: form.hasSensoryDressOption,
        allowsExtraTime: form.allowsExtraTime,
        isCoupleExperience: form.isCoupleExperience,
        displayOrder: form.displayOrder,
        isActive: form.isActive,
      };
      const saved = await adminUpsertService(payload, token, editing?.id);
      setServices((prev) => {
        if (!prev) return [saved];
        return editing ? prev.map((s) => (s.id === saved.id ? saved : s)) : [...prev, saved];
      });
      setShowForm(false);
    } catch {
      setError("No se pudo guardar el servicio.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("¿Eliminar este servicio?")) return;
    try {
      await adminDeleteService(id, token);
      setServices((prev) => prev?.filter((s) => s.id !== id) ?? null);
    } catch {
      setError("No se pudo eliminar. Puede tener citas asociadas.");
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl text-ink">Servicios</h1>
          <p className="text-sm text-ink-soft">Crea, edita precios y desactiva servicios al instante.</p>
        </div>
        <Button size="md" onClick={openNew} disabled={categories.length === 0}>
          <Plus size={16} />
          Nuevo servicio
        </Button>
      </div>

      {error && (
        <div className="mt-6 flex items-start gap-2 rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          {error}
        </div>
      )}

      {!services && !error && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-gold" size={26} />
        </div>
      )}

      <div className="mt-6 overflow-x-auto rounded-2xl border border-silk">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-silk/40 text-xs font-sans uppercase tracking-wide text-ink-soft">
            <tr>
              <th className="px-4 py-3">Servicio</th>
              <th className="px-4 py-3">Categoría</th>
              <th className="px-4 py-3">Duración</th>
              <th className="px-4 py-3">Precio</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-silk">
            {services?.map((s) => (
              <tr key={s.id} className="bg-white/50">
                <td className="px-4 py-3 font-serif text-ink">{s.name}</td>
                <td className="px-4 py-3 text-ink-soft">
                  {categories.find((c) => c.id === s.serviceCategoryId)?.name ?? "—"}
                </td>
                <td className="px-4 py-3 text-ink-soft">{formatDuration(s.durationMinutes)}</td>
                <td className="px-4 py-3 text-ink">{formatCOP(s.price)}</td>
                <td className="px-4 py-3">
                  <span
                    className={
                      "rounded-full px-2 py-0.5 text-[0.65rem] font-sans font-semibold " +
                      (s.isActive ? "bg-emerald-100 text-emerald-700" : "bg-silk text-ink-soft")
                    }
                  >
                    {s.isActive ? "Activo" : "Oculto"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button type="button" onClick={() => openEdit(s)} className="text-ink-soft hover:text-gold-dark">
                      <Pencil size={15} />
                    </button>
                    <button type="button" onClick={() => handleDelete(s.id)} className="text-ink-soft hover:text-red-600">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <Modal title={editing ? "Editar servicio" : "Nuevo servicio"} onClose={() => setShowForm(false)}>
          <div className="space-y-3">
            <Field label="Categoría">
              <select
                className="w-full rounded-lg border border-silk px-3 py-2 text-sm outline-none focus:border-gold"
                value={form.serviceCategoryId}
                onChange={(e) => setForm((f) => ({ ...f, serviceCategoryId: Number(e.target.value) }))}
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Nombre">
              <input
                className="w-full rounded-lg border border-silk px-3 py-2 text-sm outline-none focus:border-gold"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
            </Field>
            <Field label="Descripción corta">
              <input
                className="w-full rounded-lg border border-silk px-3 py-2 text-sm outline-none focus:border-gold"
                value={form.shortDescription}
                onChange={(e) => setForm((f) => ({ ...f, shortDescription: e.target.value }))}
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Duración (min)">
                <input
                  type="number"
                  className="w-full rounded-lg border border-silk px-3 py-2 text-sm outline-none focus:border-gold"
                  value={form.durationMinutes}
                  onChange={(e) => setForm((f) => ({ ...f, durationMinutes: Number(e.target.value) }))}
                />
              </Field>
              <Field label="Precio (COP)">
                <input
                  type="number"
                  className="w-full rounded-lg border border-silk px-3 py-2 text-sm outline-none focus:border-gold"
                  value={form.price}
                  onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) }))}
                />
              </Field>
            </div>
            <Field label="Highlights (separados por ;)">
              <input
                className="w-full rounded-lg border border-silk px-3 py-2 text-sm outline-none focus:border-gold"
                value={form.highlights}
                onChange={(e) => setForm((f) => ({ ...f, highlights: e.target.value }))}
              />
            </Field>

            <div className="grid grid-cols-2 gap-2 text-sm text-ink">
              <Checkbox label="2 masajistas" checked={form.requiresTwoTherapists} onChange={(v) => setForm((f) => ({ ...f, requiresTwoTherapists: v }))} />
              <Checkbox label="Vestidura sensorial" checked={form.hasSensoryDressOption} onChange={(v) => setForm((f) => ({ ...f, hasSensoryDressOption: v }))} />
              <Checkbox label="Tiempo adicional" checked={form.allowsExtraTime} onChange={(v) => setForm((f) => ({ ...f, allowsExtraTime: v }))} />
              <Checkbox label="Experiencia en pareja" checked={form.isCoupleExperience} onChange={(v) => setForm((f) => ({ ...f, isCoupleExperience: v }))} />
              <Checkbox label="Activo" checked={form.isActive} onChange={(v) => setForm((f) => ({ ...f, isActive: v }))} />
            </div>

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

function Checkbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4 accent-[var(--color-gold)]" />
      {label}
    </label>
  );
}
