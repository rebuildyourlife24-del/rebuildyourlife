'use client';

import { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { Button } from './Button';
import { Mic } from 'lucide-react';

interface NeuralSwarmProps {
  theme?: 'red' | 'blue' | 'cyan' | 'purple';
}

function SwarmCore({ isSpeaking }: { isSpeaking: boolean }) {
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const coreRef = useRef<THREE.Mesh>(null);

  const particleCount = 150;
  
  // Setup positions and lines
  const { positions, lineGeometry } = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const lineIndices: number[] = [];
    
    // Central core is at [0,0,0]
    for (let i = 0; i < particleCount; i++) {
      // Orbiting agents/data points
      const radius = 2 + Math.random() * 3;
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      
      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.cos(phi);
      pos[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);

      // Connect every particle to the center (0,0,0) to simulate data streaming to Godbrain
      lineIndices.push(i, particleCount); // particleCount will be the index of the center point
    }

    // Add center point at the end of positions array
    const finalPos = new Float32Array((particleCount + 1) * 3);
    finalPos.set(pos);
    finalPos[particleCount * 3] = 0;
    finalPos[particleCount * 3 + 1] = 0;
    finalPos[particleCount * 3 + 2] = 0;

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(finalPos, 3));
    geometry.setIndex(lineIndices);

    return { positions: finalPos, lineGeometry: geometry };
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (pointsRef.current) {
      pointsRef.current.rotation.y = time * 0.1;
      pointsRef.current.rotation.z = time * 0.05;
    }
    if (linesRef.current) {
      linesRef.current.rotation.y = time * 0.1;
      linesRef.current.rotation.z = time * 0.05;
      
      // Pulse opacity based on time or speaking state
      const mat = linesRef.current.material as THREE.LineBasicMaterial;
      mat.opacity = isSpeaking ? 0.4 + Math.sin(time * 10) * 0.2 : 0.1 + Math.sin(time * 2) * 0.05;
    }
    if (coreRef.current) {
      const scale = isSpeaking ? 1.2 + Math.sin(time * 8) * 0.1 : 1.0 + Math.sin(time * 2) * 0.05;
      coreRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group>
      {/* The Central Heart / Godbrain */}
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[0.5, 2]} />
        <meshBasicMaterial color="#06b6d4" wireframe />
      </mesh>

      {/* Solid glow core */}
      <mesh>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial color="#0891b2" emissive="#06b6d4" emissiveIntensity={2} toneMapped={false} />
      </mesh>

      {/* The Data Streams (Threads) */}
      <lineSegments ref={linesRef} geometry={lineGeometry}>
        <lineBasicMaterial color="#0ea5e9" transparent opacity={0.1} blending={THREE.AdditiveBlending} />
      </lineSegments>

      {/* The Agent Nodes */}
      <Points ref={pointsRef} positions={positions} stride={3}>
        <PointMaterial
          transparent
          color="#22d3ee"
          size={0.1}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </group>
  );
}

export function NeuralSwarm({ theme = 'cyan' }: NeuralSwarmProps) {
  const [isSyncing, setIsSyncing] = useState(false);

  return (
    <div className={`relative w-full h-[500px] bg-[#050505] rounded-none border-2 border-[#06b6d4]/40 shadow-[0_0_80px_rgba(6,182,212,0.15)] overflow-hidden flex flex-col group`}>
      {/* Background grid overlay */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none mix-blend-color-dodge z-0"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#0a192f] to-transparent z-20"></div>
      <div className="absolute bottom-0 right-0 w-10 h-10 border-b-4 border-r-4 border-[#d4af37] z-20"></div>

      {/* 3D Canvas rendering the Swarm */}
      <div className="flex-1 relative cursor-crosshair z-10">
        <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
          <ambientLight intensity={0.2} />
          <pointLight position={[10, 10, 10]} intensity={2} color="#06b6d4" />
          <SwarmCore isSpeaking={isSyncing} />
          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={1.0} />
          <Environment preset="city" />
        </Canvas>

        {/* Tactical Overlay */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none">
          <div className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest border border-[#06b6d4] bg-[#06b6d4]/10 text-[#06b6d4] shadow-[0_0_15px_rgba(6,182,212,0.5)]`}>
             [ NEURAL THREADS: ACTIVE ]
          </div>
          <div className="text-[#06b6d4]/70 text-[9px] font-mono tracking-widest">
            DATA EXTRACTION RATE: 42.8 TB/s
          </div>
        </div>

        <div className="absolute bottom-4 right-4 pointer-events-none text-right">
          <div className="text-[#06b6d4] text-[10px] font-black uppercase tracking-widest">
             TARGET NODE: ORION PRIME
          </div>
          <div className="text-[#06b6d4]/50 text-[8px] font-mono tracking-widest">
            SYNC LOCK: SECURE
          </div>
        </div>
      </div>

      {/* Command Interface */}
      <div className="p-4 bg-black/80 border-t-2 border-[#06b6d4]/30 backdrop-blur-md relative z-20">
        <div className="absolute top-0 left-0 w-full h-full bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(6,182,212,0.05)_10px,rgba(6,182,212,0.05)_20px)] pointer-events-none"></div>
        <div className="flex justify-between items-center relative z-10">
          <div className="flex items-center gap-4 text-[#06b6d4] font-black text-xs uppercase tracking-widest">
            <div className={`w-3 h-3 rounded-full ${isSyncing ? 'bg-[#06b6d4] animate-ping' : 'bg-[#06b6d4]/30'}`}></div>
            {isSyncing ? "OVERRIDING PROTOCOLS..." : "WAITING FOR COMMAND"}
          </div>
          <Button 
            onClick={() => setIsSyncing(!isSyncing)} 
            className="bg-[#06b6d4]/10 border-2 border-[#06b6d4]/50 text-[#06b6d4] hover:bg-[#06b6d4] hover:text-black font-black tracking-widest uppercase rounded-none transition-all"
          >
            <Mic className="w-4 h-4 mr-2" />
            {isSyncing ? "ABORT" : "DIRECT INJECT"}
          </Button>
        </div>
      </div>
    </div>
  );
}

