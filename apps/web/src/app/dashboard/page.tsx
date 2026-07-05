'use client';

import { motion } from 'framer-motion';
import { useRequireAuth } from '@/lib/auth';
import { 
  GraduationCap, 
  MessageSquare, 
  Terminal, 
  Search, 
  ShoppingCart, 
  Briefcase,
  Bot,
  Activity,
  ArrowUpRight
} from 'lucide-react';
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
                  Rebuild Your Life OS
                </span>
              </div>
              <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter uppercase leading-[0.9]">
                The <span className="neon-text">Control Room</span>
              </h1>
              <p className="mt-4 text-lg text-zinc-400 max-w-2xl font-light">
                Welkom in het zenuwcentrum van je imperium. Volg theorie via de Academy, connect met de Community, of automatiseer processen via de Swarm AI.
              </p>
            </div>
            
            {/* Quick Stats Summary */}
            <div className="flex gap-4">
               <div className="bg-black/50 border border-white/10 rounded-xl p-4 min-w-[120px]">
                 <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1 font-mono">Academy XP</p>
                 <p className="text-2xl font-black text-white">450<span className="text-sm text-neonCyan ml-1">xp</span></p>
               </div>
               <div className="bg-black/50 border border-white/10 rounded-xl p-4 min-w-[120px]">
                 <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1 font-mono">Active Agents</p>
                 <p className="text-2xl font-black text-white">2</p>
               </div>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Pillar 1: Academy */}
        <Link href="/dashboard/academy" className="group">
          <div className="glass-cyber rounded-[1.5rem] p-6 h-full flex flex-col hover:shadow-[0_0_20px_rgba(139,92,246,0.2)] border border-white/5 hover:border-purple-500/30 transition-all">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center shrink-0 mb-4 group-hover:scale-110 transition-transform">
              <GraduationCap className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-wide">The Academy</h3>
            <p className="text-sm text-zinc-400 font-light flex-1">
              Volg cursussen over AI Automation, Dropshipping, en Copywriting. Bouw je vaardigheden op.
            </p>
            <div className="mt-4 flex items-center text-[10px] text-purple-400 uppercase tracking-widest font-bold">
              Start Leren <ArrowUpRight className="w-3 h-3 ml-1" />
            </div>
          </div>
        </Link>

        {/* Pillar 2: Community */}
        <Link href="/dashboard/community" className="group">
          <div className="glass-cyber rounded-[1.5rem] p-6 h-full flex flex-col hover:shadow-[0_0_20px_rgba(59,130,246,0.2)] border border-white/5 hover:border-blue-500/30 transition-all">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center shrink-0 mb-4 group-hover:scale-110 transition-transform">
              <MessageSquare className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-wide">The Network</h3>
            <p className="text-sm text-zinc-400 font-light flex-1">
              Forums, peer-reviews, netwerkevenementen en directe Q&A sessies met coaches.
            </p>
            <div className="mt-4 flex items-center text-[10px] text-blue-400 uppercase tracking-widest font-bold">
              Word Lid <ArrowUpRight className="w-3 h-3 ml-1" />
            </div>
          </div>
        </Link>

        {/* Pillar 3: E-commerce & Finance */}
        <Link href="/dashboard/ecommerce" className="group">
          <div className="glass-cyber rounded-[1.5rem] p-6 h-full flex flex-col hover:shadow-[0_0_20px_rgba(16,185,129,0.2)] border border-white/5 hover:border-emerald-500/30 transition-all">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0 mb-4 group-hover:scale-110 transition-transform">
              <ShoppingCart className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-wide">E-Commerce</h3>
            <p className="text-sm text-zinc-400 font-light flex-1">
              Beheer je Shopify metrics, CRM en bedrijfsfacturatie direct vanuit je dashboard.
            </p>
            <div className="mt-4 flex items-center text-[10px] text-emerald-400 uppercase tracking-widest font-bold">
              Bekijk Data <ArrowUpRight className="w-3 h-3 ml-1" />
            </div>
          </div>
        </Link>

        {/* Pillar 4: Autonomous Agents */}
        <Link href="/dashboard/agents" className="group">
          <div className="glass-cyber rounded-[1.5rem] p-6 h-full flex flex-col hover:shadow-[0_0_20px_rgba(6,182,212,0.2)] border border-white/5 hover:border-neonCyan/30 transition-all">
            <div className="w-12 h-12 rounded-xl bg-neonCyan/10 border border-neonCyan/30 flex items-center justify-center shrink-0 mb-4 group-hover:scale-110 transition-transform">
              <Bot className="w-6 h-6 text-neonCyan" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-wide">Swarm AI Agents</h3>
            <p className="text-sm text-zinc-400 font-light flex-1">
              Stuur je CEO, CMO of CFO agents aan om taken autonoom voor je uit te voeren.
            </p>
            <div className="mt-4 flex items-center text-[10px] text-neonCyan uppercase tracking-widest font-bold">
              Manage Swarm <ArrowUpRight className="w-3 h-3 ml-1" />
            </div>
          </div>
        </Link>

        {/* Pillar 5: Tools & Resources */}
        <Link href="/dashboard/tools" className="group">
          <div className="glass-cyber rounded-[1.5rem] p-6 h-full flex flex-col hover:shadow-[0_0_20px_rgba(245,158,11,0.2)] border border-white/5 hover:border-amber-500/30 transition-all">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0 mb-4 group-hover:scale-110 transition-transform">
              <Briefcase className="w-6 h-6 text-amber-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-wide">Tools & Resources</h3>
            <p className="text-sm text-zinc-400 font-light flex-1">
              SOP bibliotheek, templates, contracten en direct inzetbare marketing modules.
            </p>
            <div className="mt-4 flex items-center text-[10px] text-amber-400 uppercase tracking-widest font-bold">
              Open Vault <ArrowUpRight className="w-3 h-3 ml-1" />
            </div>
          </div>
        </Link>
        
        {/* Placeholder for Quick Actions */}
        <div className="glass-cyber rounded-[1.5rem] p-6 h-full flex flex-col border border-white/5 border-dashed bg-white/5 opacity-50">
           <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-wide">Hermes Actions</h3>
           <p className="text-sm text-zinc-400 font-light flex-1">
              Roep de command console op (Command + K) om Hermes een directe taak te geven.
           </p>
        </div>

      </motion.div>
    </motion.div>
  );
}
