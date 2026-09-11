"use client";

import { Suspense, useRef, type RefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sparkles } from "@react-three/drei";
import type { Group, Mesh } from "three";
import { gsap } from "@/lib/gsap";
import { useGsapContext } from "@/hooks/useGsapContext";

const BASE_SCALE = 2.6;

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
    meshRef.current.rotation.y += delta * 0.035;

    const breathe = 1 + Math.sin(clock.elapsedTime * 0.5) * 0.055;
    meshRef.current.scale.setScalar(BASE_SCALE * breathe);
  });

  return (
    <Float speed={0.8} rotationIntensity={0.15} floatIntensity={0.6}>
      <mesh ref={meshRef} scale={BASE_SCALE}>
        <icosahedronGeometry args={[1, 32]} />
        <MeshDistortMaterial
          color="#e8d8b0"
          emissive="#d4af37"
          emissiveIntensity={0.22}
          roughness={0.55}
          metalness={0.3}
          distort={0.14}
          speed={0.7}
        />
      </mesh>
    </Float>
  );
}

function Rig() {
  return (
    <>
      <ambientLight intensity={0.9} color="#fdfbf7" />
      <directionalLight position={[3, 4, 4]} intensity={1.1} color="#fdfbf7" />
      <pointLight position={[-3, -1, 2]} intensity={0.6} color="#e8d8b0" />
    </>
  );
}

/**
 * The slow-parallax "image" of the hero: this group is what GSAP moves — a
 * real 3D object translating through the scene, not a CSS trick on the
 * canvas element. It lags behind the page's scroll, exactly like a
 * background photo would in the classic parallax pattern.
 */
function ParallaxRig({
  groupRef,
  triggerRef,
}: {
  groupRef: RefObject<Group | null>;
  triggerRef: RefObject<HTMLElement | null>;
}) {
  useGsapContext(() => {
    if (!groupRef.current || !triggerRef.current) return;

    gsap.to(groupRef.current.position, {
      y: -1.2,
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

  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 5.5], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      className="!touch-none"
    >
      <Suspense fallback={null}>
        {/* Offset to the right so the piece reads as a calm satellite behind the text, not centered. */}
        <group ref={groupRef} position={[2.1, 0, 0]}>
          <Rig />
          <BreathingOrb />
          <Sparkles count={50} scale={6} size={2} speed={0.12} color="#e8d8b0" opacity={0.4} />
        </group>
      </Suspense>
      <ParallaxRig groupRef={groupRef} triggerRef={triggerRef} />
    </Canvas>
  );
}
