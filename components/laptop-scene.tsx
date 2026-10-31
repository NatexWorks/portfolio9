"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import type { MutableRefObject } from "react";
import type { Group, Mesh } from "three";

function LaptopParts({ progress }: { progress: MutableRefObject<{ value: number }> }) {
  const assembly = useRef<Group>(null);
  const base = useRef<Group>(null);
  const board = useRef<Group>(null);
  const thermal = useRef<Group>(null);
  const battery = useRef<Group>(null);
  const screen = useRef<Group>(null);
  const keys = useRef<Mesh>(null);
  const target = useRef(0);

  useFrame((state, delta) => {
    const p = progress.current.value;
    const ease = 1 - Math.pow(0.001, delta);
    target.current += (p - target.current) * ease;
    const t = target.current;
    if (!assembly.current) return;
    assembly.current.rotation.y = -0.18 + Math.sin(state.clock.elapsedTime * 0.13) * 0.025;
    state.camera.position.set(4.1 - 3 * t, 3.2 - 1.4 * t, 5.4 - 1.4 * t);
    state.camera.lookAt(0, 0.1 + 0.65 * t, -0.85 * t);
    if (base.current) base.current.position.y = -0.45 + (1 - t) * -0.4;
    if (board.current) { board.current.position.y = -0.15 + (1 - t) * 0.75; board.current.position.z = -0.12 - (1 - t) * 0.35; }
    if (thermal.current) { thermal.current.position.y = -0.01 + (1 - t) * 1.15; thermal.current.position.z = 0.35 + (1 - t) * 0.45; }
    if (battery.current) { battery.current.position.y = -0.08 + (1 - t) * 1.55; battery.current.position.x = -0.05 - (1 - t) * 0.15; }
    if (keys.current) keys.current.position.y = -0.15 + (1 - t) * 2.1;
    if (screen.current) {
      screen.current.position.y = 0.02 + (1 - t) * 2.75;
      screen.current.rotation.x = -0.08 - t * 0.2;
    }
  });

  return <group ref={assembly} position={[0, 0.1, 0]}>
    <group ref={base}>
      <mesh castShadow receiveShadow position={[0, -0.45, 0]}><boxGeometry args={[3.25, 0.16, 2.15]} /><meshStandardMaterial color="#343a2e" metalness={0.72} roughness={0.3} /></mesh>
      <mesh position={[0, -0.55, 0]}><boxGeometry args={[3.1, 0.04, 2.02]} /><meshStandardMaterial color="#151813" metalness={0.35} roughness={0.55} /></mesh>
      <mesh position={[0, -0.34, 0.02]}><boxGeometry args={[2.92, 0.025, 1.82]} /><meshStandardMaterial color="#20251d" metalness={0.28} roughness={0.68} /></mesh>
      <mesh position={[0, -0.33, -1.02]}><boxGeometry args={[0.5, 0.07, 0.1]} /><meshStandardMaterial color="#697250" metalness={0.72} roughness={0.25} /></mesh>
      {[-1.55, 1.55].map((x) => <mesh key={x} position={[x, -0.42, 0.38]}><boxGeometry args={[0.07, 0.07, 0.64]} /><meshStandardMaterial color="#9fa88a" metalness={0.8} roughness={0.3} /></mesh>)}
      {[-1.15, 1.15].map((x) => <mesh key={x} position={[x, -0.34, -0.57]}><boxGeometry args={[0.56, 0.045, 0.36]} /><meshStandardMaterial color="#282e24" metalness={0.6} roughness={0.35} /></mesh>)}
    </group>
    <group ref={board}>
      <mesh position={[0, -0.15, -0.12]}><boxGeometry args={[2.15, 0.055, 1.08]} /><meshStandardMaterial color="#42543a" metalness={0.45} roughness={0.44} /></mesh>
      <mesh position={[0.1, -0.095, -0.08]}><boxGeometry args={[0.46, 0.11, 0.42]} /><meshStandardMaterial color="#a4c95c" metalness={0.68} roughness={0.25} emissive="#263a13" /></mesh>
      {[-0.72, 0.72].map((x) => <mesh key={x} position={[x, -0.095, 0]}><boxGeometry args={[0.48, 0.1, 0.2]} /><meshStandardMaterial color="#9a9d8c" metalness={0.82} roughness={0.24} /></mesh>)}
      <mesh position={[0.73, -0.08, 0.34]}><boxGeometry args={[0.65, 0.075, 0.18]} /><meshStandardMaterial color="#b1b59f" metalness={0.84} roughness={0.26} /></mesh>
    </group>
    <group ref={thermal}>
      {[-0.82, 0.82].map((x) => <group key={x} position={[x, -0.03, 0.37]}>
        <mesh><cylinderGeometry args={[0.31, 0.31, 0.08, 40]} /><meshStandardMaterial color="#767d69" metalness={0.72} roughness={0.28} /></mesh>
        <mesh position={[0, 0.05, 0]}><cylinderGeometry args={[0.2, 0.2, 0.025, 24]} /><meshStandardMaterial color="#c5f36b" metalness={0.55} roughness={0.32} /></mesh>
      </group>)}
      <mesh position={[0, 0, -0.1]}><boxGeometry args={[1.8, 0.055, 0.07]} /><meshStandardMaterial color="#cfb66d" metalness={0.84} roughness={0.22} /></mesh>
    </group>
    <group ref={battery}>
      <mesh position={[0, -0.08, 0.72]}><boxGeometry args={[2.55, 0.14, 0.48]} /><meshStandardMaterial color="#42483b" metalness={0.62} roughness={0.36} /></mesh>
      <mesh position={[0, -0.005, 0.72]}><boxGeometry args={[2.15, 0.02, 0.04]} /><meshStandardMaterial color="#c5f36b" emissive="#526e25" emissiveIntensity={0.3} /></mesh>
    </group>
    <group>
      <mesh ref={keys} position={[0, -0.15, 0.2]}><boxGeometry args={[2.54, 0.06, 1.06]} /><meshStandardMaterial color="#666d59" metalness={0.8} roughness={0.27} /></mesh>
      {Array.from({ length: 40 }, (_, i) => <mesh key={i} position={[-1.12 + (i % 10) * 0.25, -0.105, -0.19 + Math.floor(i / 10) * 0.21]}><boxGeometry args={[0.18, 0.035, 0.12]} /><meshStandardMaterial color="#171a16" roughness={0.54} /></mesh>)}
      <mesh position={[0.64, -0.1, 0.72]}><boxGeometry args={[0.86, 0.025, 0.53]} /><meshStandardMaterial color="#292e25" metalness={0.4} roughness={0.4} /></mesh>
    </group>
    <group ref={screen} position={[0, 0.02, -0.92]}>
      <mesh position={[0, 0.73, 0]}><boxGeometry args={[3.05, 1.9, 0.105]} /><meshStandardMaterial color="#747b69" metalness={0.82} roughness={0.24} /></mesh>
      <mesh position={[0, 0.73, 0.058]}><boxGeometry args={[2.84, 1.69, 0.014]} /><meshStandardMaterial color="#0c100b" emissive="#141e0d" emissiveIntensity={0.55} roughness={0.3} /></mesh>
      <mesh position={[0, 0.73, 0.068]}><planeGeometry args={[2.54, 1.37]} /><meshStandardMaterial color="#20281a" emissive="#18220f" emissiveIntensity={0.8} /></mesh>
      {[0, 1, 2, 3].map((i) => <mesh key={i} position={[-0.8 + i * 0.52, 0.73, 0.08]}><boxGeometry args={[0.38, 0.55 + (i % 2) * 0.2, 0.01]} /><meshStandardMaterial color={i === 1 ? "#c5f36b" : "#536044"} emissive={i === 1 ? "#344a1d" : "#202717"} /></mesh>)}
      <mesh position={[0, -0.25, 0]}><boxGeometry args={[0.18, 0.22, 0.14]} /><meshStandardMaterial color="#879072" metalness={0.84} roughness={0.26} /></mesh>
    </group>
  </group>;
}

export default function LaptopScene({ progress }: { progress: MutableRefObject<{ value: number }> }) {
  return <Canvas camera={{ position: [4.1, 3.2, 5.4], fov: 34 }} dpr={[1, 1.5]} shadows gl={{ antialias: true, alpha: true }}>
    <color attach="background" args={["#10120f"]} />
    <ambientLight intensity={1.2} />
    <directionalLight position={[4, 6, 4]} intensity={2.1} castShadow />
    <pointLight position={[-4, 1, -3]} color="#c5f36b" intensity={50} distance={9} />
    <Suspense fallback={null}><LaptopParts progress={progress} /></Suspense>
  </Canvas>;
}
