import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

export function LegalArticle({ children }: { children: ReactNode }) {
  return (
    <section className="py-20 sm:py-28">
      <Container className="max-w-3xl">
        <Reveal>
          <div>{children}</div>
        </Reveal>
      </Container>
    </section>
  );
}

export function LegalSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mt-12 first:mt-0">
      <h2 className="font-serif text-2xl text-ink">{title}</h2>
      <div className="mt-4 space-y-4 text-sm leading-relaxed text-ink-soft [&_strong]:text-ink [&_a]:text-bronze [&_a]:underline [&_a]:underline-offset-2">
        {children}
      </div>
    </div>
  );
}
