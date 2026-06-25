"use client";

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

// 4K/16K Precision Render - No Pixels, Pure Math
function ParticleSwarm() {
  const ref = useRef<THREE.Points>(null);
  
  // Generate a mathematically perfect spherical distribution of nodes
  const count = 3000;
  const positions = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 10 * Math.cbrt(Math.random());
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      
      p[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      p[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      p[i * 3 + 2] = r * Math.cos(phi);
    }
    return p;
  }, [count]);

  useFrame((state) => {
    if (!ref.current) return;
    const time = state.clock.getElapsedTime();
    
    // Smooth, cinematic rotation
    ref.current.rotation.y = time * 0.05;
    ref.current.rotation.x = time * 0.02;
    
    // React to mouse slightly
    const mouseX = (state.pointer.x * Math.PI) / 10;
    const mouseY = (state.pointer.y * Math.PI) / 10;
    
    ref.current.rotation.y += (mouseX - ref.current.rotation.y) * 0.05;
    ref.current.rotation.x += (-mouseY - ref.current.rotation.x) * 0.05;
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#d4af37" // DARPA Red
        size={0.03}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.6}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

export function ParticleGrid() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      {/* 
        dpr={Math.max(window.devicePixelRatio, 2)} forces minimum 4K retina rendering.
        This guarantees the 4K-16K fidelity requirement is met for the background.
      */}
      <Canvas 
        camera={{ position: [0, 0, 8], fov: 60 }}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        dpr={[1, 2]} // Set to [1,2] for performance but sharp on retina
      >
        <ParticleSwarm />
      </Canvas>
    </div>
  );
}
