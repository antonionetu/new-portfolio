"use client";

import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

function useMousePosition() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setMouse({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return mouse;
}

function Particles({ mouse }: { mouse: { x: number; y: number } }) {
  const ref = useRef<THREE.Points>(null);
  const count = 600;
  const target = useRef({ x: 0, y: 0 });

  const [positions, sizes] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sz = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
      sz[i] = Math.random() * 2 + 0.5;
    }
    return [pos, sz];
  }, []);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    target.current.x += (mouse.x * 0.3 - target.current.x) * 0.02;
    target.current.y += (mouse.y * 0.3 - target.current.y) * 0.02;
    ref.current.rotation.y = t * 0.02 + target.current.x;
    ref.current.rotation.x = Math.sin(t * 0.01) * 0.1 + target.current.y;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={count} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} count={count} />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#8B5CF6"
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

function FloatingRing({ mouse }: { mouse: { x: number; y: number } }) {
  const ref = useRef<THREE.Mesh>(null);
  const target = useRef({ x: 0, y: 0 });

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    target.current.x += (mouse.x * 0.5 - target.current.x) * 0.03;
    target.current.y += (mouse.y * 0.5 - target.current.y) * 0.03;
    ref.current.rotation.x = t * 0.15 + target.current.y * 0.8;
    ref.current.rotation.z = t * 0.1 + target.current.x * 0.5;
    ref.current.position.y = Math.sin(t * 0.5) * 0.3;
    ref.current.position.x = target.current.x * 0.6;
  });

  return (
    <mesh ref={ref}>
      <torusGeometry args={[2.5, 0.02, 16, 100]} />
      <meshBasicMaterial color="#C4E538" transparent opacity={0.3} />
    </mesh>
  );
}

function FloatingRing2({ mouse }: { mouse: { x: number; y: number } }) {
  const ref = useRef<THREE.Mesh>(null);
  const target = useRef({ x: 0, y: 0 });

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    target.current.x += (mouse.x * 0.4 - target.current.x) * 0.025;
    target.current.y += (mouse.y * 0.4 - target.current.y) * 0.025;
    ref.current.rotation.y = t * 0.12 - target.current.x * 0.6;
    ref.current.rotation.x = Math.PI / 3 + t * 0.08 + target.current.y * 0.4;
    ref.current.position.y = Math.cos(t * 0.4) * 0.2;
    ref.current.position.x = -target.current.x * 0.4;
  });

  return (
    <mesh ref={ref}>
      <torusGeometry args={[3.2, 0.015, 16, 100]} />
      <meshBasicMaterial color="#8B5CF6" transparent opacity={0.2} />
    </mesh>
  );
}

function CameraRig({ mouse }: { mouse: { x: number; y: number } }) {
  const { camera } = useThree();
  const target = useRef({ x: 0, y: 0 });

  useFrame(() => {
    target.current.x += (mouse.x * 0.15 - target.current.x) * 0.02;
    target.current.y += (mouse.y * 0.1 - target.current.y) * 0.02;
    camera.position.x = target.current.x;
    camera.position.y = target.current.y;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

export default function HeroScene() {
  const mouse = useMousePosition();

  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true }}
        style={{ background: "transparent" }}
      >
        <CameraRig mouse={mouse} />
        <Particles mouse={mouse} />
        <FloatingRing mouse={mouse} />
        <FloatingRing2 mouse={mouse} />
      </Canvas>
    </div>
  );
}
