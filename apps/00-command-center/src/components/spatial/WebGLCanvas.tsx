"use client";

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html, PresentationControls, ContactShadows, Stars } from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration, Noise, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';

// A subtle floating effect for the panels
function FloatHologram({ children, position, rotation }: { children: React.ReactNode, position: [number, number, number], rotation: [number, number, number] }) {
  const group = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (group.current) {
      const t = state.clock.getElapsedTime();
      // Subtle hovering up and down
      group.current.position.y = position[1] + Math.sin(t * 0.5) * 0.05;
      // Very subtle breathing rotation
      group.current.rotation.x = rotation[0] + Math.sin(t * 0.3) * 0.02;
    }
  });

  return (
    <group ref={group} position={position} rotation={rotation}>
      <Html 
        transform 
        occlude="blending"
        castShadow 
        receiveShadow 
        zIndexRange={[100, 0]}
        distanceFactor={1.5}
        className="will-change-transform pointer-events-auto"
      >
        <div className="relative group">
           {children}
        </div>
      </Html>
    </group>
  );
}

export function WebGLCanvas({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="h-screen w-full bg-[#010308] flex items-center justify-center text-cyan-500 font-mono text-xs">INITIALIZING TACTICAL WEBGL...</div>;

  return (
    <div className="h-screen w-full bg-[#010308] overflow-hidden relative">
      <Canvas shadows camera={{ position: [0, 0, 4.5], fov: 45 }} className="!pointer-events-auto">
        
        {/* Deep Space / Military Environment */}
        <color attach="background" args={['#010308']} />
        <fog attach="fog" args={['#010308', 3, 10]} />
        <ambientLight intensity={0.8} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} castShadow />
        
        {/* Subtle moving stars in the background */}
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={0.5} />

        {/* This allows grabbing and spinning the whole UI like a hologram */}
        <PresentationControls
          global
          cursor={true}
          snap={true}
          rotation={[0, 0, 0]}
          polar={[-0.1, 0.1]} // Limit vertical rotation
          azimuth={[-Math.PI / 1.5, Math.PI / 1.5]} // Limit horizontal rotation (swipe to look around)
        >
          {children}
        </PresentationControls>

        {/* Floor reflection / shadows for depth */}
        <ContactShadows position={[0, -2.5, 0]} opacity={0.6} scale={20} blur={2.5} far={4.5} color="#06b6d4" />



      </Canvas>

      {/* Persistent 2D Overlay (Stats, crosshairs, etc) */}
      <div className="pointer-events-none fixed inset-0 z-[100] border-[1px] border-cyan-500/10 m-4 rounded-3xl mix-blend-screen">
         {/* Crosshair */}
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center opacity-30">
            <div className="w-[1px] h-full bg-cyan-500 shadow-[0_0_10px_#06b6d4]"></div>
            <div className="w-full h-[1px] bg-cyan-500 absolute shadow-[0_0_10px_#06b6d4]"></div>
            <div className="w-6 h-6 border border-cyan-500 rounded-full absolute shadow-[0_0_10px_#06b6d4]"></div>
         </div>
         {/* HUD Text */}
         <div className="absolute top-4 left-6 text-[10px] font-mono text-cyan-500/70 tracking-widest leading-relaxed">
            SYS: GODBRAIN v3.0<br/>
            ENG: REACT THREE FIBER<br/>
            NET: ENCRYPTED
         </div>
         <div className="absolute bottom-4 right-6 text-[10px] font-mono text-cyan-500/70 tracking-widest leading-relaxed text-right">
            DRAG TO PAN<br/>
            SCROLL TO ZOOM<br/>
            OP: H. SEMLER
         </div>
      </div>
    </div>
  );
}

export { FloatHologram };
