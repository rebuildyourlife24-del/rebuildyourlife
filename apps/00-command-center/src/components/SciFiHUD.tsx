"use client";

import { motion } from 'framer-motion';

export default function SciFiHUD() {
  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden z-0">
      
      {/* Outer Rotating Ring */}
      <motion.div 
        className="absolute w-[600px] h-[600px] rounded-full border border-cyan-500/20 opacity-50"
        style={{ borderStyle: 'dashed', borderWidth: '2px' }}
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      />

      {/* Middle Segmented Ring */}
      <motion.div 
        className="absolute w-[450px] h-[450px] rounded-full border-[1px] border-cyan-400/30"
        style={{ clipPath: 'polygon(0% 0%, 100% 0%, 100% 20%, 0% 20%, 0% 40%, 100% 40%, 100% 60%, 0% 60%, 0% 80%, 100% 80%, 100% 100%, 0% 100%)' }}
        animate={{ rotate: -360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      />

      {/* Inner Tech Ring */}
      <motion.div 
        className="absolute w-[300px] h-[300px] rounded-full border-2 border-cyan-300/40"
        style={{ borderStyle: 'dashed' }}
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />

      {/* Crosshairs & Targeting */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[800px] h-[1px] bg-cyan-500/10 absolute" />
        <div className="w-[1px] h-[800px] bg-cyan-500/10 absolute" />
        
        {/* Center Target Box */}
        <div className="w-[340px] h-[440px] border border-cyan-500/30 absolute flex flex-col justify-between p-2">
          <div className="flex justify-between">
            <div className="w-4 h-4 border-t-2 border-l-2 border-cyan-400" />
            <div className="w-4 h-4 border-t-2 border-r-2 border-cyan-400" />
          </div>
          <div className="flex justify-between">
            <div className="w-4 h-4 border-b-2 border-l-2 border-cyan-400" />
            <div className="w-4 h-4 border-b-2 border-r-2 border-cyan-400" />
          </div>
        </div>
      </div>

      {/* Data Metrics Overlays (Static details) */}
      <div className="absolute top-[20%] left-[10%] font-mono text-[8px] text-cyan-500/60 leading-tight">
        <div>SYS.OP.4099</div>
        <div>MEM: 84.2%</div>
        <div>NET: SECURE</div>
        <div className="mt-2 text-cyan-400">STATUS: NOMINAL</div>
      </div>

      <div className="absolute bottom-[20%] right-[10%] font-mono text-[8px] text-cyan-500/60 leading-tight text-right">
        <div>Q-PHASE: ACTIVE</div>
        <div>T-MINUS: 00:44:12</div>
        <div className="mt-2 w-16 h-[1px] bg-cyan-500/40 ml-auto" />
      </div>

      {/* Scanline Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.03)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none mix-blend-screen" />
    </div>
  );
}
