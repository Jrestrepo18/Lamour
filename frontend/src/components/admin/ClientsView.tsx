"use client";

import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import { Check, Copy, Download, Megaphone, NotebookPen, Pencil, Search } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { wrapRailClass } from "@/components/booking/parts";
import { useAutoRefresh } from "@/hooks/useAutoRefresh";
import { adminGetClients, adminMarkClientsExported, adminUpdateClient } from "@/lib/api";
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
 * Everyone who has booked, with their history, and promotions to all of them at once
 * through a WhatsApp Business broadcast list.
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
            Promoción a todos
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
      {campaign && clients && (
        <BroadcastSheet
          clients={clients}
          token={token}
          onClose={() => setCampaign(false)}
          onExported={(phones, at) =>
            setClients((prev) => prev?.map((c) => (phones.includes(c.phone) ? { ...c, exportedAt: at } : c)) ?? null)
          }
        />
      )}
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

/** WhatsApp broadcast lists take at most 256 recipients each. */
const LIST_MAX = 256;
/** Added to every saved contact's name, so they're easy to find when building the list. */
const TAG = "LAMOUR";

/** One vCard 3.0 entry per client; the file imports straight into the phone's contacts. */
function toVCard(list: Client[]) {
  const esc = (s: string) => s.replace(/\\/g, "\\\\").replace(/[,;]/g, (m) => `\\${m}`).replace(/\n/g, " ");
  return list
    .map((c) => {
      const name = `${c.name.trim() || "Cliente"} · ${TAG}`;
      return [
        "BEGIN:VCARD",
        "VERSION:3.0",
        `FN:${esc(name)}`,
        `N:${esc(name)};;;;`,
        `ORG:Clientes L'AMOUR`,
        `TEL;TYPE=CELL:${c.phone}`,
        "END:VCARD",
      ].join("\r\n");
    })
    .join("\r\n");
}

