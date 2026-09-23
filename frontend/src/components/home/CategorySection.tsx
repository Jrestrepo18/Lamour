import { Sparkle } from "lucide-react";
import type { ServiceCategory } from "@/lib/types";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ServiceCard } from "./ServiceCard";

export function CategorySection({
  category,
  eyebrow,
  tinted = false,
}: {
  category: ServiceCategory;
  eyebrow: string;
  tinted?: boolean;
}) {
  return (
    <section id={category.slug} className={tinted ? "bg-silk/45 py-16 sm:py-32" : "py-16 sm:py-32"}>
      <Container>
        <Reveal>
          <SectionHeading eyebrow={eyebrow} title={category.name} description={category.description ?? undefined} />
        </Reveal>

        {category.highlight && (
          <Reveal delay={0.1}>
            <p className="mt-8 inline-flex items-center gap-3 rounded-full border border-gold/35 bg-gold/10 px-5 py-2.5 text-sm text-ink">
              <Sparkle size={15} className="shrink-0 text-bronze" aria-hidden />
              {category.highlight}
            </p>
          </Reveal>
        )}

        <div className="mt-8 grid grid-cols-1 border-t border-ink/10 sm:mt-10 sm:grid-cols-2 sm:gap-6 sm:border-t-0 lg:grid-cols-3">
          {category.services.map((service, i) => (
            <Reveal key={service.id} delay={0.06 * (i % 3)}>
              <ServiceCard service={service} categorySlug={category.slug} index={i} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
