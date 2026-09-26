import type { Metadata } from "next";
import { getServiceCategories } from "@/server/catalog";
import { catalogSection, localizeCatalog } from "@/lib/catalog";
import { PageHeader } from "@/components/ui/PageHeader";
import { CategoryNav, catalogSections } from "@/components/services/CatalogSections";
import { FinalCta } from "@/components/home/FinalCta";
import { JsonLd } from "@/components/seo/JsonLd";
import { catalogJsonLd, pageMetadata } from "@/lib/seo";
import { PHOTOS } from "@/lib/photos";
import { getI18n } from "@/i18n/server";

/** Catalog pages regenerate at most once a minute (and right after an admin edit). */
export const revalidate = 60;

const title = (t: (es: string, en: string) => string) =>
  t("Masajes tántricos a domicilio en Medellín", "Tantric massage at your home or hotel in Medellín");

/**
 * The adult section of the catalog (see lib/catalog.ts). Every page under this
 * path carries `<meta name="rating" content="adult">`, as Google asks of sites
 * with explicit content, so the rest of the site isn't classified with it.
 */
export async function generateMetadata(): Promise<Metadata> {
  const { t, lang } = await getI18n();
  return pageMetadata({
    lang,
    path: "/masajes-tantricos",
    adult: true,
    title: title(t),
    description: t(
      "Masajes tántricos y sensoriales a domicilio en Medellín: Full Nuru, cuatro manos, cuerpo a cuerpo y más. Solo mayores de 18, con total discreción.",
      "Tantric and sensory massages at your home or hotel in Medellín: Full Nuru, four hands, body to body and more. Adults only (18+), fully discreet.",
    ),
  });
}

export default async function MasajesTantricosPage() {
  const { t, lang } = await getI18n();
  const { data } = await getServiceCategories();
  const categories = catalogSection(localizeCatalog(data, lang), "adult");
  const { sections, lastBackground } = catalogSections(categories, lang);

  return (
    <>
      <JsonLd data={catalogJsonLd({ name: title(t), path: "/masajes-tantricos", categories, lang })} />
      <PageHeader
        path="/masajes-tantricos"
        eyebrow={title(t)}
        title={t("Rituales solo para adultos", "Adults-only rituals")}
        description={t(
          "Nuestras experiencias más íntimas, exclusivas para mayores de 18 años, en la privacidad de tu espacio y con absoluta discreción.",
          "Our most intimate experiences, exclusively for adults over 18, in the privacy of your space and with complete discretion.",
        )}
        photo={PHOTOS.candlesGlow}
      />
      <CategoryNav categories={categories} extra={{ href: "/servicios", label: t("Relajación y spa", "Relaxation & spa") }} />
      {sections}
      <FinalCta className={lastBackground} />
    </>
  );
}
