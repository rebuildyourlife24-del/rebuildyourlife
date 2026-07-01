"use client";

import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Wallet, ArrowUpRight, ArrowDownRight, CreditCard, Download, AlertTriangle, ShieldCheck, Layers } from "lucide-react";

const mockHoldingData = [
  { name: "Week 1", ecom: 4000, saas: 1200, agency: 3000 },
  { name: "Week 2", ecom: 5000, saas: 1500, agency: 3000 },
  { name: "Week 3", ecom: 3800, saas: 2100, agency: 4500 },
  { name: "Week 4", ecom: 8200, saas: 2800, agency: 4500 },
  { name: "Week 5", ecom: 10500, saas: 3600, agency: 6000 },
  { name: "Week 6", ecom: 12000, saas: 4500, agency: 6000 },
];

export default function FinanceDashboard() {
  const [bankConnected, setBankConnected] = useState(false);

  return (
    <div className="flex-1 p-8 overflow-y-auto bg-[#0a0a0a]">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Layers className="text-[#d4af37] w-6 h-6" />
            <h1 className="text-3xl font-black uppercase tracking-wider text-white">God-Mode Treasury</h1>
          </div>
          <p className="text-zinc-400">Sovereign Holding Command Center (Geaggregeerd)</p>
        </div>
        <div className="flex gap-4">
          <button className="bg-[#111] border border-white/10 hover:border-white/30 text-white px-6 py-3 font-bold uppercase tracking-widest text-sm flex items-center gap-2 transition-colors">
            <Download className="w-4 h-4" /> Export P&L
          </button>
          <button 
            onClick={() => setBankConnected(true)}
            className={`px-6 py-3 font-bold uppercase tracking-widest text-sm flex items-center gap-2 transition-colors ${
              bankConnected 
                ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/30' 
                : 'bg-[#d4af37] text-black hover:bg-white border border-transparent'
            }`}
          >
            {bankConnected ? <><ShieldCheck className="w-4 h-4" /> Banken Gekoppeld (3)</> : <><CreditCard className="w-4 h-4" /> Koppel Banken (Stripe)</>}
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* Total Holding Revenue */}
        <div className="bg-[#111] border border-[#d4af37]/20 p-6 relative overflow-hidden group hover:border-[#d4af37]/50 transition-colors">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Wallet className="w-24 h-24 text-[#d4af37]" />
          </div>
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs mb-2">Holding Omzet (30d)</p>
          <h2 className="text-4xl font-black text-[#d4af37] font-mono mb-2">€ 75.600<span className="text-xl text-[#d4af37]/50">.00</span></h2>
          <div className="flex items-center gap-2 text-emerald-500 font-bold text-sm">
            <ArrowUpRight className="w-4 h-4" /> +18.4% Portfolio Groei
          </div>
        </div>

        {/* E-Com Performance */}
        <div className="bg-[#111] border border-emerald-500/10 p-6 relative overflow-hidden group hover:border-emerald-500/30 transition-colors">
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs mb-2">Top Performer: E-Com Alpha</p>
          <h2 className="text-4xl font-black text-white font-mono mb-2">€ 43.500<span className="text-xl text-zinc-600">.00</span></h2>
          <div className="flex items-center gap-2 text-emerald-500 font-bold text-sm">
            Winstmarge: 68%
          </div>
        </div>

        {/* Agency Performance */}
        <div className="bg-[#111] border border-blue-500/10 p-6 relative overflow-hidden group hover:border-blue-500/30 transition-colors">
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs mb-2">Stabiele Cashflow: Agency</p>
          <h2 className="text-4xl font-black text-white font-mono mb-2">€ 27.000<span className="text-xl text-zinc-600">.00</span></h2>
          <div className="flex items-center gap-2 text-blue-500 font-bold text-sm">
            Winstmarge: 82% (High Ticket)
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-[#111] border border-white/5 p-6">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-white font-bold uppercase tracking-widest text-sm">Holding Portfolio Stack (Omzet per Project)</h3>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockHoldingData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                <XAxis dataKey="name" stroke="#444" tick={{fill: '#666', fontSize: 12}} />
                <YAxis stroke="#444" tick={{fill: '#666', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111', border: '1px solid #333', color: '#fff' }}
                  itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                />
                <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }} />
                <Bar dataKey="ecom" name="E-Com Alpha" stackId="a" fill="#10b981" />
                <Bar dataKey="agency" name="Service Agency" stackId="a" fill="#3b82f6" />
                <Bar dataKey="saas" name="SaaS Beta" stackId="a" fill="#8b5cf6" />
              </BarChart>
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
