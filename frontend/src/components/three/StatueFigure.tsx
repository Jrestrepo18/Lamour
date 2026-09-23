"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import clsx from "clsx";

const GoldBlobScene = dynamic(() => import("./GoldBlobScene").then((m) => m.GoldBlobScene), {
  ssr: false,
  loading: () => null,
});

function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

/** Live 3D is a desktop enhancement: phones, reduced motion, Save-Data and no-WebGL keep the still render. */
function canUse3D(): boolean {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const largeScreen = window.matchMedia("(min-width: 1024px)").matches;
  const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true;
  return largeScreen && !reduceMotion && !saveData && supportsWebGL();
}

/**
 * The statue, framed as the centerpiece of the philosophy section.
 *
 * Phones get the pre-rendered still (63 KB WebP) breathing slowly via CSS —
 * sharp and prominent, no scrim, no three.js download. On capable desktops
 * the live scene is only fetched once the section approaches the viewport,
 * cross-fades in over the still when its first frame is ready, and pauses
 * its render loop whenever the section is scrolled away.
 */
export function StatueFigure({ className }: { className?: string }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [load3D, setLoad3D] = useState(false);
  const [visible, setVisible] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = boxRef.current;
    if (!el || !canUse3D()) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
        if (entry.isIntersecting) setLoad3D(true);
      },
      { rootMargin: "400px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={boxRef} className={clsx("relative", className)}>
      {/* Aura: soft warm light behind the figure */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[80%] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.35)_0%,rgba(232,216,176,0.25)_40%,transparent_70%)] blur-2xl"
      />

      <div
        className={clsx(
          "absolute inset-0 flex items-center justify-center transition-opacity duration-1000",
          ready ? "opacity-0" : "opacity-100",
        )}
      >
        <Image
          src="/images/hero-figure.webp"
          alt="Estatua de piedra tallada en meditación, símbolo de la pausa"
          width={720}
          height={983}
          sizes="(min-width: 1024px) 30vw, 72vw"
          className="h-[88%] w-auto animate-breathe drop-shadow-[0_30px_40px_rgba(43,32,25,0.25)]"
        />
      </div>

      {load3D && (
        <div aria-hidden className={clsx("absolute inset-0 transition-opacity duration-1000", ready ? "opacity-100" : "opacity-0")}>
          <GoldBlobScene triggerRef={boxRef} active={visible} onReady={() => setReady(true)} />
        </div>
      )}
    </div>
  );
}
