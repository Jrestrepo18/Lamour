import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RootDocument, rootViewport } from "../root-document";
import { isLocale, LOCALES, OG_LOCALE, translator } from "@/i18n/config";
import { SITE, siteDescription } from "@/lib/seo";

export const viewport = rootViewport;

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = translator(lang);
  const title = t("L'AMOUR | Spa y masajes a domicilio en Medellín", "L'AMOUR | In-home spa & massage in Medellín");
  const description = siteDescription(lang);
  return {
    metadataBase: new URL(SITE.url),
    title: { default: title, template: "%s | L'AMOUR" },
    description,
    applicationName: SITE.shortName,
    authors: [{ name: SITE.name }],
    creator: SITE.name,
    category: "health & beauty",
    openGraph: { type: "website", locale: OG_LOCALE[lang], url: lang === "en" ? "/en" : "/", siteName: SITE.name, title, description },
    twitter: { card: "summary_large_image", title, description },
    // No index/follow here: indexable is already the default, and declaring it at the root
    // leaked "index, follow" into the 404 next to Next's own "noindex". Canonicals are set
    // per page for the same reason (a root canonical made every page without one claim "/").
    robots: { googleBot: { "max-image-preview": "large", "max-snippet": -1 } },
    ...(SITE.googleVerification ? { verification: { google: SITE.googleVerification } } : {}),
    formatDetection: { telephone: false },
  };
}

export default async function LangLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return (
    <RootDocument lang={lang}>{children}</RootDocument>
  );
}
