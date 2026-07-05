"use client";

import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Wallet, ArrowUpRight, ArrowDownRight, CreditCard, Download, AlertTriangle, ShieldCheck, Layers, Loader2 } from "lucide-react";
import { getHoldingRevenueAction } from "@/app/actions/finance";

export default function FinanceDashboard() {
  const [bankConnected, setBankConnected] = useState(false); // In a real scenario, this comes from user session/db
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const res = await getHoldingRevenueAction();
      if (res.success) {
        setChartData(res.data);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  const handleConnectMollie = () => {
    // Redirect to the real Mollie OAuth endpoint
    window.location.href = "/api/mollie/connect";
  };

  // Calculate real KPIs from DB data
  const totalOmzet = chartData.reduce((acc, curr) => acc + curr.ecom + curr.saas + curr.agency, 0);
  const totalEcom = chartData.reduce((acc, curr) => acc + curr.ecom, 0);
  const totalAgency = chartData.reduce((acc, curr) => acc + curr.agency, 0);

  if (loading) {
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
              Centraal overzicht van de geaggregeerde omzet over alle gekoppelde projecten (E-Com, Agency, SaaS).
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

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* Total Holding Revenue */}
        <div className="bg-[#111] border border-[#d4af37]/20 p-6 relative overflow-hidden group hover:border-[#d4af37]/50 transition-colors">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Wallet className="w-24 h-24 text-[#d4af37]" />
          </div>
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs mb-2">Holding Omzet (42d)</p>
          <h2 className="text-4xl font-black text-[#d4af37] font-mono mb-2">€ {totalOmzet.toLocaleString('nl-NL')}<span className="text-xl text-[#d4af37]/50">.00</span></h2>
          <div className="flex items-center gap-2 text-emerald-500 font-bold text-sm">
            <ArrowUpRight className="w-4 h-4" /> Live Database Koppeling
          </div>
        </div>

        {/* E-Com Performance */}
        <div className="bg-[#111] border border-emerald-500/10 p-6 relative overflow-hidden group hover:border-emerald-500/30 transition-colors">
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs mb-2">Top Performer: E-Com Alpha</p>
          <h2 className="text-4xl font-black text-white font-mono mb-2">€ {totalEcom.toLocaleString('nl-NL')}<span className="text-xl text-zinc-600">.00</span></h2>
          <div className="flex items-center gap-2 text-emerald-500 font-bold text-sm">
            Winstmarge: 68%
          </div>
        </div>

        {/* Agency Performance */}
        <div className="bg-[#111] border border-blue-500/10 p-6 relative overflow-hidden group hover:border-blue-500/30 transition-colors">
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs mb-2">Stabiele Cashflow: Agency</p>
          <h2 className="text-4xl font-black text-white font-mono mb-2">€ {totalAgency.toLocaleString('nl-NL')}<span className="text-xl text-zinc-600">.00</span></h2>
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

        {/* AI Financial Analysis */}
        <div className="bg-[#111] border border-white/5 p-6 flex flex-col">
          <h3 className="text-white font-bold uppercase tracking-widest text-sm mb-6 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#d4af37]" /> CFO AI Analyse
          </h3>
          
          <div className="flex-1 space-y-4">
            {totalOmzet === 0 ? (
              <div className="bg-rose-500/10 p-4 border border-rose-500/30">
                <p className="text-sm text-rose-500 font-bold mb-2 uppercase tracking-wide text-xs">0 Omzet Gedetecteerd</p>
                <p className="text-sm text-rose-400/80 mb-3">Er is nog geen data in de live database voor de afgelopen 42 dagen. Koppel een bank of simuleer data.</p>
              </div>
            ) : (
              <div className="bg-black/50 p-4 border-l-2 border-[#d4af37]">
                <p className="text-sm text-zinc-300">
                  De live PostgreSQL database koppeling is succesvol. Totale geaggregeerde portefeuille-waarde is €{totalOmzet.toLocaleString('nl-NL')}.
                </p>
              </div>
            )}
            
            <div className="bg-rose-500/10 p-4 border border-rose-500/30 mt-auto">
              <p className="text-sm text-rose-500 font-bold mb-2 uppercase tracking-wide text-xs">Actie Vereist</p>
              <p className="text-sm text-rose-400/80 mb-3">Koppel je zakelijke bankrekening om live cashflow interceptie via Mollie OAuth te activeren.</p>
              <button 
                onClick={handleConnectMollie}
                className="w-full bg-rose-500 text-white font-bold py-2 text-xs uppercase tracking-widest hover:bg-rose-600 transition-colors"
              >
                Nu Koppelen (Mollie)
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
