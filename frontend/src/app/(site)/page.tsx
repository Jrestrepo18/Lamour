import type { Metadata } from "next";
import { getServiceCategories } from "@/lib/api";
import { Hero } from "@/components/home/Hero";
import { Manifesto } from "@/components/home/Manifesto";
import { FeaturedServices } from "@/components/home/FeaturedServices";
import { SensesSection } from "@/components/home/SensesSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { CoverageSection } from "@/components/home/CoverageSection";
import { FaqSection } from "@/components/home/FaqSection";
import { FinalCta } from "@/components/home/FinalCta";
import { ScrollTint } from "@/components/home/ScrollTint";
import { TrustHighlights } from "@/components/home/TrustHighlights";

export const metadata: Metadata = { alternates: { canonical: "/" } };

const FEATURED_SLUGS = ["ritual-lamour-full-nuru", "masaje-sensorial", "masaje-voyerista"];

export default async function HomePage() {
  const { data: categories } = await getServiceCategories();

  const allServices = categories.flatMap((c) => c.services);
  const featured = FEATURED_SLUGS.map((slug) => allServices.find((s) => s.slug === slug)).filter(
    (s): s is NonNullable<typeof s> => !!s,
  );

  return (
    <>
      <Hero />
      <ScrollTint>
        <TrustHighlights />
        <Manifesto />
        <FeaturedServices services={featured} />
        <SensesSection />
        <HowItWorksSection />
        <CoverageSection />
        <FaqSection />
        {/* Inside the tint so its top edge dissolves into the same warm backdrop. */}
        <FinalCta />
      </ScrollTint>
    </>
  );
}
