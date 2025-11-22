"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { useMemo, useRef, useEffect } from "react";
import * as THREE from "three";

/* -------------------------------------------------------
   Floating Particles 
--------------------------------------------------------*/
function FloatingParticles({ count = 80 }) {
  const groupRef = useRef<THREE.Group>(null!);

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push({
        position: [
          (Math.random() - 0.5) * 6,
          (Math.random() - 0.5) * 3,
          (Math.random() - 0.5) * 3,
        ],
        speed: 0.001 + Math.random() * 0.002,
        offset: Math.random() * Math.PI * 2,
      });
    }
    return temp;
  }, [count]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    particles.forEach((p, i) => {
      const mesh = groupRef.current.children[i];

      mesh.position.y += Math.sin(t * p.speed + p.offset) * 0.002;
      mesh.position.x += Math.cos(t * p.speed + p.offset) * 0.002;

      if (mesh.position.y > 2) mesh.position.y = -2;
      if (mesh.position.y < -2) mesh.position.y = 2;
    });
  });

  return (
    <group ref={groupRef}>
      {particles.map((p, i) => (
        <mesh key={i} position={p.position as [number, number, number]}>
          <sphereGeometry args={[0.025, 12, 12]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={1.2}
            transparent
            opacity={0.8}
          />
        </mesh>
      ))}
    </group>
  );
}

/* -------------------------------------------------------
   Pulse Line (moving pulses along connections)
--------------------------------------------------------*/
function PulseLine({
  start,
  end,
}: {
  start: [number, number, number];
  end: [number, number, number];
}) {
  const pulseRef = useRef<THREE.Mesh>(null!);

  const direction = new THREE.Vector3(...end).sub(new THREE.Vector3(...start));

  useFrame(({ clock }) => {
    const t = (clock.getElapsedTime() % 1);
    const pos = direction.clone().multiplyScalar(t);

    pulseRef.current.position.set(
      start[0] + pos.x,
      start[1] + pos.y,
      start[2] + pos.z
    );
  });

  return (
    <mesh ref={pulseRef}>
      <sphereGeometry args={[0.045, 16, 16]} />
      <meshStandardMaterial
        color="#ffffff"
        emissive="#f59e0b"
        emissiveIntensity={2.5}
        roughness={0.2}
        metalness={0.6}
      />
    </mesh>
  );
}

/* -------------------------------------------------------
   Neural Network (nodes + connections + pulses + parallax)
--------------------------------------------------------*/
function NeuralNetwork() {
  const groupRef = useRef<THREE.Group>(null!);
  const mouse = useRef({ x: 0, y: 0 });

  // Mouse movement listener for parallax
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const { nodes, connections } = useMemo(() => {
    const layers = 4;
    const nodesPerLayer = [4, 6, 6, 3];
    const layerSpacing = 1.6;
    const nodeSpacing = 0.7;

    const generatedNodes: { position: number[]; layer: number }[] = [];
    const generatedConnections: { start: number[]; end: number[] }[] = [];

    for (let l = 0; l < layers; l++) {
      const count = nodesPerLayer[l];
      const yOffset = -((count - 1) * nodeSpacing) / 2;
      for (let i = 0; i < count; i++) {
        const x = (l - (layers - 1) / 2) * layerSpacing;
        const y = yOffset + i * nodeSpacing;
        const z = (Math.random() - 0.5) * 0.7;
        generatedNodes.push({ position: [x, y, z], layer: l });
      }
    }

    for (let l = 0; l < layers - 1; l++) {
      const a = generatedNodes.filter((n) => n.layer === l);
      const b = generatedNodes.filter((n) => n.layer === l + 1);
      a.forEach((src) => {
        b.forEach((dst) => {
          generatedConnections.push({
            start: src.position,
            end: dst.position,
          });
        });
      });
    }

    return { nodes: generatedNodes, connections: generatedConnections };
  }, []);

  // Parallax + idle motion
  useFrame(() => {
    if (!groupRef.current) return;

    const targetY = mouse.current.x * 0.25;
    const targetX = -mouse.current.y * 0.15;

    groupRef.current.rotation.y +=
      (targetY - groupRef.current.rotation.y) * 0.05;
    groupRef.current.rotation.x +=
      (targetX - groupRef.current.rotation.x) * 0.05;

    groupRef.current.rotation.y += 0.0007; // idle rotation
  });

  return (
    <group ref={groupRef}>
      {/* Lines */}
      <group>
        {connections.map((c, i) => {
          const points = [
            new THREE.Vector3(...c.start),
            new THREE.Vector3(...c.end),
          ];
          const geom = new THREE.BufferGeometry().setFromPoints(points);

          return (
            <line key={i}>
              <primitive object={geom} attach="geometry" />
              <lineBasicMaterial
                color="#c7d2fe"
                transparent
                opacity={0.38}
              />
            </line>
          );
        })}
      </group>

      {/* Pulses */}
      <group>
        {connections.map((c, i) => (
          <PulseLine
            key={`pulse-${i}`}
            start={c.start as [number, number, number]}
            end={c.end as [number, number, number]}
          />
        ))}
      </group>

      {/* Floating particles */}
      <FloatingParticles count={80} />

      {/* Nodes */}
      <group>
        {nodes.map((n, i) => (
          <mesh key={i} position={n.position as [number, number, number]}>
            <sphereGeometry args={[0.09, 24, 24]} />
            <meshStandardMaterial
              color="#4f46e5"
              emissive="#6366f1"
              emissiveIntensity={1.1}
              roughness={0.2}
              metalness={0.6}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/* -------------------------------------------------------
   Scene Wrapper
--------------------------------------------------------*/
export default function NeuralNetworkScene() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[4, 4, 4]} intensity={1.3} />
        <directionalLight position={[-4, -2, -3]} intensity={0.7} />

        <NeuralNetwork />

        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
