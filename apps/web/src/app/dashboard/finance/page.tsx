"use client";

import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Wallet, ArrowUpRight, ArrowDownRight, CreditCard, Download, AlertTriangle, ShieldCheck, Layers, Loader2, Cpu } from "lucide-react";
import { getHoldingRevenueAction, getCfoVaultsAction, simulateRevenueAction } from "@/app/actions/finance";

export default function FinanceDashboard() {
  const [bankConnected, setBankConnected] = useState(false);
  const [chartData, setChartData] = useState<any[]>([]);
  const [vaults, setVaults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [simulating, setSimulating] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const [revRes, vaultRes] = await Promise.all([
      getHoldingRevenueAction(),
      getCfoVaultsAction()
    ]);
    if (revRes.success) setChartData(revRes.data);
    if (vaultRes.success) setVaults(vaultRes.data);
    setLoading(false);
  }

  const handleConnectMollie = () => {
    window.location.href = "/api/mollie/connect";
  };

  const handleSimulate = async () => {
    setSimulating(true);
    await simulateRevenueAction(1000);
    await loadData();
    setSimulating(false);
  };

  const totalOmzet = chartData.reduce((acc, curr) => acc + curr.ecom + curr.saas + curr.agency, 0);
  
  const adminVault = vaults.find(v => v.vaultType === "ADMIN_WALLET")?.balance || 0;
  const hardwareVault = vaults.find(v => v.vaultType === "HARDWARE_RESERVE")?.balance || 0;

  if (loading && !simulating && chartData.length === 0) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center bg-[#0a0a0a]">
        <Loader2 className="w-12 h-12 text-[#d4af37] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto pb-20 font-sans h-full px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Widget */}
      <div className="relative overflow-hidden rounded-[2rem] border border-[#d4af37]/20 glass-cyber p-8 md:p-12 group">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#d4af37]/5 rounded-full blur-3xl pointer-events-none group-hover:bg-[#d4af37]/10 transition-colors duration-1000"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-flex items-center justify-center bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#d4af37] px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-widest rounded-full shadow-[0_0_15px_rgba(212,175,55,0.5)]">
                <Layers className="w-3 h-3 mr-2" />
                Sovereign Holding
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase leading-[0.9]">
              God-Mode <span className="text-[#d4af37] drop-shadow-[0_0_15px_rgba(212,175,55,0.8)]">Treasury</span>
            </h1>
            <p className="mt-4 text-lg text-zinc-400 max-w-2xl font-light">
              Centraal overzicht van de CFO AI Vaults. Alle inkomsten worden live afgevangen en opgesplitst (90% Admin / 10% Hardware Reserve).
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="bg-black/50 border border-white/10 hover:border-white/30 text-white px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-colors">
              <Download className="w-4 h-4" /> Export P&L
            </button>
            <button 
              onClick={handleConnectMollie}
              className={`px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-colors ${
                bankConnected 
                  ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/30' 
                  : 'bg-[#d4af37] text-black hover:bg-white border border-transparent shadow-[0_0_20px_rgba(212,175,55,0.3)]'
              }`}
            >
              {bankConnected ? <><ShieldCheck className="w-4 h-4" /> Gekoppeld (3)</> : <><CreditCard className="w-4 h-4" /> Bank Koppelen</>}
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards (The Vaults) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        
        {/* Total Holding Revenue */}
        <div className="bg-[#111] border border-[#d4af37]/20 p-6 relative overflow-hidden group hover:border-[#d4af37]/50 transition-colors">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Wallet className="w-24 h-24 text-[#d4af37]" />
          </div>
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs mb-2">Holding Omzet (Totaal 42d)</p>
          <h2 className="text-4xl font-black text-[#d4af37] font-mono mb-2">€ {totalOmzet.toLocaleString('nl-NL')}</h2>
          <div className="flex items-center gap-2 text-emerald-500 font-bold text-sm">
            <ArrowUpRight className="w-4 h-4" /> Live Database Koppeling
          </div>
        </div>

        {/* Admin Wallet (90%) */}
        <div className="bg-[#111] border border-emerald-500/10 p-6 relative overflow-hidden group hover:border-emerald-500/30 transition-colors">
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs mb-2">Admin Wallet (90% Vrije Kasstroom)</p>
          <h2 className="text-4xl font-black text-white font-mono mb-2">€ {adminVault.toLocaleString('nl-NL')}</h2>
          <div className="flex items-center gap-2 text-emerald-500 font-bold text-sm">
            Beschikbaar voor opname
          </div>
        </div>

        {/* Hardware Spaarpot (10%) */}
        <div className="bg-[#111] border border-cyan-500/20 p-6 relative overflow-hidden group hover:border-cyan-500/40 transition-colors">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Cpu className="w-24 h-24 text-cyan-500" />
          </div>
          <p className="text-cyan-500/70 font-bold uppercase tracking-widest text-xs mb-2">Hardware Spaarpot (10% AI Compute)</p>
          <h2 className="text-4xl font-black text-cyan-400 font-mono mb-2">€ {hardwareVault.toLocaleString('nl-NL')}</h2>
          <div className="flex items-center gap-2 text-cyan-500 font-bold text-sm">
            Gereserveerd voor Groq & Cerebras API
          </div>
        </div>
      </div>

      {/* Charts & AI Action Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-[#111] border border-white/5 p-6">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-white font-bold uppercase tracking-widest text-sm">Holding Portfolio Stack (Omzet per Project)</h3>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
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

        {/* AI Financial Analysis & Simulation */}
        <div className="bg-[#111] border border-white/5 p-6 flex flex-col">
          <h3 className="text-white font-bold uppercase tracking-widest text-sm mb-6 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#d4af37]" /> CFO AI Interceptie
          </h3>
          
          <div className="flex-1 space-y-4">
            <div className="bg-black/50 p-4 border-l-2 border-[#d4af37]">
              <p className="text-sm text-zinc-300">
                De CFO Agent verdeelt alle binnenkomende omzet automatisch (90% / 10%). 
              </p>
            </div>
            
            <div className="bg-[#1a1a1a] p-4 border border-white/10 mt-auto">
              <p className="text-sm text-zinc-400 font-bold mb-2 uppercase tracking-wide text-xs">Test de CFO Routing</p>
              <p className="text-sm text-zinc-500 mb-4">Simuleer €1.000 omzet. €900 zou direct in de Admin Wallet moeten belanden en €100 in de Hardware pot.</p>
              
              <button 
                onClick={handleSimulate}
                disabled={simulating}
                className="w-full bg-[#d4af37] text-black font-bold py-3 text-xs uppercase tracking-widest hover:bg-white transition-colors flex items-center justify-center disabled:opacity-50"
              >
                {simulating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Simuleer Inkomsten (€1.000)"}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
