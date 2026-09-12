"use client";

import { useRef } from "react";
import { MapPin } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { useGsapContext } from "@/hooks/useGsapContext";
import { FadeInImage } from "@/components/ui/FadeInImage";
import { Reveal } from "@/components/ui/Reveal";

const LABELS = [
  { name: "Bello", className: "left-1/2 top-8 -translate-x-1/2" },
  { name: "Itagüí", className: "bottom-10 left-10" },
  { name: "Envigado", className: "bottom-10 right-8" },
  { name: "Rionegro", className: "right-6 top-1/2 -translate-y-1/2" },
];

/**
 * The coverage circle: a real photo (parallaxed on scroll, oversized 10% on
 * each side so the pan never reveals an edge) inside a rounded mask, with
 * three staggered "radar" rings pulsing outward from the center pin — a
 * literal read of "coverage area" rather than a static decorative graphic.
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
      <div
        ref={wrapperRef}
        className="relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-full border border-gold/25 shadow-xl"
      >
        <div ref={imgRef} className="absolute inset-[-10%]">
          <FadeInImage
            src="/images/spa-bath-tray.jpg"
            alt="Ritual de baño con velas, sales y aceites"
            fill
            sizes="(min-width: 1024px) 28rem, 90vw"
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
        <div className="absolute inset-1/2 z-10 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-gold text-ivory shadow-lg">
          <MapPin size={26} />
        </div>

        {LABELS.map((l) => (
          <span
            key={l.name}
            className={`absolute ${l.className} text-xs font-sans font-medium uppercase tracking-widest text-ivory drop-shadow-md`}
          >
            {l.name}
          </span>
        ))}
      </div>
    </Reveal>
  );
}
