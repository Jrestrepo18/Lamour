import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { getServiceCategories } from "@/server/catalog";
import { getI18n } from "@/i18n/server";
import { catalogSection, findService, localizeCatalog, sectionOf, servicePath, type CatalogSection } from "./catalog";
import { serviceContent } from "./service-content-en";
import { pageMetadata } from "./seo";

export type ServiceRouteProps = { params: Promise<{ slug: string }> };

/** Shared data layer for /servicios/[slug] and /masajes-tantricos/[slug], in the page's language. */
export function serviceRoute(section: CatalogSection) {
  async function generateStaticParams() {
    const { data } = await getServiceCategories();
    return catalogSection(data, section).flatMap((c) => c.services.map((s) => ({ slug: s.slug })));
  }

  /**
   * Resolves the service for this section. A slug that belongs to the *other*
   * section redirects (308) to its canonical URL, so each service has exactly
   * one address; an unknown slug is a real 404.
   */
  async function load(slug: string) {
    const { lang, href } = await getI18n();
    const { data: raw } = await getServiceCategories();
    const data = localizeCatalog(raw, lang);
    const found = findService(data, slug);
    if (!found || !found.service.isActive) notFound();
    if (sectionOf(found.service, found.category.slug) !== section) {
      permanentRedirect(href(servicePath(found.service, found.category.slug)));
    }
    const siblings = catalogSection(data, section).flatMap((c) =>
      c.services.map((service) => ({ service, categorySlug: c.slug })),
    );
    return { ...found, siblings };
  }

  async function generateMetadata({ params }: ServiceRouteProps): Promise<Metadata> {
    const { lang, t } = await getI18n();
    const { service, category } = await load((await params).slug);
    const content = serviceContent(service.slug, lang);
    return pageMetadata({
      lang,
      title: content?.seoTitle ?? t(`${service.name} a domicilio en Medellín`, `${service.name} at your home or hotel in Medellín`),
      description: content?.seoDescription ?? service.shortDescription,
      path: servicePath(service, category.slug),
      adult: section === "adult",
    });
  }

  return { generateStaticParams, generateMetadata, load };
}
