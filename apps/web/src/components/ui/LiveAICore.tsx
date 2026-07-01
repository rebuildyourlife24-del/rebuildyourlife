'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LiveAICoreProps {
  state: 'idle' | 'listening' | 'thinking' | 'speaking';
}

export function LiveAICore({ state = 'idle' }: LiveAICoreProps) {
  // Determine pulsing and coloring based on state
  const isSpeaking = state === 'speaking';
  const isThinking = state === 'thinking';
  const isListening = state === 'listening';

  let overlayColor = 'from-cyan-500/10 to-transparent';
  let pulseAnimation = 'animate-none';
  
  if (isThinking) {
    overlayColor = 'from-amber-500/20 to-transparent';
    pulseAnimation = 'animate-pulse';
  } else if (isListening) {
    overlayColor = 'from-blue-500/20 to-transparent';
    pulseAnimation = 'animate-pulse';
  } else if (isSpeaking) {
    overlayColor = 'from-cyan-400/30 to-transparent';
    pulseAnimation = 'animate-pulse'; // Or a custom rapid pulse
  }

  return (
    <div className="w-full h-[300px] relative overflow-hidden bg-[#020202] border-b border-white/5">
      
      {/* The 3D Glowing Brain Image */}
      <motion.div 
        animate={{ 
          scale: isSpeaking ? 1.05 : isThinking ? 1.02 : 1,
          y: isSpeaking ? -5 : isThinking ? -2 : 0
        }}
        transition={{ 
          duration: isSpeaking ? 0.2 : 2, 
          repeat: Infinity, 
          repeatType: "reverse",
          ease: "easeInOut"
        }}
        className="absolute inset-0 z-0 flex items-center justify-center"
      >
        <img 
          src="/glowing_brain.png" 
          alt="Neural Core" 
          className="w-[120%] h-[120%] object-cover object-center mix-blend-screen opacity-90"
          style={{ filter: isThinking ? 'hue-rotate(-45deg)' : isListening ? 'hue-rotate(45deg)' : 'none' }}
        />
      </motion.div>

      {/* Lighting & Overlays */}
      <div className={`absolute inset-0 bg-gradient-to-t ${overlayColor} mix-blend-screen transition-colors duration-500 z-10`}></div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black z-10"></div>
      
      {/* Central glow point */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100px] h-[100px] rounded-full blur-2xl z-10 transition-all duration-300 ${pulseAnimation} ${
        isThinking ? 'bg-amber-500/20' : isListening ? 'bg-blue-500/20' : isSpeaking ? 'bg-cyan-400/30' : 'bg-cyan-500/10'
      }`}></div>
      
      {/* Overlay Text */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-md">
        <div className={`w-2 h-2 rounded-full ${state === 'idle' ? 'bg-cyan-500' : state === 'listening' ? 'bg-blue-500 animate-pulse' : state === 'thinking' ? 'bg-amber-500 animate-spin' : 'bg-white animate-pulse'}`}></div>
        <span className="text-[10px] uppercase tracking-widest font-mono text-zinc-300 font-bold">
          SYS_AI_CORE: {state}
        </span>
      </div>
      
      {/* Scanning Line Effect for "Thinking" */}
      <AnimatePresence>
        {isThinking && (
          <motion.div 
            initial={{ top: '-10%' }}
            animate={{ top: '110%' }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            className="absolute left-0 right-0 h-[2px] bg-amber-500/50 shadow-[0_0_10px_rgba(245,158,11,0.8)] z-20"
          />
        )}
      </AnimatePresence>
    </div>
  );
}
