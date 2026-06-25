'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Brain, Users, HeartPulse, PieChart, Mic, ShieldAlert, Cpu } from 'lucide-react';
import { SatelliteCore } from '@/components/ui/SatelliteCore';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
};

export default function AITeamPage() {
  const [isListening, setIsListening] = useState(false);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-[1600px] mx-auto min-h-[85vh] flex flex-col font-sans"
    >
      {/* Header - Ultra Premium Glass */}
      <div className="flex justify-between items-center border-b border-cyan-900/30 pb-6 mb-8 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/10 to-transparent blur-xl pointer-events-none"></div>
        <div className="relative z-10">
           <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-white tracking-tighter uppercase flex items-center gap-4">
             <Brain className="w-10 h-10 text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]" />
             AI STRATEGY & WELZIJN
           </h1>
           <p className="text-cyan-500 uppercase tracking-[0.3em] text-xs font-bold mt-2 flex items-center gap-2">
             <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
             Constructieve Planning & Godbrain Synchroniciteit
           </p>
        </div>
        <div className="text-right">
          <Badge variant="outline" className="border-cyan-500/30 text-cyan-300 bg-cyan-950/40 backdrop-blur-md px-4 py-2 uppercase tracking-widest font-black shadow-[0_0_20px_rgba(34,211,238,0.1)]">
            NEURAL LINK: OPTIMAL
          </Badge>
        </div>
      </div>

      {/* The 3-Column Advanced Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 relative">
        
        {/* Deep Data Grid Background (Optimized) */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none mix-blend-screen"></div>

        {/* LEFT COLUMN: Masterplan & Franchises */}
        <div className="lg:col-span-3 flex flex-col gap-8">
          <motion.div variants={itemVariants} className="flex-1">
            <Card className="h-full bg-black/40 backdrop-blur-3xl border border-cyan-900/40 p-8 flex flex-col justify-between shadow-[inset_0_0_50px_rgba(6,182,212,0.02)] rounded-2xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
              
              <div>
                <h3 className="text-cyan-400 uppercase tracking-[0.2em] text-xs font-black mb-6 flex items-center gap-3">
                  <PieChart className="w-5 h-5" /> MASTERPLAN VOORTGANG
                </h3>
                <div className="space-y-8">
                  <div>
                    <div className="flex justify-between text-xs font-bold tracking-widest text-white mb-2 uppercase">
                      <span>Fase 1: Infrastructuur</span>
                      <span className="text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]">100%</span>
                    </div>
                    <div className="h-1.5 bg-[#020617] rounded-full overflow-hidden shadow-inner">
                      <div className="h-full bg-gradient-to-r from-cyan-600 to-cyan-300 w-full shadow-[0_0_10px_rgba(34,211,238,0.5)]"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-bold tracking-widest text-white mb-2 uppercase">
                      <span>Fase 2: Expansie</span>
                      <span className="text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]">85%</span>
                    </div>
                    <div className="h-1.5 bg-[#020617] rounded-full overflow-hidden shadow-inner">
                      <div className="h-full bg-gradient-to-r from-cyan-600 to-cyan-300 w-[85%] shadow-[0_0_10px_rgba(34,211,238,0.5)]"></div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants} className="flex-1">
            <Card className="h-full bg-black/40 backdrop-blur-3xl border border-cyan-900/40 p-8 flex flex-col justify-between rounded-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-10">
                <Users className="w-32 h-32 text-cyan-300" />
              </div>
              
              <div className="relative z-10 flex flex-col justify-between h-full">
                <div>
                  <h3 className="text-cyan-400 uppercase tracking-[0.2em] text-xs font-black mb-6 flex items-center gap-3">
                    <Users className="w-5 h-5" /> AI EXECUTIVE BOARD
                  </h3>
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center p-3 bg-cyan-950/20 rounded-xl border border-cyan-900/30 backdrop-blur-sm">
                      <span className="text-white font-bold tracking-wide">Sophia (CFO)</span>
                      <span className="text-cyan-400 text-[10px] font-mono uppercase tracking-widest flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span> Actief</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-cyan-950/20 rounded-xl border border-cyan-900/30 backdrop-blur-sm">
                      <span className="text-white font-bold tracking-wide">Marcus (CRM)</span>
                      <span className="text-cyan-400 text-[10px] font-mono uppercase tracking-widest flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span> Actief</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-cyan-950/20 rounded-xl border border-cyan-900/30 backdrop-blur-sm">
                      <span className="text-white font-bold tracking-wide">Elena (PR)</span>
                      <span className="text-emerald-400 text-[10px] font-mono uppercase tracking-widest flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Optimaliseren</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-cyan-900/30">
                  <Link href="/dashboard/ai-team/synthetic" className="w-full inline-flex items-center justify-center p-3 bg-cyan-950/40 text-cyan-300 hover:bg-cyan-900/50 hover:text-white border border-cyan-500/30 rounded-xl font-mono text-xs uppercase tracking-widest transition-all gap-2">
                    <Cpu size={14} />
                    SYNTHETIC COMMAND CONSOLE ➔
                  </Link>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* CENTER COLUMN: ORION AVATAR (ELEGANT HUD) */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center relative min-h-[550px]">
          
          {/* Subtle Ambient Glow (Optimized) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none"></div>

             {/* The Satellite Core 3D Component */}
             <div className="relative z-10 w-full max-w-[450px]">
               <SatelliteCore theme="blue" />
             </div>
          </div>

        {/* RIGHT COLUMN: Health & Lifestyle */}
        <div className="lg:col-span-3 flex flex-col gap-8">
          <motion.div variants={itemVariants} className="flex-1">
            <Card className="h-full bg-black/40 backdrop-blur-3xl border border-cyan-900/40 p-8 flex flex-col justify-between rounded-2xl">
              <div>
                <h3 className="text-cyan-400 uppercase tracking-[0.2em] text-xs font-black mb-6 flex items-center gap-3">
                  <HeartPulse className="w-5 h-5" /> FYSIEK & MENTAAL
                </h3>
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-cyan-950/40 to-transparent p-4 rounded-xl border-l-2 border-cyan-500">
                    <p className="text-white font-bold text-sm tracking-wide">Slaapkwaliteit (Oura)</p>
                    <p className="text-xs text-cyan-300 font-mono mt-1 uppercase tracking-widest flex items-center gap-2">Score: 84 <span className="text-[9px] bg-cyan-900/50 px-2 py-0.5 rounded">Optimaal</span></p>
                  </div>
                  <div className="bg-gradient-to-r from-cyan-950/40 to-transparent p-4 rounded-xl border-l-2 border-emerald-500">
                    <p className="text-white font-bold text-sm tracking-wide">Stress Niveaus</p>
                    <p className="text-xs text-emerald-400 font-mono mt-1 uppercase tracking-widest flex items-center gap-2">Laag <span className="text-[9px] bg-emerald-900/50 px-2 py-0.5 rounded text-emerald-200">Systeem dekt werkdruk</span></p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants} className="flex-1">
            <Card className="h-full bg-black/40 backdrop-blur-3xl border border-cyan-900/40 p-8 flex flex-col justify-between rounded-2xl">
              <div>
                <h3 className="text-cyan-400 uppercase tracking-[0.2em] text-xs font-black mb-6 flex items-center gap-3">
                  <Brain className="w-5 h-5" /> CONCIERGE & LIFESTYLE
                </h3>
                <div className="space-y-4 font-mono text-xs">
                  <div className="flex flex-col gap-1 pb-3 border-b border-cyan-900/30">
                    <span className="text-cyan-500 font-bold uppercase tracking-widest text-[9px]">[TRAVEL]</span>
                    <span className="text-white">Vlucht Dubai (12 Nov) geboekt.</span>
                  </div>
                  <div className="flex flex-col gap-1 pb-3 border-b border-cyan-900/30">
                    <span className="text-cyan-500 font-bold uppercase tracking-widest text-[9px]">[LIFESTYLE]</span>
                    <span className="text-white">Reservering The Jane (Vr 20:00).</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-emerald-500 font-bold uppercase tracking-widest text-[9px]">[FINANCE]</span>
                    <span className="text-white">Belastingaangifte Q3 verwerkt.</span>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

      </div>
    </motion.div>
  );
}
