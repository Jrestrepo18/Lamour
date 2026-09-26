import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { getMasseuses } from "@/server/catalog";
import { localizeMasseuses } from "@/lib/catalog";
import { PageHeader } from "@/components/ui/PageHeader";
import { MasseusesSection } from "@/components/home/MasseusesSection";
import { FinalCta } from "@/components/home/FinalCta";
import { PHOTOS } from "@/lib/photos";
import { getI18n } from "@/i18n/server";

/** Catalog pages regenerate at most once a minute (and right after an admin edit). */
export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const { t, lang } = await getI18n();
  return pageMetadata({
    lang,
    path: "/masajistas",
    title: t("Masajistas a domicilio en Medellín, certificadas", "Certified massage therapists in Medellín"),
    description: t(
      "Conoce a las masajistas certificadas de L'AMOUR en Medellín: técnica, presencia y absoluta discreción. Elige con quién vivir tu masaje a domicilio.",
      "Meet L'AMOUR's certified massage therapists in Medellín: technique, presence and complete discretion. Choose who gives your in-home massage.",
    ),
  });
}

export default async function MasajistasPage() {
  const { t, lang } = await getI18n();
  const { data } = await getMasseuses();

  return (
    <>
      <PageHeader
        path="/masajistas"
        eyebrow={t("Masajistas a domicilio en Medellín", "In-home massage therapists in Medellín")}
        title={t("Nuestro equipo", "Our team")}
        description={t(
          "Terapeutas certificadas, seleccionadas por su técnica, presencia y absoluta discreción. Elige con quién vivir tu experiencia.",
          "Certified therapists, chosen for their technique, presence and complete discretion. Choose who will guide your experience.",
        )}
        photo={PHOTOS.shoulders}
      />
      <MasseusesSection masseuses={localizeMasseuses(data, lang)} />
      <FinalCta />
    </>
  );
}
