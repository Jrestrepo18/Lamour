import { Sparkle } from "lucide-react";
import type { ServiceCategory } from "@/lib/types";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { asymmetricDirection } from "@/lib/motion";
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
    <section id={category.slug} className={tinted ? "bg-silk/40 py-28 sm:py-36" : "py-28 sm:py-36"}>
      <Container>
        {/* Editorial masthead: big asymmetric title on the left, description as a narrow column on the right */}
        <div className="grid grid-cols-1 gap-8 border-b border-ink/10 pb-10 lg:grid-cols-[1.6fr_1fr] lg:items-end lg:gap-16">
          <Reveal from="left">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-terracotta">{eyebrow}</p>
            <h2 className="font-serif text-4xl italic leading-[1.05] text-ink text-balance sm:text-6xl">
              {category.name}
            </h2>
          </Reveal>
          {category.description && (
            <Reveal from="right" delay={0.1}>
              <p className="text-sm leading-relaxed text-ink-soft lg:text-right">{category.description}</p>
            </Reveal>
          )}
        </div>

        {category.highlight && (
          <Reveal delay={0.15}>
            <div className="mt-8 flex items-center gap-3 rounded-full border border-gold/30 bg-gold/10 px-5 py-3 text-xs font-medium uppercase tracking-wide text-gold-dark">
              <Sparkle size={16} className="shrink-0" />
              <span>{category.highlight}</span>
            </div>
          </Reveal>
        )}

        <div className="mt-4">
          {category.services.map((service, i) => (
            <Reveal key={service.id} delay={0.06 * (i % 4)} from={asymmetricDirection(i)}>
              <ServiceCard service={service} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
