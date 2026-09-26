import type { Metadata } from "next";
import { getServiceCategories } from "@/server/catalog";
import { catalogSection, localizeCatalog } from "@/lib/catalog";
import { PageHeader } from "@/components/ui/PageHeader";
import { AdultSectionDoor, CategoryNav, catalogSections } from "@/components/services/CatalogSections";
import { FinalCta } from "@/components/home/FinalCta";
import { JsonLd } from "@/components/seo/JsonLd";
import { catalogJsonLd, pageMetadata } from "@/lib/seo";
import { PHOTOS } from "@/lib/photos";
import { getI18n } from "@/i18n/server";

/** Catalog pages regenerate at most once a minute (and right after an admin edit). */
export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const { t, lang } = await getI18n();
  return pageMetadata({
    lang,
    path: "/servicios",
    title: t("Servicios y precios de masajes a domicilio", "In-home massage services and prices"),
    description: t(
      "Precios de masajes a domicilio en Medellín: piedras volcánicas, aceites calientes, masaje en pareja, relajación, reflexología y recuperación muscular.",
      "In-home and hotel massage prices in Medellín: hot stones, warm oils, couples massage, relaxation, reflexology and deep muscle recovery.",
    ),
  });
}

/**
 * The general (non-explicit) catalog. The adult rituals live on /masajes-tantricos —
 * see lib/catalog.ts — and this page only links to that section.
 */
export default async function ServiciosPage() {
  const { t, lang } = await getI18n();
  const { data } = await getServiceCategories();
  const categories = catalogSection(localizeCatalog(data, lang), "spa");
  const { sections, lastBackground } = catalogSections(categories, lang);

  return (
    <>
      <JsonLd
        data={catalogJsonLd({
          name: t("Masajes a domicilio en Medellín", "In-home massages in Medellín"),
          path: "/servicios",
          categories,
          lang,
        })}
      />
      <PageHeader
        path="/servicios"
        eyebrow={t("Masajes a domicilio en Medellín", "In-home massages in Medellín")}
        title={t("Servicios y precios", "Services & prices")}
        description={t(
          "Terapias con calor, experiencias en pareja y masajes de relajación y recuperación muscular, llevados hasta tu espacio.",
          "Heat therapies, couples experiences and relaxation and muscle-recovery massages, brought to your home or hotel.",
        )}
        photo={PHOTOS.backFlowers}
      />
      <CategoryNav categories={categories} extra={{ href: "/masajes-tantricos", label: t("Tántricos +18", "Tantric 18+") }} />
      <AdultSectionDoor />
      {sections}
      <FinalCta className={lastBackground} />
    </>
  );
}
