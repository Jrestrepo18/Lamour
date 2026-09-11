import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

export function PageHeader({
  eyebrow,
  title,
  description,
  compact = false,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  compact?: boolean;
}) {
  return (
    <section
      className={
        compact
          ? "relative flex min-h-[38vh] items-end overflow-hidden bg-ink pb-12 pt-36"
          : "relative flex min-h-[60vh] items-end overflow-hidden bg-ink pb-16 pt-40 sm:min-h-[55vh]"
      }
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-6 left-1/2 -translate-x-1/2 select-none whitespace-nowrap font-serif text-[22vw] leading-none text-ivory/[0.03] sm:text-[13vw]"
      >
        {title}
      </span>
      <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-terracotta/10 blur-[120px]" />

      <Container className="relative z-10">
        <Reveal from="left">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.4em] text-gold">{eyebrow}</p>
          <h1 className="font-serif text-5xl leading-[0.95] text-ivory text-balance sm:text-7xl">{title}</h1>
        </Reveal>
        {description && (
          <Reveal delay={0.15} className="mt-6 max-w-lg">
            <p className="text-sm leading-relaxed text-ivory/60 sm:text-base">{description}</p>
          </Reveal>
        )}
      </Container>
    </section>
  );
}
