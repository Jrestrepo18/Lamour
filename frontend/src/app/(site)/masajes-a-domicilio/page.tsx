import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import { CITIES, cityPath } from "@/lib/cities";
import { pageMetadata } from "@/lib/seo";
import { PHOTOS } from "@/lib/photos";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { FinalCta } from "@/components/home/FinalCta";

export const metadata: Metadata = pageMetadata({
  title: "Masajes a domicilio en Medellín y el Valle de Aburrá",
  description:
    "Masajes a domicilio en Medellín, Envigado, Sabaneta, Itagüí, Bello, La Estrella, Caldas y Rionegro. Todos los días de 9:00 a.m. a 9:00 p.m.",
  path: "/masajes-a-domicilio",
});

/** Hub for the municipality pages — one crawlable entry point to every local landing page. */
export default function CoberturaPage() {
  const places = [
    ...CITIES.map((c) => ({ name: c.name, href: cityPath(c), where: c.where })),
  ];

  return (
    <>
      <PageHeader
        path="/masajes-a-domicilio"
        eyebrow="Masajes a domicilio en el Valle de Aburrá"
        title="Zonas de cobertura"
        description="Llevamos cada ritual hasta tu espacio en Medellín, su área metropolitana y Rionegro, todos los días de 9:00 a.m. a 9:00 p.m."
        photo={PHOTOS.suite}
      />
      <section className="pb-16 sm:pb-24">
        <Container>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {places.map((p) => (
              <li key={p.name}>
                <Link
                  href={p.href}
                  className="group flex h-full flex-col rounded-[1.5rem] border border-ink/10 bg-white/60 p-5 transition-[transform,border-color] duration-300 hover:-translate-y-0.5 hover:border-gold/50"
                >
                  <MapPin size={18} className="text-bronze" aria-hidden />
                  <span className="mt-3 font-serif text-xl font-semibold text-ink">Masajes en {p.name}</span>
                  <span className="mt-1 flex-1 text-sm text-ink-soft">A domicilio, {p.where}</span>
                  <ArrowUpRight
                    size={16}
                    className="mt-4 text-bronze transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>
      <FinalCta />
    </>
  );
}
