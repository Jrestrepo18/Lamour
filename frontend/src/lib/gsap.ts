import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Central place GSAP is configured. Every component that needs GSAP or
 * ScrollTrigger should import from here instead of `"gsap"` directly, so the
 * plugin is guaranteed to be registered exactly once, client-side only.
 */
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };
