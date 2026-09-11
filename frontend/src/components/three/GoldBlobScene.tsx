"use client";

import { Suspense, useRef, type RefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sparkles } from "@react-three/drei";
import { MathUtils, type Group, type Mesh } from "three";
import { gsap } from "@/lib/gsap";
import { useGsapContext } from "@/hooks/useGsapContext";

// Radius 1.4 at this camera distance/fov (5.5 units, fov 45 → ~2.28 half-height
// at that depth) fills roughly 60% of the frame — a dominant presence with
// room to spare before the camera would sit inside it. The 2.6 scale from
// two iterations ago put the camera almost inside the sphere, rendering it
// as a flat color fill instead of a round object; 0.95 was a safe but
// timid overcorrection. This is the deliberate "large but still round" size.
const BASE_SCALE = 1.4;

/**
 * "Quietud": a smooth, matte sculptural form — carved stone, not a glowing
 * gem. Barely any pulse (a form named "stillness" shouldn't visibly
 * breathe); what little motion remains is a near-imperceptible rotation and
 * float, so it reads as present and real rather than static, without
 * undercutting the calm the name promises.
 */
function StoneForm() {
  const meshRef = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += delta * 0.018;
  });

  return (
    <Float speed={0.5} rotationIntensity={0.06} floatIntensity={0.3}>
      <mesh ref={meshRef} scale={BASE_SCALE}>
        <icosahedronGeometry args={[1, 32]} />
        <MeshDistortMaterial color="#e6dfd3" roughness={0.82} metalness={0.08} distort={0.1} speed={0.35} />
      </mesh>
    </Float>
  );
}

/**
 * Warm studio-photography lighting: one dominant key light raking across the
 * surface (the source of the light-to-shadow gradient that makes it read as
 * carved stone), a dim warm fill so shadows don't go fully black, and a
 * soft rim to separate the form from the background.
 */
function Rig() {
  return (
    <>
      <ambientLight intensity={0.38} color="#fdfbf7" />
      <directionalLight position={[4, 3.5, 3.5]} intensity={2.4} color="#fdfbf7" />
      <pointLight position={[-3, -1.5, 1]} intensity={0.45} color="#c9a15a" />
      <pointLight position={[0.5, -0.5, -3]} intensity={0.6} color="#e8d8b0" />
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
    groupRef.current.rotation.y = MathUtils.lerp(groupRef.current.rotation.y, x * 0.22, 0.04);
    groupRef.current.rotation.x = MathUtils.lerp(groupRef.current.rotation.x, -y * 0.13, 0.04);
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
        <group ref={groupRef} position={[1.7, -0.15, 0]}>
          {/* Inner group: pointer tilt, isolated so it doesn't fight the scroll tween. */}
          <group ref={tiltRef}>
            <Rig />
            <StoneForm />
            <Sparkles count={35} scale={4.5} size={1.6} speed={0.08} color="#e8d8b0" opacity={0.35} />
          </group>
        </group>
      </Suspense>
      <ScrollParallax groupRef={groupRef} triggerRef={triggerRef} />
      <PointerTilt groupRef={tiltRef} />
    </Canvas>
  );
}
