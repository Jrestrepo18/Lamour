import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Grain } from "@/components/ui/Grain";
import { ParallaxMedia } from "@/components/motion/ParallaxMedia";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo";
import type { Photo } from "@/lib/photos";

/**
 * Opening masthead for every inner page. Same light, warm gradient as the home
 * Hero (ivory → champagne → silk) so no page opens on a dark screen — the
 * brand's calm register starts at the top of every route. Carries a visible
 * breadcrumb plus its BreadcrumbList structured data.
 */
export function PageHeader({
  eyebrow,
  title,
  description,
  path,
  photo,
  parent,
  compact = false,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  /** Route path of this page, e.g. "/servicios" — used for the breadcrumb. */
  path: string;
  photo?: Photo;
  /** Intermediate breadcrumb level, e.g. the catalog a service page belongs to. */
  parent?: { name: string; path: string };
  compact?: boolean;
}) {
  return (
    <section
      className={
        "relative overflow-hidden " +
        (photo
          ? "bg-ivory pb-12 lg:bg-gradient-to-br lg:from-ivory lg:via-champagne/35 lg:to-silk lg:pb-24 lg:pt-40"
          : compact
            ? "pb-14 pt-32 sm:pb-16 sm:pt-36"
            : "pb-16 pt-32 sm:pb-24 sm:pt-40") +
        (photo ? "" : " bg-gradient-to-br from-ivory via-champagne/35 to-silk")
      }
    >
      <JsonLd data={breadcrumbJsonLd([...(parent ? [parent] : []), { name: title, path }])} />
      <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-gold/20 blur-[120px]" />
      <Grain />

      <Container className="relative z-10">
        <div className={photo ? "grid lg:grid-cols-[1.4fr_1fr] lg:items-end lg:gap-16" : undefined}>
          {/* Phones: the photo runs full-bleed above the title (same language as the home hero);
              desktop: a framed portrait in the right column. */}
          {photo && (
            <div className="relative -mx-5 h-[38svh] min-h-60 overflow-hidden sm:-mx-8 lg:order-last lg:mx-0 lg:aspect-[4/5] lg:h-auto lg:max-h-[26rem] lg:min-h-0 lg:animate-rise lg:rounded-[2rem] lg:shadow-[0_30px_60px_-30px_rgba(23,23,23,0.5)] lg:[animation-delay:150ms]">
              <ParallaxMedia distance={12}>
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  priority
                  sizes="(min-width: 1024px) 32vw, 100vw"
                  className="animate-hero-settle object-cover lg:animate-none"
                />
              </ParallaxMedia>
              <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-ivory/80 to-transparent lg:hidden" />
            </div>
          )}

          <div
            className={
              photo
                ? "relative -mx-5 -mt-8 rounded-t-[2rem] bg-ivory px-5 pt-7 sm:-mx-8 sm:px-8 lg:mx-0 lg:mt-0 lg:rounded-none lg:bg-transparent lg:p-0"
                : undefined
            }
          >
            <nav aria-label="Ruta de navegación" className="mb-6 lg:mb-8">
              <ol className="flex flex-wrap items-center gap-1.5 text-xs text-ink-soft">
                <li>
                  <Link href="/" className="transition-colors hover:text-ink">
                    Inicio
                  </Link>
                </li>
                <li aria-hidden>
                  <ChevronRight size={12} />
                </li>
                {parent && (
                  <>
                    <li>
                      <Link href={parent.path} className="transition-colors hover:text-ink">
                        {parent.name}
                      </Link>
                    </li>
                    <li aria-hidden>
                      <ChevronRight size={12} />
                    </li>
                  </>
                )}
                <li aria-current="page" className="text-ink">
                  {title}
                </li>
              </ol>
            </nav>
            {/* Above the fold: CSS-only entrance (no JS wait), so the title paints — and counts as LCP — immediately. */}
            {/* The eyebrow is part of the <h1> (as on the home hero), so the search-facing
                heading carries the keywords ("… a domicilio en Medellín") while the big
                display word stays short. */}
            <h1 className="animate-rise">
              <span className="eyebrow">{eyebrow}</span>
              <span className="sr-only">: </span>
              <span className="mt-5 block font-serif text-5xl font-semibold leading-[0.95] tracking-tight text-ink text-balance sm:text-7xl">
                {title}
              </span>
            </h1>
            {description && (
              <p className="mt-6 max-w-xl animate-rise text-base leading-relaxed text-ink-soft [animation-delay:120ms] sm:text-lg">
                {description}
              </p>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
