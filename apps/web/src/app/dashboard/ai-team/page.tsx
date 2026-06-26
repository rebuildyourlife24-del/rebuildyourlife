"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Brain, Users, Zap, Cpu, Network, ArrowRight } from 'lucide-react';
import { NeuralSwarm } from '@/components/ui/NeuralSwarm';

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
             AI TEAM HUB
           </h1>
           <p className="text-cyan-500 uppercase tracking-[0.3em] text-xs font-bold mt-2 flex items-center gap-2">
             <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
             Kies je AI Agent voor onafhankelijke executie
           </p>
        </div>
        <div className="text-right">
          <Badge variant="outline" className="border-cyan-500/30 text-cyan-300 bg-cyan-950/40 backdrop-blur-md px-4 py-2 uppercase tracking-widest font-black shadow-[0_0_20px_rgba(34,211,238,0.1)]">
            NEURAL LINK: OPTIMAL
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Hermes Card */}
        <motion.div variants={itemVariants}>
          <Link href="/dashboard/ai-team/hermes" className="block group">
            <Card className="h-full bg-black/60 border border-cyan-500/20 backdrop-blur-xl p-8 hover:bg-cyan-950/20 hover:border-cyan-500/50 transition-all shadow-lg hover:shadow-[0_0_40px_rgba(34,211,238,0.2)] flex flex-col">
              <div className="flex justify-between items-start mb-6">
                <div className="p-4 bg-cyan-500/10 rounded-2xl border border-cyan-500/30 group-hover:scale-110 transition-transform">
                  <Zap className="w-10 h-10 text-cyan-400" />
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-[9px] text-cyan-400 font-black uppercase tracking-widest">ONLINE</span>
                </div>
              </div>
              <h2 className="text-2xl font-black uppercase tracking-widest text-white mb-2 group-hover:text-cyan-400 transition-colors">
                HERMES
              </h2>
              <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest mb-6">
                Frontend, Automation & Execution
              </p>
              <p className="text-sm text-zinc-300 leading-relaxed mb-8 flex-1 font-mono">
                Gebruik Hermes voor snelle script-executie, frontend deployments, copywriting en directe automation taken.
              </p>
              <div className="mt-auto flex items-center justify-between text-cyan-400 text-xs font-black uppercase tracking-widest border-t border-cyan-500/20 pt-4">
                <span>Start Terminal</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
              </div>
            </Card>
          </Link>
        </motion.div>

        {/* Orion Card */}
        <motion.div variants={itemVariants}>
          <Link href="/dashboard/ai-team/orion" className="block group">
            <Card className="h-full bg-black/60 border border-indigo-500/20 backdrop-blur-xl p-8 hover:bg-indigo-950/20 hover:border-indigo-500/50 transition-all shadow-lg hover:shadow-[0_0_40px_rgba(99,102,241,0.2)] flex flex-col">
              <div className="flex justify-between items-start mb-6">
                <div className="p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/30 group-hover:scale-110 transition-transform">
                  <Cpu className="w-10 h-10 text-indigo-400" />
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20">
                  <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                  <span className="text-[9px] text-indigo-400 font-black uppercase tracking-widest">AURA ACTIVE</span>
                </div>
              </div>
              <h2 className="text-2xl font-black uppercase tracking-widest text-white mb-2 group-hover:text-indigo-400 transition-colors">
                ORION
              </h2>
              <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest mb-6">
                Strategic Overseer & Architect
              </p>
              <p className="text-sm text-zinc-300 leading-relaxed mb-8 flex-1 font-mono">
                Gebruik Orion voor marktonderzoek, risico-inschattingen, financiële modellering en architectuur ontwerpen.
              </p>
              <div className="mt-auto flex items-center justify-between text-indigo-400 text-xs font-black uppercase tracking-widest border-t border-indigo-500/20 pt-4">
                <span>Start Consultatie</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
              </div>
            </Card>
          </Link>
        </motion.div>

        {/* Swarm Card */}
        <motion.div variants={itemVariants}>
          <Link href="/dashboard/ai-team/swarm" className="block group">
            <Card className="h-full bg-black/60 border border-fuchsia-500/20 backdrop-blur-xl p-8 hover:bg-fuchsia-950/20 hover:border-fuchsia-500/50 transition-all shadow-lg hover:shadow-[0_0_40px_rgba(217,70,239,0.2)] flex flex-col relative overflow-hidden">
              {/* Subtle background element */}
              <div className="absolute inset-0 opacity-10 pointer-events-none z-0">
                <NeuralSwarm theme="purple" />
              </div>

              <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-6">
                  <div className="p-4 bg-fuchsia-500/10 rounded-2xl border border-fuchsia-500/30 group-hover:scale-110 transition-transform">
                    <Network className="w-10 h-10 text-fuchsia-400" />
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/20 shadow-[0_0_10px_rgba(217,70,239,0.2)]">
                    <div className="w-2 h-2 rounded-full bg-fuchsia-400 animate-pulse" />
                    <span className="text-[9px] text-fuchsia-400 font-black uppercase tracking-widest">HIVE SYNCED</span>
                  </div>
                </div>
                <h2 className="text-2xl font-black uppercase tracking-widest text-white mb-2 group-hover:text-fuchsia-400 transition-colors">
                  THE SWARM
                </h2>
                <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest mb-6">
                  Collective Intelligence Protocol
                </p>
                <p className="text-sm text-zinc-300 leading-relaxed mb-8 flex-1 font-mono">
                  Zet The Swarm in voor massale parallelle scraping-taken, content-syndicatie en complexe multi-step berekeningen.
                </p>
                <div className="mt-auto flex items-center justify-between text-fuchsia-400 text-xs font-black uppercase tracking-widest border-t border-fuchsia-500/20 pt-4">
                  <span>Initialiseer Hive Mind</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </Card>
          </Link>
        </motion.div>

      </div>
    </motion.div>
  );
}
