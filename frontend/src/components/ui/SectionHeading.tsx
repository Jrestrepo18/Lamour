import clsx from "clsx";
import type { ReactNode } from "react";

/**
 * The single section masthead used across the site: eyebrow (gold rule +
 * bronze small caps), a large heading, and an optional lede. Every home
 * section and every catalog section goes through this, so the rhythm and
 * type scale are identical page to page.
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  light = false,
  as: Tag = "h2",
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "center" | "left";
  light?: boolean;
  as?: "h1" | "h2";
  className?: string;
}) {
  return (
    <div className={clsx("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && (
        <p className={clsx("eyebrow", align === "center" && "justify-center", light && "!text-champagne")}>
          {eyebrow}
        </p>
      )}
      <Tag
        className={clsx(
          "mt-4 font-serif text-4xl font-semibold leading-[1.05] tracking-tight text-balance sm:text-5xl",
          light ? "text-ivory" : "text-ink",
        )}
      >
        {title}
      </Tag>
      {description && (
        <p
          className={clsx(
            "mt-5 max-w-xl text-base leading-relaxed",
            align === "center" && "mx-auto",
            light ? "text-ivory/75" : "text-[var(--tone-body)]",
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
