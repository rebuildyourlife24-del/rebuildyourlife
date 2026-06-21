'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Shield, Activity, Skull, Terminal, Cpu, Network, Zap, Lock, ChevronRight, Crosshair, Command } from 'lucide-react';
import { NeuralSwarm } from '@/components/ui/NeuralSwarm';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, filter: 'blur(10px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
};

export default function WarRoomRedPage() {
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(true);

  // Fake terminal boot sequence
  useEffect(() => {
    const lines = [
      "INIT CORE SYS...",
      "LOADING NEURAL NETWORKS [OK]",
      "BYPASSING SECURITY PROTOCOLS [OK]",
      "ESTABLISHING SECURE CONNECTION...",
      "CONNECTED TO THE SOVEREIGN GRID.",
      "AWAITING COMMAND."
    ];
    let i = 0;
    const interval = setInterval(() => {
      if (i < lines.length) {
        setTerminalOutput(prev => [...prev, lines[i]]);
        i++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-[1800px] mx-auto min-h-[85vh] flex flex-col font-sans relative z-10"
    >
      {/* Header - Cinematic Aggressive Style */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-6 mb-8 relative">
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-red-600/80 to-transparent"></div>
        
        <div className="flex items-center gap-6 px-4">
          <div className="relative">
            <div className="absolute inset-0 bg-red-500 blur-xl opacity-20 animate-pulse"></div>
            <div className="w-14 h-14 bg-black border border-red-500/40 flex items-center justify-center rounded-2xl relative z-10 shadow-[inset_0_0_20px_rgba(255,0,51,0.2)]">
              <Command className="w-8 h-8 text-red-500" />
            </div>
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-red-100 to-zinc-500 tracking-tighter">
              The War Room
            </h1>
            <p className="text-red-500 uppercase tracking-[0.3em] text-[10px] font-bold mt-2 flex items-center gap-2 font-mono">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(255,0,51,0.8)]"></span>
              System Mode: Active
            </p>
          </div>
        </div>

        <div className="mt-6 md:mt-0 px-4 flex flex-wrap gap-2">
           {/* Model Badges (Junie Style) */}
           <div className="flex gap-2">
             <span className="inline-flex items-center justify-center border border-red-900/50 bg-black text-red-100 rounded-full px-4 py-1.5 text-xs font-mono shadow-[0_0_15px_rgba(255,0,51,0.15)]">
               <Cpu className="w-3 h-3 text-red-500 mr-2" />
               Hermes 4.0
             </span>
             <span className="inline-flex items-center justify-center border border-red-900/50 bg-black text-zinc-400 rounded-full px-4 py-1.5 text-xs font-mono">
               <Network className="w-3 h-3 text-zinc-500 mr-2" />
               Orion Alpha
             </span>
             <span className="inline-flex items-center justify-center border border-red-900/50 bg-black text-zinc-400 rounded-full px-4 py-1.5 text-xs font-mono">
               <Lock className="w-3 h-3 text-zinc-500 mr-2" />
               BYOK
             </span>
           </div>
        </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-6 relative z-10 px-4 pb-8">
        
        {/* LARGE WIDGET: THE AI ENGINE (Centerpiece) */}
        <motion.div variants={itemVariants} className="md:col-span-8 lg:col-span-8 h-full min-h-[500px]">
          <div className="h-full bg-[#0a0a0a] border border-red-900/30 rounded-[2rem] hover:border-red-500/50 transition-colors duration-500 group relative overflow-hidden shadow-2xl flex flex-col">
            
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-600/5 rounded-full blur-3xl group-hover:bg-red-600/10 transition-colors pointer-events-none"></div>
            
            {/* Widget Header */}
            <div className="flex justify-between items-center px-8 py-6 border-b border-white/5 relative z-10">
              <h3 className="font-sans text-2xl font-semibold text-white flex items-center gap-3">
                <Terminal className="w-6 h-6 text-red-500" />
                Command Interface
              </h3>
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-900"></div>
                <div className="w-3 h-3 rounded-full bg-red-900"></div>
                <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_10px_rgba(255,0,51,0.8)]"></div>
              </div>
            </div>

            {/* Widget Body (Terminal / AI Input) */}
            <div className="flex-1 p-8 flex flex-col relative z-10">
              <div className="flex-1 bg-black/60 rounded-xl border border-red-900/30 p-6 font-mono text-sm overflow-hidden relative shadow-[inset_0_0_30px_rgba(0,0,0,1)]">
                {/* Terminal Output */}
                <div className="space-y-2">
                  {terminalOutput.map((line, idx) => (
                    <div key={idx} className="flex gap-4 opacity-80">
                      <span className="text-zinc-600">[{new Date().toISOString().split('T')[1].split('.')[0]}]</span>
                      <span className={line.includes('OK') ? 'text-emerald-500' : line.includes('AWAITING') ? 'text-red-500 font-bold' : 'text-zinc-300'}>{line}</span>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex gap-4">
                      <span className="text-zinc-600">[{new Date().toISOString().split('T')[1].split('.')[0]}]</span>
                      <span className="w-2 h-4 bg-red-500 animate-pulse"></span>
                    </div>
                  )}
                </div>

                <div className="absolute bottom-6 left-6 right-6">
                   <div className="relative flex items-center bg-[#111] border border-red-900/50 rounded-full px-4 py-3 shadow-[0_0_20px_rgba(255,0,51,0.1)] group-hover:border-red-500/50 transition-colors">
                     <span className="text-red-500 font-mono font-bold mr-3">&gt;</span>
                     <input 
                       type="text" 
                       placeholder="Deploy new strategy..." 
                       className="bg-transparent border-none outline-none flex-1 text-white font-mono placeholder:text-zinc-600"
                       readOnly
                     />
                     <button className="bg-red-600 hover:bg-red-500 text-white p-2 rounded-full transition-colors shadow-[0_0_10px_rgba(255,0,51,0.4)]">
                       <Zap className="w-4 h-4 fill-white" />
                     </button>
                   </div>
                </div>
              </div>
            </div>

          </div>
        </motion.div>

        {/* SIDE WIDGETS */}
        <div className="md:col-span-4 lg:col-span-4 flex flex-col gap-6">
          
          {/* SMALL WIDGET 1: SYNDICATE OPS */}
          <motion.div variants={itemVariants} className="flex-1">
            <div className="h-full bg-[#0a0a0a] border border-red-900/30 rounded-[2rem] hover:border-red-500/50 transition-colors duration-500 group relative overflow-hidden shadow-2xl p-8 flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 rounded-full blur-2xl pointer-events-none"></div>
              
              <div>
                <h3 className="font-sans text-xl font-semibold text-white mb-2 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-red-500" />
                  Syndicate Ops
                </h3>
                <p className="text-zinc-500 text-sm leading-relaxed mb-6">
                  Autonome defensie en IP-bescherming. Run security protocollen in de achtergrond.
                </p>
              </div>

              <div className="bg-black rounded-xl border border-white/5 p-4 relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-red-500"></div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-mono text-zinc-400">STATUS</span>
                  <span className="text-xs font-mono font-bold text-red-500 bg-red-950/50 px-2 py-0.5 rounded">DEFENDING</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* SMALL WIDGET 2: NEURAL SWARM */}
          <motion.div variants={itemVariants} className="flex-1">
            <div className="h-full bg-[#0a0a0a] border border-red-900/30 rounded-[2rem] hover:border-red-500/50 transition-colors duration-500 group relative overflow-hidden shadow-2xl p-0 flex flex-col">
              
              <div className="p-8 pb-0">
                <h3 className="font-sans text-xl font-semibold text-white mb-2 flex items-center gap-2">
                  <Crosshair className="w-5 h-5 text-red-500" />
                  Target Scanner
                </h3>
                <p className="text-zinc-500 text-sm leading-relaxed">
                  Visuele weergave van actieve overnames.
                </p>
              </div>

              <div className="flex-1 relative min-h-[200px] w-full flex items-center justify-center mt-4">
                 <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent z-10"></div>
                 {/* NeuralSwarm component acts as the visual graphic inside the widget */}
                 <div className="w-[150%] h-[150%] opacity-60">
                   <NeuralSwarm theme="red" />
                 </div>
              </div>
              
            </div>
          </motion.div>

        </div>

        {/* BOTTOM WIDE WIDGET: PIPELINE */}
        <motion.div variants={itemVariants} className="md:col-span-12 h-[200px]">
          <div className="h-full bg-[#0a0a0a] border border-red-900/30 rounded-[2rem] hover:border-red-500/50 transition-colors duration-500 group relative overflow-hidden shadow-2xl p-8 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="absolute left-0 bottom-0 w-[500px] h-full bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,0,51,0.02)_10px,rgba(255,0,51,0.02)_20px)] pointer-events-none"></div>

            <div className="max-w-xl relative z-10">
              <h3 className="font-sans text-2xl font-semibold text-white mb-2">
                Hassle-Free Migration
              </h3>
              <p className="text-zinc-400 text-lg">
                Importeer data uit andere tools in seconden zonder verstoring in je workflow.
              </p>
            </div>

            <button className="relative z-10 shrink-0 inline-flex items-center justify-center px-8 py-4 text-sm font-bold uppercase tracking-widest text-black bg-red-500 rounded-full hover:bg-red-400 transition-colors shadow-[0_0_20px_rgba(255,0,51,0.3)]">
              Initieer Migratie <ChevronRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
}
