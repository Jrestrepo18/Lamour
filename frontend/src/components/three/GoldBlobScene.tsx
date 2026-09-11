"use client";

import { Suspense, useRef, type RefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sparkles } from "@react-three/drei";
import { DoubleSide, type Group, type Mesh, type MeshBasicMaterial } from "three";
import { gsap } from "@/lib/gsap";
import { useGsapContext } from "@/hooks/useGsapContext";

const BASE_SCALE = 2.6;
const RING_COUNT = 3;
const RING_DURATION = 4.6; // seconds per ripple cycle — slow, like water settling
const RING_SPREAD = 1.7;

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

/**
 * The requested symbol: slow concentric rings breathing outward from the
 * orb, like ripples settling on still water — a universal, unclichéd stand-in
 * for calm/meditation/energy, tied directly to the piece that's already
 * there instead of a bolted-on icon (lotus, om, ...).
 */
function RippleRings() {
  const ringRefs = useRef<(Mesh | null)[]>([]);

  useFrame(({ clock }) => {
    for (let i = 0; i < RING_COUNT; i++) {
      const ring = ringRefs.current[i];
      if (!ring) continue;

      const phase = i / RING_COUNT;
      const t = ((clock.elapsedTime / RING_DURATION + phase) % 1 + 1) % 1;

      ring.scale.setScalar(BASE_SCALE * (1 + t * RING_SPREAD));
      (ring.material as MeshBasicMaterial).opacity = (1 - t) * 0.3;
    }
  });

  return (
    <>
      {Array.from({ length: RING_COUNT }, (_, i) => (
        <mesh
          key={i}
          ref={(el) => {
            ringRefs.current[i] = el;
          }}
        >
          <ringGeometry args={[0.99, 1, 80]} />
          <meshBasicMaterial color="#d4af37" transparent opacity={0} side={DoubleSide} depthWrite={false} />
        </mesh>
      ))}
    </>
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
          <RippleRings />
          <Sparkles count={50} scale={6} size={2} speed={0.12} color="#e8d8b0" opacity={0.4} />
        </group>
      </Suspense>
      <ParallaxRig groupRef={groupRef} triggerRef={triggerRef} />
    </Canvas>
  );
}
