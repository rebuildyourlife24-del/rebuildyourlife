'use client';

import { useCinematicTheme } from '@/lib/contexts/ThemeContext';
import React, { useEffect, useState } from 'react';

export function LightweightCinematicBackground() {
  const { activeTheme } = useCinematicTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="fixed inset-0 z-[-100] bg-black" />;

  return (
    <div className="fixed inset-0 w-screen h-screen z-[-100] pointer-events-none overflow-hidden bg-black transition-colors duration-1000">
      
      {/* SCIFI THEME */}
      <div 
        className={`absolute inset-0 transition-opacity duration-1000 ${activeTheme === 'scifi' ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/20 via-black to-black" />
        {/* CSS Stars Background */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at center, rgba(6, 182, 212, 0.4) 1px, transparent 1px)',
          backgroundSize: '100px 100px',
          backgroundPosition: '0 0',
          animation: 'slowPan 100s linear infinite'
        }} />
        <div className="absolute inset-0 opacity-50" style={{
          backgroundImage: 'radial-gradient(circle at center, rgba(255, 255, 255, 0.8) 2px, transparent 2px)',
          backgroundSize: '250px 250px',
          backgroundPosition: '50px 50px',
          animation: 'slowPan 150s linear infinite reverse'
        }} />
      </div>

      {/* CYBERPUNK THEME */}
      <div 
        className={`absolute inset-0 transition-opacity duration-1000 ${activeTheme === 'cyberpunk' ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-fuchsia-900/20 via-black to-black" />
        {/* CSS Cyber Grid */}
        <div className="absolute bottom-0 w-[200vw] h-[100vh] -ml-[50vw]" style={{
          backgroundImage: `
            linear-gradient(rgba(217, 70, 239, 0.2) 1px, transparent 1px),
            linear-gradient(90deg, rgba(217, 70, 239, 0.2) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          transform: 'perspective(500px) rotateX(60deg) translateY(100px) translateZ(-200px)',
          animation: 'gridMove 10s linear infinite'
        }} />
        {/* Floating Scanlines */}
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(transparent_50%,rgba(0,0,0,1)_50%)] bg-[length:100%_4px] pointer-events-none" />
      </div>

      {/* THRILLER THEME */}
      <div 
        className={`absolute inset-0 transition-opacity duration-1000 ${activeTheme === 'dark' ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#C8A96B]/10 via-black to-black" />
        {/* Vignette Heavy */}
        <div className="absolute inset-0 shadow-[inset_0_0_200px_rgba(0,0,0,1)]" />
        {/* Floating Dust (CSS Animated) */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, rgba(200, 169, 107, 0.15) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          animation: 'dustFloat 20s ease-in-out infinite alternate'
        }} />
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slowPan {
          from { background-position: 0 0; }
          to { background-position: 1000px 1000px; }
        }
        @keyframes gridMove {
          from { background-position: 0 0; }
          to { background-position: 0 40px; }
        }
        @keyframes dustFloat {
          0% { transform: translateY(0) translateX(0); }
          100% { transform: translateY(-50px) translateX(20px); }
        }
      `}} />
    </div>
  );
}
