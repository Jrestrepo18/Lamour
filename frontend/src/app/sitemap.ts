import type { MetadataRoute } from "next";
import { getServiceCategories } from "@/server/catalog";
import { servicePath } from "@/lib/catalog";
import { CITIES, cityPath } from "@/lib/cities";
import { absoluteUrl } from "@/lib/seo";
import { localePath } from "@/i18n/config";

/** Catalog pages regenerate at most once a minute (and right after an admin edit). */
export const revalidate = 60;

type Entry = { path: string; changeFrequency: "weekly" | "monthly"; priority: number };

/**
 * Public, indexable routes only — /admin is disallowed in robots.ts; legal pages and
 * /reservar are noindex. Every page is listed in Spanish (unprefixed) and English
 * (/en), each entry carrying both hreflang alternates so Google pairs them.
 * No `lastModified`: Google only uses it when it's reliably accurate, and stamping
 * "now" on every request taught it to ignore the field.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data: categories } = await getServiceCategories();
  const services = categories.flatMap((c) => c.services.filter((s) => s.isActive).map((s) => servicePath(s, c.slug)));

  const pages: Entry[] = [
    { path: "/", changeFrequency: "weekly", priority: 1 },
    { path: "/servicios", changeFrequency: "weekly", priority: 0.9 },
    { path: "/masajes-tantricos", changeFrequency: "weekly", priority: 0.9 },
    ...services.map((path) => ({ path, changeFrequency: "monthly" as const, priority: 0.8 })),
    { path: "/masajes-a-domicilio", changeFrequency: "monthly", priority: 0.7 },
    ...CITIES.map((c) => ({ path: cityPath(c), changeFrequency: "monthly" as const, priority: 0.7 })),
    { path: "/masajistas", changeFrequency: "weekly", priority: 0.7 },
  ];

  return pages.flatMap(({ path, changeFrequency, priority }) => {
    const alternates = {
      languages: { "es-CO": absoluteUrl(path), en: absoluteUrl(localePath("en", path)), "x-default": absoluteUrl(path) },
    };
    return [
      { url: absoluteUrl(path), changeFrequency, priority, alternates },
      { url: absoluteUrl(localePath("en", path)), changeFrequency, priority: Math.round(priority * 0.9 * 10) / 10, alternates },
    ];
  });
}
