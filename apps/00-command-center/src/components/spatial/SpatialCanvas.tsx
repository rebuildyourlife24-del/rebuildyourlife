"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation, useMotionValue, useTransform } from 'framer-motion';

export function SpatialCanvas({ children }: { children: React.ReactNode }) {
  const [zoomLevel, setZoomLevel] = useState(0.5); // 0 = overview, 0.5 = normal, 0.75 = deep dive
  const [panX, setPanX] = useState(0); // Left/right navigation
  const [inWarRoom, setInWarRoom] = useState(false); // Y-axis drop
  
  const controls = useAnimation();
  const containerRef = useRef<HTMLDivElement>(null);

  // Keyboard navigation for testing (we will add touch/scroll later)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') setZoomLevel(prev => Math.min(prev + 0.25, 0.75));
      if (e.key === 'ArrowDown') setZoomLevel(prev => Math.max(prev - 0.25, 0));
      if (e.key === 'ArrowLeft') setPanX(prev => prev + 100);
      if (e.key === 'ArrowRight') setPanX(prev => prev - 100);
      if (e.key === 'w') setInWarRoom(prev => !prev);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Map zoom level to scale
  const scale = zoomLevel === 0 ? 0.3 : zoomLevel === 0.5 ? 1 : 1.5;
  const yOffset = inWarRoom ? (typeof window !== 'undefined' ? window.innerHeight * 0.8 : 800) : 0;

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-black text-white perspective-[1000px]">
      
      {/* Hyper-realistic Imperfections Overlay */}
      <div className="pointer-events-none fixed inset-0 z-50 opacity-20 mix-blend-overlay" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/stardust.png")' }}></div>
      <div className="pointer-events-none fixed inset-0 z-50 shadow-[inset_0_0_150px_rgba(0,0,0,0.9)]"></div>
      
      {/* The Spatial Plane */}
      <motion.div 
        ref={containerRef}
        className="w-full h-full flex items-center justify-center origin-center"
        animate={{
          scale: scale,
          x: panX + '%',
          y: yOffset,
          rotateX: zoomLevel === 0 ? 10 : 0, // Slight tilt when zoomed out
        }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 20,
          mass: 1
        }}
      >
        
        {/* Subtle camera breathing effect */}
        <motion.div
          animate={{
            y: [0, -15, 0],
            rotateZ: [0, 0.5, 0, -0.5, 0]
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="w-[300vw] h-[300vh] flex items-center justify-center gap-32"
        >
          {children}
        </motion.div>

      </motion.div>

      {/* Temporary Debug HUD */}
      <div className="fixed bottom-4 left-4 z-[100] text-xs font-mono text-cyan-500/50 flex flex-col gap-1 pointer-events-none">
        <div>ZOOM_DEPTH: {(zoomLevel * 100).toFixed(0)}%</div>
        <div>X_AXIS_PAN: {panX}</div>
        <div>Y_AXIS_WARROOM: {inWarRoom ? 'ENGAGED' : 'STANDBY'}</div>
        <div>CONTROLS: ARROWS (Zoom/Pan), 'W' (WarRoom)</div>
      </div>
    </div>
  );
}
