"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import { BadgeCheck, CalendarClock, Plus, UserRound } from "lucide-react";
import {
  adminDeleteMasseuse,
  adminGetMasseuses,
  adminGetSchedule,
  adminSaveSchedule,
  adminUpsertMasseuse,
  ApiError,
} from "@/lib/api";
import type { MasseuseAdmin, MasseuseSchedule } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { StoryAvatar } from "@/components/booking/parts";
import { fieldClass, labelClass } from "@/lib/ui";
import { AdminPageHeader } from "./AdminPageHeader";
import { PhotosField } from "./PhotosField";
import { ScheduleEditor, scheduleProblem } from "./ScheduleEditor";
import { ConfirmDialog, ErrorBanner, LoadingBlock, SheetActions, SwitchRow } from "./kit";

type ProfileForm = {
  stageName: string;
  age: string;
  bio: string;
  photos: string[];
  whatsAppNumber: string;
  displayOrder: number;
  isActive: boolean;
};

const EMPTY_FORM: ProfileForm = {
  stageName: "",
  age: "",
  bio: "",
  photos: [],
  whatsAppNumber: "",
  displayOrder: 0,
  isActive: true,
};

function apiMessage(err: unknown, fallback: string) {
  if (err instanceof ApiError && err.status === 400 && err.message && !err.message.startsWith("{")) return err.message;
  return err instanceof ApiError ? fallback : "No se pudo conectar con el servidor. Revisa que la API esté encendida.";
}

