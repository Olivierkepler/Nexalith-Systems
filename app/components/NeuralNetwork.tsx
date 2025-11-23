"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { EffectComposer, DepthOfField } from '@react-three/postprocessing'
import { useMemo, useRef, useEffect } from "react";
import * as THREE from "three";

/* -----------------------------------------------------------
   FLOATING PARTICLES (slower + smaller)
----------------------------------------------------------- */
function FloatingParticles({ count = 80 }) {
  const groupRef = useRef<THREE.Group>(null!);

  const particles = useMemo(() => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      arr.push({
        position: [
          (Math.random() - 0.5) * 6,
          (Math.random() - 0.5) * 3,
          (Math.random() - 0.5) * 3,
        ],
        speed: 0.0003 + Math.random() * 0.0007, // slower
        offset: Math.random() * Math.PI * 2,
      });
    }
    return arr;
  }, [count]);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;

    const t = clock.getElapsedTime();

    particles.forEach((p, i) => {
      const mesh = groupRef.current.children[i];

      mesh.position.y += Math.sin(t * p.speed + p.offset) * 0.0007;
      mesh.position.x += Math.cos(t * p.speed + p.offset) * 0.0007;

      if (mesh.position.y > 2) mesh.position.y = -2;
      if (mesh.position.y < -2) mesh.position.y = 2;
    });
  });

  return (
    <group ref={groupRef}>
      {particles.map((p, i) => (
        <mesh key={i} position={p.position as any}>
          <sphereGeometry args={[0.015, 12, 12]} /> {/* Smaller */}
          <meshStandardMaterial
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={0.7}
            transparent
            opacity={0.55}
          />
        </mesh>
      ))}
    </group>
  );
}

/* -----------------------------------------------------------
   PULSE PARTICLES (smaller + slower)
----------------------------------------------------------- */
function PulseLine({
  start,
  end,
}: {
  start: [number, number, number];
  end: [number, number, number];
}) {
  const pulseRef = useRef<THREE.Mesh>(null!);

  const direction = new THREE.Vector3(...end).sub(
    new THREE.Vector3(...start)
  );

  useFrame(({ clock }) => {
    // MUCH SLOWER SPEED
    const t = (clock.getElapsedTime() * 0.35) % 1;
    const pos = direction.clone().multiplyScalar(t);

    pulseRef.current.position.set(
      start[0] + pos.x,
      start[1] + pos.y,
      start[2] + pos.z
    );
  });

  return (
    <mesh ref={pulseRef}>
      {/* Smaller pulse */}
      <sphereGeometry args={[0.02, 16, 16]} />
      <meshStandardMaterial
        color="#000000"
        emissive="#000000"
        transparent
        opacity={0.35}
        roughness={1}
        metalness={0}
      />
    </mesh>
  );
}

/* -----------------------------------------------------------
   NEURAL NETWORK GRAPH
----------------------------------------------------------- */
function NeuralNetwork() {
  const groupRef = useRef<THREE.Group>(null!);
  const mouse = useRef({ x: 0, y: 0 });

  const { nodes, connections } = useMemo(() => {
    const layers = 4;
    const nodesPerLayer = [4, 6, 6, 3];
    const layerSpacing = 1.6;
    const nodeSpacing = 0.7;

    const n: { position: number[]; layer: number }[] = [];
    const c: { start: number[]; end: number[] }[] = [];

    for (let l = 0; l < layers; l++) {
      const count = nodesPerLayer[l];
      const yOffset = -((count - 1) * nodeSpacing) / 2;

      for (let i = 0; i < count; i++) {
        const x = (l - (layers - 1) / 2) * layerSpacing;
        const y = yOffset + i * nodeSpacing;
        const z = (Math.random() - 0.5) * 0.7;

        n.push({ position: [x, y, z], layer: l });
      }
    }

    for (let l = 0; l < layers - 1; l++) {
      const current = n.filter((node) => node.layer === l);
      const next = n.filter((node) => node.layer === l + 1);

      current.forEach((src) => {
        next.forEach((dst) => {
          c.push({ start: src.position, end: dst.position });
        });
      });
    }

    return { nodes: n, connections: c };
  }, []);

  /* Mouse Parallax */
  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  useFrame(() => {
    if (!groupRef.current) return;

    const tx = -mouse.current.y * 0.15;
    const ty = mouse.current.x * 0.25;

    groupRef.current.rotation.x += (tx - groupRef.current.rotation.x) * 0.05;
    groupRef.current.rotation.y += (ty - groupRef.current.rotation.y) * 0.05;

    groupRef.current.rotation.y += 0.0007; // idle animation
  });

  return (
    <group ref={groupRef}>
      {/* Black Lines */}
      <group>
        {connections.map((c, i) => {
          const pts = [
            new THREE.Vector3(...c.start),
            new THREE.Vector3(...c.end),
          ];
          const geom = new THREE.BufferGeometry().setFromPoints(pts);

          return (
            <line key={i}>
              <primitive object={geom} attach="geometry" />
              <lineBasicMaterial color="#000000" opacity={1} transparent />
            </line>
          );
        })}
      </group>

      {/* Pulses */}
      <group>
        {connections.map((c, i) => (
          <PulseLine key={i} start={c.start as any} end={c.end as any} />
        ))}
      </group>

      {/* Floating Particles */}
      <FloatingParticles count={90} />

      {/* Black Nodes */}
      <group>
        {nodes.map((n, i) => (
          <mesh key={i} position={n.position as any}>
            <sphereGeometry args={[0.09, 24, 24]} />
            <meshStandardMaterial
              color="#000000"
              emissive="#000000"
              roughness={1}
              metalness={0}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/* -----------------------------------------------------------
   ROOT SCENE
----------------------------------------------------------- */
export default function NeuralNetworkScene() {
  return (
    <div className="absolute  inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[4, 4, 4]} intensity={1.3} />
        <directionalLight position={[-4, -2, -3]} intensity={0.7} />

        <NeuralNetwork />

        <EffectComposer>
          <DepthOfField
            focusDistance={0}
            focalLength={0.015}
            bokehScale={2.3}
            height={480}
          />
        </EffectComposer>

        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
