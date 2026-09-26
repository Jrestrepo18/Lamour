"use client";

import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import { ArrowDown, ArrowUp, Check, Copy, Crown, Download, FileSpreadsheet, Megaphone, NotebookPen, Pencil, Search } from "lucide-react";
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

/* ---------- Categories ---------- */

type TierId = "premium" | "frecuente" | "recurrente" | "nuevo" | "prospecto";

/**
 * Automatic category from the client's history. Only completed appointments count
 * (a pending or cancelled one isn't a visit); the first rule that matches wins.
 */
const TIERS: { id: TierId; label: string; rule: string; test: (c: Client) => boolean; badge: string }[] = [
  {
    id: "premium",
    label: "Premium",
    rule: "6+ citas o $1.500.000+ gastados",
    test: (c) => c.completed >= 6 || c.totalSpent >= 1_500_000,
    badge: "bg-gold/20 text-bronze ring-1 ring-gold/40",
  },
  { id: "frecuente", label: "Frecuente", rule: "3 a 5 citas", test: (c) => c.completed >= 3, badge: "bg-ink text-ivory" },
  { id: "recurrente", label: "Recurrente", rule: "2 citas", test: (c) => c.completed === 2, badge: "bg-champagne/60 text-ink" },
  { id: "nuevo", label: "Nuevo", rule: "1 cita", test: (c) => c.completed === 1, badge: "bg-[#25D366]/12 text-[#128C4B]" },
  { id: "prospecto", label: "Sin cita completada", rule: "reservó, aún sin cita completada", test: () => true, badge: "bg-ink/[0.06] text-ink-soft" },
];
const TIER_RANK: Record<TierId, number> = { premium: 4, frecuente: 3, recurrente: 2, nuevo: 1, prospecto: 0 };
const tierOf = (c: Client) => TIERS.find((t) => t.test(c))!;

function TierBadge({ client }: { client: Client }) {
  const tier = tierOf(client);
  return (
    <span className={clsx("inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold", tier.badge)}>
      {tier.id === "premium" && <Crown size={12} aria-hidden />}
      {tier.label}
    </span>
  );
}

/* ---------- Filters (also the audiences of a broadcast) ---------- */

type Filter = "all" | "optin" | "away" | TierId;

const FILTERS: { value: Filter; label: string }[] = [
  { value: "optin", label: "Aceptan promociones" },
  ...TIERS.map((t) => ({ value: t.id as Filter, label: t.label })),
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
  if (filter === "all") return true;
  if (filter === "optin") return c.acceptsMarketing;
  if (filter === "away") return (daysSince(c.lastVisit) ?? 0) > 60;
  return tierOf(c).id === filter;
}

function lastVisitLabel(c: Client) {
  const days = daysSince(c.lastVisit);
  if (days === null) return "—";
  if (days < 0) return "Cita próxima";
  if (days === 0) return "Hoy";
  if (days === 1) return "Ayer";
  if (days < 60) return `Hace ${days} días`;
  return `Hace ${Math.round(days / 30)} meses`;
}

/* ---------- Sorting ---------- */

type SortKey = "name" | "tier" | "completed" | "lastVisit" | "totalSpent";
const SORTERS: Record<SortKey, (a: Client, b: Client) => number> = {
  name: (a, b) => a.name.localeCompare(b.name, "es"),
  tier: (a, b) => TIER_RANK[tierOf(a).id] - TIER_RANK[tierOf(b).id] || a.totalSpent - b.totalSpent,
  completed: (a, b) => a.completed - b.completed || a.bookings - b.bookings,
  lastVisit: (a, b) => (a.lastVisit ?? "").localeCompare(b.lastVisit ?? ""),
  totalSpent: (a, b) => a.totalSpent - b.totalSpent,
};

function Th({
  k,
  sort,
  onSort,
  children,
  className,
}: {
  k: SortKey;
  sort: { key: SortKey; desc: boolean };
  onSort: (k: SortKey) => void;
  children: React.ReactNode;
  className?: string;
}) {
  const active = sort.key === k;
  return (
    <th scope="col" aria-sort={active ? (sort.desc ? "descending" : "ascending") : "none"} className={clsx("px-3 py-3 font-semibold", className)}>
      <button type="button" onClick={() => onSort(k)} className="inline-flex cursor-pointer items-center gap-1 whitespace-nowrap hover:text-ink">
        {children}
        {active && (sort.desc ? <ArrowDown size={13} aria-hidden /> : <ArrowUp size={13} aria-hidden />)}
      </button>
    </th>
  );
}

/* ---------- Excel export ---------- */

