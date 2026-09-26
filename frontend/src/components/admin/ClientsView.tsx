"use client";

import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import { Check, Megaphone, NotebookPen, Pencil, Search } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { wrapRailClass } from "@/components/booking/parts";
import { useAutoRefresh } from "@/hooks/useAutoRefresh";
import { adminGetClients, adminUpdateClient } from "@/lib/api";
import { formatCOP } from "@/lib/format";
import type { Client } from "@/lib/types";
import { chipClass, fieldClass, labelClass } from "@/lib/ui";
import { AdminPageHeader } from "./AdminPageHeader";
import { ErrorBanner, LoadingBlock, SheetActions, SwitchRow } from "./kit";

type Filter = "all" | "optin" | "repeat" | "away";

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "optin", label: "Aceptan promociones" },
  { value: "repeat", label: "Recurrentes" },
  { value: "away", label: "Sin volver +60 días" },
];

const OPT_OUT = "Si no quieres recibir más promociones, responde NO.";
const DAY = 86_400_000;

const digits = (phone: string) => phone.replace(/\D/g, "");
const firstName = (name: string) => name.trim().split(/\s+/)[0] ?? "";
const waLink = (phone: string, text?: string) =>
  `https://wa.me/${digits(phone)}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
/** "+573001234567" → "300 123 4567" for Colombian numbers; others as stored. */
const prettyPhone = (phone: string) => {
  const d = digits(phone);
  return d.length === 12 && d.startsWith("57") ? `${d.slice(2, 5)} ${d.slice(5, 8)} ${d.slice(8)}` : phone;
};
const daysSince = (local: string | null) => (local ? Math.floor((Date.now() - new Date(local).getTime()) / DAY) : null);

function matches(c: Client, filter: Filter) {
  if (filter === "optin") return c.acceptsMarketing;
  if (filter === "repeat") return c.completed >= 2;
  if (filter === "away") return (daysSince(c.lastVisit) ?? 0) > 60;
  return true;
}

function lastVisitLabel(c: Client) {
  const days = daysSince(c.lastVisit);
  if (days === null) return "Sin citas";
  if (days < 0) return "Cita próxima";
  if (days === 0) return "Hoy";
  if (days === 1) return "Ayer";
  if (days < 60) return `Hace ${days} días`;
  return `Hace ${Math.round(days / 30)} meses`;
}

/**
 * Everyone who has booked, with their history, and a WhatsApp campaign sender.
 * Promotions go only to clients who opted in (booking checkbox, or told the team),
 * as Colombian data law (Ley 1581) and WhatsApp's own rules require.
 */
export function ClientsView({ token }: { token: string }) {
  const [clients, setClients] = useState<Client[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<Client | null>(null);
  const [campaign, setCampaign] = useState(false);

  async function load(silent = false) {
    if (!silent) setError(null);
    try {
      setClients(await adminGetClients(token));
    } catch {
      if (!silent) setError("No se pudieron cargar los clientes.");
    }
  }

  useAutoRefresh(() => load(true), 30_000);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial fetch on mount
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const q = query.trim().toLowerCase();
  const list = useMemo(
    () =>
      (clients ?? []).filter(
        (c) => matches(c, filter) && (!q || c.name.toLowerCase().includes(q) || digits(c.phone).includes(q.replace(/\D/g, "") || "§")),
      ),
    [clients, filter, q],
  );
  const optedIn = (clients ?? []).filter((c) => c.acceptsMarketing);

  return (
    <div>
      <AdminPageHeader
        title="Clientes"
        description="Todas las personas que han reservado, con su historial. Las promociones solo se envían a quienes aceptaron recibirlas."
        action={
          <Button onClick={() => setCampaign(true)} disabled={!clients}>
            <Megaphone size={16} aria-hidden />
            Mensaje masivo
          </Button>
        }
      />

      {clients && (
        <p className="mt-6 text-sm text-ink-soft">
          <span className="font-semibold text-ink">{clients.length} {clients.length === 1 ? "cliente" : "clientes"}</span> · {optedIn.length}{" "}
          {optedIn.length === 1 ? "acepta" : "aceptan"} promociones
        </p>
      )}

      <label className="relative mt-5 block">
        <span className="sr-only">Buscar cliente</span>
        <Search size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft" aria-hidden />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por nombre o teléfono"
          className={clsx(fieldClass, "pl-11")}
        />
      </label>

      <div className={clsx(wrapRailClass, "mt-4")}>
        {FILTERS.map((f) => {
          const count = (clients ?? []).filter((c) => matches(c, f.value)).length;
          return (
            <button
              key={f.value}
              type="button"
              onClick={() => setFilter(f.value)}
              aria-pressed={filter === f.value}
              className={clsx(chipClass(filter === f.value), "min-h-10 shrink-0 whitespace-nowrap")}
            >
              {f.label}
              {count ? <span className="ml-1.5 opacity-60">{count}</span> : null}
            </button>
          );
        })}
      </div>

      {error && <div className="mt-6"><ErrorBanner>{error}</ErrorBanner></div>}
      {!clients && !error && <LoadingBlock label="Cargando clientes" />}
      {clients && list.length === 0 && (
        <p className="mt-14 text-center text-sm text-ink-soft">
          {clients.length === 0 ? "Aún no hay clientes. Aparecen aquí con su primera reserva." : "Nadie coincide con la búsqueda."}
        </p>
      )}

      <ul className="mt-6 space-y-3">
        {list.map((c) => (
          <li key={c.phone} className="animate-fade-in rounded-[1.5rem] bg-marfil p-5 ring-1 ring-ink/[0.07]">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate font-semibold text-ink">{c.name || "Sin nombre"}</p>
                <p className="text-sm tabular-nums text-ink-soft">{prettyPhone(c.phone)}</p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={() => setEditing(c)}
                  aria-label={`Editar a ${c.name}`}
                  className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-ink/10 bg-ivory text-ink transition-colors hover:border-gold/50"
                >
                  <Pencil size={15} aria-hidden />
                </button>
                <a
                  href={waLink(c.phone)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Escribir a ${c.name} por WhatsApp`}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-[#25D366] text-white"
                >
                  <WhatsAppIcon size={17} />
                </a>
              </div>
            </div>

            <dl className="mt-4 grid grid-cols-3 gap-2 border-t border-ink/[0.07] pt-4 text-sm">
              <div>
                <dt className="text-xs text-ink-soft">Citas</dt>
                <dd className="font-semibold tabular-nums text-ink">
                  {c.completed}
                  {c.bookings > c.completed && <span className="font-normal text-ink-soft"> / {c.bookings}</span>}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-ink-soft">Última</dt>
                <dd className="font-semibold text-ink">{lastVisitLabel(c)}</dd>
              </div>
              <div>
                <dt className="text-xs text-ink-soft">Total</dt>
                <dd className="font-semibold tabular-nums text-ink">{formatCOP(c.totalSpent)}</dd>
              </div>
            </dl>

            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
              {c.lastService && <span className="text-ink-soft">{c.lastService}</span>}
              <span
                className={clsx(
                  "inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-semibold",
                  c.acceptsMarketing ? "bg-[#25D366]/10 text-[#128C4B]" : "bg-ink/[0.06] text-ink-soft",
                )}
              >
                {c.acceptsMarketing && <Check size={12} aria-hidden />}
                {c.acceptsMarketing ? "Acepta promociones" : "Sin autorización de promociones"}
              </span>
            </div>
            {c.notes && (
              <p className="mt-3 flex items-start gap-2 rounded-xl bg-ivory p-3 text-sm text-ink-soft">
                <NotebookPen size={14} className="mt-0.5 shrink-0" aria-hidden />
                {c.notes}
              </p>
            )}
          </li>
        ))}
      </ul>

      {editing && (
        <EditClientSheet
          client={editing}
          token={token}
          onClose={() => setEditing(null)}
          onSaved={(updated) => {
            setClients((prev) => prev?.map((c) => (c.phone === updated.phone ? updated : c)) ?? null);
            setEditing(null);
          }}
        />
      )}
      {campaign && clients && <CampaignSheet clients={clients} onClose={() => setCampaign(false)} />}
    </div>
  );
}

