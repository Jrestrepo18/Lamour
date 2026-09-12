import { getMasseuses, getServiceCategories } from "@/lib/api";
import { Hero } from "@/components/home/Hero";
import { Manifesto } from "@/components/home/Manifesto";
import { FeaturedServices } from "@/components/home/FeaturedServices";
import { MasseusesTeaser } from "@/components/home/MasseusesTeaser";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { CoverageSection } from "@/components/home/CoverageSection";
import { FaqSection } from "@/components/home/FaqSection";
import { PhotoCarousel } from "@/components/home/PhotoCarousel";
import { FinalCta } from "@/components/home/FinalCta";
import { ScrollTint } from "@/components/home/ScrollTint";

const FEATURED_SLUGS = ["ritual-lamour-full-nuru", "masaje-sensorial", "masaje-voyerista"];

export default async function HomePage() {
  const [{ data: categories }, { data: masseuses }] = await Promise.all([getServiceCategories(), getMasseuses()]);

  const allServices = categories.flatMap((c) => c.services);
  const featured = FEATURED_SLUGS.map((slug) => allServices.find((s) => s.slug === slug)).filter(
    (s): s is NonNullable<typeof s> => !!s,
  );

  return (
    <>
      <Hero />
      <ScrollTint>
        <Manifesto />
        <FeaturedServices services={featured} />
        <MasseusesTeaser masseuses={masseuses} />
        <HowItWorksSection />
        <CoverageSection />
        <FaqSection />
        <PhotoCarousel />
      </ScrollTint>
      <FinalCta />
    </>
  );
}
