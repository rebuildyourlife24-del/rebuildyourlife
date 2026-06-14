'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Points, PointMaterial } from '@react-three/drei';

interface SwarmBrainProps {
  isSpeaking: boolean;
  analyserRef: React.MutableRefObject<AnalyserNode | null>;
}

export function SwarmBrain({ isSpeaking, analyserRef }: SwarmBrainProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const shellRef = useRef<THREE.Mesh>(null);
  const dataArrayRef = useRef<Uint8Array>(new Uint8Array(128));

  // Generate brain-like point cloud
  const particleCount = 2500;
  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      // Create a shape resembling two hemispheres
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      
      // Base radius
      let r = 2.0;
      
      // Dent in the middle (hemispheres)
      const x = Math.sin(phi) * Math.cos(theta);
      if (Math.abs(x) < 0.2) {
        r *= 0.8; 
      }
      
      // Flatten bottom slightly
      const y = Math.sin(phi) * Math.sin(theta);
      if (y < -0.5) r *= 0.9;

      // Add noise
      r += (Math.random() - 0.5) * 0.4;

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.cos(phi);
      pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    return pos;
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Idle rotation
    if (pointsRef.current) {
      pointsRef.current.rotation.y = time * 0.1;
      pointsRef.current.rotation.z = Math.sin(time * 0.2) * 0.1;
    }
    if (shellRef.current) {
      shellRef.current.rotation.y = time * 0.1;
      shellRef.current.rotation.z = Math.sin(time * 0.2) * 0.1;
    }

    // Audio Reactivity (Pulsing)
    let targetScale = 1.0;
    if (isSpeaking && analyserRef.current) {
      analyserRef.current.getByteFrequencyData(dataArrayRef.current as any);
      let sum = 0;
      for (let i = 0; i < dataArrayRef.current.length; i++) {
        sum += dataArrayRef.current[i];
      }
      const avg = sum / dataArrayRef.current.length;
      const intensity = avg / 255.0;
      targetScale = 1.0 + intensity * 0.25;
    } else {
      targetScale = 1.0 + Math.sin(time * 2) * 0.02;
    }

    // Smooth scaling interpolation
    if (pointsRef.current) {
      pointsRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  });

  return (
    <group>
      {/* Outer Shell (The Face/Skull abstraction) */}
      <mesh ref={shellRef}>
        <sphereGeometry args={[2.5, 32, 32]} />
        <meshBasicMaterial 
          color="#00f0ff" 
          wireframe={true} 
          transparent={true} 
          opacity={0.05} 
        />
      </mesh>

      {/* Inner Brain (The Swarm) */}
      <Points ref={pointsRef} positions={positions} stride={3}>
        <PointMaterial
          transparent
          color="#d4a853" // Gold color for the brain nodes
          size={0.05}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </group>
  );
}
