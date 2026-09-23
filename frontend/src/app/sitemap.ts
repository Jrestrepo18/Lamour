import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

/** Public, indexable routes only — /admin is disallowed in robots.ts, legal pages are noindex. */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: absoluteUrl("/"), lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/servicios"), lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/masajistas"), lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: absoluteUrl("/reservar"), lastModified: now, changeFrequency: "monthly", priority: 0.8 },
  ];
}
