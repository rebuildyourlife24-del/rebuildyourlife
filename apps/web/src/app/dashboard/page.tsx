'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/lib/auth';
import { Shield, Sparkles, TrendingUp, CalendarDays, Activity } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 100, damping: 20 } },
};

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-10 max-w-7xl mx-auto"
    >
      {/* The Holographic AI Concierge */}
      <motion.div variants={itemVariants}>
        <div className="relative overflow-hidden rounded-3xl border border-[#d4a853]/40 bg-black/80 shadow-[0_0_60px_rgba(212,168,83,0.15)] p-8 md:p-12">
          {/* Subtle animated background gradient */}
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#d4a853]/20 via-black to-black opacity-60 pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="w-24 h-24 rounded-full border-2 border-[#d4a853] flex items-center justify-center bg-black/50 shadow-[0_0_30px_rgba(212,168,83,0.5)]">
              <Sparkles className="w-10 h-10 text-[#d4a853] animate-pulse" />
            </div>
            <div>
              <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight uppercase">
                Welcome back, <span className="text-[#d4a853]">{user?.firstName || 'Boss'}</span>.
              </h1>
              <p className="mt-3 text-lg text-zinc-400 max-w-2xl">
                "Gefeliciteerd. We hebben zojuist <strong className="text-white">€400</strong> aan onrechtmatige incassokosten geblokkeerd via de VTLB-Lock. De tegenaanval is ingezet."
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Predictive Wealth Matrix (VTLB 2.0) */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="p-8 h-full bg-[#050505] border border-[#d4a853]/20 shadow-[0_0_40px_rgba(212,168,83,0.05)] relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
              <TrendingUp className="w-48 h-48 text-[#d4a853]" />
            </div>
            
            <div className="flex items-center gap-3 mb-8">
              <Shield className="w-8 h-8 text-[#d4a853]" />
              <h2 className="text-2xl font-bold text-white uppercase tracking-widest">Predictive Wealth Matrix</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="space-y-2">
                <p className="text-sm font-bold text-zinc-500 uppercase">Live VTLB Protection</p>
                <p className="text-4xl font-mono font-bold text-[#d4a853]">€ 1.740,50</p>
                <p className="text-xs text-zinc-400">Secured from creditors this month</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-bold text-zinc-500 uppercase">Total Debt Remaining</p>
                <p className="text-4xl font-mono font-bold text-red-500">€ 14.200,00</p>
                <p className="text-xs text-zinc-400">Decreasing steadily via AI negotiations</p>
              </div>
            </div>

            {/* Debt Destruction Timeline */}
            <div className="mt-10 border-t border-zinc-800 pt-8">
              <h3 className="text-sm font-bold text-white uppercase mb-4 flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-[#d4a853]" />
                Estimated Financial Freedom
              </h3>
              
              <div className="w-full bg-zinc-900 rounded-full h-4 mb-2 overflow-hidden border border-zinc-800">
                <motion.div 
                  className="bg-gradient-to-r from-red-600 via-orange-500 to-[#d4a853] h-full"
                  initial={{ width: 0 }}
                  animate={{ width: '65%' }}
                  transition={{ duration: 2, ease: "easeOut" }}
                />
              </div>
              <div className="flex justify-between text-xs font-mono font-bold text-zinc-500 uppercase">
                <span>Start: -€42.000</span>
                <span className="text-[#d4a853]">Projected Zero: Okt 2027</span>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* The Elite Academy / Quick Actions */}
        <motion.div variants={itemVariants} className="space-y-8">
          <Card className="p-6 bg-[#0a0a0a] border border-[#d4a853]/30">
            <div className="flex items-center gap-3 mb-6">
              <Activity className="w-6 h-6 text-[#d4a853]" />
              <h3 className="text-lg font-bold text-white uppercase tracking-widest">Active Operations</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-zinc-900 rounded-lg border border-zinc-800">
                <div className="font-medium text-white">Debt Negotiator</div>
                <div className="text-xs font-bold text-emerald-500 uppercase animate-pulse">Running</div>
              </div>
              <div className="flex items-center justify-between p-4 bg-zinc-900 rounded-lg border border-zinc-800">
                <div className="font-medium text-white">Legal Engine</div>
                <div className="text-xs font-bold text-emerald-500 uppercase">Standby</div>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-b from-[#111] to-black border border-zinc-800">
            <h3 className="text-lg font-bold text-white mb-2 uppercase">The Elite Academy</h3>
            <p className="text-zinc-400 text-sm mb-6">Master the Billionaire Mindset. Learn how to leverage the VTLB loophole.</p>
            <Button className="w-full bg-[#d4a853] hover:bg-[#b0893a] text-black font-bold uppercase tracking-widest border-none">
              Enter Academy
            </Button>
          </Card>
        </motion.div>

      </div>
    </motion.div>
  );
}