export function MasseusesView({ token }: { token: string }) {
  const [items, setItems] = useState<MasseuseAdmin[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [profileOf, setProfileOf] = useState<MasseuseAdmin | "new" | null>(null);
  const [scheduleOf, setScheduleOf] = useState<MasseuseAdmin | null>(null);

  async function load() {
    setError(null);
    try {
      setItems(await adminGetMasseuses(token));
    } catch (err) {
      setError(apiMessage(err, "No se pudo cargar el equipo."));
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial fetch on mount, not a render loop
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <div>
      <AdminPageHeader
        title="Masajistas"
        description="Su perfil en la web, sus fotos y la agenda en la que se le puede reservar."
        action={
          <Button onClick={() => setProfileOf("new")}>
            <Plus size={16} aria-hidden />
            Nueva
          </Button>
        }
      />

      {error && <div className="mt-6"><ErrorBanner>{error}</ErrorBanner></div>}
      {!items && !error && <LoadingBlock label="Cargando equipo" />}

      {items && items.length === 0 && (
        <p className="mt-12 text-center text-sm text-ink-soft">Aún no hay masajistas. Crea la primera con “Nueva”.</p>
      )}

      <ul className="mt-4 divide-y divide-ink/[0.07]">
        {items?.map((m) => (
          <li key={m.id} className="flex items-center gap-4 py-4">
            <button type="button" onClick={() => setProfileOf(m)} className="shrink-0 cursor-pointer" aria-label={`Editar perfil de ${m.stageName}`}>
              <StoryAvatar masseuse={m} size={56} ring={m.isActive} className={clsx(!m.isActive && "opacity-60")} />
            </button>
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-1.5 truncate font-semibold text-ink">
                {m.stageName}
                {m.isActive && <BadgeCheck size={15} className="shrink-0 fill-gold text-ivory" aria-hidden />}
              </p>
              <p className="truncate text-sm text-ink-soft">
                {m.age != null && `${m.age} años · `}
                {m.isActive ? "Visible" : "Oculta"}
                {` · ${m.photoGallery.length + (m.photoUrl ? 1 : 0)} fotos`}
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              <button type="button" onClick={() => setProfileOf(m)} aria-label={`Perfil de ${m.stageName}`} className={pillClass}>
                <UserRound size={14} aria-hidden />
                <span className="hidden sm:inline">Perfil</span>
              </button>
              <button type="button" onClick={() => setScheduleOf(m)} aria-label={`Horario de ${m.stageName}`} className={pillClass}>
                <CalendarClock size={14} aria-hidden />
                <span className="hidden sm:inline">Horario</span>
              </button>
            </div>
          </li>
        ))}
      </ul>

      {profileOf && (
        <ProfileSheet
          key={profileOf === "new" ? "new" : profileOf.id}
          token={token}
          masseuse={profileOf === "new" ? null : profileOf}
          nextOrder={(items?.length ?? 0) + 1}
          onClose={() => setProfileOf(null)}
          onSaved={(saved, isNew) => {
            setItems((prev) => (isNew ? [...(prev ?? []), saved] : prev?.map((m) => (m.id === saved.id ? saved : m)) ?? [saved]));
            setProfileOf(null);
          }}
          onDeleted={(id) => {
            setItems((prev) => prev?.filter((m) => m.id !== id) ?? null);
            setProfileOf(null);
            load();
          }}
        />
      )}

      {scheduleOf && <ScheduleSheet token={token} masseuse={scheduleOf} onClose={() => setScheduleOf(null)} />}
    </div>
  );
}

const pillClass =
  "inline-flex min-h-10 min-w-10 cursor-pointer items-center justify-center gap-1.5 rounded-full border border-ink/10 bg-marfil px-3 text-sm font-semibold text-ink transition-colors hover:border-gold/50";

function ProfileSheet({
  token,
  masseuse,
  nextOrder,
  onClose,
  onSaved,
  onDeleted,
}: {
  token: string;
  masseuse: MasseuseAdmin | null;
  nextOrder: number;
  onClose: () => void;
  onSaved: (saved: MasseuseAdmin, isNew: boolean) => void;
  onDeleted: (id: number) => void;
}) {
  const [form, setForm] = useState<ProfileForm>(() =>
    masseuse
      ? {
          stageName: masseuse.stageName,
          age: masseuse.age != null ? String(masseuse.age) : "",
          bio: masseuse.bio ?? "",
          photos: [masseuse.photoUrl, ...masseuse.photoGallery].filter(Boolean) as string[],
          whatsAppNumber: masseuse.whatsAppNumber,
          displayOrder: masseuse.displayOrder,
          isActive: masseuse.isActive,
        }
      : { ...EMPTY_FORM, displayOrder: nextOrder },
  );
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const phoneDigits = form.whatsAppNumber.replace(/\D/g, "");
  const problem = !form.stageName.trim()
    ? "Escribe su nombre artístico."
    : phoneDigits.length < 10
      ? "Escribe su WhatsApp con indicativo (ej. 573001234567)."
      : null;

  async function save() {
    if (problem) {
      setError(problem);
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const saved = await adminUpsertMasseuse(
        {
          stageName: form.stageName.trim(),
          age: form.age.trim() ? Number(form.age) : null,
          bio: form.bio.trim() || null,
          photoUrl: form.photos[0] ?? null,
          photoGallery: form.photos.slice(1),
          whatsAppNumber: phoneDigits,
          displayOrder: form.displayOrder,
          isActive: form.isActive,
        },
        token,
        masseuse?.id,
      );
      onSaved(saved, !masseuse);
    } catch (err) {
      setError(apiMessage(err, "No se pudo guardar. Inténtalo de nuevo."));
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <Modal
        title={masseuse ? masseuse.stageName : "Nueva masajista"}
        subtitle={masseuse ? "Perfil" : "Así aparecerá en la web"}
        onClose={onClose}
        footer={
          <SheetActions
            primaryLabel={masseuse ? "Guardar cambios" : "Crear perfil"}
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
            hint="La primera es la foto de perfil; las demás salen en su galería."
            photos={form.photos}
            onChange={(photos) => setForm((f) => ({ ...f, photos }))}
            onBusyChange={setUploading}
            token={token}
          />

          <div className="space-y-4">
            <label className={labelClass}>
              Nombre artístico
              <input
                data-autofocus={!masseuse || undefined}
                className={fieldClass}
                value={form.stageName}
                onChange={(e) => setForm((f) => ({ ...f, stageName: e.target.value }))}
              />
            </label>
            <div className="grid grid-cols-[6rem_1fr] gap-3">
              <label className={labelClass}>
                Edad
                <input
                  type="number"
                  inputMode="numeric"
                  min={18}
                  className={fieldClass}
                  value={form.age}
                  onChange={(e) => setForm((f) => ({ ...f, age: e.target.value }))}
                />
              </label>
              <label className={labelClass}>
                WhatsApp
                <input
                  type="tel"
                  inputMode="tel"
                  placeholder="573001234567"
                  className={fieldClass}
                  value={form.whatsAppNumber}
                  onChange={(e) => setForm((f) => ({ ...f, whatsAppNumber: e.target.value }))}
                />
              </label>
            </div>
            <label className={labelClass}>
              Biografía
              <textarea
                className={`${fieldClass} min-h-24 resize-none`}
                value={form.bio}
                onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
                placeholder="Especialidades, estilo, lo que la hace única…"
              />
            </label>
          </div>

          <div className="border-t border-ink/[0.07]">
            <SwitchRow
              label="Visible en la web"
              hint="Si la apagas, no aparece en el sitio ni se le puede reservar."
              checked={form.isActive}
              onChange={(v) => setForm((f) => ({ ...f, isActive: v }))}
            />
          </div>

          {error && <ErrorBanner>{error}</ErrorBanner>}

          {masseuse && (
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="min-h-11 cursor-pointer text-sm font-semibold text-red-700"
            >
              Eliminar masajista
            </button>
          )}
        </div>
      </Modal>

      {confirmDelete && masseuse && (
        <ConfirmDialog
          title={`¿Eliminar a ${masseuse.stageName}?`}
          message="Dejará de aparecer en la web. Si tiene citas registradas, se oculta en lugar de borrarse para conservar el historial."
          confirmLabel="Eliminar"
          onClose={() => setConfirmDelete(false)}
          onConfirm={async () => {
            try {
              await adminDeleteMasseuse(masseuse.id, token);
              onDeleted(masseuse.id);
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

function ScheduleSheet({ token, masseuse, onClose }: { token: string; masseuse: MasseuseAdmin; onClose: () => void }) {
  const [schedule, setSchedule] = useState<MasseuseSchedule | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    adminGetSchedule(masseuse.id, token)
      .then(setSchedule)
      .catch((err) => setError(apiMessage(err, "No se pudo cargar su horario.")));
  }, [masseuse.id, token]);

  async function save() {
    if (!schedule) return;
    const problem = scheduleProblem(schedule);
    if (problem) {
      setError(problem);
      return;
    }
    setSaving(true);
    setError(null);
    try {
      setSchedule(await adminSaveSchedule(masseuse.id, schedule, token));
      setSaved(true);
      setTimeout(onClose, 700);
    } catch (err) {
      setError(apiMessage(err, "No se pudo guardar el horario."));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal
      title={`Horario de ${masseuse.stageName}`}
      subtitle="Solo se podrán reservar citas dentro de estas horas."
      onClose={onClose}
      size="lg"
      footer={
        <SheetActions
          primaryLabel={saved ? "¡Guardado!" : "Guardar horario"}
          busyLabel="Guardando…"
          busy={saving}
          disabled={!schedule || saved}
          onPrimary={save}
          onCancel={onClose}
        />
      }
    >
      {!schedule && !error && <LoadingBlock label="Cargando horario" />}
      {schedule && (
        <ScheduleEditor
          schedule={schedule}
          onChange={(s) => {
            setSchedule(s);
            setError(null);
          }}
        />
      )}
      {error && <div className="mt-5"><ErrorBanner>{error}</ErrorBanner></div>}
    </Modal>
  );
}
