"use client";

import { useEffect, useState, type RefObject } from "react";
import dynamic from "next/dynamic";

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

/** Static CSS fallback for reduced-motion preferences or environments without WebGL. */
function StaticGlow() {
  return (
    <div className="relative h-full w-full">
      <div className="absolute right-[15%] top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-gradient-to-br from-gold via-champagne to-gold opacity-60 blur-2xl" />
      <div className="absolute right-[18%] top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-gold opacity-80 blur-md" />
    </div>
  );
}

export function Hero3D({ triggerRef }: { triggerRef: RefObject<HTMLElement | null> }) {
  const [mode, setMode] = useState<"checking" | "3d" | "static">("checking");

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time capability check, reads browser APIs unavailable during SSR
    setMode(!prefersReducedMotion && supportsWebGL() ? "3d" : "static");
  }, []);

  if (mode === "checking") return null;
  return mode === "3d" ? <GoldBlobScene triggerRef={triggerRef} /> : <StaticGlow />;
}
