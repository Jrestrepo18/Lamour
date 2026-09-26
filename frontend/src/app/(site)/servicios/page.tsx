import type { Metadata } from "next";
import { getServiceCategories } from "@/server/catalog";
import { catalogSection } from "@/lib/catalog";
import { PageHeader } from "@/components/ui/PageHeader";
import { AdultSectionDoor, CategoryNav, catalogSections } from "@/components/services/CatalogSections";
import { FinalCta } from "@/components/home/FinalCta";
import { JsonLd } from "@/components/seo/JsonLd";
import { catalogJsonLd, pageMetadata } from "@/lib/seo";
import { PHOTOS } from "@/lib/photos";

/** Catalog pages regenerate at most once a minute (and right after an admin edit). */
export const revalidate = 60;

const TITLE = "Servicios y precios de masajes a domicilio";
const DESCRIPTION =
  "Precios de masajes a domicilio en Medellín: piedras volcánicas, aceites calientes, masaje en pareja, relajación, reflexología y recuperación muscular.";

export const metadata: Metadata = pageMetadata({ title: TITLE, description: DESCRIPTION, path: "/servicios" });

/**
 * The general (non-explicit) catalog. The adult rituals live on /masajes-tantricos —
 * see lib/catalog.ts — and this page only links to that section.
 */
export default async function ServiciosPage() {
  const { data } = await getServiceCategories();
  const categories = catalogSection(data, "spa");
  const { sections, lastBackground } = catalogSections(categories);

  return (
    <>
      <JsonLd data={catalogJsonLd({ name: "Masajes a domicilio en Medellín", path: "/servicios", categories })} />
      <PageHeader
        path="/servicios"
        eyebrow="Masajes a domicilio en Medellín"
        title="Servicios y precios"
        description="Terapias con calor, experiencias en pareja y masajes de relajación y recuperación muscular, llevados hasta tu espacio."
        photo={PHOTOS.backFlowers}
      />
      <CategoryNav categories={categories} extra={{ href: "/masajes-tantricos", label: "Tántricos +18" }} />
      <AdultSectionDoor />
      {sections}
      <FinalCta className={lastBackground} />
    </>
  );
}
