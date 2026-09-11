import { type ButtonHTMLAttributes, type ReactNode } from "react";
import Link from "next/link";
import clsx from "clsx";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

const base =
  "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full font-sans font-medium tracking-wide transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-terracotta text-ivory shadow-[0_10px_28px_-10px_rgba(165,80,42,0.65)] hover:-translate-y-0.5 hover:bg-terracotta-dark hover:shadow-[0_14px_34px_-8px_rgba(165,80,42,0.75)] active:translate-y-0 active:scale-[0.98]",
  secondary:
    "border border-gold/50 bg-white/5 text-ink backdrop-blur-md hover:-translate-y-0.5 hover:border-gold hover:bg-gold/10 active:translate-y-0 active:scale-[0.98]",
  ghost: "text-ink-soft hover:text-ink underline-offset-4 hover:underline",
};

const sizes: Record<Size, string> = {
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-base",
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  className?: string;
}

function Shine() {
  return (
    <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
  );
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={clsx(base, variants[variant], sizes[size], className)} {...props}>
      {variant === "primary" && <Shine />}
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
      {variant === "primary" && <Shine />}
      {children}
    </Link>
  );
}
