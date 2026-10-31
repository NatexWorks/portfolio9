"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import type { ReactNode } from "react";
import { useRef } from "react";
import type { Group } from "three";

function OrbitObject() {
  const assembly = useRef<Group>(null);
  const inner = useRef<Group>(null);

  useFrame((state, delta) => {
    if (!assembly.current || !inner.current) return;
    assembly.current.rotation.y += delta * 0.13;
    assembly.current.rotation.x += (state.pointer.y * 0.09 - assembly.current.rotation.x) * 0.035;
    assembly.current.rotation.z += (state.pointer.x * 0.06 - assembly.current.rotation.z) * 0.035;
    inner.current.rotation.y -= delta * 0.18;
    inner.current.rotation.x += delta * 0.07;
  });

  return (
    <group ref={assembly}>
      <mesh>
        <icosahedronGeometry args={[0.82, 2]} />
        <meshPhysicalMaterial color="#6572e9" roughness={0.25} metalness={0.5} transparent opacity={0.88} />
      </mesh>
      <mesh scale={1.018}>
        <icosahedronGeometry args={[0.82, 2]} />
        <meshBasicMaterial color="#b4bcff" wireframe transparent opacity={0.38} />
      </mesh>
      <group ref={inner}>
        <mesh rotation={[Math.PI / 2.6, 0.2, 0.1]}>
          <torusGeometry args={[1.19, 0.018, 8, 128]} />
          <meshStandardMaterial color="#f07558" metalness={0.5} roughness={0.28} />
        </mesh>
        <mesh rotation={[0.35, 0.7, Math.PI / 2.8]}>
          <torusGeometry args={[1.48, 0.012, 8, 128]} />
          <meshStandardMaterial color="#4b5ce1" metalness={0.65} roughness={0.24} />
        </mesh>
        <mesh rotation={[0.8, 0.1, 0.5]}>
          <torusGeometry args={[1.72, 0.009, 8, 128]} />
          <meshStandardMaterial color="#a5b9a0" metalness={0.35} roughness={0.42} />
        </mesh>
      </group>
      {Array.from({ length: 12 }, (_, index) => {
        const angle = (index / 12) * Math.PI * 2;
        const radius = index % 2 === 0 ? 1.88 : 1.54;
        return (
          <mesh key={index} position={[Math.cos(angle) * radius, Math.sin(angle * 1.6) * 0.42, Math.sin(angle) * radius]}>
            <sphereGeometry args={[index % 3 === 0 ? 0.055 : 0.032, 12, 12]} />
            <meshStandardMaterial color={index % 3 === 0 ? "#f07558" : "#d9d9d2"} emissive="#252a4d" emissiveIntensity={0.12} />
          </mesh>
        );
      })}
    </group>
  );
}

export default function HeroCanvas({ visible, fallback }: { visible: boolean; fallback: ReactNode }) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 5.7], fov: 38 }}
      frameloop={visible ? "always" : "never"}
      gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
      fallback={fallback}
    >
      <ambientLight intensity={1.05} />
      <directionalLight position={[3, 4, 5]} intensity={2.2} color="#fff5e8" />
      <pointLight position={[-3, -1, 2]} intensity={1.1} color="#6572e9" />
      <OrbitObject />
    </Canvas>
  );
}
