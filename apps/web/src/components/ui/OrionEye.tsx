'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

interface OrionEyeProps {
  status?: 'IDLE' | 'THINKING' | 'ALERT';
  apexMode?: boolean;
}

function EyeMesh({ status }: { status: 'IDLE' | 'THINKING' | 'ALERT' }) {
  const meshRef = useRef<THREE.Mesh>(null);

  // Colors based on status
  const color = useMemo(() => {
    switch (status) {
      case 'THINKING':
        return '#00e5ff'; // Cyan
      case 'ALERT':
        return '#d4af37'; // Red
      case 'IDLE':
      default:
        return '#1a1a1a'; // Dark core
    }
  }, [status]);

  const distort = useMemo(() => {
    switch (status) {
      case 'THINKING': return 0.6;
      case 'ALERT': return 0.8;
      case 'IDLE': default: return 0.3;
    }
  }, [status]);

  const speed = useMemo(() => {
    switch (status) {
      case 'THINKING': return 4;
      case 'ALERT': return 6;
      case 'IDLE': default: return 2;
    }
  }, [status]);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
      
      // Add pulsing effect for ALERT
      if (status === 'ALERT') {
        const scale = 1 + Math.sin(state.clock.getElapsedTime() * 8) * 0.05;
        meshRef.current.scale.set(scale, scale, scale);
      } else {
        meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
      }
    }
  });

  return (
    <Sphere ref={meshRef} args={[1, 64, 64]}>
      <MeshDistortMaterial
        color={color}
        envMapIntensity={1}
        clearcoat={1}
        clearcoatRoughness={0.1}
        metalness={0.8}
        roughness={0.2}
        distort={distort}
        speed={speed}
      />
    </Sphere>
  );
}

export function OrionEye({ status = 'IDLE', apexMode = false }: OrionEyeProps) {
  const finalStatus = apexMode ? 'ALERT' : status;
  
  return (
    <div className="relative w-full h-[300px] flex items-center justify-center pointer-events-none">
      {/* Glow behind the eye based on status */}
      <div 
        className={`absolute inset-0 m-auto w-[200px] h-[200px] rounded-full blur-3xl opacity-30 transition-colors duration-700
          ${finalStatus === 'THINKING' ? 'bg-cyan-500' : ''}
          ${finalStatus === 'ALERT' ? 'bg-gold' : ''}
          ${finalStatus === 'IDLE' ? 'bg-zinc-700' : ''}
        `}
      />
      
      <Canvas camera={{ position: [0, 0, 3] }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#00e5ff" />
        <EyeMesh status={finalStatus} />
      </Canvas>
    </div>
  );
}
