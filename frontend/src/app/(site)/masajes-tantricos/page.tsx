import type { Metadata } from "next";
import { getServiceCategories } from "@/server/catalog";
import { catalogSection } from "@/lib/catalog";
import { PageHeader } from "@/components/ui/PageHeader";
import { CategoryNav, catalogSections } from "@/components/services/CatalogSections";
import { FinalCta } from "@/components/home/FinalCta";
import { JsonLd } from "@/components/seo/JsonLd";
import { catalogJsonLd, pageMetadata } from "@/lib/seo";
import { PHOTOS } from "@/lib/photos";

/** Catalog pages regenerate at most once a minute (and right after an admin edit). */
export const revalidate = 60;

const TITLE = "Masajes tántricos a domicilio en Medellín";
const DESCRIPTION =
  "Masajes tántricos y sensoriales a domicilio en Medellín: Full Nuru, cuatro manos, cuerpo a cuerpo y más. Solo mayores de 18, con total discreción.";

/**
 * The adult section of the catalog (see lib/catalog.ts). Every page under this
 * path carries `<meta name="rating" content="adult">`, as Google asks of sites
 * with explicit content, so the rest of the site isn't classified with it.
 */
export const metadata: Metadata = pageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/masajes-tantricos",
  adult: true,
});

export default async function MasajesTantricosPage() {
  const { data } = await getServiceCategories();
  const categories = catalogSection(data, "adult");
  const { sections, lastBackground } = catalogSections(categories);

  return (
    <>
      <JsonLd data={catalogJsonLd({ name: TITLE, path: "/masajes-tantricos", categories })} />
      <PageHeader
        path="/masajes-tantricos"
        eyebrow="Masajes tántricos a domicilio en Medellín"
        title="Rituales tántricos"
        description="Nuestras experiencias más íntimas, exclusivas para mayores de 18 años, en la privacidad de tu espacio y con absoluta discreción."
        photo={PHOTOS.candlesGlow}
      />
      <CategoryNav categories={categories} extra={{ href: "/servicios", label: "Relajación y spa" }} />
      {sections}
      <FinalCta className={lastBackground} />
    </>
  );
}
