"use client";

import { Suspense, useRef, type RefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sparkles } from "@react-three/drei";
import { MathUtils, type Group } from "three";
import { gsap } from "@/lib/gsap";
import { useGsapContext } from "@/hooks/useGsapContext";

// Calibrated so the whole figure spans roughly 55-60% of the frame height at
// this camera distance (5.5 units, fov 45) — dominant but comfortably inside
// the frustum, not the "camera sitting inside the object" bug from earlier.
const SCALE = 1.4;

/**
 * A faceless, abstract meditating silhouette — head + seated body built from
 * two primitives, no religious iconography (no ushnisha, no robe detail, no
 * mudra hands, no face). Reads as "figure in stillness" without being a
 * statue of anyone specific. A slight distort softens the geometric
 * primitives into something more hand-formed than CAD-perfect.
 */
function MeditatingForm() {
  const groupRef = useRef<Group>(null);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.02;
  });

  return (
    <Float speed={0.55} rotationIntensity={0.06} floatIntensity={0.35}>
      <group ref={groupRef} scale={SCALE}>
        {/* Seated body: wide at the base (crossed legs), tapering to the shoulders */}
        <mesh position={[0, -0.05, 0]}>
          <coneGeometry args={[0.82, 1.05, 48]} />
          <MeshDistortMaterial
            color="#e8d8b0"
            emissive="#d4af37"
            emissiveIntensity={0.35}
            roughness={0.4}
            metalness={0.18}
            distort={0.08}
            speed={0.3}
          />
        </mesh>
        {/* Head */}
        <mesh position={[0, 0.75, 0]}>
          <sphereGeometry args={[0.33, 48, 48]} />
          <MeshDistortMaterial
            color="#e8d8b0"
            emissive="#d4af37"
            emissiveIntensity={0.35}
            roughness={0.4}
            metalness={0.18}
            distort={0.1}
            speed={0.3}
          />
        </mesh>
      </group>
    </Float>
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
      <ambientLight intensity={0.3} color="#fdfbf7" />
      <directionalLight position={[3.5, 3.5, 3]} intensity={2} color="#fdfbf7" />
      <pointLight position={[-2.5, -1, 1.5]} intensity={0.4} color="#c9a15a" />
      {/* Rim/back light: behind the figure, facing the camera, for the glowing edge */}
      <pointLight position={[1.5, 0.5, -3.5]} intensity={1.4} color="#d4af37" />
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
 * The slow-parallax "image" of the hero: this group is what GSAP moves — a
 * real 3D object translating through the scene, not a CSS trick on the
 * canvas element. It lags behind the page's scroll, exactly like a
 * background photo would in the classic parallax pattern.
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
            <MeditatingForm />
            <Sparkles count={90} scale={6} size={1.8} speed={0.18} color="#e8d8b0" opacity={0.5} />
          </group>
        </group>
      </Suspense>
      <ScrollParallax groupRef={groupRef} triggerRef={triggerRef} />
      <PointerTilt groupRef={tiltRef} />
    </Canvas>
  );
}
