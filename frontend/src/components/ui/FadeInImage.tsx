"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";
import clsx from "clsx";

/**
 * Wraps next/image with a load-driven fade + gentle scale-settle: the image
 * starts dimmed and very slightly scaled up, and eases in once the actual
 * bytes arrive, instead of popping in abruptly. Most noticeable — and most
 * requested — on mobile, where images stream in progressively over slower
 * connections. Independent of scroll-reveal (Reveal/whileInView): this fires
 * on load, not on entering the viewport, so it still helps an image that's
 * already on screen when it finishes downloading.
 */
export function FadeInImage({ className, onLoad, ...props }: ImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    // eslint-disable-next-line jsx-a11y/alt-text -- alt is required by ImageProps and spread via ...props; the linter can't trace it through the spread
    <Image
      {...props}
      onLoad={(e) => {
        setLoaded(true);
        onLoad?.(e);
      }}
      className={clsx(
        "transition-all duration-700 ease-out",
        loaded ? "scale-100 opacity-100" : "scale-105 opacity-0",
        className,
      )}
    />
  );
}