/** The rows on screen as a CSV Excel opens directly (UTF-8 BOM, semicolons as Colombian Excel expects). */
function exportCsv(rows: Client[]) {
  const cell = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;
  const header = ["Nombre", "Celular", "Categoría", "Citas completadas", "Reservas", "Última visita", "Último servicio", "Total gastado", "Acepta promociones", "Notas"];
  const lines = rows.map((c) =>
    [
      c.name,
      c.phone,
      tierOf(c).label,
      c.completed,
      c.bookings,
      c.lastVisit?.slice(0, 10) ?? "",
      c.lastService ?? "",
      c.totalSpent,
      c.acceptsMarketing ? "Sí" : "No",
      c.notes,
    ]
      .map(cell)
      .join(";"),
  );
  const csv = "﻿" + [header.map(cell).join(";"), ...lines].join("\r\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = `clientes-lamour-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * The client database: one row per person who has booked, with their automatic
 * category, history and contact, sortable by any column. Promotions go to all of
 * them at once through a WhatsApp Business broadcast list — only to clients who
 * opted in, as Colombian data law (Ley 1581) and WhatsApp's own rules require.
 */
export function ClientsView({ token }: { token: string }) {
  const [clients, setClients] = useState<Client[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<{ key: SortKey; desc: boolean }>({ key: "lastVisit", desc: true });
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

  useAutoRefresh(() => load(true), 30_000, editing === null && !campaign);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial fetch on mount
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const q = query.trim().toLowerCase();
  const rows = useMemo(() => {
    const qDigits = q.replace(/\D/g, "");
    const list = (clients ?? []).filter(
      (c) => matches(c, filter) && (!q || c.name.toLowerCase().includes(q) || (qDigits && digits(c.phone).includes(qDigits))),
    );
    const cmp = SORTERS[sort.key];
    return list.sort((a, b) => (sort.desc ? cmp(b, a) : cmp(a, b)));
  }, [clients, filter, q, sort]);

  const all = clients ?? [];
  const revenue = all.reduce((s, c) => s + c.totalSpent, 0);
  const optedIn = all.filter((c) => c.acceptsMarketing).length;

  function sortBy(key: SortKey) {
    setSort((s) => (s.key === key ? { key, desc: !s.desc } : { key, desc: key !== "name" }));
  }

  return (
    <div>
      <AdminPageHeader
        title="Clientes"
        description="Tu base de clientes: quién es, cómo contactarla y qué tan seguido reserva. La categoría se calcula sola con las citas completadas."
        action={
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={() => exportCsv(rows)} disabled={!clients || rows.length === 0}>
              <FileSpreadsheet size={16} aria-hidden />
              Excel
            </Button>
            <Button onClick={() => setCampaign(true)} disabled={!clients}>
              <Megaphone size={16} aria-hidden />
              Promoción a todos
            </Button>
          </div>
        }
      />

      {clients && (
        <dl className="mt-6 grid grid-cols-3 divide-x divide-ink/10 rounded-2xl bg-marfil py-4 ring-1 ring-ink/[0.07]">
          {[
            { label: "Clientes", value: String(all.length) },
            { label: "Aceptan promociones", value: String(optedIn) },
            { label: "Facturado", value: formatCOP(revenue) },
          ].map((s) => (
            <div key={s.label} className="px-3 text-center">
              <dt className="text-[0.7rem] font-medium text-ink-soft">{s.label}</dt>
              <dd className="mt-0.5 font-serif text-lg font-semibold tabular-nums text-ink sm:text-2xl">{s.value}</dd>
            </div>
          ))}
        </dl>
      )}

      <label className="relative mt-5 block">
        <span className="sr-only">Buscar cliente</span>
        <Search size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft" aria-hidden />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por nombre o celular"
          className={clsx(fieldClass, "pl-11")}
        />
      </label>

      <div className={clsx(wrapRailClass, "mt-4")}>
        {[{ value: "all" as Filter, label: "Todos" }, ...FILTERS].map((f) => {
          const count = all.filter((c) => matches(c, f.value)).length;
          return (
            <button
              key={f.value}
              type="button"
              onClick={() => setFilter(f.value)}
              aria-pressed={filter === f.value}
              className={clsx(chipClass(filter === f.value), "min-h-10 shrink-0 whitespace-nowrap")}
            >
              {f.value === "premium" && <Crown size={13} className="mr-1.5" aria-hidden />}
              {f.label}
              <span className="ml-1.5 opacity-60">{count}</span>
            </button>
          );
        })}
      </div>
      <p className="mt-2 text-xs leading-relaxed text-ink-soft">
        {TIERS.slice(0, 4)
          .map((t) => `${t.label}: ${t.rule}`)
          .join(" · ")}
      </p>

      {error && <div className="mt-6"><ErrorBanner>{error}</ErrorBanner></div>}
      {!clients && !error && <LoadingBlock label="Cargando clientes" />}

      {clients && (
        <div className="relative isolate mt-5 overflow-x-auto rounded-2xl bg-marfil ring-1 ring-ink/[0.07]">
          <table className="w-full min-w-[52rem] border-separate border-spacing-0 text-left text-sm">
            <thead className="bg-ivory/80 text-xs text-ink-soft [&_th]:border-b [&_th]:border-ink/10">
              <tr>
                <Th k="name" sort={sort} onSort={sortBy} className="sticky left-0 z-10 bg-ivory pl-4">
                  Nombre
                </Th>
                <th scope="col" className="px-3 py-3 font-semibold">
                  Celular
                </th>
                <Th k="tier" sort={sort} onSort={sortBy}>Categoría</Th>
                <Th k="completed" sort={sort} onSort={sortBy} className="text-right">
                  Citas
                </Th>
                <Th k="lastVisit" sort={sort} onSort={sortBy}>Última visita</Th>
                <Th k="totalSpent" sort={sort} onSort={sortBy} className="text-right">
                  Total gastado
                </Th>
                <th scope="col" className="px-3 py-3 font-semibold">
                  Promos
                </th>
                <th scope="col" className="px-3 py-3 pr-4 text-right font-semibold">
                  <span className="sr-only">Acciones</span>
                </th>
              </tr>
            </thead>
            <tbody className="[&_tr+tr_td]:border-t [&_tr+tr_td]:border-ink/[0.06]">
              {rows.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-ink-soft">
                    {all.length === 0 ? "Aún no hay clientes. Aparecen aquí con su primera reserva." : "Nadie coincide con la búsqueda."}
                  </td>
                </tr>
              )}
              {rows.map((c) => (
                <tr key={c.phone} className="group transition-colors hover:bg-ivory/70">
                  <td className="sticky left-0 z-10 bg-marfil py-3 pl-4 pr-3 transition-colors group-hover:bg-ivory">
                    <button type="button" onClick={() => setEditing(c)} className="block max-w-[8.5rem] cursor-pointer text-left sm:max-w-[11rem]">
                      <span className="block truncate font-semibold text-ink">{c.name || "Sin nombre"}</span>
                      {c.notes && (
                        <span className="mt-0.5 flex items-center gap-1 truncate text-xs text-ink-soft" title={c.notes}>
                          <NotebookPen size={11} className="shrink-0" aria-hidden />
                          {c.notes}
                        </span>
                      )}
                    </button>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 tabular-nums text-ink">{prettyPhone(c.phone)}</td>
                  <td className="px-3 py-3">
                    <TierBadge client={c} />
                  </td>
                  <td className="px-3 py-3 text-right tabular-nums">
                    <span className="font-semibold text-ink">{c.completed}</span>
                    {c.bookings > c.completed && <span className="text-ink-soft"> / {c.bookings}</span>}
                  </td>
                  <td className="px-3 py-3">
                    <span className="block whitespace-nowrap text-ink">{lastVisitLabel(c)}</span>
                    {c.lastService && <span className="block max-w-[12rem] truncate text-xs text-ink-soft">{c.lastService}</span>}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-right font-semibold tabular-nums text-ink">{formatCOP(c.totalSpent)}</td>
                  <td className="px-3 py-3">
                    {c.acceptsMarketing ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#128C4B]">
                        <Check size={14} aria-hidden /> Sí
                      </span>
                    ) : (
                      <span className="text-xs text-ink-soft">No</span>
                    )}
                  </td>
                  <td className="py-3 pl-3 pr-4">
                    <div className="flex justify-end gap-2">
                      <a
                        href={waLink(c.phone)}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Escribir a ${c.name} por WhatsApp`}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-[#25D366] text-white"
                      >
                        <WhatsAppIcon size={16} />
                      </a>
                      <button
                        type="button"
                        onClick={() => setEditing(c)}
                        aria-label={`Editar a ${c.name}`}
                        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-ink/10 bg-ivory text-ink transition-colors hover:border-gold/50"
                      >
                        <Pencil size={14} aria-hidden />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {clients && rows.length > 0 && (
        <p className="mt-2 text-xs text-ink-soft">
          {rows.length} de {all.length} · toca un encabezado para ordenar · desliza la tabla hacia los lados en el celular
        </p>
      )}

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
