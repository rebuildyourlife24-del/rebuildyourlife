'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Sparkles, Environment } from '@react-three/drei';
import * as THREE from 'three';

export function DarkThrillerEnvironment() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.1;
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <>
      <color attach="background" args={['#050505']} />
      <fog attach="fog" args={['#050505', 2, 20]} />
      
      <ambientLight intensity={0.05} />
      {/* Dramatic gold spotlight */}
      <spotLight 
        position={[5, 5, 5]} 
        angle={0.4} 
        penumbra={1} 
        intensity={2} 
        color="#C8A96B" 
        castShadow 
      />

      {/* Elegant floating gold particles */}
      <Sparkles count={500} scale={12} size={2} speed={0.4} opacity={0.5} color="#C8A96B" />

      {/* Abstract dark monolith object */}
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
        <mesh ref={meshRef} position={[0, 0, -5]} castShadow receiveShadow>
          <icosahedronGeometry args={[2, 0]} />
          <meshStandardMaterial 
            color="#111111" 
            roughness={0.2} 
            metalness={0.8} 
            envMapIntensity={0.5}
          />
        </mesh>
      </Float>

      <Environment preset="studio" />
    </>
  );
}
