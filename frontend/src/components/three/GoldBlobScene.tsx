"use client";

import { Suspense, useRef, type RefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sparkles } from "@react-three/drei";
import { MathUtils, type Group, type Mesh } from "three";
import { gsap } from "@/lib/gsap";
import { useGsapContext } from "@/hooks/useGsapContext";

// Radius 0.95 at this camera distance/fov reads as a discrete floating orb —
// filling roughly 40% of the frame height, not the whole screen. Previous
// scale (2.6) put the camera almost inside the sphere, so it rendered as a
// flat color fill instead of a round object.
const BASE_SCALE = 0.95;

/**
 * A slow, breathing form instead of a shiny "product shot" rock — the brand
 * wants to read as calm and spiritual, not dramatic. Low metalness, soft
 * roughness and a gentle inner glow read as warm wax or a singing bowl
 * rather than polished jewelry; the scale pulse mimics an inhale/exhale.
 */
function BreathingOrb() {
  const meshRef = useRef<Mesh>(null);

  useFrame(({ clock }, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += delta * 0.05;

    const breathe = 1 + Math.sin(clock.elapsedTime * 0.5) * 0.06;
    meshRef.current.scale.setScalar(BASE_SCALE * breathe);
  });

  return (
    <Float speed={0.9} rotationIntensity={0.2} floatIntensity={0.7}>
      <mesh ref={meshRef} scale={BASE_SCALE}>
        <icosahedronGeometry args={[1, 32]} />
        <MeshDistortMaterial
          color="#e8d8b0"
          emissive="#d4af37"
          emissiveIntensity={0.28}
          roughness={0.45}
          metalness={0.35}
          distort={0.16}
          speed={0.7}
        />
      </mesh>
    </Float>
  );
}

/**
 * Real light-to-shadow contrast across the surface — a single dominant warm
 * key light plus a dim, cooler fill and a soft rim — is what makes a sphere
 * actually read as round instead of a flat gradient disc. Low, even
 * ambient light (the previous setup) was washing that shading out.
 */
function Rig() {
  return (
    <>
      <ambientLight intensity={0.32} color="#fdfbf7" />
      <directionalLight position={[3.5, 4, 3]} intensity={2.2} color="#fdfbf7" />
      <pointLight position={[-3, -2, 1]} intensity={0.5} color="#a5502a" />
      <pointLight position={[1, 0, -3]} intensity={0.9} color="#d4af37" />
    </>
  );
}

/**
 * Subtle cursor-reactive tilt — the one thing missing that actually reads as
 * "premium/interactive" rather than a static ambient render. Lerped, so it
 * trails the pointer gently instead of snapping to it.
 */
function PointerTilt({ groupRef }: { groupRef: RefObject<Group | null> }) {
  useFrame((state) => {
    if (!groupRef.current) return;
    const { x, y } = state.pointer;
    groupRef.current.rotation.y = MathUtils.lerp(groupRef.current.rotation.y, x * 0.3, 0.04);
    groupRef.current.rotation.x = MathUtils.lerp(groupRef.current.rotation.x, -y * 0.18, 0.04);
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
        <group ref={groupRef} position={[1.9, -0.2, 0]}>
          {/* Inner group: pointer tilt, isolated so it doesn't fight the scroll tween. */}
          <group ref={tiltRef}>
            <Rig />
            <BreathingOrb />
            <Sparkles count={60} scale={5} size={2.2} speed={0.15} color="#e8d8b0" opacity={0.5} />
          </group>
        </group>
      </Suspense>
      <ScrollParallax groupRef={groupRef} triggerRef={triggerRef} />
      <PointerTilt groupRef={tiltRef} />
    </Canvas>
  );
}
