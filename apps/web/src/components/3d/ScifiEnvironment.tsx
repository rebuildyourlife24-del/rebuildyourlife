'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Stars, Float, Lightformer, Environment } from '@react-three/drei';
import * as THREE from 'three';

export function ScifiEnvironment() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.5;
    }
  });

  return (
    <>
      <color attach="background" args={['#010204']} />
      <fog attach="fog" args={['#010204', 10, 50]} />
      
      <ambientLight intensity={0.1} />
      <directionalLight position={[10, 10, 5]} intensity={1} color="#06b6d4" />
      <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#3b82f6" />

      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      <group ref={groupRef}>
        <Float speed={2} rotationIntensity={0.5} floatIntensity={2}>
          <mesh position={[0, 0, -10]}>
            <octahedronGeometry args={[4, 0]} />
            <meshStandardMaterial 
              color="#0f172a" 
              emissive="#06b6d4" 
              emissiveIntensity={0.2}
              wireframe 
            />
          </mesh>
        </Float>
        
        <Float speed={1} rotationIntensity={1} floatIntensity={1}>
          <mesh position={[0, 0, -10]} rotation={[Math.PI/2, 0, 0]}>
            <torusGeometry args={[8, 0.05, 16, 100]} />
            <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={0.5} />
          </mesh>
        </Float>
      </group>

      <Environment preset="city">
        <Lightformer form="rect" intensity={1} color="#06b6d4" position={[-10, 0, -10]} scale={[10, 10, 1]} target={[0, 0, 0]} />
      </Environment>
    </>
  );
}
