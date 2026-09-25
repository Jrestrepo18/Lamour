import Link from "next/link";
import { ArrowUpRight, ShieldCheck } from "lucide-react";
import type { ServiceCategory } from "@/lib/types";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { CategorySection } from "@/components/home/CategorySection";
import { CouplesSection } from "@/components/home/CouplesSection";

/** Short chip labels — the full category names are too long for a one-line pill row on a phone. */
const CATEGORY_SHORT: Record<string, string> = {
  "eroticos-tantricos": "Tántricos",
  "terapias-especiales": "Terapias especiales",
  sensoriales: "Sensoriales",
  "experiencias-pareja": "En pareja",
  "relajacion-muscular": "Relajación",
};

const CATEGORY_EYEBROW: Record<string, string> = {
  "eroticos-tantricos": "Nuestro ritual insignia",
  "terapias-especiales": "Terapias especiales",
  sensoriales: "Sentidos al límite",
  "relajacion-muscular": "Bienestar físico",
};

const COUPLES = "experiencias-pareja";
const anchorOf = (slug: string) => (slug === COUPLES ? "pareja" : slug);

/** Quick jump between categories — sticky under the header, swipeable on phones. */
export function CategoryNav({
  categories,
  extra,
}: {
  categories: ServiceCategory[];
  /** A trailing chip to the other catalog section. */
  extra?: { href: string; label: string };
}) {
  const chip =
    "inline-flex min-h-10 items-center whitespace-nowrap rounded-full px-4 text-xs font-medium transition-colors";
  return (
    <nav
      aria-label="Categorías"
      className="sticky top-[4.5rem] z-30 mx-auto mt-4 w-fit max-w-[calc(100%-2rem)] rounded-full border border-ink/10 bg-ivory/95 shadow-[0_8px_32px_-16px_rgba(23,23,23,0.3)] sm:top-20 sm:mt-6"
    >
      <ul className="flex gap-1 overflow-x-auto overflow-y-hidden px-1.5 py-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {categories.map((c) => (
          <li key={c.id} className="shrink-0">
            <a href={`#${anchorOf(c.slug)}`} className={`${chip} text-ink-soft hover:bg-silk hover:text-ink`}>
              {CATEGORY_SHORT[c.slug] ?? c.name}
            </a>
          </li>
        ))}
        {extra && (
          <li className="shrink-0">
            <Link href={extra.href} className={`${chip} gap-1 text-bronze hover:bg-silk hover:text-ink`}>
              {extra.label}
              <ArrowUpRight size={13} aria-hidden />
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}

/**
 * The catalog sections of one section of the site, in order. Light sections
 * alternate plain / silk tint (the couples category is always the dark
 * "evening" moment). Returns the background of the last section, so the page
 * can hand it to FinalCta and the photo fades in from exactly that colour.
 */
export function catalogSections(categories: ServiceCategory[]) {
  let light = 0;
  let lastBackground: string | undefined;
  const sections = categories.map((category) => {
    if (category.slug === COUPLES) {
      lastBackground = "bg-ink";
      return <CouplesSection key={category.id} category={category} />;
    }
    const tinted = light++ % 2 === 1;
    lastBackground = tinted ? "bg-silk/45" : undefined;
    return (
      <CategorySection
        key={category.id}
        category={category}
        eyebrow={CATEGORY_EYEBROW[category.slug] ?? "Catálogo"}
        tinted={tinted}
      />
    );
  });
  return { sections, lastBackground };
}

/**
 * The general catalog's doorway to the adult section: says what's there and
 * that it's +18, without describing it — the explicit copy lives only on the
 * pages marked rating=adult.
 */
export function AdultSectionDoor() {
  return (
    <section className="pt-12 sm:pt-20">
      <Container>
        <Reveal>
          <Link
            href="/masajes-tantricos"
            className="group flex flex-col gap-5 rounded-[2rem] border border-gold/30 bg-gradient-to-br from-champagne/40 via-ivory to-silk p-7 transition-[transform,border-color] duration-300 hover:-translate-y-0.5 hover:border-gold/60 sm:flex-row sm:items-center sm:justify-between sm:p-10"
          >
            <div className="max-w-xl">
              <p className="eyebrow">
                <ShieldCheck size={14} aria-hidden /> Solo mayores de 18
              </p>
              <h2 className="mt-4 font-serif text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                Masajes tántricos y rituales sensoriales
              </h2>
              <p className="mt-3 text-base leading-relaxed text-ink-soft">
                Nuestro ritual insignia y las experiencias más íntimas de L&apos;AMOUR tienen su propia sección, con
                precios, duración y todos los detalles.
              </p>
            </div>
            <span className="inline-flex min-h-12 shrink-0 items-center gap-2 self-start rounded-full bg-ink px-6 text-sm font-semibold text-ivory sm:self-center">
              Ver rituales tántricos
              <ArrowUpRight size={16} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </span>
          </Link>
        </Reveal>
      </Container>
    </section>
  );
}
