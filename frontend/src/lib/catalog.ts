import type { Masseuse, Service, ServiceCategory } from "./types";
import type { Locale } from "@/i18n/config";

/**
 * Splits the catalog into the general spa section (/servicios) and the adult
 * section (/masajes-tantricos), following Google's guidance for sites with
 * explicit content: group it under its own path and mark those pages with
 * `<meta name="rating" content="adult">`, so the rest of the site isn't
 * classified as explicit and keeps showing for non-explicit searches such as
 * "masajes a domicilio Medellín".
 *
 * A service is adult when its category is adult as a whole, or when it's listed
 * individually below. Anything new added from the admin panel to another
 * category defaults to the general section.
 */
const ADULT_CATEGORIES = new Set([
  "eroticos-tantricos", // every ritual includes stimulation at the end
  "sensoriales", // focus on the most sensitive areas, optional panty-only dress
]);

const ADULT_SERVICES = new Set([
  "ritual-contacto-total", // full-body contact ritual (paired with the tantric rituals in the team bios)
  "piel-con-piel", // direct skin contact "sin barreras"
  "cuerpo-a-cuerpo", // the therapist's body as the massage tool (body slide)
  "masaje-voyerista", // one partner watches, "alimentando la fantasía"
]);

export type CatalogSection = "spa" | "adult";

export const SECTION_BASE: Record<CatalogSection, string> = {
  spa: "/servicios",
  adult: "/masajes-tantricos",
};

export const SECTION_NAME: Record<Locale, Record<CatalogSection, string>> = {
  es: { spa: "Servicios", adult: "Masajes tántricos" },
  en: { spa: "Services", adult: "Tantric massages" },
};

export function isAdultService(service: Pick<Service, "slug">, categorySlug: string) {
  return ADULT_CATEGORIES.has(categorySlug) || ADULT_SERVICES.has(service.slug);
}

export function sectionOf(service: Pick<Service, "slug">, categorySlug: string): CatalogSection {
  return isAdultService(service, categorySlug) ? "adult" : "spa";
}

/** Canonical URL path of a service's own page. */
export function servicePath(service: Pick<Service, "slug">, categorySlug: string) {
  return `${SECTION_BASE[sectionOf(service, categorySlug)]}/${service.slug}`;
}

/** The categories of one section, each keeping only that section's services; empty ones dropped. */
export function catalogSection(categories: ServiceCategory[], section: CatalogSection): ServiceCategory[] {
  return categories
    .map((c) => ({ ...c, services: c.services.filter((s) => sectionOf(s, c.slug) === section) }))
    .filter((c) => c.services.length > 0);
}

export function findService(categories: ServiceCategory[], slug: string) {
  for (const category of categories) {
    const index = category.services.findIndex((s) => s.slug === slug);
    if (index !== -1) return { service: category.services[index], category, index };
  }
  return null;
}

/** Short chip labels — the full category names are too long for a one-line pill row on a phone. */
export const CATEGORY_SHORT: Record<Locale, Record<string, string>> = {
  es: {
    "eroticos-tantricos": "Tántricos",
    "terapias-especiales": "Terapias especiales",
    sensoriales: "Sensoriales",
    "experiencias-pareja": "En pareja",
    "relajacion-muscular": "Relajación",
  },
  en: {
    "eroticos-tantricos": "Tantric",
    "terapias-especiales": "Special therapies",
    sensoriales: "Sensory",
    "experiencias-pareja": "Couples",
    "relajacion-muscular": "Relaxation",
  },
};

/** A service in the page's language: English fields where they exist, Spanish otherwise. */
export function localizeService(s: Service, lang: Locale): Service {
  if (lang !== "en" || !s.en) return s;
  return {
    ...s,
    name: s.en.name || s.name,
    shortDescription: s.en.shortDescription || s.shortDescription,
    longDescription: s.en.longDescription || s.longDescription,
    highlights: s.en.highlights?.length ? s.en.highlights : s.highlights,
  };
}

export function localizeCatalog(categories: ServiceCategory[], lang: Locale): ServiceCategory[] {
  if (lang !== "en") return categories;
  return categories.map((c) => ({
    ...c,
    name: c.en?.name || c.name,
    description: c.en?.description || c.description,
    highlight: c.en?.highlight || c.highlight,
    services: c.services.map((s) => localizeService(s, lang)),
  }));
}

export function localizeMasseuses(masseuses: Masseuse[], lang: Locale): Masseuse[] {
  if (lang !== "en") return masseuses;
  return masseuses.map((m) => ({ ...m, bio: m.bioEn || m.bio }));
}
