'use client';

import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Float, Points, PointMaterial } from '@react-three/drei';
import { EffectComposer, Bloom, Glitch } from '@react-three/postprocessing';
import { GlitchMode } from 'postprocessing';
import * as THREE from 'three';

// 1. Live Orbital Strikes
function LiveOrbitalStrikes({ active }: { active: boolean }) {
  const [strikes, setStrikes] = useState<any[]>([]);

  useEffect(() => {
    if (!active) return;
    const interval = setInterval(() => {
      // Create random point on sphere
      const r = 2.45;
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      
      const newStrike = {
        id: Math.random().toString(),
        position: new THREE.Vector3(x, y, z),
        createdAt: Date.now()
      };
      setStrikes(prev => [...prev, newStrike]);
    }, 2000);

    return () => clearInterval(interval);
  }, [active]);

  useFrame(() => {
    if (strikes.length > 0) {
      const now = Date.now();
      // Remove strikes older than 1 second
      setStrikes(prev => prev.filter(s => now - s.createdAt < 1000));
    }
  });

  return (
    <group>
      {strikes.map((strike) => {
        const p1 = new THREE.Vector3(0, 8, 0); // Origin of laser
        const p2 = strike.position;
        const distance = p1.distanceTo(p2);
        
        // Cylinder oriented along the line
        const midPoint = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
        const orientation = new THREE.Matrix4().lookAt(p1, p2, new THREE.Vector3(0, 1, 0));
        const euler = new THREE.Euler().setFromRotationMatrix(orientation);

        return (
          <group key={strike.id}>
            {/* The Laser */}
            <mesh position={midPoint} rotation={euler}>
              <cylinderGeometry args={[0.02, 0.02, distance, 8]} />
              <meshBasicMaterial color="#ff0000" blending={THREE.AdditiveBlending} />
            </mesh>
            {/* The Target Dot */}
            <mesh position={p2}>
              <sphereGeometry args={[0.08, 16, 16]} />
              <meshBasicMaterial color="#ff0000" blending={THREE.AdditiveBlending} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

// 2. Global Revenue Pulses
function RevenuePulses({ count = 200 }) {
  const points = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 5;
      p[i * 3 + 1] = (Math.random() - 0.5) * 5;
      p[i * 3 + 2] = (Math.random() - 0.5) * 5;
    }
    return p;
  }, [count]);

  const ref = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (ref.current) {
      const positions = ref.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < count; i++) {
        // Expand outwards
        positions[i * 3] *= 1.01;
        positions[i * 3 + 1] *= 1.01;
        positions[i * 3 + 2] *= 1.01;
        
        // Reset if too far
        const dist = Math.sqrt(
          positions[i * 3]**2 + 
          positions[i * 3 + 1]**2 + 
          positions[i * 3 + 2]**2
        );
        if (dist > 5) {
          const r = 2.45;
          const theta = 2 * Math.PI * Math.random();
          const phi = Math.acos(2 * Math.random() - 1);
          positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
          positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
          positions[i * 3 + 2] = r * Math.cos(phi);
        }
      }
      ref.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <Points ref={ref} positions={points} stride={3} frustumCulled={false}>
      <PointMaterial transparent color="#ffdd55" size={0.06} sizeAttenuation={true} depthWrite={false} blending={THREE.AdditiveBlending} opacity={0.8} />
    </Points>
  );
}

// Generates random points on a sphere to simulate global network nodes
function NetworkNodes({ count = 2000 }) {
  const points = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 2.5;
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      p[i * 3] = x;
      p[i * 3 + 1] = y;
      p[i * 3 + 2] = z;
    }
    return p;
  }, [count]);

  const ref = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.05;
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
  });

  return (
    <Points ref={ref} positions={points} stride={3} frustumCulled={false}>
      <PointMaterial transparent color="#d4a853" size={0.03} sizeAttenuation={true} depthWrite={false} blending={THREE.AdditiveBlending} />
    </Points>
  );
}

// Glowing inner sphere representing the core
function CoreGlobe() {
  const mesh = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.y = state.clock.elapsedTime * -0.02;
    }
  });

  return (
    <mesh ref={mesh}>
      <sphereGeometry args={[2.45, 64, 64]} />
      <meshStandardMaterial 
        color="#050505" 
        emissive="#1a1200"
        wireframe={true} 
        transparent 
        opacity={0.15} 
      />
    </mesh>
  );
}

// Hovering data rings
function DataRings() {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.z = state.clock.elapsedTime * 0.1;
      ref.current.rotation.x = state.clock.elapsedTime * 0.08;
    }
  });

  return (
    <group ref={ref}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[3.2, 0.01, 16, 100]} />
        <meshBasicMaterial color="#d4a853" transparent opacity={0.3} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh rotation={[Math.PI / 2, Math.PI / 4, 0]}>
        <torusGeometry args={[3.8, 0.005, 16, 100]} />
        <meshBasicMaterial color="#ffc107" transparent opacity={0.1} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  );
}

export function OrionEye({ apexMode = false }: { apexMode?: boolean }) {
  return (
    <div className="w-full h-full min-h-[500px] relative rounded-xl overflow-hidden border border-[#d4a853]/20 bg-black/50 shadow-[0_0_50px_rgba(212,168,83,0.1)]">
      {/* Hologram Overlay Scifi UI */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-10 p-6 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div className="font-mono text-xs text-[#d4a853] tracking-widest uppercase">
            <div className="flex items-center gap-2 mb-1">
              <span className={`w-2 h-2 rounded-full ${apexMode ? 'bg-red-500' : 'bg-[#d4a853]'} animate-pulse`}></span>
              ORION CORE: {apexMode ? 'APEX PREDATOR' : 'ACTIVE'}
            </div>
            <div>GLOBAL SURVEILLANCE: 100%</div>
          </div>
          <div className="text-right font-mono text-xs text-zinc-500 uppercase tracking-widest">
            <div>LAT: 52.3676° N</div>
            <div>LNG: 4.9041° E</div>
            <div className="text-[#d4a853] mt-1">SWARM NODES: 2,491</div>
          </div>
        </div>
        
        <div className="flex items-end justify-center w-full">
          <div className={`px-6 py-2 border backdrop-blur-md rounded-full text-sm uppercase tracking-widest ${
            apexMode 
              ? 'border-red-500/50 bg-red-900/40 text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.4)]'
              : 'border-[#d4a853]/30 bg-black/40 text-[#d4a853] shadow-[0_0_15px_rgba(212,168,83,0.2)]'
          }`}>
            The Apex Ascension Mode
          </div>
        </div>
      </div>

      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <color attach="background" args={['#000000']} />
        
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color={apexMode ? "#ff0000" : "#d4a853"} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ffffff" />
        
        {/* Holographic Depth & Glitch Effects via Postprocessing */}
        <EffectComposer>
          <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} height={300} intensity={apexMode ? 2.0 : 1.5} />
          {apexMode && <Glitch delay={[1.5, 3.5]} duration={[0.1, 0.3]} strength={[0.02, 0.05]} mode={GlitchMode.SPORADIC} />}
        </EffectComposer>

        <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
          <group>
            <CoreGlobe />
            <NetworkNodes count={3000} />
            <DataRings />
            {apexMode && <LiveOrbitalStrikes active={true} />}
            {apexMode && <RevenuePulses count={150} />}
          </group>
        </Float>

        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        
        <OrbitControls 
          enablePan={false}
          enableZoom={true}
          minDistance={4}
          maxDistance={12}
          autoRotate={false}
        />
      </Canvas>
    </div>
  );
}

