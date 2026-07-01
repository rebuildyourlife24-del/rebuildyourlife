"use client";

import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { Wallet, ArrowUpRight, ArrowDownRight, CreditCard, Download, ExternalLink, AlertTriangle, ShieldCheck } from "lucide-react";

const mockData = [
  { name: "Week 1", revenue: 4000, profit: 2400 },
  { name: "Week 2", revenue: 5000, profit: 3100 },
  { name: "Week 3", revenue: 3800, profit: 2100 },
  { name: "Week 4", revenue: 8200, profit: 5400 },
  { name: "Week 5", revenue: 10500, profit: 7100 },
  { name: "Week 6", revenue: 12000, profit: 8400 },
];

export default function FinanceDashboard() {
  const [bankConnected, setBankConnected] = useState(false);

  return (
    <div className="flex-1 p-8 overflow-y-auto bg-[#0a0a0a]">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-wider text-white">Treasury & Capital</h1>
          <p className="text-zinc-400 mt-1">Sovereign Financial Command Center</p>
        </div>
        <div className="flex gap-4">
          <button className="bg-[#111] border border-white/10 hover:border-white/30 text-white px-6 py-3 font-bold uppercase tracking-widest text-sm flex items-center gap-2 transition-colors">
            <Download className="w-4 h-4" /> Rapportage
          </button>
          <button 
            onClick={() => setBankConnected(true)}
            className={`px-6 py-3 font-bold uppercase tracking-widest text-sm flex items-center gap-2 transition-colors ${
              bankConnected 
                ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/30' 
                : 'bg-[#d4af37] text-black hover:bg-white border border-transparent'
            }`}
          >
            {bankConnected ? <><ShieldCheck className="w-4 h-4" /> Bank Gekoppeld</> : <><CreditCard className="w-4 h-4" /> Koppel Bank (Stripe)</>}
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* Net Revenue */}
        <div className="bg-[#111] border border-white/5 p-6 relative overflow-hidden group hover:border-[#d4af37]/50 transition-colors">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Wallet className="w-24 h-24 text-[#d4af37]" />
          </div>
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs mb-2">Netto Omzet (30d)</p>
          <h2 className="text-4xl font-black text-white font-mono mb-2">€ 43.500<span className="text-xl text-zinc-600">.00</span></h2>
          <div className="flex items-center gap-2 text-emerald-500 font-bold text-sm">
            <ArrowUpRight className="w-4 h-4" /> +12.4% vs vorige maand
          </div>
        </div>

        {/* Profit Margin */}
        <div className="bg-[#111] border border-white/5 p-6 relative overflow-hidden group hover:border-[#d4af37]/50 transition-colors">
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs mb-2">Winstmarge</p>
          <h2 className="text-4xl font-black text-white font-mono mb-2">68<span className="text-xl text-zinc-600">%</span></h2>
          <div className="flex items-center gap-2 text-emerald-500 font-bold text-sm">
            <ArrowUpRight className="w-4 h-4" /> +2.1% vs vorige maand
          </div>
        </div>

        {/* Active Capital */}
        <div className="bg-[#111] border border-white/5 p-6 relative overflow-hidden group hover:border-[#d4af37]/50 transition-colors">
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs mb-2">Werkkapitaal</p>
          <h2 className="text-4xl font-black text-white font-mono mb-2">€ 18.250<span className="text-xl text-zinc-600">.00</span></h2>
          <div className="flex items-center gap-2 text-rose-500 font-bold text-sm">
            <ArrowDownRight className="w-4 h-4" /> Actieve ad spend hoog
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-[#111] border border-white/5 p-6">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-white font-bold uppercase tracking-widest text-sm">P&L Groei Traject</h3>
            <div className="flex gap-4 text-xs font-bold uppercase">
              <span className="text-[#d4af37] flex items-center gap-2"><div className="w-2 h-2 bg-[#d4af37] rounded-full"></div> Omzet</span>
              <span className="text-emerald-500 flex items-center gap-2"><div className="w-2 h-2 bg-emerald-500 rounded-full"></div> Winst</span>
            </div>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d4af37" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#d4af37" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                <XAxis dataKey="name" stroke="#444" tick={{fill: '#666', fontSize: 12}} />
                <YAxis stroke="#444" tick={{fill: '#666', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111', border: '1px solid #333', color: '#fff' }}
                  itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#d4af37" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={2} />
                <Area type="monotone" dataKey="profit" stroke="#10b981" fillOpacity={1} fill="url(#colorProfit)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Financial Analysis */}
        <div className="bg-[#111] border border-white/5 p-6 flex flex-col">
          <h3 className="text-white font-bold uppercase tracking-widest text-sm mb-6 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#d4af37]" /> CFO AI Analyse
          </h3>
          
          <div className="flex-1 space-y-4">
            <div className="bg-black/50 p-4 border-l-2 border-emerald-500">
              <p className="text-sm text-zinc-300">
                Winstmarge is met 2.1% gestegen. De geautomatiseerde upsell flows via de COO-agent leveren direct ROI op.
              </p>
            </div>
            <div className="bg-black/50 p-4 border-l-2 border-[#d4af37]">
              <p className="text-sm text-zinc-300">
                Ad spend is lichtelijk aan de hoge kant (CAC = €24). Overweeg de CMO-agent in te zetten om ad-creatives te optimaliseren.
              </p>
            </div>
            
            {!bankConnected && (
              <div className="bg-rose-500/10 p-4 border border-rose-500/30 mt-auto">
                <p className="text-sm text-rose-500 font-bold mb-2 uppercase tracking-wide text-xs">Actie Vereist</p>
                <p className="text-sm text-rose-400/80 mb-3">Koppel je zakelijke bankrekening om live cashflow interceptie te activeren.</p>
                <button 
                  onClick={() => setBankConnected(true)}
                  className="w-full bg-rose-500 text-white font-bold py-2 text-xs uppercase tracking-widest hover:bg-rose-600 transition-colors"
                >
                  Nu Koppelen
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
