import { getMasseuses, getServiceCategories } from "@/lib/api";
import { Hero } from "@/components/home/Hero";
import { PhotoGallery } from "@/components/home/PhotoGallery";
import { Manifesto } from "@/components/home/Manifesto";
import { FeaturedServices } from "@/components/home/FeaturedServices";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { CoverageSection } from "@/components/home/CoverageSection";
import { FinalCta } from "@/components/home/FinalCta";
import { ScrollTint } from "@/components/home/ScrollTint";

const FEATURED_SLUGS = ["ritual-lamour-full-nuru", "masaje-sensorial", "masaje-voyerista"];

export default async function HomePage() {
  const [{ data: categories }] = await Promise.all([getServiceCategories(), getMasseuses()]);

  const allServices = categories.flatMap((c) => c.services);
  const featured = FEATURED_SLUGS.map((slug) => allServices.find((s) => s.slug === slug)).filter(
    (s): s is NonNullable<typeof s> => !!s,
  );

  return (
    <>
      <Hero />
      <PhotoGallery />
      <ScrollTint>
        <Manifesto />
        <FeaturedServices services={featured} />
        <HowItWorksSection />
        <CoverageSection />
      </ScrollTint>
      <FinalCta />
    </>
  );
}
