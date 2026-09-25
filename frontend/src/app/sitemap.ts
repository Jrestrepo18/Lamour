import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

/**
 * Public, indexable routes only — /admin is disallowed in robots.ts; legal pages and
 * /reservar are noindex. No `lastModified`: Google only uses it when it's reliably
 * accurate, and stamping "now" on every request taught it to ignore the field.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/servicios"), changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/masajistas"), changeFrequency: "weekly", priority: 0.7 },
  ];
}
