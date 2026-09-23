import type { MetadataRoute } from "next";
import { absoluteUrl, SITE } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/admin/"] }],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: SITE.url,
  };
}
