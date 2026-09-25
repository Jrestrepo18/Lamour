import type { Metadata } from "next";
import { getServiceCategories } from "@/lib/api";
import { PageHeader } from "@/components/ui/PageHeader";
import { CategorySection } from "@/components/home/CategorySection";
import { CouplesSection } from "@/components/home/CouplesSection";
import { FinalCta } from "@/components/home/FinalCta";
import { JsonLd } from "@/components/seo/JsonLd";
import { catalogJsonLd, pageMetadata } from "@/lib/seo";
import { PHOTOS } from "@/lib/photos";

const TITLE = "Servicios y precios de masajes a domicilio";
const DESCRIPTION =
  "Catálogo completo con precios: masajes tántricos, terapias con piedras y aceites calientes, sesiones sensoriales, experiencias en pareja y relajación muscular a domicilio en Medellín.";

/** Short chip labels — the full category names are too long for a one-line pill row on a phone. */
const CATEGORY_SHORT: Record<string, string> = {
  "eroticos-tantricos": "Tántricos",
  "terapias-especiales": "Terapias especiales",
  sensoriales: "Sensoriales",
  "experiencias-pareja": "En pareja",
  "relajacion-muscular": "Relajación",
};

export const metadata: Metadata = pageMetadata({ title: TITLE, description: DESCRIPTION, path: "/servicios" });

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
      <JsonLd data={catalogJsonLd(categories)} />
      <PageHeader
        path="/servicios"
        eyebrow="Catálogo completo"
        title="Servicios"
        description="Cinco categorías de rituales, cada una diseñada para un propósito distinto: liberar, conectar, relajar o recuperar."
        photo={PHOTOS.oilBowl}
      />

      {/* Quick jump between categories — sticky under the header, swipeable on phones. */}
      <nav
        aria-label="Categorías"
        className="sticky top-[4.5rem] z-30 mx-auto mt-4 w-fit max-w-[calc(100%-2rem)] rounded-full border border-ink/10 bg-ivory/95 shadow-[0_8px_32px_-16px_rgba(43,32,25,0.3)] sm:top-20 sm:mt-6"
      >
        <ul className="flex gap-1 overflow-x-auto overflow-y-hidden px-1.5 py-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {categories.map((c) => (
            <li key={c.id} className="shrink-0">
              <a
                href={`#${c.slug === "experiencias-pareja" ? "pareja" : c.slug}`}
                className="inline-flex min-h-10 items-center whitespace-nowrap rounded-full px-4 text-xs font-medium text-ink-soft transition-colors hover:bg-silk hover:text-ink"
              >
                {CATEGORY_SHORT[c.slug] ?? c.name}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {eroticos && <CategorySection category={eroticos} eyebrow="Nuestro ritual insignia" />}
      {especiales && <CategorySection category={especiales} eyebrow="Terapias especiales" tinted />}
      {sensoriales && <CategorySection category={sensoriales} eyebrow="Sentidos al límite" />}
      {pareja && <CouplesSection category={pareja} />}
      {relajacion && <CategorySection category={relajacion} eyebrow="Bienestar físico" tinted />}

      {/* Same tint as the Relajación section right above, so the CTA photo fades in from it. */}
      <FinalCta className="bg-silk/45" />
    </>
  );
}
