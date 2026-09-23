"use client";

import { useRef } from "react";
import { MapPin } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { useGsapContext } from "@/hooks/useGsapContext";
import { FadeInImage } from "@/components/ui/FadeInImage";
import { Reveal } from "@/components/ui/Reveal";
import { PHOTOS } from "@/lib/photos";

// Compass points around the circle's own edge, not corners of its bounding
// box — a corner (e.g. "bottom-10 left-10") falls outside the circle's
// radius, so an earlier version got clipped by the mask the moment a label
// sat near one. Pinning each label to N/E/S/W of the circle instead means it
// straddles the edge exactly, and it lives in the unmasked wrapper (see
// below) so there's nothing left to clip it against.
const LABELS = [
  { name: "Bello", className: "left-1/2 top-[7%] -translate-x-1/2 -translate-y-1/2" },
  { name: "Rionegro", className: "left-[93%] top-1/2 -translate-x-1/2 -translate-y-1/2" },
  { name: "Envigado", className: "left-1/2 top-[93%] -translate-x-1/2 -translate-y-1/2" },
  { name: "Itagüí", className: "left-[7%] top-1/2 -translate-x-1/2 -translate-y-1/2" },
];

/**
 * The coverage circle: a real photo (parallaxed on scroll, oversized 10% on
 * each side so the pan never reveals an edge) inside a rounded mask, with
 * three staggered "radar" rings pulsing outward from the center pin — a
 * literal read of "coverage area" over the same warm, photographic language
 * the rest of the site uses (Hero, Manifesto), rather than a data-viz map.
 *
 * The photo mask and the compass labels are two separate layers: the mask
 * needs `overflow-hidden` to keep the photo circular, but that same overflow
 * would clip anything positioned on the circle's edge — so the labels live
 * one level up, in a wrapper with no clipping, and the masked circle is
 * inset slightly inside it to leave them room.
 */
export function CoverageParallaxPhoto() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);

  useGsapContext(() => {
    if (!wrapperRef.current || !imgRef.current) return;

    gsap.fromTo(
      imgRef.current,
      { yPercent: -8 },
      {
        yPercent: 8,
        ease: "none",
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      },
    );
  }, []);

  return (
    <Reveal delay={0.15}>
      <div ref={wrapperRef} className="relative mx-auto aspect-square w-full max-w-md">
        <div className="absolute inset-[9%] overflow-hidden rounded-full border border-gold/25 shadow-xl">
          <div ref={imgRef} className="absolute inset-[-10%]">
            <FadeInImage
              src={PHOTOS.suite.src}
              alt={PHOTOS.suite.alt}
              fill
              sizes="(min-width: 1024px) 26rem, 82vw"
              className="object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-ink/25" />

          {[0, 1, 2].map((i) => (
            <span
              key={i}
              aria-hidden
              className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-gold/70 animate-radar-pulse"
              style={{ animationDelay: `${i}s` }}
            />
          ))}

          <div className="absolute inset-6 rounded-full border border-ivory/30" />
          <div className="absolute inset-14 rounded-full border border-ivory/20" />
          <div className="absolute inset-1/2 z-10 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-gold text-ink shadow-lg">
            <MapPin size={26} aria-hidden />
          </div>
        </div>

        {LABELS.map((l) => (
          <span
            key={l.name}
            className={`absolute z-10 whitespace-nowrap rounded-full border border-gold/25 bg-ivory px-3.5 py-1.5 text-xs font-sans font-semibold uppercase tracking-widest text-ink shadow-md ${l.className}`}
          >
            {l.name}
          </span>
        ))}
      </div>
    </Reveal>
  );
}
