"use client";

import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import { BadgeCheck, MessageSquareQuote, Plus, Star } from "lucide-react";
import { adminCreateReview, adminDeleteReview, adminGetReviews, adminUpdateReview, ApiError } from "@/lib/api";
import type { ReviewAdmin, ReviewStatus } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { wrapRailClass } from "@/components/booking/parts";
import { chipClass, fieldClass, labelClass } from "@/lib/ui";
import { AdminPageHeader } from "./AdminPageHeader";
import { ConfirmDialog, ErrorBanner, LoadingBlock, SheetActions } from "./kit";

const TABS: { value: ReviewStatus; label: string }[] = [
  { value: "Pending", label: "Por revisar" },
  { value: "Published", label: "Publicadas" },
  { value: "Hidden", label: "Ocultas" },
];

const SOURCE_LABEL = { appointment: "Cita verificada", whatsapp: "WhatsApp", google: "Google" } as const;

function Stars({ value }: { value: number }) {
  return (
    <span className="inline-flex gap-0.5" aria-label={`${value} de 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} size={15} aria-hidden className={n <= value ? "fill-gold text-gold" : "text-ink/15"} />
      ))}
    </span>
  );
}

function message(err: unknown, fallback: string) {
  if (err instanceof ApiError && err.status === 400 && err.message && !err.message.startsWith("{")) return err.message;
  return fallback;
}

/**
 * Reviews moderation. Clients' own reviews (from their booking link) arrive here to
 * be published or hidden — never edited; the team can reply. Real reviews received
 * elsewhere (WhatsApp, Google) can be added with the client's consent.
 */
export function ReviewsView({ token }: { token: string }) {
  const [items, setItems] = useState<ReviewAdmin[] | null>(null);
  const [tab, setTab] = useState<ReviewStatus>("Pending");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [replying, setReplying] = useState<ReviewAdmin | null>(null);
  const [adding, setAdding] = useState(false);
  const [deleting, setDeleting] = useState<ReviewAdmin | null>(null);

  async function load() {
    setError(null);
    try {
      setItems(await adminGetReviews(token));
    } catch {
      setError("No se pudieron cargar las opiniones.");
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial fetch on mount, not a render loop
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    // Open on "Por revisar" only when something is waiting; otherwise on what's published.
    if (items && tab === "Pending" && !items.some((r) => r.status === "Pending")) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time default tab once data arrives
      setTab("Published");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items === null]);

  async function setStatus(r: ReviewAdmin, status: ReviewStatus) {
    setBusy(r.id);
    try {
      const updated = await adminUpdateReview(r.id, { status }, token);
      setItems((prev) => prev?.map((x) => (x.id === r.id ? updated : x)) ?? null);
    } catch (err) {
      setError(message(err, "No se pudo actualizar la opinión."));
    } finally {
      setBusy(null);
    }
  }

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const r of items ?? []) c[r.status] = (c[r.status] ?? 0) + 1;
    return c;
  }, [items]);
  const published = (items ?? []).filter((r) => r.status === "Published");
  const average = published.length ? published.reduce((s, r) => s + r.rating, 0) / published.length : 0;
  const list = (items ?? []).filter((r) => r.status === tab);

  return (
    <div>
      <AdminPageHeader
        title="Reseñas"
        description="Opiniones reales de clientas. Aparecen en el inicio cuando hay al menos 3 publicadas; no publiques las que describan servicios +18 de forma explícita."
        action={
          <Button onClick={() => setAdding(true)}>
            <Plus size={16} aria-hidden />
            Agregar
          </Button>
        }
      />

      {items && (
        <p className="mt-6 text-sm text-ink-soft">
          <span className="font-semibold text-ink">{published.length} publicadas</span>
          {published.length > 0 && ` · promedio ${average.toFixed(1).replace(".", ",")} de 5`}
          {published.length < 3 && ` · faltan ${3 - published.length} para mostrarse en la web`}
        </p>
      )}

      <div className={clsx(wrapRailClass, "mt-5")}>
        {TABS.map((t) => (
          <button
            key={t.value}
            type="button"
            onClick={() => setTab(t.value)}
            aria-pressed={tab === t.value}
            className={clsx(chipClass(tab === t.value), "min-h-10 shrink-0 whitespace-nowrap")}
          >
            {t.label}
            {counts[t.value] ? <span className="ml-1.5 opacity-60">{counts[t.value]}</span> : null}
          </button>
        ))}
      </div>

      {error && <div className="mt-6"><ErrorBanner>{error}</ErrorBanner></div>}
      {!items && !error && <LoadingBlock label="Cargando opiniones" />}

      {items && list.length === 0 && (
        <div className="mt-14 text-center text-sm text-ink-soft">
          <MessageSquareQuote size={28} className="mx-auto mb-3 text-ink/25" aria-hidden />
          {tab === "Pending"
            ? "No hay opiniones por revisar. Pídelas desde Citas → Completadas → “Pedir opinión”."
            : "Nada por aquí todavía."}
        </div>
      )}

      <ul className="mt-6 space-y-3">
        {list.map((r) => (
          <li key={r.id} className="rounded-[1.5rem] bg-marfil p-5 ring-1 ring-ink/[0.07]">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <Stars value={r.rating} />
              <span className="font-semibold text-ink">{r.displayName}</span>
              {r.city && <span className="text-sm text-ink-soft">· {r.city}</span>}
              <span
                className={clsx(
                  "ml-auto inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold",
                  r.verified ? "bg-gold/15 text-bronze" : "bg-ink/[0.06] text-ink-soft",
                )}
              >
                {r.verified && <BadgeCheck size={13} aria-hidden />}
                {SOURCE_LABEL[r.source]}
              </span>
            </div>
            <p className="mt-3 whitespace-pre-line text-[0.95rem] leading-relaxed text-ink">“{r.text}”</p>
            <p className="mt-2 text-xs text-ink-soft">
              {[r.serviceName, r.date, r.appointmentId].filter(Boolean).join(" · ")}
            </p>
            {r.reply && (
              <p className="mt-3 border-l-2 border-gold/50 pl-3 text-sm text-ink-soft">
                <span className="font-semibold text-ink">Tu respuesta: </span>
                {r.reply}
              </p>
            )}
            <div className="mt-4 flex flex-wrap gap-2">
              {r.status !== "Published" && (
                <button type="button" disabled={busy === r.id} onClick={() => setStatus(r, "Published")} className="min-h-11 cursor-pointer rounded-full bg-ink px-5 text-sm font-semibold text-ivory disabled:opacity-50">
                  Publicar
                </button>
              )}
              {r.status !== "Hidden" && (
                <button type="button" disabled={busy === r.id} onClick={() => setStatus(r, "Hidden")} className="min-h-11 cursor-pointer rounded-full border border-ink/15 bg-ivory px-5 text-sm font-semibold text-ink disabled:opacity-50">
                  Ocultar
                </button>
              )}
              <button type="button" onClick={() => setReplying(r)} className="min-h-11 cursor-pointer rounded-full px-4 text-sm font-semibold text-bronze">
                {r.reply ? "Editar respuesta" : "Responder"}
              </button>
              {r.source !== "appointment" && (
                <button type="button" onClick={() => setDeleting(r)} className="min-h-11 cursor-pointer rounded-full px-4 text-sm font-semibold text-red-700">
                  Borrar
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>

      {replying && (
        <ReplySheet
          review={replying}
          onClose={() => setReplying(null)}
          onSave={async (reply) => {
            const updated = await adminUpdateReview(replying.id, { reply }, token);
            setItems((prev) => prev?.map((x) => (x.id === updated.id ? updated : x)) ?? null);
            setReplying(null);
          }}
        />
      )}

      {adding && (
        <AddReviewSheet
          token={token}
          onClose={() => setAdding(false)}
          onCreated={(created) => {
            setItems((prev) => [created, ...(prev ?? [])]);
            setTab("Published");
            setAdding(false);
          }}
        />
      )}

      {deleting && (
        <ConfirmDialog
          title="¿Borrar esta opinión?"
          message="Solo para opiniones que agregaste por error. Si solo quieres quitarla de la web, usa Ocultar."
          confirmLabel="Borrar"
          onClose={() => setDeleting(null)}
          onConfirm={async () => {
            try {
              await adminDeleteReview(deleting.id, token);
              setItems((prev) => prev?.filter((x) => x.id !== deleting.id) ?? null);
            } catch (err) {
              setError(message(err, "No se pudo borrar."));
            }
            setDeleting(null);
          }}
        />
      )}
    </div>
  );
}

function ReplySheet({ review, onClose, onSave }: { review: ReviewAdmin; onClose: () => void; onSave: (reply: string | null) => Promise<void> }) {
  const [text, setText] = useState(review.reply ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  return (
    <Modal
      title={`Responder a ${review.displayName}`}
      subtitle="La respuesta se muestra debajo de su opinión en la web."
      onClose={onClose}
      size="sm"
      footer={
        <SheetActions
          primaryLabel="Guardar respuesta"
          busyLabel="Guardando…"
          busy={busy}
          onCancel={onClose}
          onPrimary={async () => {
            setBusy(true);
            try {
              await onSave(text.trim() || null);
            } catch {
              setError("No se pudo guardar la respuesta.");
              setBusy(false);
            }
          }}
        />
      }
    >
      <div className="space-y-3">
        <p className="rounded-2xl bg-marfil p-3 text-sm text-ink-soft">“{review.text}”</p>
        <label className={labelClass}>
          Tu respuesta
          <textarea
            data-autofocus
            className={clsx(fieldClass, "min-h-28 resize-none")}
            value={text}
            maxLength={400}
            onChange={(e) => setText(e.target.value)}
            placeholder="Gracias por confiar en nosotras…"
          />
        </label>
        <p className="text-xs text-ink-soft">Responder también las críticas, con calma y sin ponerse a la defensiva, aumenta la confianza de quien lee.</p>
        {error && <ErrorBanner>{error}</ErrorBanner>}
      </div>
    </Modal>
  );
}

function AddReviewSheet({ token, onClose, onCreated }: { token: string; onClose: () => void; onCreated: (r: ReviewAdmin) => void }) {
  const [form, setForm] = useState({
    displayName: "",
    city: "",
    serviceName: "",
    rating: 5,
    text: "",
    date: new Date().toLocaleDateString("en-CA"),
    source: "whatsapp" as "whatsapp" | "google",
    consent: false,
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => setForm((f) => ({ ...f, [k]: v }));

  async function save() {
    setBusy(true);
    setError(null);
    try {
      onCreated(
        await adminCreateReview(
          { ...form, city: form.city.trim() || null, serviceName: form.serviceName.trim() || null, text: form.text.trim(), displayName: form.displayName.trim() },
          token,
        ),
      );
    } catch (err) {
      setError(message(err, "No se pudo guardar la opinión."));
      setBusy(false);
    }
  }

  return (
    <Modal
      title="Agregar opinión real"
      subtitle="Copia una opinión que una clienta te envió por WhatsApp o dejó en Google."
      onClose={onClose}
      footer={<SheetActions primaryLabel="Publicar opinión" busyLabel="Guardando…" busy={busy} disabled={!form.consent} onPrimary={save} onCancel={onClose} />}
    >
      <div className="space-y-4">
        <div>
          <p className="text-sm font-medium text-ink">Calificación</p>
          <div className="mt-1 flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} type="button" aria-label={`${n} estrellas`} aria-pressed={form.rating === n} onClick={() => set("rating", n)} className="flex h-11 w-11 cursor-pointer items-center justify-center">
                <Star size={28} className={n <= form.rating ? "fill-gold text-gold" : "text-ink/20"} />
              </button>
            ))}
          </div>
        </div>
        <label className={labelClass}>
          Texto de la opinión (tal como lo escribió)
          <textarea className={clsx(fieldClass, "min-h-28 resize-none")} value={form.text} maxLength={600} onChange={(e) => set("text", e.target.value)} />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className={labelClass}>
            Nombre visible
            <input className={fieldClass} value={form.displayName} maxLength={40} placeholder="María G." onChange={(e) => set("displayName", e.target.value)} />
          </label>
          <label className={labelClass}>
            Municipio
            <input className={fieldClass} value={form.city} maxLength={60} placeholder="Envigado" onChange={(e) => set("city", e.target.value)} />
          </label>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <label className={labelClass}>
            Servicio
            <input className={fieldClass} value={form.serviceName} maxLength={80} placeholder="Piedras volcánicas" onChange={(e) => set("serviceName", e.target.value)} />
          </label>
          <label className={labelClass}>
            Fecha
            <input type="date" className={fieldClass} value={form.date} onChange={(e) => set("date", e.target.value)} />
          </label>
        </div>
        <div role="radiogroup" aria-label="Dónde la dejó" className="grid grid-cols-2 gap-1 rounded-2xl bg-ink/[0.06] p-1">
          {(["whatsapp", "google"] as const).map((s) => (
            <button key={s} type="button" role="radio" aria-checked={form.source === s} onClick={() => set("source", s)} className={clsx("min-h-11 cursor-pointer rounded-xl text-sm font-medium", form.source === s ? "bg-marfil text-ink shadow-sm" : "text-ink-soft")}>
              {s === "whatsapp" ? "WhatsApp" : "Google"}
            </button>
          ))}
        </div>
        <label className="flex cursor-pointer items-start gap-3 rounded-2xl bg-marfil p-4 text-sm text-ink">
          <input type="checkbox" checked={form.consent} onChange={(e) => set("consent", e.target.checked)} className="mt-0.5 h-5 w-5 shrink-0 accent-[var(--color-ink)]" />
          Confirmo que es una opinión real de una clienta, copiada sin cambios, y que autorizó publicarla.
        </label>
        {error && <ErrorBanner>{error}</ErrorBanner>}
      </div>
    </Modal>
  );
}
