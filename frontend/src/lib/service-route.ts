import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { getServiceCategories } from "./api";
import { catalogSection, findService, sectionOf, servicePath, type CatalogSection } from "./catalog";
import { SERVICE_CONTENT } from "./service-content";
import { pageMetadata } from "./seo";

export type ServiceRouteProps = { params: Promise<{ slug: string }> };

/** Shared data layer for /servicios/[slug] and /masajes-tantricos/[slug]. */
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
    const { data } = await getServiceCategories();
    const found = findService(data, slug);
    if (!found || !found.service.isActive) notFound();
    if (sectionOf(found.service, found.category.slug) !== section) {
      permanentRedirect(servicePath(found.service, found.category.slug));
    }
    const siblings = catalogSection(data, section).flatMap((c) =>
      c.services.map((service) => ({ service, categorySlug: c.slug })),
    );
    return { ...found, siblings };
  }

  async function generateMetadata({ params }: ServiceRouteProps): Promise<Metadata> {
    const { service, category } = await load((await params).slug);
    const content = SERVICE_CONTENT[service.slug];
    return pageMetadata({
      title: content?.seoTitle ?? `${service.name} a domicilio en Medellín`,
      description: content?.seoDescription ?? service.shortDescription,
      path: servicePath(service, category.slug),
      adult: section === "adult",
    });
  }

  return { generateStaticParams, generateMetadata, load };
}