function EditClientSheet({
  client,
  token,
  onClose,
  onSaved,
}: {
  client: Client;
  token: string;
  onClose: () => void;
  onSaved: (c: Client) => void;
}) {
  const [name, setName] = useState(client.name);
  const [notes, setNotes] = useState(client.notes);
  const [acceptsMarketing, setAcceptsMarketing] = useState(client.acceptsMarketing);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    setBusy(true);
    setError(null);
    try {
      onSaved(await adminUpdateClient(client.phone, { name: name.trim(), notes: notes.trim(), acceptsMarketing }, token));
    } catch {
      setError("No se pudo guardar. Inténtalo de nuevo.");
      setBusy(false);
    }
  }

  return (
    <Modal
      title="Cliente"
      subtitle={prettyPhone(client.phone)}
      onClose={onClose}
      footer={<SheetActions primaryLabel="Guardar" busyLabel="Guardando…" busy={busy} onPrimary={save} onCancel={onClose} />}
    >
      <div className="space-y-5">
        {error && <ErrorBanner>{error}</ErrorBanner>}
        <label className={labelClass}>
          Nombre
          <input className={fieldClass} value={name} onChange={(e) => setName(e.target.value)} maxLength={120} />
        </label>
        <label className={labelClass}>
          <span>
            Notas internas <span className="font-normal text-ink-soft">(solo las ve el equipo)</span>
          </span>
          <textarea
            className={clsx(fieldClass, "min-h-24 resize-none")}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            maxLength={1000}
            placeholder="Preferencias, presión favorita, portería…"
          />
        </label>
        <div className="border-t border-ink/10">
          <SwitchRow
            label="Acepta recibir promociones"
            hint="Actívalo solo si la persona lo pidió o lo autorizó. Si responde “NO” a una promoción, desactívalo."
            checked={acceptsMarketing}
            onChange={setAcceptsMarketing}
          />
        </div>
      </div>
    </Modal>
  );
}

