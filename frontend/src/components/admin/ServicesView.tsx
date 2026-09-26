"use client";

import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import { ChevronDown, ChevronRight, ImageOff, Plus, Users } from "lucide-react";
import { adminDeleteService, adminGetServices, adminUpsertService, ApiError, getServiceCategories } from "@/lib/api";
import type { Service, ServiceCategory } from "@/lib/types";
import { CATEGORY_SHORT } from "@/lib/catalog";
import { formatCOP, formatDuration } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { wrapRailClass } from "@/components/booking/parts";
import { chipClass, fieldClass, labelClass } from "@/lib/ui";
import { AdminPageHeader } from "./AdminPageHeader";
import { PhotosField } from "./PhotosField";
import { ConfirmDialog, ErrorBanner, LoadingBlock, SheetActions, SwitchRow } from "./kit";

type FormState = {
  serviceCategoryId: string;
  name: string;
  slug: string;
  shortDescription: string;
  longDescription: string;
  durationMinutes: string;
  price: string;
  photos: string[];
  highlights: string;
  requiresTwoTherapists: boolean;
  hasSensoryDressOption: boolean;
  allowsExtraTime: boolean;
  isCoupleExperience: boolean;
  displayOrder: number;
  isActive: boolean;
  nameEn: string;
  shortEn: string;
  longEn: string;
  highlightsEn: string;
};

const DURATIONS = [30, 45, 60, 75, 90, 120];

