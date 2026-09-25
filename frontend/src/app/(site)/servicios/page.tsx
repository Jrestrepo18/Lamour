import type { Metadata } from "next";
import { getServiceCategories } from "@/lib/api";
import { catalogSection } from "@/lib/catalog";
import { PageHeader } from "@/components/ui/PageHeader";
import { AdultSectionDoor, CategoryNav, catalogSections } from "@/components/services/CatalogSections";
import { FinalCta } from "@/components/home/FinalCta";
import { JsonLd } from "@/components/seo/JsonLd";
import { catalogJsonLd, pageMetadata } from "@/lib/seo";
import { PHOTOS } from "@/lib/photos";

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
        title="Servicios"
        description="Terapias con calor, experiencias en pareja y masajes de relajación y recuperación muscular, llevados hasta tu espacio."
        photo={PHOTOS.oilBowl}
      />
      <CategoryNav categories={categories} extra={{ href: "/masajes-tantricos", label: "Tántricos +18" }} />
      <AdultSectionDoor />
      {sections}
      <FinalCta className={lastBackground} />
    </>
  );
}