function download(filename: string, content: string) {
  const url = URL.createObjectURL(new Blob([content], { type: "text/vcard;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Promotions to everyone at once, through WhatsApp Business *broadcast lists* — free,
 * official and safe for the number. 1) download the opted-in clients as contacts and
 * import them on the business phone (only people who have your number saved receive
 * broadcasts, so ask them to save it); 2) build the broadcast list once; 3) write the
 * promotion here, copy it and send it to the whole list in one go.
 */
function BroadcastSheet({
  clients,
  token,
  onClose,
  onExported,
}: {
  clients: Client[];
  token: string;
  onClose: () => void;
  onExported: (phones: string[], at: string) => void;
}) {
  const [audience, setAudience] = useState<Filter>("optin");
  const [onlyNew, setOnlyNew] = useState(true);
  const [text, setText] = useState("🌿 L'AMOUR\n\n");
  const [copied, setCopied] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const optedIn = clients.filter((c) => c.acceptsMarketing);
  const inAudience = optedIn.filter((c) => matches(c, audience));
  const toExport = onlyNew ? inAudience.filter((c) => !c.exportedAt) : inAudience;
  const lists = Math.max(1, Math.ceil(optedIn.length / LIST_MAX));
  const message = `${text.trim()}\n\n${OPT_OUT}`;

  async function exportContacts() {
    if (toExport.length === 0) return;
    setExporting(true);
    setError(null);
    const date = new Date().toISOString().slice(0, 10);
    download(`clientes-lamour-${date}.vcf`, toVCard(toExport));
    try {
      await adminMarkClientsExported(
        toExport.map((c) => c.phone),
        token,
      );
      onExported(
        toExport.map((c) => c.phone),
        new Date().toISOString(),
      );
    } catch {
      setError("El archivo se descargó, pero no se pudo registrar la exportación. La próxima vez podrían salir repetidos.");
    } finally {
      setExporting(false);
    }
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("No se pudo copiar. Mantén presionado el texto de la vista previa para copiarlo.");
    }
  }

  const step = "flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink text-xs font-bold text-ivory";

  return (
    <Modal
      title="Promoción a todos"
      subtitle="Por lista de difusión de WhatsApp Business"
      onClose={onClose}
      size="lg"
      footer={
        <Button onClick={onClose} variant="secondary" className="w-full">
          Listo
        </Button>
      }
    >
      <div className="space-y-8">
        {error && <ErrorBanner>{error}</ErrorBanner>}

        {optedIn.length === 0 ? (
          <p className="rounded-xl bg-ivory p-4 text-sm text-ink-soft">
            Todavía nadie ha aceptado promociones. Al reservar, las clientas pueden marcar “Quiero recibir promociones”;
            también puedes activarlo en su ficha si te lo pidieron por WhatsApp.
          </p>
        ) : (
          <>
            {/* 1 — contacts */}
            <section className="space-y-3">
              <h3 className="flex items-center gap-3 font-semibold text-ink">
                <span className={step}>1</span> Descarga los contactos
              </h3>
              <div role="radiogroup" aria-label="Para quién" className="flex flex-wrap gap-2">
                {FILTERS.filter((f) => f.value !== "all").map((f) => {
                  const n = optedIn.filter((c) => matches(c, f.value)).length;
                  return (
                    <button
                      key={f.value}
                      type="button"
                      role="radio"
                      aria-checked={audience === f.value}
                      onClick={() => setAudience(f.value)}
                      className={clsx(chipClass(audience === f.value), "min-h-10")}
                    >
                      {f.value === "optin" ? "Todos los que aceptan" : f.label} · {n}
                    </button>
                  );
                })}
              </div>
              <div className="border-y border-ink/[0.07]">
                <SwitchRow
                  label="Solo los que no he descargado antes"
                  hint="Para agregar a tu lista únicamente a los clientes nuevos."
                  checked={onlyNew}
                  onChange={setOnlyNew}
                />
              </div>
              <Button onClick={exportContacts} disabled={toExport.length === 0 || exporting} className="w-full">
                <Download size={16} aria-hidden />
                {toExport.length === 0
                  ? "No hay contactos nuevos"
                  : `Descargar ${toExport.length} ${toExport.length === 1 ? "contacto" : "contactos"}`}
              </Button>
              <p className="text-xs leading-relaxed text-ink-soft">
                Abre el archivo en el celular del negocio y elige guardarlos en Contactos. Quedan con “· {TAG}” al final
                del nombre para encontrarlos fácil.
              </p>
            </section>

            {/* 2 — broadcast list */}
            <section className="space-y-3">
              <h3 className="flex items-center gap-3 font-semibold text-ink">
                <span className={step}>2</span> Crea (o actualiza) tu lista de difusión
              </h3>
              <ol className="list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-ink-soft">
                <li>
                  En WhatsApp Business: <strong className="text-ink">Chats → ⋮ (o “Nueva lista” en iPhone) → Nueva difusión</strong>.
                </li>
                <li>
                  Busca <strong className="text-ink">{TAG}</strong> y selecciónalos todos.
                </li>
                <li>Guárdala con un nombre, por ejemplo “Promociones”. Se hace una sola vez; luego solo agregas a los nuevos.</li>
              </ol>
              <p className="rounded-xl bg-gold/10 p-3 text-xs leading-relaxed text-bronze">
                Cada lista admite hasta {LIST_MAX} personas
                {lists > 1 ? ` — con ${optedIn.length} clientes necesitas ${lists} listas.` : "."} La difusión solo le llega
                a quien tiene tu número guardado: pídeles que lo guarden (por ejemplo, en el mensaje de confirmación).
              </p>
            </section>

            {/* 3 — message */}
            <section className="space-y-3">
              <h3 className="flex items-center gap-3 font-semibold text-ink">
                <span className={step}>3</span> Escribe la promoción y envíala a la lista
              </h3>
              <label className={labelClass}>
                <span className="sr-only">Mensaje</span>
                <textarea
                  className={clsx(fieldClass, "min-h-36 resize-y")}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  maxLength={1000}
                />
              </label>
              <div>
                <p className="text-sm font-medium text-ink">Así le llega a todos</p>
                <p className="mt-2 whitespace-pre-line rounded-2xl rounded-tl-sm bg-[#DCF8C6] p-4 text-sm leading-relaxed text-[#111]">
                  {message}
                </p>
                <p className="mt-2 text-xs text-ink-soft">
                  La línea para darse de baja se agrega sola. En difusión el mensaje es igual para todos (sin nombre
                  personalizado). Evita mencionar servicios +18: WhatsApp puede restringir el número.
                </p>
              </div>
              <button
                type="button"
                onClick={copy}
                disabled={text.trim().length < 10}
                className="inline-flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 text-[0.95rem] font-semibold text-white shadow-[0_10px_24px_-12px_rgba(37,211,102,0.8)] disabled:opacity-50"
              >
                {copied ? <Check size={18} aria-hidden /> : <Copy size={18} aria-hidden />}
                {copied ? "Copiado — pégalo en tu lista de difusión" : "Copiar mensaje"}
              </button>
            </section>
          </>
        )}
      </div>
    </Modal>
  );
}