/** "Masaje de Piedras Volcánicas" → "masaje-de-piedras-volcanicas" */
function slugify(text: string) {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function apiMessage(err: unknown, fallback: string) {
  if (err instanceof ApiError && err.status === 400 && err.message && !err.message.startsWith("{")) return err.message;
  return err instanceof ApiError ? fallback : "No se pudo conectar con el servidor. Revisa que la API esté encendida.";
}

export function ServicesView({ token }: { token: string }) {
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [services, setServices] = useState<Service[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string | "all">("all");
  const [editing, setEditing] = useState<Service | "new" | null>(null);

  async function load() {
    setError(null);
    try {
      const [cats, svcs] = await Promise.all([getServiceCategories(), adminGetServices(token)]);
      setCategories(cats.data);
      setServices(svcs);
    } catch (err) {
      setError(apiMessage(err, "No se pudieron cargar los servicios."));
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial fetch on mount, not a render loop
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const groups = useMemo(
    () =>
      categories
        .filter((c) => filter === "all" || c.id === filter)
        .map((c) => ({ category: c, items: (services ?? []).filter((s) => s.serviceCategoryId === c.id) })),
    [categories, services, filter],
  );

  return (
    <div>
      <AdminPageHeader
        title="Servicios"
        description="Precios, fotos y qué aparece en la web. Los cambios se ven en el sitio en menos de un minuto."
        action={
          <Button onClick={() => setEditing("new")} disabled={categories.length === 0}>
            <Plus size={16} aria-hidden />
            Nuevo
          </Button>
        }
      />

      {error && <div className="mt-6"><ErrorBanner>{error}</ErrorBanner></div>}
      {!services && !error && <LoadingBlock label="Cargando servicios" />}

      {services && (
        <div className={clsx(wrapRailClass, "mt-6")}>
          <button type="button" onClick={() => setFilter("all")} className={clsx(chipClass(filter === "all"), "min-h-10 shrink-0")}>
            Todos
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setFilter(c.id)}
              className={clsx(chipClass(filter === c.id), "min-h-10 shrink-0 whitespace-nowrap")}
            >
              {CATEGORY_SHORT.es[c.slug] ?? c.name}
            </button>
          ))}
        </div>
      )}

      {groups.map(({ category, items }) => (
        <section key={category.id} className="mt-8">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-bronze">{category.name}</p>
          {items.length === 0 ? (
            <p className="mt-3 text-sm text-ink-soft">Sin servicios en esta categoría.</p>
          ) : (
            <ul className="mt-2 divide-y divide-ink/[0.07]">
              {items.map((s) => (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => setEditing(s)}
                    className="-mx-3 flex w-[calc(100%+1.5rem)] cursor-pointer items-center gap-4 rounded-2xl px-3 py-3 text-left transition-colors hover:bg-marfil/70"
                  >
                    <span className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-silk">
                      {s.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element -- admin-uploaded image served by the API host
                        <img src={s.imageUrl} alt="" className={clsx("h-full w-full object-cover", !s.isActive && "opacity-50")} />
                      ) : (
                        <ImageOff size={18} className="text-ink-soft/50" aria-label="Sin foto" />
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className={clsx("block truncate font-semibold", s.isActive ? "text-ink" : "text-ink-soft")}>{s.name}</span>
                      <span className="mt-0.5 flex flex-wrap items-center gap-x-2 text-sm text-ink-soft">
                        <span>{formatDuration(s.durationMinutes)}</span>
                        <span aria-hidden>·</span>
                        <span className="font-semibold text-ink">{formatCOP(s.price)}</span>
                        {s.requiresTwoTherapists && (
                          <>
                            <span aria-hidden>·</span>
                            <Users size={13} aria-label="2 masajistas" />
                          </>
                        )}
                      </span>
                      {!s.isActive && <span className="mt-1 inline-block rounded-full bg-ink/[0.07] px-2 py-0.5 text-xs text-ink-soft">Oculto</span>}
                    </span>
                    <ChevronRight size={18} className="shrink-0 text-ink-soft/60" aria-hidden />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}

      {editing && (
        <ServiceSheet
          key={editing === "new" ? "new" : editing.id}
          token={token}
          categories={categories}
          service={editing === "new" ? null : editing}
          defaultCategory={filter === "all" ? categories[0]?.id ?? "" : filter}
          onClose={() => setEditing(null)}
          onSaved={(saved, isNew) => {
            setServices((prev) => (isNew ? [...(prev ?? []), saved] : prev?.map((s) => (s.id === saved.id ? saved : s)) ?? [saved]));
            setEditing(null);
          }}
          onDeleted={() => {
            setEditing(null);
            load();
          }}
        />
      )}
    </div>
  );
}

function ServiceSheet({
  token,
  categories,
  service,
  defaultCategory,
  onClose,
  onSaved,
  onDeleted,
}: {
  token: string;
  categories: ServiceCategory[];
  service: Service | null;
  defaultCategory: string;
  onClose: () => void;
  onSaved: (saved: Service, isNew: boolean) => void;
  onDeleted: () => void;
}) {
  const [form, setForm] = useState<FormState>(() =>
    service
      ? {
          serviceCategoryId: service.serviceCategoryId,
          name: service.name,
          slug: service.slug,
          shortDescription: service.shortDescription,
          longDescription: service.longDescription ?? "",
          durationMinutes: String(service.durationMinutes),
          price: String(service.price),
          photos: [service.imageUrl, ...service.imageGallery].filter(Boolean) as string[],
          highlights: service.highlights.join("\n"),
          requiresTwoTherapists: service.requiresTwoTherapists,
          hasSensoryDressOption: service.hasSensoryDressOption,
          allowsExtraTime: service.allowsExtraTime,
          isCoupleExperience: service.isCoupleExperience,
          displayOrder: service.displayOrder,
          isActive: service.isActive,
          nameEn: service.en?.name ?? "",
          shortEn: service.en?.shortDescription ?? "",
          longEn: service.en?.longDescription ?? "",
          highlightsEn: (service.en?.highlights ?? []).join("\n"),
        }
      : {
          serviceCategoryId: defaultCategory,
          name: "",
          slug: "",
          shortDescription: "",
          longDescription: "",
          durationMinutes: "60",
          price: "",
          photos: [],
          highlights: "",
          requiresTwoTherapists: false,
          hasSensoryDressOption: false,
          allowsExtraTime: false,
          isCoupleExperience: false,
          displayOrder: 99,
          isActive: true,
          nameEn: "",
          shortEn: "",
          longEn: "",
          highlightsEn: "",
        },
  );
  const [showEnglish, setShowEnglish] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((f) => ({ ...f, [key]: value }));

  const duration = Number(form.durationMinutes);
  const price = Number(form.price.replace(/\D/g, ""));
  const problem = !form.name.trim()
    ? "Escribe el nombre del servicio."
    : !form.shortDescription.trim()
      ? "Escribe una descripción corta."
      : !(duration > 0)
        ? "Indica la duración en minutos."
        : !(price > 0)
          ? "Indica el precio."
          : null;

  async function save() {
    if (problem) {
      setError(problem);
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const saved = await adminUpsertService(
        {
          serviceCategoryId: form.serviceCategoryId,
          name: form.name.trim(),
          slug: form.slug.trim() || slugify(form.name),
          shortDescription: form.shortDescription.trim(),
          longDescription: form.longDescription.trim() || null,
          durationMinutes: duration,
          price,
          imageUrl: form.photos[0] ?? null,
          imageGallery: form.photos.slice(1),
          highlights: form.highlights.split(/\n|;/).map((h) => h.trim()).filter(Boolean),
          requiresTwoTherapists: form.requiresTwoTherapists,
          hasSensoryDressOption: form.hasSensoryDressOption,
          allowsExtraTime: form.allowsExtraTime,
          isCoupleExperience: form.isCoupleExperience,
          displayOrder: form.displayOrder,
          isActive: form.isActive,
          en: {
            name: form.nameEn.trim(),
            shortDescription: form.shortEn.trim(),
            longDescription: form.longEn.trim() || null,
            highlights: form.highlightsEn.split(/\n|;/).map((h) => h.trim()).filter(Boolean),
          },
        },
        token,
        service?.id,
      );
      onSaved(saved, !service);
    } catch (err) {
      setError(apiMessage(err, "No se pudo guardar. Revisa que el nombre no esté repetido."));
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <Modal
        title={service ? service.name : "Nuevo servicio"}
        subtitle={service ? categories.find((c) => c.id === service.serviceCategoryId)?.name : "Aparecerá en el catálogo y en reservas"}
        onClose={onClose}
        size="lg"
        footer={
          <SheetActions
            primaryLabel={service ? "Guardar cambios" : "Crear servicio"}
            busyLabel="Guardando…"
            busy={saving}
            disabled={uploading}
            onPrimary={save}
            onCancel={onClose}
          />
        }
      >
        <div className="space-y-6">
          <PhotosField
            label="Fotos"
            hint="La primera es la portada del servicio; las demás, su galería."
            photos={form.photos}
            onChange={(photos) => set("photos", photos)}
            onBusyChange={setUploading}
            token={token}
          />

          <div className="space-y-4">
            <label className={labelClass}>
              Nombre
              <input data-autofocus={!service || undefined} className={fieldClass} value={form.name} onChange={(e) => set("name", e.target.value)} />
            </label>

            <label className={labelClass}>
              Categoría
              <span className="relative">
                <select
                  className={clsx(fieldClass, "cursor-pointer appearance-none pr-10")}
                  value={form.serviceCategoryId}
                  onChange={(e) => set("serviceCategoryId", e.target.value)}
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <ChevronDown size={16} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-soft" aria-hidden />
              </span>
            </label>

            <div>
              <p className="text-sm font-medium text-ink">Duración</p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                {DURATIONS.map((d) => (
                  <button
                    key={d}
                    type="button"
                    aria-pressed={duration === d}
                    onClick={() => set("durationMinutes", String(d))}
                    className={clsx(chipClass(duration === d), "min-h-10")}
                  >
                    {formatDuration(d)}
                  </button>
                ))}
                <label className="flex items-center gap-2 text-sm text-ink-soft">
                  <input
                    type="number"
                    inputMode="numeric"
                    min={5}
                    aria-label="Duración en minutos"
                    className="h-10 w-20 rounded-full border border-ink/15 bg-marfil px-3 text-center text-base text-ink outline-none focus:border-gold sm:text-sm"
                    value={form.durationMinutes}
                    onChange={(e) => set("durationMinutes", e.target.value)}
                  />
                  min
                </label>
              </div>
            </div>

            <label className={labelClass}>
              Precio
              <span className="relative">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft">$</span>
                <input
                  inputMode="numeric"
                  className={clsx(fieldClass, "pl-8")}
                  value={form.price ? Number(form.price.replace(/\D/g, "")).toLocaleString("es-CO") : ""}
                  onChange={(e) => set("price", e.target.value.replace(/\D/g, ""))}
                  placeholder="150.000"
                />
              </span>
            </label>

            <label className={labelClass}>
              Descripción corta
              <input
                className={fieldClass}
                value={form.shortDescription}
                onChange={(e) => set("shortDescription", e.target.value)}
                placeholder="Una línea que se ve en el catálogo"
              />
            </label>
          </div>

          <div className="divide-y divide-ink/[0.07] border-y border-ink/[0.07]">
            <SwitchRow label="Visible en la web" checked={form.isActive} onChange={(v) => set("isActive", v)} />
            <SwitchRow label="Requiere 2 masajistas" hint="A cuatro manos" checked={form.requiresTwoTherapists} onChange={(v) => set("requiresTwoTherapists", v)} />
            <SwitchRow label="Experiencia en pareja" checked={form.isCoupleExperience} onChange={(v) => set("isCoupleExperience", v)} />
            <SwitchRow label="Permite tiempo adicional" hint="El cliente puede sumar 15, 30 o 45 min" checked={form.allowsExtraTime} onChange={(v) => set("allowsExtraTime", v)} />
            <SwitchRow label="Opción de vestidura sensorial" checked={form.hasSensoryDressOption} onChange={(v) => set("hasSensoryDressOption", v)} />
          </div>

          <button
            type="button"
            onClick={() => setShowMore((v) => !v)}
            aria-expanded={showMore}
            className="flex min-h-11 w-full cursor-pointer items-center justify-between text-sm font-semibold text-ink"
          >
            Descripción larga y lo que incluye
            <ChevronDown size={18} className={clsx("transition-transform", showMore && "rotate-180")} aria-hidden />
          </button>
          {showMore && (
            <div className="-mt-2 animate-fade-in space-y-4">
              <label className={labelClass}>
                Descripción larga
                <textarea
                  className={`${fieldClass} min-h-28 resize-none`}
                  value={form.longDescription}
                  onChange={(e) => set("longDescription", e.target.value)}
                  placeholder="Qué es, cómo se vive, para quién es…"
                />
              </label>
              <label className={labelClass}>
                <span>
                  Lo que incluye <span className="font-normal text-ink-soft">(uno por línea)</span>
                </span>
                <textarea
                  className={`${fieldClass} min-h-24 resize-none`}
                  value={form.highlights}
                  onChange={(e) => set("highlights", e.target.value)}
                  placeholder={"Aceites tibios\nMúsica y aromas"}
                />
              </label>
            </div>
          )}

          <button
            type="button"
            onClick={() => setShowEnglish((v) => !v)}
            aria-expanded={showEnglish}
            className="flex min-h-11 w-full cursor-pointer items-center justify-between text-sm font-semibold text-ink"
          >
            <span>
              Versión en inglés{" "}
              <span className="font-normal text-ink-soft">
                {form.nameEn.trim() ? "· lista" : "· vacía (se muestra en español)"}
              </span>
            </span>
            <ChevronDown size={18} className={clsx("transition-transform", showEnglish && "rotate-180")} aria-hidden />
          </button>
          {showEnglish && (
            <div className="-mt-2 animate-fade-in space-y-4">
              <p className="text-xs text-ink-soft">
                Lo que ven los visitantes en la página en inglés (/en). Lo que dejes vacío se muestra en español.
              </p>
              <label className={labelClass}>
                Nombre en inglés
                <input className={fieldClass} value={form.nameEn} onChange={(e) => set("nameEn", e.target.value)} placeholder="Classic Relaxation Massage" />
              </label>
              <label className={labelClass}>
                Descripción corta en inglés
                <input className={fieldClass} value={form.shortEn} onChange={(e) => set("shortEn", e.target.value)} />
              </label>
              <label className={labelClass}>
                Descripción larga en inglés
                <textarea className={`${fieldClass} min-h-28 resize-none`} value={form.longEn} onChange={(e) => set("longEn", e.target.value)} />
              </label>
              <label className={labelClass}>
                <span>
                  Lo que incluye en inglés <span className="font-normal text-ink-soft">(uno por línea)</span>
                </span>
                <textarea
                  className={`${fieldClass} min-h-24 resize-none`}
                  value={form.highlightsEn}
                  onChange={(e) => set("highlightsEn", e.target.value)}
                />
              </label>
            </div>
          )}

          {error && <ErrorBanner>{error}</ErrorBanner>}

          {service && (
            <button type="button" onClick={() => setConfirmDelete(true)} className="min-h-11 cursor-pointer text-sm font-semibold text-red-700">
              Eliminar servicio
            </button>
          )}
        </div>
      </Modal>

      {confirmDelete && service && (
        <ConfirmDialog
          title={`¿Eliminar “${service.name}”?`}
          message="Dejará de aparecer en la web y en reservas. Si tiene citas registradas, se oculta en lugar de borrarse."
          confirmLabel="Eliminar"
          onClose={() => setConfirmDelete(false)}
          onConfirm={async () => {
            try {
              await adminDeleteService(service.id, token);
              onDeleted();
            } catch (err) {
              setConfirmDelete(false);
              setError(apiMessage(err, "No se pudo eliminar."));
            }
          }}
        />
      )}
    </>
  );
}
