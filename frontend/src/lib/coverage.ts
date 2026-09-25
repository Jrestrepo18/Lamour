import { SITE } from "@/lib/seo";

/** Municipalities with home service — single source shared with the SEO areaServed data. */
export const MUNICIPIOS: readonly string[] = SITE.areaServed;

/** Lowercase, accent-free form for forgiving matching ("itagui" finds "Itagüí"). */
export function normalizePlace(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

/** The covered municipality matching `value` exactly (accent/case-insensitive), if any. */
export function findMunicipio(value: string | null | undefined): string | null {
  if (!value) return null;
  const n = normalizePlace(value);
  return MUNICIPIOS.find((m) => normalizePlace(m) === n) ?? null;
}
