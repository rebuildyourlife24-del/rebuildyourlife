"use client";

import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Activity, Server, DollarSign, TrendingUp, Cpu } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { motion } from 'framer-motion';

const revenueData = [
  { time: '08:00', revenue: 1200, roas: 2.1 },
  { time: '10:00', revenue: 2100, roas: 2.4 },
  { time: '12:00', revenue: 3400, roas: 3.1 },
  { time: '14:00', revenue: 4800, roas: 3.5 },
  { time: '16:00', revenue: 5200, roas: 3.2 },
  { time: '18:00', revenue: 6900, roas: 4.0 },
  { time: '20:00', revenue: 8100, roas: 4.2 },
];

export default function AnalyticsDashboard() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="w-full max-w-[1600px] mx-auto p-4 md:p-8 space-y-8">
      
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between"
      >
        <div>
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-widest text-white mb-2 flex items-center gap-3">
            <Activity className="text-[#00ffea] w-8 h-8" />
            Live Analytics
          </h1>
          <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest">
            The Syndicate - Command Center Metrics
          </p>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 bg-black/40 border-[#00ffea]/20">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-[#00ffea]/10 rounded-xl border border-[#00ffea]/20">
              <DollarSign className="w-6 h-6 text-[#00ffea]" />
            </div>
            <span className="text-emerald-400 text-xs font-bold">+14.2%</span>
          </div>
          <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest">Dagomzet</p>
          <p className="text-3xl font-black text-white mt-1">€ 8,100.00</p>
        </Card>
        
        <Card className="p-6 bg-black/40 border-[#ff00aa]/20">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-[#ff00aa]/10 rounded-xl border border-[#ff00aa]/20">
              <TrendingUp className="w-6 h-6 text-[#ff00aa]" />
            </div>
            <span className="text-emerald-400 text-xs font-bold">+0.8</span>
          </div>
          <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest">Gemiddelde ROAS</p>
          <p className="text-3xl font-black text-white mt-1">4.2x</p>
        </Card>

        <Card className="p-6 bg-black/40 border-[#d4af37]/20">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-[#d4af37]/10 rounded-xl border border-[#d4af37]/20">
              <Server className="w-6 h-6 text-[#d4af37]" />
            </div>
            <span className="text-amber-400 text-xs font-bold">STABLE</span>
          </div>
          <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest">Inngest Events/hr</p>
          <p className="text-3xl font-black text-white mt-1">1,240</p>
        </Card>

        <Card className="p-6 bg-black/40 border-zinc-500/20">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-zinc-500/10 rounded-xl border border-zinc-500/20">
              <Cpu className="w-6 h-6 text-zinc-400" />
            </div>
            <span className="text-emerald-400 text-xs font-bold">NOMINAL</span>
          </div>
          <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest">AI Decision Latency</p>
          <p className="text-3xl font-black text-white mt-1">112ms</p>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-black/60 border-white/10 h-[400px]">
          <h2 className="text-sm font-bold text-white uppercase tracking-widest mb-6">Omzet Verloop (Vandaag)</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00ffea" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00ffea" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="time" stroke="#71717a" fontSize={12} tickMargin={10} />
                <YAxis stroke="#71717a" fontSize={12} tickFormatter={(value) => `€${value}`} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderColor: 'rgba(0,255,234,0.3)' }}
                  itemStyle={{ color: '#00ffea' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#00ffea" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6 bg-black/60 border-white/10 h-[400px]">
          <h2 className="text-sm font-bold text-white uppercase tracking-widest mb-6">ROAS Performance</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="time" stroke="#71717a" fontSize={12} tickMargin={10} />
                <YAxis stroke="#71717a" fontSize={12} domain={[0, 5]} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderColor: 'rgba(255,0,170,0.3)' }}
                  itemStyle={{ color: '#ff00aa' }}
                />
                <Line type="monotone" dataKey="roas" stroke="#ff00aa" strokeWidth={3} dot={{ fill: '#ff00aa', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

    </div>
  );
}
