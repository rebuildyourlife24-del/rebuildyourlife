import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Network, Cpu, Lock } from 'lucide-react';

interface CinematicDataSyncProps {
  onComplete: () => void;
}

export function CinematicDataSync({ onComplete }: CinematicDataSyncProps) {
  const [phase, setPhase] = useState<0 | 1 | 2 | 3>(0);
  
  // Phase 1: 0-2s "Handshake"
  // Phase 2: 2-5s "Ingestion"
  // Phase 3: 5-6s "Lock"
  
  useEffect(() => {
    // Start Handshake immediately
    setPhase(1);
    
    // Switch to Ingestion after 2 seconds
    const t1 = setTimeout(() => setPhase(2), 2000);
    
    // Switch to Lock after 5 seconds
    const t2 = setTimeout(() => setPhase(3), 5000);
    
    // Complete after 6.5 seconds
    const t3 = setTimeout(() => onComplete(), 6500);
    
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  // Generate random data strings for the cinematic effect
  const [dataStreams, setDataStreams] = useState<string[]>([]);
  useEffect(() => {
    if (phase !== 2) return;
    const interval = setInterval(() => {
      const streams = Array.from({ length: 15 }).map(() => {
        return Math.random().toString(36).substring(2, 15).toUpperCase() + 
               Math.random().toString(36).substring(2, 15).toUpperCase();
      });
      setDataStreams(streams);
    }, 100);
    return () => clearInterval(interval);
  }, [phase]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-3xl overflow-hidden font-mono"
    >
      {/* Background Atmosphere */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,0,51,0.1)_0%,rgba(0,0,0,0)_60%)]" />
        
        {/* Render data streams when in phase 2 */}
        <div className="absolute inset-0 opacity-10 overflow-hidden flex flex-col justify-around pointer-events-none">
          {dataStreams.map((str, i) => (
            <div key={i} className="text-gold text-[10px] tracking-widest whitespace-nowrap opacity-50 font-bold">
              {str} {str} {str} {str} {str}
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 flex flex-col items-center max-w-3xl w-full px-8 text-center">
        
        {/* Core Visualizer */}
        <div className="relative w-48 h-48 mb-12 flex items-center justify-center">
          {/* Static outer ring */}
          <div className="absolute inset-0 rounded-full border border-white/5" />
          
          {/* Pulsing red ring */}
          <motion.div 
            animate={{ 
              scale: phase === 3 ? 1.5 : [1, 1.1, 1],
              opacity: phase === 3 ? 0 : [0.5, 1, 0.5] 
            }}
            transition={{ duration: 2, repeat: phase === 3 ? 0 : Infinity }}
            className="absolute inset-0 rounded-full border border-gold/30" 
          />
          
          {/* Spinning inner dashed ring */}
          <motion.div 
            animate={{ rotate: 360, scale: phase === 3 ? 0 : 1 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute inset-4 rounded-full border border-dashed border-gold/50" 
          />
          
          {/* Center Icon */}
          <AnimatePresence mode="wait">
            {phase === 1 && (
              <motion.div key="p1" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }}>
                <Network className="w-16 h-16 text-white" />
              </motion.div>
            )}
            {phase === 2 && (
              <motion.div key="p2" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }}>
                <Cpu className="w-16 h-16 text-gold" />
              </motion.div>
            )}
            {phase === 3 && (
              <motion.div key="p3" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.5 }}>
                <Lock className="w-16 h-16 text-white" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Dynamic Text */}
        <div className="h-32 flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            {phase === 1 && (
              <motion.div key="text1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col items-center">
                <span className="text-gold font-bold tracking-[0.2em] mb-2 uppercase text-xs">Phase 1: Handshake</span>
                <h2 className="text-2xl md:text-4xl font-black text-white tracking-tighter uppercase">Establishing Secure Tunnel</h2>
              </motion.div>
            )}
            {phase === 2 && (
              <motion.div key="text2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col items-center">
                <span className="text-gold font-bold tracking-[0.2em] mb-2 uppercase text-xs animate-pulse">Phase 2: Ingestion</span>
                <h2 className="text-2xl md:text-4xl font-black text-white tracking-tighter uppercase">Synchronizing Datastreams</h2>
                <div className="mt-4 text-zinc-500 text-xs">Bypassing standard nodes... Extracting financial baseline...</div>
              </motion.div>
            )}
            {phase === 3 && (
              <motion.div key="text3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col items-center">
                <span className="text-white font-bold tracking-[0.2em] mb-2 uppercase text-xs">Phase 3: Protocol Locked</span>
                <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase">System Overrided</h2>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Progress Bar */}
        <div className="w-full max-w-md mt-12 bg-white/5 h-1 rounded-full overflow-hidden relative">
          <motion.div 
            initial={{ width: "0%" }}
            animate={{ width: phase === 1 ? "30%" : phase === 2 ? "90%" : "100%" }}
            transition={{ duration: phase === 1 ? 2 : phase === 2 ? 3 : 0.5, ease: "linear" }}
            className={`h-full ${phase === 3 ? 'bg-white' : 'bg-gold'}`}
          />
        </div>

      </div>
    </motion.div>
  );
}
