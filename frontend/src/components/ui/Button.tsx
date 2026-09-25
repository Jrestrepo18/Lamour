import { type ComponentPropsWithRef, type ReactNode } from "react";
import Link from "next/link";
import clsx from "clsx";

/**
 * The one button system for the whole product — public site, booking flow,
 * login and admin. Quiet-luxury palette: a warm ink (café) primary with ivory
 * text (15:1 contrast) instead of a loud accent, gold reserved for the thin
 * details. `light` is the inverted primary for use on dark surfaces.
 */
type Variant = "primary" | "secondary" | "ghost" | "light" | "danger";
type Size = "sm" | "md" | "lg";

const base =
  "group relative inline-flex cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-full font-sans font-medium tracking-wide transition-[transform,background-color,border-color,color,box-shadow] duration-300 ease-out disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary:
    "bg-ink text-ivory shadow-[0_12px_30px_-14px_rgba(23,23,23,0.7)] hover:-translate-y-0.5 hover:bg-espresso hover:shadow-[0_18px_36px_-14px_rgba(23,23,23,0.75)] active:translate-y-0 active:scale-[0.98]",
  secondary:
    "border border-ink/15 bg-marfil/50 text-ink hover:-translate-y-0.5 hover:border-gold hover:bg-marfil/80 active:translate-y-0 active:scale-[0.98]",
  ghost: "text-ink-soft hover:text-ink underline-offset-4 hover:underline",
  light:
    "bg-ivory text-ink shadow-[0_12px_30px_-14px_rgba(0,0,0,0.6)] hover:-translate-y-0.5 hover:bg-champagne active:translate-y-0 active:scale-[0.98]",
  danger: "border border-red-200 bg-marfil/60 text-red-700 hover:border-red-300 hover:bg-red-50",
};

const sizes: Record<Size, string> = {
  sm: "min-h-9 px-4 py-2 text-xs",
  md: "min-h-11 px-6 py-3 text-sm",
  lg: "min-h-13 px-8 py-4 text-base",
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  className?: string;
}

/** A soft gold sheen that sweeps across filled buttons on hover. */
function Shine() {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-gold/25 to-transparent transition-transform duration-700 group-hover:translate-x-full"
    />
  );
}

const hasShine = (v: Variant) => v === "primary" || v === "light";

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  type = "button",
  ...props
}: CommonProps & Omit<ComponentPropsWithRef<"button">, "children">) {
  return (
    <button type={type} className={clsx(base, variants[variant], sizes[size], className)} {...props}>
      {hasShine(variant) && <Shine />}
      {children}
    </button>
  );
}

export function LinkButton({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
}: CommonProps & { href: string }) {
  return (
    <Link href={href} className={clsx(base, variants[variant], sizes[size], className)}>
      {hasShine(variant) && <Shine />}
      {children}
    </Link>
  );
}
