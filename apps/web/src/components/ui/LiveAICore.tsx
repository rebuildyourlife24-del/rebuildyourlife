'use client';

import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Sphere, Environment, Float } from '@react-three/drei';
import * as THREE from 'three';

interface LiveAICoreProps {
  state: 'idle' | 'listening' | 'thinking' | 'speaking';
}

function CoreEntity({ state }: LiveAICoreProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Dynamic parameters based on AI state
  const isSpeaking = state === 'speaking';
  const isThinking = state === 'thinking';
  const isListening = state === 'listening';

  useFrame((clockState) => {
    if (!meshRef.current) return;
    const time = clockState.clock.elapsedTime;
    
    // Rotation logic
    let rotSpeed = 0.5;
    if (isThinking) rotSpeed = 5.0;
    if (isSpeaking) rotSpeed = 2.0;
    meshRef.current.rotation.y += 0.01 * rotSpeed;
    meshRef.current.rotation.x += 0.005 * rotSpeed;

    // Scale pulsing logic
    if (isSpeaking) {
      const scale = 1 + Math.sin(time * 15) * 0.15;
      meshRef.current.scale.set(scale, scale, scale);
    } else if (isListening) {
      const scale = 1 + Math.sin(time * 5) * 0.05;
      meshRef.current.scale.set(scale, scale, scale);
    } else {
      // Idle gentle breathing
      const scale = 1 + Math.sin(time * 2) * 0.02;
      meshRef.current.scale.set(scale, scale, scale);
    }
  });

  // Material distortion based on state
  const distort = isThinking ? 0.8 : isSpeaking ? 0.6 : 0.3;
  const speed = isThinking ? 8 : isSpeaking ? 5 : 2;
  const color = isListening ? "#0ea5e9" : isThinking ? "#d4af37" : "#06b6d4";

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.5, 4]} />
        <MeshDistortMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isSpeaking ? 2 : 1}
          envMapIntensity={1}
          clearcoat={1}
          clearcoatRoughness={0.1}
          metalness={0.8}
          roughness={0.2}
          distort={distort}
          speed={speed}
        />
      </mesh>
      
      {/* Inner glowing core */}
      <Sphere args={[0.8, 32, 32]}>
        <meshBasicMaterial color="#ffffff" transparent opacity={isSpeaking ? 0.8 : 0.2} />
      </Sphere>
    </Float>
  );
}

export function LiveAICore({ state = 'idle' }: { state?: 'idle' | 'listening' | 'thinking' | 'speaking' }) {
  return (
    <div className="w-full h-[250px] relative overflow-hidden bg-black/40 border-b border-cyan-500/20 shadow-[inset_0_0_50px_rgba(6,182,212,0.05)]">
      {/* Background Ambient Glow */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150px] h-[150px] hidden blur-[] rounded-full transition-all duration-700 ${
        state === 'thinking' ? 'bg-amber-500/30' : state === 'listening' ? 'bg-blue-500/30' : 'bg-cyan-500/20'
      }`}></div>

      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} intensity={2} color="#ffffff" />
        <directionalLight position={[-10, -10, -10]} intensity={1} color="#06b6d4" />
        <CoreEntity state={state} />
        <Environment preset="city" />
      </Canvas>
      
      {/* Overlay Text Overlay */}
      <div className="absolute top-3 left-3 flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${state === 'idle' ? 'bg-cyan-500' : state === 'listening' ? 'bg-blue-500 animate-pulse' : state === 'thinking' ? 'bg-amber-500 animate-spin' : 'bg-white animate-pulse'}`}></div>
        <span className="text-[9px] uppercase tracking-widest font-mono text-zinc-400">
          SYS_AI_CORE: {state}
        </span>
      </div>
    </div>
  );
}
