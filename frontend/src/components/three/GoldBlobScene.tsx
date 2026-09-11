"use client";

import { Suspense, useRef, type RefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sparkles, useGLTF } from "@react-three/drei";
import { MathUtils, type Group } from "three";
import { gsap } from "@/lib/gsap";
import { useGsapContext } from "@/hooks/useGsapContext";

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

/**
 * The user's own 3D export, loaded as-is — real carved-stone detail and
 * baked lighting instead of a hand-built primitive approximation. Optimized
 * from the 52 MB source (Draco geometry compression + WebP textures at
 * 1024px + a simplify pass) down to 1.4 MB; see frontend/public/models/.
 *
 * Deliberately static on its own — no autonomous spin or float. The only
 * things that move it are the user's scroll (ScrollParallax) and cursor
 * (PointerTilt), both applied to the groups that wrap this one.
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
 * pointer gently instead of snapping to it.
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
 * All the figure's motion lives here, driven directly by scroll position
 * (scrub: true — no autoplay, no easing lag beyond what scrub itself
 * smooths). Position drifts up like a parallax background; rotation turns
 * the figure so scrolling visibly "does something" to it, not just moves it.
 */
function ScrollParallax({
  groupRef,
  triggerRef,
}: {
  groupRef: RefObject<Group | null>;
  triggerRef: RefObject<HTMLElement | null>;
}) {
  useGsapContext(() => {
    if (!groupRef.current || !triggerRef.current) return;

    gsap.to(groupRef.current.position, {
      y: -0.9,
      ease: "none",
      scrollTrigger: {
        trigger: triggerRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });

    // Negative Y-rotation turns the figure toward the viewer's left as the
    // user scrolls down. Sign flip is the only thing to touch if this reads
    // backwards once you see it live.
    gsap.to(groupRef.current.rotation, {
      y: -0.9,
      ease: "none",
      scrollTrigger: {
        trigger: triggerRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });
  }, []);

  return null;
}

export function GoldBlobScene({ triggerRef }: { triggerRef: RefObject<HTMLElement | null> }) {
  const groupRef = useRef<Group>(null);
  const tiltRef = useRef<Group>(null);

  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 5.5], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      className="!touch-none"
    >
      <Suspense fallback={null}>
        {/* Outer group: scroll parallax only, in world space. */}
        <group ref={groupRef} position={[1.6, -0.35, 0]}>
          {/* Inner group: pointer tilt, isolated so it doesn't fight the scroll tween. */}
          <group ref={tiltRef}>
            <Rig />
            <HeroFigure />
            <Sparkles count={90} scale={6} size={1.8} speed={0.18} color="#e8d8b0" opacity={0.5} />
          </group>
        </group>
      </Suspense>
      <ScrollParallax groupRef={groupRef} triggerRef={triggerRef} />
      <PointerTilt groupRef={tiltRef} />
    </Canvas>
  );
}
