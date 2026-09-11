"use client";

import { Suspense, useRef, type RefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sparkles } from "@react-three/drei";
import type { Group, Mesh } from "three";
import { gsap } from "@/lib/gsap";
import { useGsapContext } from "@/hooks/useGsapContext";

function GoldBlob() {
  const meshRef = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x += delta * 0.07;
    meshRef.current.rotation.y += delta * 0.1;
  });

  return (
    <Float speed={1.3} rotationIntensity={0.3} floatIntensity={0.8}>
      <mesh ref={meshRef} scale={2.3}>
        <icosahedronGeometry args={[1, 24]} />
        <MeshDistortMaterial
          color="#d4af37"
          roughness={0.24}
          metalness={0.88}
          distort={0.3}
          speed={1.5}
          clearcoat={0.6}
          clearcoatRoughness={0.15}
        />
      </mesh>
    </Float>
  );
}

function Rig() {
  return (
    <>
      <ambientLight intensity={0.5} color="#fdfbf7" />
      <directionalLight position={[4, 5, 3]} intensity={1.7} color="#e8d8b0" />
      <pointLight position={[-4, -2, -3]} intensity={1} color="#d4af37" />
      <pointLight position={[0, 3, -4]} intensity={0.75} color="#fdfbf7" />
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
      y: -1.6,
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
      camera={{ position: [0, 0, 6], fov: 40 }}
      gl={{ antialias: true, alpha: true }}
      className="!touch-none"
    >
      <Suspense fallback={null}>
        {/* Offset to the right so the piece reads as an asymmetric satellite behind the text, not centered. */}
        <group ref={groupRef} position={[1.7, 0, 0]}>
          <Rig />
          <GoldBlob />
          <Sparkles count={40} scale={5} size={2} speed={0.25} color="#e8d8b0" opacity={0.5} />
        </group>
      </Suspense>
      <ParallaxRig groupRef={groupRef} triggerRef={triggerRef} />
    </Canvas>
  );
}
