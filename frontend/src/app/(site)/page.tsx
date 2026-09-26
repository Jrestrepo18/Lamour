import type { Metadata } from "next";
import { getReviews, getServiceCategories } from "@/server/catalog";
import { findService, servicePath } from "@/lib/catalog";
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
import { ReviewsSection } from "@/components/reviews/ReviewsSection";

/** Catalog pages regenerate at most once a minute (and right after an admin edit). */
export const revalidate = 60;

export const metadata: Metadata = { alternates: { canonical: "/" } };

/**
 * Only general-section rituals on the home page: an adult ritual here would get the
 * whole home page classified as explicit, and Google keeps explicit pages out of
 * non-explicit searches like "masajes a domicilio Medellín". The tantric rituals are
 * one link away (/masajes-tantricos) — see lib/catalog.ts.
 */
const FEATURED_SLUGS = ["relajacion-clasica", "piedras-volcanicas", "experiencia-en-pareja"];

export default async function HomePage() {
  const [{ data: categories }, reviews] = await Promise.all([getServiceCategories(), getReviews()]);

  const featured = FEATURED_SLUGS.map((slug) => findService(categories, slug))
    .filter((f) => f !== null)
    .map(({ service, category }) => ({ ...service, href: servicePath(service, category.slug) }));

  return (
    <>
      <Hero />
      <ScrollTint>
        <TrustHighlights />
        <Manifesto />
        <FeaturedServices services={featured} />
        <SensesSection />
        <HowItWorksSection />
        {/* Real client reviews only; hidden until there are at least three published. */}
        <ReviewsSection summary={reviews} />
        <CoverageSection />
        <FaqSection />
        {/* Inside the tint so its top edge dissolves into the same warm backdrop. */}
        <FinalCta />
      </ScrollTint>
    </>
  );
}
