import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { getMasseuses } from "@/server/catalog";
import { PageHeader } from "@/components/ui/PageHeader";
import { MasseusesSection } from "@/components/home/MasseusesSection";
import { FinalCta } from "@/components/home/FinalCta";
import { PHOTOS } from "@/lib/photos";

/** Catalog pages regenerate at most once a minute (and right after an admin edit). */
export const revalidate = 60;

const TITLE = "Masajistas a domicilio en Medellín, certificadas";
const DESCRIPTION =
  "Conoce a las masajistas certificadas de L'AMOUR en Medellín: técnica, presencia y absoluta discreción. Elige con quién vivir tu masaje a domicilio.";

export const metadata: Metadata = pageMetadata({ title: TITLE, description: DESCRIPTION, path: "/masajistas" });

export default async function MasajistasPage() {
  const { data: masseuses } = await getMasseuses();

  return (
    <>
      <PageHeader
        path="/masajistas"
        eyebrow="Masajistas a domicilio en Medellín"
        title="Nuestro equipo"
        description="Terapeutas certificadas, seleccionadas por su técnica, presencia y absoluta discreción. Elige con quién vivir tu experiencia."
        photo={PHOTOS.shoulders}
      />
      <MasseusesSection masseuses={masseuses} />
      <FinalCta />
    </>
  );
}
