"use client";

import { useCallback, useRef, type RefObject } from "react";
import { Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Sparkles, useGLTF } from "@react-three/drei";
import { MathUtils, type Group } from "three";
import { ScrollTrigger } from "@/lib/gsap";

const MODEL_URL = "/models/hero-figure.glb";
useGLTF.preload(MODEL_URL);

// The source export is ~1.9 world units tall; this scales it so the whole
// figure spans roughly 55-60% of the frame height at the current camera
// distance (5.5 units, fov 45) — dominant but comfortably inside the
// frustum, not the "camera sitting inside the object" bug from earlier.
const SCALE = 1.4;
// The model's own origin sits at its base (feet), not its center — offset it
// up by half its (scaled) height so it's vertically centered like the
// primitive shapes before it were.
const MODEL_HEIGHT = 1.906;
// Desktop/landscape offset to the right, as an asymmetric satellite.
const DESKTOP_X_OFFSET = 1.6;

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
function HeroFigure() {
  const { scene } = useGLTF(MODEL_URL);

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
 * Everything that needs `useThree()` (i.e. needs to know the real render
 * size) lives here, inside the Canvas. `viewport.width`/`.height` are in
 * Three.js world units at the camera's focal plane — not CSS pixels — so
 * they already account for the current aspect ratio.
 *
 * The 1.6 desktop X offset was tuned against a landscape aspect ratio. On a
 * narrow phone in portrait, the visible half-width at this camera distance
 * shrinks to roughly 1 world unit — well inside 1.6 — so the whole figure
 * was sitting outside the frustum and effectively invisible. Clamping the
 * offset (and easing the scale down slightly) to the actual viewport keeps
 * it on-screen and reasonably framed at any width instead of only desktop.
 */
function Scene({ triggerRef }: { triggerRef: RefObject<HTMLElement | null> }) {
  const viewport = useThree((state) => state.viewport);
  const tiltRef = useRef<Group>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

  const isNarrow = viewport.width < 3.2;
  const xOffset = isNarrow ? viewport.width * 0.24 : DESKTOP_X_OFFSET;
  const scale = isNarrow ? 0.8 : 1;

  /**
   * A callback ref instead of `useRef` + a `useLayoutEffect` with `[]` deps.
   * The previous version raced Suspense: the model (loaded via useGLTF)
   * takes a moment to resolve, and the one-shot effect ran, saw a still-null
   * group ref, bailed out via its early return, and — having no dependency
   * that would fire it again — never retried. React calls a callback ref
   * exactly when the node is actually attached to the tree, Suspense
   * resolution included, so there's no race left to lose.
   */
  const setScrollGroup = useCallback(
    (node: Group | null) => {
      scrollTriggerRef.current?.kill();
      scrollTriggerRef.current = null;

      if (!node || !triggerRef.current) return;

      // Negative Y-rotation turns the figure toward the viewer's left as the
      // user scrolls down; flip the sign here if it reads backwards live.
      scrollTriggerRef.current = ScrollTrigger.create({
        trigger: triggerRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => {
          node.position.y = -0.9 * self.progress;
          node.rotation.y = -0.9 * self.progress;
        },
      });
    },
    [triggerRef],
  );

  return (
    <group ref={setScrollGroup} position={[xOffset, -0.35, 0]} scale={scale}>
      <group ref={tiltRef}>
        <Rig />
        <HeroFigure />
        <Sparkles count={90} scale={6} size={1.8} speed={0.18} color="#e8d8b0" opacity={0.5} />
      </group>
      <PointerTilt groupRef={tiltRef} />
    </group>
  );
}

export function GoldBlobScene({ triggerRef }: { triggerRef: RefObject<HTMLElement | null> }) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 5.5], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      className="!touch-none"
    >
      <Suspense fallback={null}>
        <Scene triggerRef={triggerRef} />
      </Suspense>
    </Canvas>
  );
}
