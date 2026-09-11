"use client";

import { useLayoutEffect, useRef, type DependencyList, type RefObject } from "react";
import { gsap } from "@/lib/gsap";

/**
 * Scopes every tween/ScrollTrigger created inside `setup` to the returned
 * ref, and reverts (kills) all of them automatically on unmount or when
 * `deps` change. This is the fix for the classic GSAP+React leak: forgetting
 * to individually `.kill()` every ScrollTrigger in a cleanup function.
 *
 * Usage:
 *   const scope = useGsapContext<HTMLDivElement>((el) => {
 *     gsap.to(el.current!.querySelector(".foo"), { ... });
 *     ScrollTrigger.create({ trigger: el.current, ... });
 *   });
 *   return <div ref={scope}>...</div>;
 */
export function useGsapContext<T extends HTMLElement = HTMLDivElement>(
  setup: (scope: RefObject<T | null>) => void,
  deps: DependencyList = [],
): RefObject<T | null> {
  const scope = useRef<T | null>(null);

  useLayoutEffect(() => {
    // `scope.current` may legitimately stay null for logic-only callers (e.g. a
    // React Three Fiber component with no DOM output) — GSAP's scope param is
    // only for selector-text convenience, so fall back to no scope rather than
    // passing it a non-DOM/null value, which GSAP warns about ("Invalid scope").
    const ctx = gsap.context(() => setup(scope), scope.current ?? undefined);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return scope;
}
