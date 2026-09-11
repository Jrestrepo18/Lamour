import { getServiceCategories } from "@/lib/api";
import { PageHeader } from "@/components/ui/PageHeader";
import { CategorySection } from "@/components/home/CategorySection";
import { CouplesSection } from "@/components/home/CouplesSection";
import { FinalCta } from "@/components/home/FinalCta";

export const metadata = {
  title: "Servicios | L'AMOUR — Estética y Sentidos",
  description:
    "Catálogo completo de masajes tántricos, terapias especiales, sesiones sensoriales, experiencias en pareja y relajación muscular a domicilio en Medellín.",
};

export default async function ServiciosPage() {
  const { data: categories } = await getServiceCategories();

  const bySlug = (slug: string) => categories.find((c) => c.slug === slug);

  const eroticos = bySlug("eroticos-tantricos");
  const especiales = bySlug("terapias-especiales");
  const sensoriales = bySlug("sensoriales");
  const pareja = bySlug("experiencias-pareja");
  const relajacion = bySlug("relajacion-muscular");

  return (
    <>
      <PageHeader
        eyebrow="Catálogo completo"
        title="Servicios"
        description="Cinco categorías de rituales, cada una diseñada para un propósito distinto: liberar, conectar, relajar o recuperar."
      />

      {eroticos && <CategorySection category={eroticos} eyebrow="Nuestro Ritual Insignia" />}
      {especiales && <CategorySection category={especiales} eyebrow="Terapias Especiales" tinted />}
      {sensoriales && <CategorySection category={sensoriales} eyebrow="Sentidos al Límite" />}
      {pareja && <CouplesSection category={pareja} />}
      {relajacion && <CategorySection category={relajacion} eyebrow="Bienestar Físico" tinted />}

      <FinalCta />
    </>
  );
}
