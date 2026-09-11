import { GRAIN_DATA_URI } from "@/lib/grain";

/**
 * Drop into a `relative` section, behind the content and behind any real
 * image/3D layer (per Fase 0: grain goes on flat color fields, never on top
 * of a photo/3D piece). `dark` bumps the opacity slightly since grain reads
 * more faintly against a dark ground.
 */
export function Grain({ dark = false }: { dark?: boolean }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0"
      style={{
        backgroundImage: `url("${GRAIN_DATA_URI}")`,
        opacity: dark ? 0.06 : 0.035,
        mixBlendMode: "overlay",
      }}
    />
  );
}
