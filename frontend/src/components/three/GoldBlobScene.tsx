"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sparkles } from "@react-three/drei";
import type { Mesh } from "three";

function GoldBlob() {
  const meshRef = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x += delta * 0.08;
    meshRef.current.rotation.y += delta * 0.12;
  });

  return (
    <Float speed={1.4} rotationIntensity={0.35} floatIntensity={0.9}>
      <mesh ref={meshRef} scale={2.1}>
        <icosahedronGeometry args={[1, 24]} />
        <MeshDistortMaterial
          color="#a5502a"
          roughness={0.22}
          metalness={0.85}
          distort={0.32}
          speed={1.6}
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
      <ambientLight intensity={0.55} color="#fbf6ef" />
      <directionalLight position={[4, 5, 3]} intensity={1.6} color="#e4d2ae" />
      <pointLight position={[-4, -2, -3]} intensity={1.1} color="#b08d4f" />
      <pointLight position={[0, 3, -4]} intensity={0.8} color="#fbf6ef" />
    </>
  );
}

export function GoldBlobScene() {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 5.2], fov: 42 }}
      gl={{ antialias: true, alpha: true }}
      className="!touch-none"
    >
      <Suspense fallback={null}>
        <Rig />
        <GoldBlob />
        <Sparkles count={40} scale={5} size={2} speed={0.25} color="#e4d2ae" opacity={0.5} />
      </Suspense>
    </Canvas>
  );
}
