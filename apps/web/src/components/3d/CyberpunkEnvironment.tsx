'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

export function CyberpunkEnvironment() {
  const gridRef = useRef<THREE.GridHelper>(null);

  useFrame((state) => {
    if (gridRef.current) {
      gridRef.current.position.z = (state.clock.elapsedTime * 2) % 2;
    }
  });

  return (
    <>
      <color attach="background" args={['#050010']} />
      <fog attach="fog" args={['#050010', 5, 30]} />
      
      <ambientLight intensity={0.2} />
      <directionalLight position={[0, 10, 10]} intensity={1.5} color="#06b6d4" />
      <directionalLight position={[0, -10, -10]} intensity={1} color="#f43f5e" />

      {/* Cyberpunk Grid */}
      <gridHelper ref={gridRef} args={[100, 100, '#06b6d4', '#4c1d95']} position={[0, -2, 0]} />

      {/* Floating Holographic Elements */}
      <Float speed={3} rotationIntensity={1} floatIntensity={2}>
        <mesh position={[-3, 1, -5]}>
          <boxGeometry args={[1, 3, 1]} />
          <meshStandardMaterial color="#000" emissive="#06b6d4" emissiveIntensity={0.8} wireframe />
        </mesh>
      </Float>

      <Float speed={2} rotationIntensity={1.5} floatIntensity={1}>
        <mesh position={[4, 0, -8]}>
          <cylinderGeometry args={[1, 1, 4, 16]} />
          <meshStandardMaterial color="#000" emissive="#f43f5e" emissiveIntensity={0.8} wireframe />
        </mesh>
      </Float>
    </>
  );
}
