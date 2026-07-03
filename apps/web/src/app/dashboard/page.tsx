'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { useRequireAuth } from '@/lib/auth';
import { Brain, Briefcase, Activity, Network, Search, Terminal, Tv, Map, Rocket, Shield, ChevronRight } from 'lucide-react';
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

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-12 max-w-[1400px] mx-auto pb-20 font-sans h-full overflow-y-auto px-4 sm:px-6 lg:px-8 py-8 custom-scrollbar"
    >
      {/* Header Widget */}
      <motion.div variants={itemVariants}>
        <div className="relative overflow-hidden rounded-[2rem] border border-neonCyan/20 glass-cyber p-8 md:p-12 group">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-neonCyan/5 rounded-full blur-3xl pointer-events-none group-hover:bg-neonCyan/10 transition-colors duration-1000"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex items-center justify-center bg-neonCyan/10 border border-neonCyan/30 text-neonCyan px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-widest rounded-full shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-neonCyan animate-pulse mr-2 shadow-[0_0_10px_rgba(6,182,212,0.8)]"></span>
                  AI Revenue Engine
                </span>
              </div>
              <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter uppercase leading-[0.9]">
                The <span className="neon-text">Neuromatrix</span>
              </h1>
              <p className="mt-4 text-lg text-zinc-400 max-w-2xl font-light">
                Welkom in je commandocentrum. Dit is je geautomatiseerde team. Selecteer een specialist om processen te optimaliseren of direct omzet te verhogen.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* The Boardroom (C-Suite) */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-neonCyan" />
            <h2 className="text-2xl font-bold text-white uppercase tracking-widest neon-text">Leidinggevenden (C-Suite)</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* CEO */}
          <Link href="/dashboard/c-suite/ceo" className="group">
            <div className="glass-cyber rounded-[2rem] p-8 h-full relative overflow-hidden flex flex-col group-hover:shadow-[0_0_30px_rgba(6,182,212,0.15)]">
              <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Brain className="w-48 h-48 text-white" />
              </div>
              <div className="w-12 h-12 rounded-2xl bg-[#020202] border border-neonCyan/30 flex items-center justify-center mb-6 group-hover:bg-neonCyan/10 transition-colors shrink-0 shadow-[0_0_15px_rgba(6,182,212,0.1)] group-hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-1">CEO</h3>
              <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-4">Strategie & Groei</p>
              <p className="text-zinc-500 text-sm mb-6 font-light flex-1">Spar over bedrijfsstructuur, schaalbaarheid en de grote lijnen van je bedrijf.</p>
              <div className="flex items-center text-xs font-bold text-white uppercase tracking-widest mt-auto">
                Start Sessie <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

          {/* CFO */}
          <Link href="/dashboard/c-suite/cfo" className="group">
            <div className="glass-cyber rounded-[2rem] p-8 h-full relative overflow-hidden flex flex-col group-hover:shadow-[0_0_30px_rgba(6,182,212,0.15)]">
              <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Briefcase className="w-48 h-48 text-white" />
              </div>
              <div className="w-12 h-12 rounded-2xl bg-[#020202] border border-neonCyan/30 flex items-center justify-center mb-6 group-hover:bg-neonCyan/10 transition-colors shrink-0 shadow-[0_0_15px_rgba(6,182,212,0.1)] group-hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-1">CFO</h3>
              <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-4">Winst & Kapitaal</p>
              <p className="text-zinc-500 text-sm mb-6 font-light flex-1">Analyseer kosten, optimaliseer marges en beheer cashflow beslissingen.</p>
              <div className="flex items-center text-xs font-bold text-white uppercase tracking-widest mt-auto">
                Start Sessie <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

          {/* CMO */}
          <Link href="/dashboard/c-suite/cmo" className="group">
            <div className="glass-cyber rounded-[2rem] p-8 h-full relative overflow-hidden flex flex-col group-hover:shadow-[0_0_30px_rgba(6,182,212,0.15)]">
              <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Activity className="w-48 h-48 text-white" />
              </div>
              <div className="w-12 h-12 rounded-2xl bg-[#020202] border border-neonCyan/30 flex items-center justify-center mb-6 group-hover:bg-neonCyan/10 transition-colors shrink-0 shadow-[0_0_15px_rgba(6,182,212,0.1)] group-hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-1">CMO</h3>
              <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-4">Marketing & Acquisitie</p>
              <p className="text-zinc-500 text-sm mb-6 font-light flex-1">Campagne strategie, branding en aansturing van het marketingteam.</p>
              <div className="flex items-center text-xs font-bold text-white uppercase tracking-widest mt-auto">
                Start Sessie <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

          {/* COO */}
          <Link href="/dashboard/c-suite/coo" className="group">
            <div className="glass-cyber rounded-[2rem] p-8 h-full relative overflow-hidden flex flex-col group-hover:shadow-[0_0_30px_rgba(6,182,212,0.15)]">
              <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Network className="w-48 h-48 text-white" />
              </div>
              <div className="w-12 h-12 rounded-2xl bg-[#020202] border border-neonCyan/30 flex items-center justify-center mb-6 group-hover:bg-neonCyan/10 transition-colors shrink-0 shadow-[0_0_15px_rgba(6,182,212,0.1)] group-hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                <Network className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-1">COO</h3>
              <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-4">Systemen & Operaties</p>
              <p className="text-zinc-500 text-sm mb-6 font-light flex-1">Optimaliseer interne processen, logistiek en software koppelingen.</p>
              <div className="flex items-center text-xs font-bold text-white uppercase tracking-widest mt-auto">
                Start Sessie <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

        </div>
      </motion.div>

      {/* Specialized Agents */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-between mb-6 mt-8">
          <div className="flex items-center gap-3">
            <Rocket className="w-5 h-5 text-neonPurple" />
            <h2 className="text-2xl font-bold text-white uppercase tracking-widest" style={{ textShadow: '0 0 10px rgba(139,92,246,0.6)' }}>Revenue Agents (Machines)</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* SEO & Traffic */}
          <Link href="/dashboard/agents/seo" className="group">
            <div className="glass-cyber rounded-[1.5rem] p-6 flex items-start gap-4 hover:shadow-[0_0_20px_rgba(139,92,246,0.2)]">
              <div className="w-10 h-10 rounded-xl bg-[#020202] border border-neonPurple/30 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(139,92,246,0.1)]">
                <Search className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white">SEO & Traffic</h3>
                <p className="text-xs text-zinc-500 mt-1">Organisch bereik en keyword analyse.</p>
              </div>
            </div>
          </Link>

          {/* CRO */}
          <Link href="/dashboard/agents/cro" className="group">
            <div className="glass-cyber rounded-[1.5rem] p-6 flex items-start gap-4 hover:shadow-[0_0_20px_rgba(139,92,246,0.2)]">
              <div className="w-10 h-10 rounded-xl bg-[#020202] border border-neonPurple/30 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(139,92,246,0.1)]">
                <Map className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white">CRO & Funnels</h3>
                <p className="text-xs text-zinc-500 mt-1">Conversie optimalisatie en webdesign.</p>
              </div>
            </div>
          </Link>

          {/* Copywriter */}
          <Link href="/dashboard/agents/copywriter" className="group">
            <div className="glass-cyber rounded-[1.5rem] p-6 flex items-start gap-4 hover:shadow-[0_0_20px_rgba(139,92,246,0.2)]">
              <div className="w-10 h-10 rounded-xl bg-[#020202] border border-neonPurple/30 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(139,92,246,0.1)]">
                <Terminal className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white">Copy & Content</h3>
                <p className="text-xs text-zinc-500 mt-1">Sales pages, ads en email funnels.</p>
              </div>
            </div>
          </Link>

          {/* Ads & Media */}
          <Link href="/dashboard/agents/ads" className="group">
            <div className="glass-cyber rounded-[1.5rem] p-6 flex items-start gap-4 hover:shadow-[0_0_20px_rgba(139,92,246,0.2)]">
              <div className="w-10 h-10 rounded-xl bg-[#020202] border border-neonPurple/30 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(139,92,246,0.1)]">
                <Tv className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white">Ads & Media</h3>
                <p className="text-xs text-zinc-500 mt-1">ROAS optimalisatie en betaalde traffic.</p>
              </div>
            </div>
          </Link>

          {/* Data */}
          <Link href="/dashboard/agents/data" className="group">
            <div className="glass-cyber rounded-[1.5rem] p-6 flex items-start gap-4 hover:shadow-[0_0_20px_rgba(139,92,246,0.2)]">
              <div className="w-10 h-10 rounded-xl bg-[#020202] border border-neonPurple/30 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(139,92,246,0.1)]">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white">Data & Analytics</h3>
                <p className="text-xs text-zinc-500 mt-1">Harde cijfers, trends en patronen.</p>
              </div>
            </div>
          </Link>

        </div>
      </motion.div>

    </motion.div>
  );
}