/**
 * Bulk WhatsApp without a paid API: the message is written once, personalised with
 * each first name, and sent one tap per client from the team's own WhatsApp.
 * Progress is kept on this device, so a campaign can be finished later.
 */
function CampaignSheet({ clients, onClose }: { clients: Client[]; onClose: () => void }) {
  const [text, setText] = useState("Hola {nombre} 🌿\n\n");
  const [audience, setAudience] = useState<Filter>("optin");
  const [step, setStep] = useState<"write" | "send">("write");
  const [sent, setSent] = useState<string[]>([]);

  const recipients = clients.filter((c) => c.acceptsMarketing && matches(c, audience));
  const storageKey = `lamour_campaign_${hash(text)}`;
  const personal = (c: Client) => `${text.replaceAll("{nombre}", firstName(c.name)).trim()}\n\n${OPT_OUT}`;

  useEffect(() => {
    if (step !== "send") return;
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- resume a campaign started earlier on this device
      setSent(JSON.parse(localStorage.getItem(storageKey) ?? "[]"));
    } catch {
      setSent([]);
    }
  }, [step, storageKey]);

  function markSent(phone: string) {
    setSent((prev) => {
      const next = prev.includes(phone) ? prev : [...prev, phone];
      try {
        localStorage.setItem(storageKey, JSON.stringify(next));
      } catch {}
      return next;
    });
  }

  const pending = recipients.filter((c) => !sent.includes(c.phone));
  const next = pending[0];
  const body = text.replace("{nombre}", "").trim();

  if (step === "write") {
    return (
      <Modal
        title="Mensaje masivo"
        subtitle="Por WhatsApp, solo a quienes aceptaron promociones"
        onClose={onClose}
        size="lg"
        footer={
          <SheetActions
            primaryLabel={`Continuar · ${recipients.length} ${recipients.length === 1 ? "cliente" : "clientes"}`}
            busyLabel=""
            busy={false}
            disabled={body.length < 10 || recipients.length === 0}
            onPrimary={() => setStep("send")}
            onCancel={onClose}
          />
        }
      >
        <div className="space-y-5">
          <div role="radiogroup" aria-label="Para quién">
            <p className="text-sm font-medium text-ink">Para quién</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {FILTERS.filter((f) => f.value !== "all").map((f) => {
                const value = f.value === "optin" ? "optin" : f.value;
                const n = clients.filter((c) => c.acceptsMarketing && matches(c, value)).length;
                return (
                  <button
                    key={f.value}
                    type="button"
                    role="radio"
                    aria-checked={audience === value}
                    onClick={() => setAudience(value)}
                    className={clsx(chipClass(audience === value), "min-h-10")}
                  >
                    {f.value === "optin" ? "Todos los que aceptan" : f.label} · {n}
                  </button>
                );
              })}
            </div>
            {clients.filter((c) => c.acceptsMarketing).length === 0 && (
              <p className="mt-3 rounded-xl bg-ivory p-3 text-sm text-ink-soft">
                Todavía nadie ha aceptado promociones. Al reservar, las clientas pueden marcar la casilla “Quiero recibir
                promociones”; también puedes activarlo en su ficha si te lo pidieron por WhatsApp.
              </p>
            )}
          </div>

          <label className={labelClass}>
            <span>
              Mensaje <span className="font-normal text-ink-soft">— escribe {"{nombre}"} y se cambia por el nombre de cada una</span>
            </span>
            <textarea
              className={clsx(fieldClass, "min-h-40 resize-y")}
              value={text}
              onChange={(e) => setText(e.target.value)}
              maxLength={1000}
            />
          </label>

          {recipients[0] && body.length >= 10 && (
            <div>
              <p className="text-sm font-medium text-ink">Así le llega a {firstName(recipients[0].name) || "la clienta"}</p>
              <p className="mt-2 whitespace-pre-line rounded-2xl rounded-tl-sm bg-[#DCF8C6] p-4 text-sm leading-relaxed text-[#111]">
                {personal(recipients[0])}
              </p>
              <p className="mt-2 text-xs text-ink-soft">La línea para darse de baja se agrega sola a cada mensaje.</p>
            </div>
          )}
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      title="Enviar promoción"
      subtitle={`${sent.filter((p) => recipients.some((c) => c.phone === p)).length} de ${recipients.length} enviados`}
      onClose={onClose}
      size="lg"
      footer={
        next ? (
          <a
            href={waLink(next.phone, personal(next))}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => markSent(next.phone)}
            className="flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 text-[0.95rem] font-semibold text-white shadow-[0_10px_24px_-12px_rgba(37,211,102,0.8)]"
          >
            <WhatsAppIcon size={18} />
            Enviar a {firstName(next.name) || prettyPhone(next.phone)}
          </a>
        ) : (
          <Button onClick={onClose} className="w-full">
            Listo, campaña terminada
          </Button>
        )
      }
    >
      <p className="text-sm leading-relaxed text-ink-soft">
        Cada botón abre WhatsApp con el mensaje ya escrito para esa persona: toca <strong className="text-ink">Enviar</strong> en
        WhatsApp y vuelve aquí para la siguiente. Enviarlos uno a uno, y solo a quien aceptó, evita que WhatsApp bloquee el número.
      </p>
      <button type="button" onClick={() => setStep("write")} className="mt-3 cursor-pointer text-sm font-semibold text-bronze underline underline-offset-4">
        Editar mensaje
      </button>
      <ul className="mt-5 divide-y divide-ink/[0.07]">
        {recipients.map((c) => {
          const done = sent.includes(c.phone);
          return (
            <li key={c.phone} className="flex items-center justify-between gap-3 py-3">
              <span className="min-w-0">
                <span className={clsx("block truncate text-sm font-semibold", done ? "text-ink-soft" : "text-ink")}>{c.name || "Sin nombre"}</span>
                <span className="text-xs tabular-nums text-ink-soft">{prettyPhone(c.phone)}</span>
              </span>
              {done ? (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#128C4B]">
                  <Check size={14} aria-hidden /> Enviado
                </span>
              ) : (
                <a
                  href={waLink(c.phone, personal(c))}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => markSent(c.phone)}
                  className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-[#25D366] px-4 text-xs font-semibold text-[#128C4B]"
                >
                  <WhatsAppIcon size={14} /> Enviar
                </a>
              )}
            </li>
          );
        })}
      </ul>
    </Modal>
  );
}

/** Short stable key for a message, so progress belongs to that exact campaign. */
function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return (h >>> 0).toString(36);
}
