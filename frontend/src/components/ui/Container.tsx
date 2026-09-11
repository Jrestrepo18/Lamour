import { createElement, type ReactNode } from "react";
import clsx from "clsx";

export function Container({
  children,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
}) {
  return createElement(Tag, { className: clsx("mx-auto w-full max-w-6xl px-5 sm:px-8", className) }, children);
}
