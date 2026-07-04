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

      {/* Real Modules */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-neonCyan" />
            <h2 className="text-2xl font-bold text-white uppercase tracking-widest neon-text">Actieve Modules</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* E-Commerce Agent */}
          <Link href="/dashboard/agents/ecommerce" className="group">
            <div className="glass-cyber rounded-[1.5rem] p-6 flex items-start gap-4 hover:shadow-[0_0_20px_rgba(6,182,212,0.2)] border border-neonCyan/10">
              <div className="w-10 h-10 rounded-xl bg-[#020202] border border-neonCyan/30 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(6,182,212,0.1)]">
                <Terminal className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white">E-Commerce (Shopify)</h3>
                <p className="text-xs text-zinc-500 mt-1">Product generator & API push.</p>
              </div>
            </div>
          </Link>

          {/* SEO Audit */}
          <Link href="/dashboard/modules/seo-audit" className="group">
            <div className="glass-cyber rounded-[1.5rem] p-6 flex items-start gap-4 hover:shadow-[0_0_20px_rgba(6,182,212,0.2)] border border-neonCyan/10">
              <div className="w-10 h-10 rounded-xl bg-[#020202] border border-neonCyan/30 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(6,182,212,0.1)]">
                <Search className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white">SEO Audit Scanner</h3>
                <p className="text-xs text-zinc-500 mt-1">Scrape & analyseer URL's.</p>
              </div>
            </div>
          </Link>

          {/* Cold Email */}
          <Link href="/dashboard/modules/cold-email" className="group">
            <div className="glass-cyber rounded-[1.5rem] p-6 flex items-start gap-4 hover:shadow-[0_0_20px_rgba(6,182,212,0.2)] border border-neonCyan/10">
              <div className="w-10 h-10 rounded-xl bg-[#020202] border border-neonCyan/30 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(6,182,212,0.1)]">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white">Cold Email Generator</h3>
                <p className="text-xs text-zinc-500 mt-1">AI-gedreven B2B lead scripts.</p>
              </div>
            </div>
          </Link>

        </div>
      </motion.div>

    </motion.div>
  );
}
