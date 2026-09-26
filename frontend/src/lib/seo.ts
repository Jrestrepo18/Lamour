import type { Metadata } from "next";
import { servicePath } from "./catalog";
import { localePath, LOCALE_TAG, OG_LOCALE, translator, type Locale } from "@/i18n/config";

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
    "Spa de masajes a domicilio en Medellín y el Valle de Aburrá: relajación, piedras volcánicas y masajes en pareja con terapeutas certificadas. Reserva en línea.",
  areaServed: ["Medellín", "Envigado", "Sabaneta", "Itagüí", "Bello", "La Estrella", "Caldas", "Rionegro"],
  openingHours: { opens: "09:00", closes: "21:00" },
  /** Business WhatsApp with country code (57 = Colombia); overridable per environment. */
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "") || "573236669426",
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || undefined,
  ogImage: "/opengraph-image.jpg",
  /** Raster logo for structured data — Google doesn't accept SVG logos. */
  logo: "/logo.png",
  /** Google Search Console HTML-tag verification token (content of the meta tag only). */
  googleVerification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
} as const;

export const absoluteUrl = (path = "/") => `${SITE.url}${path.startsWith("/") ? path : `/${path}`}`;

export const siteDescription = (lang: Locale) =>
  translator(lang)(
    SITE.description,
    "In-home massage spa in Medellín and the Aburrá Valley: relaxation, volcanic stones and couples massages by certified therapists. Book online.",
  );

/** hreflang pairs for a page, from its Spanish (unprefixed) path. */
export const languageAlternates = (path: string) => ({
  "es-CO": path,
  en: localePath("en", path),
  "x-default": path,
});

/**
 * Full metadata for an inner page. Next.js replaces nested objects like
 * `openGraph` wholesale instead of merging them with the root layout's, so each
 * page must restate the image, locale and site name — this does it in one place.
 */
export function pageMetadata({
  title,
  description,
  path,
  lang,
  adult = false,
}: {
  title: string;
  description: string;
  /** The Spanish (unprefixed) path; the English one is derived from it. */
  path: string;
  lang: Locale;
  /** Marks the page as sexually explicit for SafeSearch (`<meta name="rating" content="adult">`). */
  adult?: boolean;
}): Metadata {
  const alt = translator(lang)("L'AMOUR — Spa y masajes a domicilio en Medellín", "L'AMOUR — In-home spa and massage in Medellín");
  const image = { url: SITE.ogImage, width: 1200, height: 630, alt };
  const url = localePath(lang, path);
  return {
    title,
    description,
    alternates: { canonical: url, languages: languageAlternates(path) },
    ...(adult ? { other: { rating: "adult" } } : {}),
    openGraph: {
      type: "website",
      locale: OG_LOCALE[lang],
      alternateLocale: [OG_LOCALE[lang === "en" ? "es" : "en"]],
      siteName: SITE.name,
      url,
      title,
      description,
      images: [image],
    },
    twitter: { card: "summary_large_image", title, description, images: [image.url] },
  };
}

type Json = Record<string, unknown>;

/** The business entity — one node for the whole service area (no per-city duplicates). */
export function businessJsonLd(lang: Locale): Json {
  return {
    "@context": "https://schema.org",
    "@type": "HealthAndBeautyBusiness",
    "@id": absoluteUrl("/#business"),
    name: SITE.name,
    alternateName: SITE.shortName,
    description: siteDescription(lang),
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

export function websiteJsonLd(lang: Locale): Json {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": absoluteUrl("/#website"),
    name: SITE.name,
    url: SITE.url,
    inLanguage: LOCALE_TAG[lang],
    publisher: { "@id": absoluteUrl("/#business") },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[], lang: Locale): Json {
  const all = [{ name: translator(lang)("Inicio", "Home"), path: "/" }, ...items];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: all.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(localePath(lang, item.path)),
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

/** One section of the catalog as an OfferCatalog of the business — prices and durations included. */
export function catalogJsonLd({
  name,
  path,
  categories,
  lang,
}: {
  name: string;
  path: string;
  lang: Locale;
  categories: { name: string; slug: string; services: { name: string; slug: string; shortDescription: string; price: number }[] }[];
}): Json {
  return {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    name,
    url: absoluteUrl(localePath(lang, path)),
    provider: { "@id": absoluteUrl("/#business") },
    itemListElement: categories.map((c) => ({
      "@type": "OfferCatalog",
      name: c.name,
      itemListElement: c.services.map((s) => ({
        "@type": "Offer",
        price: s.price,
        priceCurrency: "COP",
        url: absoluteUrl(localePath(lang, servicePath(s, c.slug))),
        itemOffered: {
          "@type": "Service",
          name: s.name,
          description: s.shortDescription,
          areaServed: translator(lang)("Medellín y Valle de Aburrá", "Medellín and the Aburrá Valley"),
        },
      })),
    })),
  };
}

/** A single service's own page: the Service, offered by the business, with its price. */
export function serviceJsonLd({
  name,
  slug,
  description,
  path,
  price,
  category,
  lang,
}: {
  lang: Locale;
  name: string;
  slug: string;
  description: string;
  path: string;
  price: number;
  category: string;
}): Json {
  const url = absoluteUrl(localePath(lang, path));
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}#service`,
    name,
    description,
    url,
    serviceType: category,
    provider: { "@id": absoluteUrl("/#business") },
    areaServed: SITE.areaServed.map((city) => ({ "@type": "City", name: city })),
    offers: {
      "@type": "Offer",
      price,
      priceCurrency: "COP",
      url: absoluteUrl(localePath(lang, `/reservar?service=${slug}`)),
    },
  };
}
