import type { MetadataRoute } from "next";
import { getServiceCategories } from "@/server/catalog";
import { servicePath } from "@/lib/catalog";
import { CITIES, cityPath } from "@/lib/cities";
import { absoluteUrl } from "@/lib/seo";

/** Catalog pages regenerate at most once a minute (and right after an admin edit). */
export const revalidate = 60;

/**
 * Public, indexable routes only — /admin is disallowed in robots.ts; legal pages and
 * /reservar are noindex. No `lastModified`: Google only uses it when it's reliably
 * accurate, and stamping "now" on every request taught it to ignore the field.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data: categories } = await getServiceCategories();
  const services = categories.flatMap((c) =>
    c.services.filter((s) => s.isActive).map((s) => absoluteUrl(servicePath(s, c.slug))),
  );

  return [
    { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/servicios"), changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/masajes-tantricos"), changeFrequency: "weekly", priority: 0.9 },
    ...services.map((url) => ({ url, changeFrequency: "monthly" as const, priority: 0.8 })),
    { url: absoluteUrl("/masajes-a-domicilio"), changeFrequency: "monthly", priority: 0.7 },
    ...CITIES.map((c) => ({ url: absoluteUrl(cityPath(c)), changeFrequency: "monthly" as const, priority: 0.7 })),
    { url: absoluteUrl("/masajistas"), changeFrequency: "weekly", priority: 0.7 },
  ];
}
