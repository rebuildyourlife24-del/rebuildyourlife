"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export function CommandBar() {
  const [autonomyLevel, setAutonomyLevel] = useState(94);

  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="flex justify-between items-end pb-6 border-b border-white/[0.04] mb-8"
    >
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C8A96B] opacity-40"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#C8A96B]"></span>
          </div>
          <span className="text-[9px] font-mono uppercase tracking-[0.3em] text-zinc-500">System Online</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-serif text-white tracking-tight leading-none">
          Argentic <span className="text-[#C8A96B] italic font-light">Nexus Core</span>
        </h1>
      </div>
      
      <div className="flex gap-12">
        <div className="flex flex-col items-end">
          <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-zinc-500 mb-1">Global Autonomy</span>
          <div className="flex items-center gap-4">
            <input 
              type="range" 
              min="0" max="100" 
              value={autonomyLevel} 
              onChange={(e) => setAutonomyLevel(parseInt(e.target.value))}
              className="w-32 h-px bg-white/10 appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-1.5 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-[#C8A96B] cursor-crosshair"
            />
            <span className="text-2xl font-light font-serif text-white w-12 text-right">{autonomyLevel}%</span>
          </div>
        </div>
        
        <div className="flex flex-col items-end border-l border-white/[0.04] pl-12">
          <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-zinc-500 mb-1">Treasury Active</span>
          <span className="text-2xl font-light font-serif text-white">€42,890<span className="text-zinc-600 text-lg">.00</span></span>
        </div>
      </div>
    </motion.header>
  );
}
