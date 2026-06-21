'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useRequireAuth } from '@/lib/auth';
import { Shield, Sparkles, TrendingUp, CalendarDays, Activity, Lock, CheckCircle2, Terminal, Cpu, Network, Briefcase, Heart, Map, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, filter: 'blur(10px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
};

export default function DashboardPage() {
  const { user } = useRequireAuth();
  
  const currentPhase = (user as any)?.phase || (user as any)?.clearanceLevel || 1;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 max-w-[1600px] mx-auto pb-20 font-sans"
    >
      {/* Header Widget */}
      <motion.div variants={itemVariants}>
        <div className="relative overflow-hidden rounded-[2rem] border border-white/5 bg-[#050505] shadow-[0_0_50px_rgba(255,255,255,0.02)] p-8 md:p-12 group">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl pointer-events-none group-hover:bg-white/10 transition-colors duration-1000"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex items-center justify-center bg-white/5 border border-white/10 text-white px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-widest rounded-full shadow-[0_0_10px_rgba(255,255,255,0.05)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse mr-2 shadow-[0_0_8px_rgba(255,255,255,0.8)]"></span>
                  System Secured
                </span>
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Protocol 1.0 Active</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
                System <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 to-zinc-500">Initialized</span>
              </h1>
              <p className="mt-4 text-lg text-zinc-400 max-w-2xl font-light">
                De 9-tot-5 is een algoritme. Meedogenloze discipline is de hack. Voltooi je acties, consolideer je schulden en begin met bouwen.
              </p>
            </div>

            <div className="flex items-center gap-4 bg-black/60 border border-white/5 p-6 rounded-2xl backdrop-blur-md">
               <div className="text-center px-4 border-r border-white/10">
                 <div className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest mb-1">Clearance</div>
                 <div className="text-2xl font-black text-white">Tier {currentPhase}</div>
               </div>
               <div className="text-center px-4">
                 <div className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest mb-1">Network Score</div>
                 <div className="text-2xl font-black text-zinc-300">450</div>
               </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Grid: Action Required & Fast Links */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Urgent Action Bento Box */}
        <motion.div variants={itemVariants} className="lg:col-span-8">
          <div className="h-full bg-[#050505] border border-white/10 rounded-[2rem] p-8 relative overflow-hidden group hover:border-white/20 transition-colors shadow-xl">
             <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
             
             <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-3">
                  <Activity className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" />
                  Primary Directive: Financial X-Ray
                </h3>
                <span className="bg-white/5 text-white border border-white/10 px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest animate-pulse shadow-[0_0_10px_rgba(255,255,255,0.1)]">
                  Action Required
                </span>
             </div>

             <div className="bg-black rounded-2xl border border-white/5 p-6 md:p-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-white shadow-[0_0_15px_rgba(255,255,255,0.5)]"></div>
                
                <div className="flex-1">
                  <h4 className="text-2xl font-bold text-white mb-2">Initialize Financial Blueprint</h4>
                  <p className="text-zinc-400 mb-6 font-light">
                    Om de AI je financiën te laten herstructureren, moet het systeem je cashflow kunnen analyseren. Verbind je bank via de beveiligde PSD2 tunnel.
                  </p>
                  
                  <div className="flex items-center gap-6">
                    <Button className="bg-white hover:bg-zinc-200 text-black font-bold uppercase tracking-widest px-8 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                      Connect Now
                    </Button>
                    <span className="text-[10px] text-zinc-500 font-mono">Time est: 2 mins</span>
                  </div>
                </div>

                <div className="w-24 h-24 rounded-full border border-white/10 flex items-center justify-center bg-white/5 shrink-0">
                  <Lock className="w-10 h-10 text-white" />
                </div>
             </div>
          </div>
        </motion.div>

        {/* Global Stats / AI Status */}
        <motion.div variants={itemVariants} className="lg:col-span-4 flex flex-col gap-6">
          <div className="flex-1 bg-[#050505] border border-white/10 rounded-[2rem] p-6 hover:border-white/20 transition-colors shadow-xl flex flex-col">
            <h3 className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Network className="w-3 h-3" /> Active Agents
            </h3>
            
            <div className="space-y-3 flex-1">
              <div className="bg-black border border-white/5 p-4 rounded-xl flex justify-between items-center group cursor-default">
                 <span className="text-sm font-medium text-white group-hover:text-zinc-300 transition-colors">Financial Analyzer</span>
                 <span className="text-[9px] font-mono text-zinc-500 bg-zinc-900 px-2 py-1 rounded">STANDBY</span>
              </div>
              <div className="bg-black border border-white/5 p-4 rounded-xl flex justify-between items-center group cursor-default">
                 <span className="text-sm font-medium text-white group-hover:text-zinc-300 transition-colors">Wealth Engine</span>
                 <span className="text-[9px] font-mono text-white bg-white/10 border border-white/20 px-2 py-1 rounded">LOCKED</span>
              </div>
            </div>
          </div>
        </motion.div>

      </div>

      {/* The Campuses (Bento Grid) */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center gap-3 mb-6 mt-4">
          <Shield className="w-5 h-5 text-white" />
          <h2 className="text-2xl font-bold text-white">The Pillars</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Wealth Campus */}
          <Link href="/dashboard/wealth" className="group">
            <div className="bg-[#050505] border border-white/10 rounded-[2rem] p-8 h-full hover:border-white/30 transition-colors shadow-xl relative overflow-hidden">
              <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Briefcase className="w-48 h-48 text-white" />
              </div>
              
              <div className="w-12 h-12 rounded-2xl bg-black border border-white/20 flex items-center justify-center mb-6 group-hover:bg-white/10 transition-colors">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2">Capital Reconstruction</h3>
              <p className="text-zinc-500 text-sm mb-6 font-light">Fix je schulden, begroot als een bedrijf en bouw meedogenloze cashflow op.</p>
              
              <div className="flex items-center text-xs font-bold text-white uppercase tracking-widest mt-auto">
                Enter Pillar <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

          {/* Mindset Campus */}
          <Link href="/dashboard/life-balance" className="group">
            <div className="bg-[#050505] border border-white/10 rounded-[2rem] p-8 h-full hover:border-white/30 transition-colors shadow-xl relative overflow-hidden">
              <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Map className="w-48 h-48 text-white" />
              </div>
              
              <div className="w-12 h-12 rounded-2xl bg-black border border-white/20 flex items-center justify-center mb-6 group-hover:bg-white/10 transition-colors">
                <Map className="w-6 h-6 text-white" />
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2">Cognitive Reprogramming</h3>
              <p className="text-zinc-500 text-sm mb-6 font-light">Identificeer blinde vlekken en bouw een onbreekbaar mentaal raamwerk.</p>
              
              <div className="flex items-center text-xs font-bold text-white uppercase tracking-widest mt-auto">
                Enter Pillar <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

          {/* Vitality Campus */}
          <Link href="/dashboard/health" className="group">
            <div className="bg-[#050505] border border-white/10 rounded-[2rem] p-8 h-full hover:border-white/30 transition-colors shadow-xl relative overflow-hidden">
              <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Heart className="w-48 h-48 text-white" />
              </div>
              
              <div className="w-12 h-12 rounded-2xl bg-black border border-white/20 flex items-center justify-center mb-6 group-hover:bg-white/10 transition-colors">
                <Heart className="w-6 h-6 text-white" />
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2">Biological Optimisation</h3>
              <p className="text-zinc-500 text-sm mb-6 font-light">Train je lichaam tot de ultieme machine. Gezondheid is de basis van succes.</p>
              
              <div className="flex items-center text-xs font-bold text-white uppercase tracking-widest mt-auto opacity-50">
                <Lock className="w-3 h-3 mr-2" /> Locked (Tier 2)
              </div>
            </div>
          </Link>

        </div>
      </motion.div>

    </motion.div>
  );
}
