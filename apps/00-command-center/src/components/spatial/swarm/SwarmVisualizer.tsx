"use client";

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line, Sphere, Icosahedron, Trail, Float, Html } from '@react-three/drei';
import * as THREE from 'three';
import { Brain, DollarSign, BarChart2, Globe, ShoppingCart, Code, Users } from 'lucide-react';

const AGENTS = [
  { id: 1, title: "AFFILIATE SWARM", icon: DollarSign, color: "#4ade80" }, // green-400
  { id: 2, title: "ADS OPTIMIZER", icon: BarChart2, color: "#c084fc" }, // purple-400
  { id: 3, title: "DIGITAL PRODUCTS", icon: Code, color: "#60a5fa" }, // blue-400
  { id: 4, title: "SAAS", icon: Users, color: "#f472b6" }, // pink-400
  { id: 5, title: "DROPSHIP", icon: ShoppingCart, color: "#fb923c" }, // orange-400
  { id: 6, title: "FREEMIUM", icon: Globe, color: "#22d3ee" }, // cyan-400
];

// The Central Brain (Master AI)
function MasterCore() {
  const coreRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (coreRef.current) {
      coreRef.current.rotation.y += 0.005;
      coreRef.current.rotation.x += 0.002;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[0.8, 1]} />
        <meshStandardMaterial 
          color="#ef4444" // red-500
          wireframe 
          emissive="#ef4444"
          emissiveIntensity={2}
          transparent
          opacity={0.8}
        />
        {/* Core Glow */}
        <Sphere args={[0.75, 32, 32]}>
          <meshBasicMaterial color="#ef4444" transparent opacity={0.1} />
        </Sphere>
      </mesh>
      
      {/* Label for Master Core */}
      <Html center position={[0, 1.2, 0]} className="pointer-events-none">
        <div className="flex flex-col items-center">
          <Brain className="w-5 h-5 text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
          <div className="text-[9px] font-mono font-bold text-red-500 tracking-widest mt-1 bg-black/50 px-2 py-0.5 rounded border border-red-500/30 backdrop-blur-sm whitespace-nowrap">
            MASTER AI (ARCHITECT)
          </div>
        </div>
      </Html>
    </Float>
  );
}

// Orbiting Workers (The 6 Revenue Streams)
function SwarmSatellite({ agent, index, total }: { agent: typeof AGENTS[0], index: number, total: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Calculate orbit path
  const radius = 2.5;
  const angle = (index / total) * Math.PI * 2;
  const speedOffset = (index % 2 === 0 ? 1 : -1) * (0.2 + Math.random() * 0.2); // varied speed and direction

  useFrame((state) => {
    if (groupRef.current) {
      // Orbit around the core
      const t = state.clock.getElapsedTime();
      groupRef.current.rotation.y = t * speedOffset + angle;
    }
    if (meshRef.current) {
      // Spin the satellite itself
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.01;
    }
  });

  // Calculate static position for the connection line to target
  // We use a fixed position on the edge of the radius
  const targetPos = useMemo(() => new THREE.Vector3(radius, 0, 0), [radius]);

  const Icon = agent.icon;

  return (
    <group ref={groupRef}>
      <group position={[radius, 0, 0]}>
        
        {/* The Satellite Node */}
        <mesh ref={meshRef}>
          <octahedronGeometry args={[0.15, 0]} />
          <meshStandardMaterial 
            color={agent.color} 
            emissive={agent.color} 
            emissiveIntensity={2} 
            wireframe
          />
        </mesh>
        
        {/* Core Glow of the satellite */}
        <Sphere args={[0.1, 16, 16]}>
           <meshBasicMaterial color={agent.color} transparent opacity={0.4} />
        </Sphere>

        {/* The Holographic HUD Label */}
        <Html position={[0.3, 0.3, 0]} className="pointer-events-none">
          <div className="flex items-center gap-2 bg-black/60 border rounded-lg px-2 py-1 backdrop-blur-md whitespace-nowrap" style={{ borderColor: `${agent.color}40` }}>
             <Icon className="w-3 h-3" style={{ color: agent.color }} />
             <div className="flex flex-col">
               <span className="text-[8px] font-mono font-bold tracking-widest" style={{ color: agent.color, textShadow: `0 0 5px ${agent.color}` }}>{agent.title}</span>
             </div>
          </div>
        </Html>
      </group>

      {/* Connection line back to Core (0,0,0) */}
      <Line 
        points={[[0, 0, 0], [radius - 0.2, 0, 0]]} // Slightly shorter than radius to not overlap
        color={agent.color}
        lineWidth={1}
        transparent
        opacity={0.3}
        dashed
        dashScale={50}
        dashSize={1}
        dashOffset={0}
      />
    </group>
  );
}

// Data Packets flowing along the lines (Visualizing the "Measure Twice" communication)
function DataPacket({ index, total, color }: { index: number, total: number, color: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const radius = 2.5;
  const angle = (index / total) * Math.PI * 2;
  const groupRef = useRef<THREE.Group>(null);
  const speedOffset = (index % 2 === 0 ? 1 : -1) * (0.2 + (index * 0.05)); // Match satellite speed

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    
    // Match satellite orbit rotation
    if (groupRef.current) {
      groupRef.current.rotation.y = t * speedOffset + angle;
    }

    if (meshRef.current) {
      // Ping pong distance from core to satellite
      const distance = (Math.sin(t * 2 + index) + 1) / 2; // 0 to 1
      const actualDist = distance * (radius - 0.3) + 0.3; // between 0.3 and 2.2
      meshRef.current.position.set(actualDist, 0, 0);
    }
  });

  return (
    <group ref={groupRef}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  );
}

export function SwarmVisualizer() {
  return (
    <group position={[0, -0.5, 0]}>
      <MasterCore />
      {AGENTS.map((agent, i) => (
        <React.Fragment key={agent.id}>
          <SwarmSatellite agent={agent} index={i} total={AGENTS.length} />
          <DataPacket index={i} total={AGENTS.length} color={agent.color} />
        </React.Fragment>
      ))}
    </group>
  );
}
