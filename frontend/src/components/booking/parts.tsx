import Image from "next/image";
import clsx from "clsx";
import { fallbackPhoto } from "@/lib/photos";
import type { Masseuse, Service, ServiceCategory } from "@/lib/types";

/** Category slug and position of a service, so it gets the same stand-in photo it has in the catalog. */
export function serviceContext(service: Service, categories: ServiceCategory[]) {
  const category = categories.find((c) => c.id === service.serviceCategoryId);
  const index = category ? Math.max(0, category.services.findIndex((s) => s.id === service.id)) : 0;
  return { categorySlug: category?.slug, index };
}

/** A service's photo: the uploaded one, or the catalog's stand-in for its category. */
export function ServiceThumb({
  service,
  categories,
  sizes,
  className,
}: {
  service: Service;
  categories: ServiceCategory[];
  sizes: string;
  className?: string;
}) {
  const { categorySlug, index } = serviceContext(service, categories);
  const stand = fallbackPhoto(categorySlug, index);
  return (
    <div className={clsx("relative overflow-hidden bg-silk", className)}>
      {service.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element -- admin-uploaded image served by the API host
        <img src={service.imageUrl} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" />
      ) : (
        <Image src={stand.src} alt="" fill sizes={sizes} className="object-cover" />
      )}
    </div>
  );
}

/**
 * Round masseuse avatar with an Instagram story ring: gold gradient when the
 * ring is "on" (selected / featured), a quiet hairline otherwise.
 */
export function StoryAvatar({
  masseuse,
  size,
  ring,
  className,
}: {
  masseuse: Masseuse;
  size: number;
  ring: boolean;
  className?: string;
}) {
  return (
    <span
      className={clsx(
        "block shrink-0 rounded-full p-[3px] transition-[background] duration-300",
        ring ? "bg-[conic-gradient(from_210deg,#c9a227,#d6b978,#a8871a,#c9a227)]" : "bg-ink/10",
        className,
      )}
    >
      <span className="block rounded-full bg-ivory p-[3px]">
        <span
          style={{ width: size, height: size }}
          className="flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-champagne via-silk to-champagne/60"
        >
          {masseuse.photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- admin-uploaded image served by the API host
            <img src={masseuse.photoUrl} alt="" loading="lazy" className="h-full w-full object-cover" />
          ) : (
            <span className="font-serif font-semibold text-bronze" style={{ fontSize: size * 0.38 }}>
              {masseuse.stageName.slice(0, 1).toUpperCase()}
            </span>
          )}
        </span>
      </span>
    </span>
  );
}

/** Step title block, same voice as the site's section headings. */
export function StepHeading({ title, hint }: { title: string; hint: string }) {
  return (
    <div>
      <h2 className="font-serif text-[1.75rem] font-semibold leading-tight tracking-tight text-ink sm:text-3xl">{title}</h2>
      <p className="mt-2 text-[0.95rem] leading-relaxed text-[var(--tone-body)]">{hint}</p>
    </div>
  );
}

/** Small uppercase group label inside a step. */
export function GroupLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-bronze">{children}</p>;
}

/** Horizontal, edge-to-edge chip rail on phones (scrolls sideways, never traps vertical swipes). */
export const railClass =
  "-mx-5 flex touch-manipulation gap-2 overflow-x-auto overflow-y-hidden px-5 pb-1 [scrollbar-width:none] sm:-mx-8 sm:px-8 [&::-webkit-scrollbar]:hidden";

/** Same rail, but from sm up the chips simply wrap in place. */
export const wrapRailClass =
  "-mx-5 flex touch-manipulation gap-2 overflow-x-auto overflow-y-hidden px-5 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden";
