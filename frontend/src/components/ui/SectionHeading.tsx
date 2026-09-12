import clsx from "clsx";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  light = false,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  light?: boolean;
}) {
  return (
    <div className={clsx("max-w-2xl", align === "center" && "mx-auto text-center")}>
      {eyebrow && (
        <p
          className={clsx(
            "mb-3 text-xs font-sans font-semibold uppercase tracking-[0.3em]",
            light ? "text-champagne" : "text-gold-dark",
          )}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={clsx(
          "font-serif text-3xl sm:text-4xl text-balance",
          light ? "text-ivory" : "text-ink",
        )}
      >
        {title}
      </h2>
      {description && (
        <p className={clsx("mt-4 font-sans text-base leading-relaxed", light ? "text-ivory/75" : "text-[var(--tone-body)]")}>
          {description}
        </p>
      )}
    </div>
  );
}
