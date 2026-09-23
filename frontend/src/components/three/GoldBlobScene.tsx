"use client";

import { useCallback, useEffect, useRef, type RefObject } from "react";
import { Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sparkles, useGLTF } from "@react-three/drei";
import { MathUtils, type Group } from "three";
import { ScrollTrigger } from "@/lib/gsap";

const MODEL_URL = "/models/hero-figure.glb";

// The source export is ~1.9 world units tall; this scales it so the whole
// figure spans roughly 55-60% of the frame height at the current camera
// distance (4.4 units, fov 45) — dominant but comfortably inside the
// frustum, not the "camera sitting inside the object" bug from earlier.
const SCALE = 1.4;
// The model's own origin sits at its base (feet), not its center — offset it
// up by half its (scaled) height so it's vertically centered like the
// primitive shapes before it were.
const MODEL_HEIGHT = 1.906;

/**
 * The user's own 3D export, loaded as-is — real carved-stone detail and
 * baked lighting instead of a hand-built primitive approximation. Optimized
 * from the 52 MB source (Draco geometry compression + WebP textures at
 * 1024px + a simplify pass) down to 1.4 MB; see frontend/public/models/.
 *
 * Deliberately static on its own — no autonomous spin or float. The only
 * things that move it are the user's scroll (the callback ref on the outer
 * group, in GoldBlobScene) and cursor (PointerTilt).
 */
function HeroFigure({ onReady }: { onReady?: () => void }) {
  const { scene } = useGLTF(MODEL_URL);

  // Runs once the model has resolved out of Suspense and is in the scene —
  // StatueFigure uses it to cross-fade from the still render to the live canvas.
  useEffect(() => {
    const id = requestAnimationFrame(() => onReady?.());
    return () => cancelAnimationFrame(id);
  }, [onReady]);

  return (
    <group scale={SCALE} position={[0, -(MODEL_HEIGHT / 2) * SCALE, 0]}>
      <primitive object={scene} />
    </group>
  );
}

/**
 * Warm key light for a real light-to-shadow gradient across the form, plus a
 * light positioned behind it (relative to the camera) so its edge catches a
 * soft glow — the "astral / luminous silhouette" quality that a flat, evenly
 * lit render can't produce.
 */
function Rig() {
  return (
    <>
      <ambientLight intensity={0.55} color="#fdfbf7" />
      <directionalLight position={[3.5, 3.5, 3]} intensity={1.8} color="#fdfbf7" />
      <pointLight position={[-2.5, -1, 1.5]} intensity={0.4} color="#c9a15a" />
      {/* Rim/back light: behind the figure, facing the camera, for the glowing edge */}
      <pointLight position={[1.5, 0.5, -3.5]} intensity={1.2} color="#d4af37" />
    </>
  );
}

/**
 * Subtle cursor-reactive tilt — the one thing that reads as "premium/
 * interactive" rather than a static render. Lerped, so it trails the
 * pointer gently instead of snapping to it. `useFrame` re-checks the ref
 * every frame, so unlike a one-shot effect it isn't sensitive to whether
 * the model has finished loading yet — it just starts working the first
 * frame the ref is non-null.
 */
function PointerTilt({ groupRef }: { groupRef: RefObject<Group | null> }) {
  useFrame((state) => {
    if (!groupRef.current) return;
    const { x, y } = state.pointer;
    groupRef.current.rotation.y = MathUtils.lerp(groupRef.current.rotation.y, x * 0.2, 0.04);
    groupRef.current.rotation.x = MathUtils.lerp(groupRef.current.rotation.x, -y * 0.12, 0.04);
  });

  return null;
}

/**
 * The statue centered in its own framed box (Manifesto section). As the
 * section scrolls through the viewport the figure turns slowly from a
 * three-quarter view on one side to the other — a quiet, scroll-driven
 * reveal of the carving rather than an autonomous spin.
 */
function Scene({ triggerRef, onReady }: { triggerRef: RefObject<HTMLElement | null>; onReady?: () => void }) {
  const tiltRef = useRef<Group>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

  /**
   * A callback ref instead of `useRef` + a one-shot effect: the model resolves
   * through Suspense, and React calls a callback ref exactly when the node is
   * attached — so the ScrollTrigger is never created against a null group.
   */
  const setScrollGroup = useCallback(
    (node: Group | null) => {
      scrollTriggerRef.current?.kill();
      scrollTriggerRef.current = null;

      if (!node || !triggerRef.current) return;

      scrollTriggerRef.current = ScrollTrigger.create({
        trigger: triggerRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => {
          node.rotation.y = 0.6 - 1.2 * self.progress;
        },
      });
    },
    [triggerRef],
  );

  return (
    <group ref={setScrollGroup} position={[0, -0.1, 0]}>
      <group ref={tiltRef}>
        <Rig />
        <HeroFigure onReady={onReady} />
        <Sparkles count={60} scale={4.5} size={1.8} speed={0.18} color="#e8d8b0" opacity={0.5} />
      </group>
      <PointerTilt groupRef={tiltRef} />
    </group>
  );
}

export function GoldBlobScene({
  triggerRef,
  onReady,
  active = true,
}: {
  triggerRef: RefObject<HTMLElement | null>;
  onReady?: () => void;
  /** false pauses the render loop entirely (section scrolled offscreen). */
  active?: boolean;
}) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      frameloop={active ? "always" : "never"}
      camera={{ position: [0, 0, 4.4], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      style={{ touchAction: "pan-y" }}
    >
      <Suspense fallback={null}>
        <Scene triggerRef={triggerRef} onReady={onReady} />
      </Suspense>
    </Canvas>
  );
}
