import { getMasseuses } from "@/lib/api";
import { PageHeader } from "@/components/ui/PageHeader";
import { MasseusesSection } from "@/components/home/MasseusesSection";
import { FinalCta } from "@/components/home/FinalCta";

export const metadata = {
  title: "Masajistas | L'AMOUR — Estética y Sentidos",
  description: "Conoce al equipo de terapeutas certificadas de L'AMOUR, seleccionadas por su técnica y discreción.",
};

export default async function MasajistasPage() {
  const { data: masseuses } = await getMasseuses();

  return (
    <>
      <PageHeader
        eyebrow="Nuestro equipo"
        title="Masajistas"
        description="Terapeutas certificadas, seleccionadas por su técnica, presencia y absoluta discreción. Elige con quién vivir tu experiencia."
      />
      <MasseusesSection masseuses={masseuses} />
      <FinalCta />
    </>
  );
}
