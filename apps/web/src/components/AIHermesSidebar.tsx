'use client';

import { useState, useEffect } from 'react';
import { LiveAICore } from './ui/LiveAICore';
import { BrainCircuit, Activity, Network, Shield, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';

export function AIHermesSidebar() {
  const [aiState, setAiState] = useState<'idle' | 'listening' | 'thinking' | 'speaking'>('idle');
  const [metrics, setMetrics] = useState({ cpu: 12, memory: 45, latency: 42 });

  // Simulate dynamic metrics for the Neural Core
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics({
        cpu: Math.floor(Math.random() * 20) + 10,
        memory: Math.floor(Math.random() * 10) + 40,
        latency: Math.floor(Math.random() * 50) + 20,
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-80 lg:w-[400px] h-full border-l border-white/5 bg-[#020202] flex flex-col shrink-0 relative z-20 shadow-[-20px_0_50px_rgba(0,0,0,0.5)]">
      
      {/* 3D Glowing Neural Brain */}
      <LiveAICore state={aiState} />

      {/* Sovereign Neural Core Dashboard */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
        
        {/* Core Identity */}
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div className="flex items-center gap-3">
            <BrainCircuit className="w-6 h-6 text-cyan-500" />
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest text-white">Sovereign Core</h3>
              <p className="text-[10px] font-mono text-zinc-500">NVIDIA Audio2Face Ready</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></div>
            <span className="text-[9px] uppercase font-bold text-cyan-500 tracking-widest">Online</span>
          </div>
        </div>

        {/* Neural Labor Metrics */}
        <div className="space-y-5">
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Labor Metrics
          </h4>
          
          <div className="space-y-4">
            {/* CPU Load */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1.5 font-mono">
                <span className="text-zinc-400">Cognitive Load</span>
                <span className="text-white">{metrics.cpu}%</span>
              </div>
              <div className="w-full bg-white/5 rounded-full h-1">
                <motion.div 
                  className="h-1 rounded-full bg-cyan-500" 
                  animate={{ width: `${metrics.cpu}%` }} 
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            {/* Memory Allocation */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1.5 font-mono">
                <span className="text-zinc-400">Context Memory</span>
                <span className="text-white">{metrics.memory}%</span>
              </div>
              <div className="w-full bg-white/5 rounded-full h-1">
                <motion.div 
                  className="h-1 rounded-full bg-blue-500" 
                  animate={{ width: `${metrics.memory}%` }} 
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            {/* Router Latency */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1.5 font-mono">
                <span className="text-zinc-400">Router Latency</span>
                <span className="text-white">{metrics.latency}ms</span>
              </div>
              <div className="w-full bg-white/5 rounded-full h-1">
                <motion.div 
                  className="h-1 rounded-full bg-amber-500" 
                  animate={{ width: `${Math.min(100, metrics.latency)}%` }} 
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Active Nodes */}
        <div className="space-y-4 pt-4 border-t border-white/5">
           <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
            <Network className="w-4 h-4" />
            Active Nodes
          </h4>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col gap-1">
              <span className="text-[9px] uppercase tracking-widest text-zinc-500">Node Alpha</span>
              <span className="text-xs font-mono text-white">Cerebras-70B</span>
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1"></div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col gap-1">
              <span className="text-[9px] uppercase tracking-widest text-zinc-500">Node Beta</span>
              <span className="text-xs font-mono text-white">Groq-Versatile</span>
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1"></div>
            </div>
          </div>
        </div>

      </div>

      {/* Security Overlay Footer */}
      <div className="p-4 border-t border-white/5 bg-black/60 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-zinc-500" />
          <span className="text-[9px] font-mono uppercase text-zinc-500 tracking-widest">Sentinel Secured</span>
        </div>
        <Cpu className="w-4 h-4 text-zinc-600" />
      </div>

    </div>
  );
}
