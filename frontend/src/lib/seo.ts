import type { Metadata } from "next";

/**
 * Single source of truth for SEO: canonical site URL, brand copy, and the
 * schema.org JSON-LD builders. Pages import from here instead of repeating
 * strings, so titles/descriptions/structured data never drift apart.
 */

function resolveSiteUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  // Vercel exposes the production domain at build time.
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;
  // A production server without a known domain would publish canonicals, the sitemap and
  // Open Graph URLs pointing at localhost — fail loudly instead of deploying that silently.
  // (Server only: VERCEL_* never reaches the browser bundle, so the check would misfire there.)
  if (process.env.NODE_ENV === "production" && typeof window === "undefined") {
    throw new Error(
      "Falta NEXT_PUBLIC_SITE_URL: define el dominio público del sitio (p. ej. https://lamour.com.co) antes de compilar para producción.",
    );
  }
  return "http://localhost:3000";
}

export const SITE = {
  url: resolveSiteUrl(),
  name: "L'AMOUR — Estética y Sentidos",
  shortName: "L'AMOUR",
  locale: "es_CO",
  description:
    "Spa de masajes a domicilio en Medellín: masajes tántricos, relajación, experiencias en pareja y recuperación muscular con terapeutas certificadas. Discreción total en Envigado, Sabaneta, Itagüí, Bello y el Valle de Aburrá.",
  areaServed: ["Medellín", "Envigado", "Sabaneta", "Itagüí", "Bello", "La Estrella", "Caldas", "Rionegro"],
  openingHours: { opens: "09:00", closes: "21:00" },
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "") || undefined,
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || undefined,
  ogImage: "/opengraph-image.jpg",
  /** Raster logo for structured data — Google doesn't accept SVG logos. */
  logo: "/logo.png",
  /** Google Search Console HTML-tag verification token (content of the meta tag only). */
  googleVerification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
} as const;

export const absoluteUrl = (path = "/") => `${SITE.url}${path.startsWith("/") ? path : `/${path}`}`;

/**
 * Full metadata for an inner page. Next.js replaces nested objects like
 * `openGraph` wholesale instead of merging them with the root layout's, so each
 * page must restate the image, locale and site name — this does it in one place.
 */
export function pageMetadata({ title, description, path }: { title: string; description: string; path: string }): Metadata {
  const image = { url: SITE.ogImage, width: 1200, height: 630, alt: "L'AMOUR — Spa y masajes a domicilio en Medellín" };
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: SITE.locale,
      siteName: SITE.name,
      url: path,
      title,
      description,
      images: [image],
    },
    twitter: { card: "summary_large_image", title, description, images: [image.url] },
  };
}

type Json = Record<string, unknown>;

/** The business entity — one node for the whole service area (no per-city duplicates). */
export function businessJsonLd(): Json {
  return {
    "@context": "https://schema.org",
    "@type": "HealthAndBeautyBusiness",
    "@id": absoluteUrl("/#business"),
    name: SITE.name,
    alternateName: SITE.shortName,
    description: SITE.description,
    url: SITE.url,
    image: absoluteUrl(SITE.ogImage),
    logo: absoluteUrl(SITE.logo),
    priceRange: "$$$",
    currenciesAccepted: "COP",
    paymentAccepted: "Efectivo, Transferencia, Tarjeta",
    ...(SITE.whatsapp ? { telephone: `+${SITE.whatsapp}` } : {}),
    address: {
      "@type": "PostalAddress",
      addressLocality: "Medellín",
      addressRegion: "Antioquia",
      addressCountry: "CO",
    },
    geo: { "@type": "GeoCoordinates", latitude: 6.2442, longitude: -75.5812 },
    areaServed: SITE.areaServed.map((name) => ({ "@type": "City", name })),
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: SITE.openingHours.opens,
      closes: SITE.openingHours.closes,
    },
    ...(SITE.instagram ? { sameAs: [SITE.instagram] } : {}),
  };
}

export function websiteJsonLd(): Json {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": absoluteUrl("/#website"),
    name: SITE.name,
    url: SITE.url,
    inLanguage: "es-CO",
    publisher: { "@id": absoluteUrl("/#business") },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]): Json {
  const all = [{ name: "Inicio", path: "/" }, ...items];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: all.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqJsonLd(faqs: { q: string; a: string }[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

/** The service catalog as an OfferCatalog of the business — prices and durations included. */
export function catalogJsonLd(
  categories: { name: string; services: { name: string; slug: string; shortDescription: string; price: number }[] }[],
): Json {
  return {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    name: "Catálogo de masajes a domicilio",
    url: absoluteUrl("/servicios"),
    provider: { "@id": absoluteUrl("/#business") },
    itemListElement: categories.map((c) => ({
      "@type": "OfferCatalog",
      name: c.name,
      itemListElement: c.services.map((s) => ({
        "@type": "Offer",
        price: s.price,
        priceCurrency: "COP",
        url: absoluteUrl(`/reservar?service=${s.slug}`),
        itemOffered: {
          "@type": "Service",
          name: s.name,
          description: s.shortDescription,
          areaServed: "Medellín y Valle de Aburrá",
        },
      })),
    })),
  };
}
