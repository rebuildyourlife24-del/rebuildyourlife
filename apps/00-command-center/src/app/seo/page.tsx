"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldAlert, CheckCircle, XCircle, Activity,
  TrendingUp, TrendingDown, DollarSign, Target,
  RefreshCw, Cpu, Server, Zap, Globe, Share2, 
  Camera, MessageSquare, Briefcase, Video
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
} from 'recharts';

interface AgentAction {
  id: string;
  agentType: string;
  title: string;
  description: string;
  status: string;
  estimatedCost: number;
  estimatedRevenue: number;
  transactionFees: number;
  netProfitImpact: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  suggestedAt: string;
}

function formatEur(n: number, decimals: number = 2) {
  return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR', minimumFractionDigits: decimals }).format(n);
}

export default function EnterpriseBlackBox() {
  const [actions, setActions] = useState<AgentAction[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock Radar Data (Micro-financial tracking)
  const radarData = {
    grossRevenue: 12450.00,
    totalFees: 345.82,     // Stripe, gas, servers
    microLosses: 112.40,   // AI detected inefficiencies
    netProfit: 11991.78,
    margin: 96.3,
    historical: [
      { time: '08:00', profit: 1100, fees: 30, loss: 5 },
      { time: '12:00', profit: 2400, fees: 70, loss: 12 },
      { time: '16:00', profit: 5800, fees: 150, loss: 40 },
      { time: '20:00', profit: 12450, fees: 345, loss: 112 },
    ]
  };

  const loadActions = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/actions/review');
      if (res.ok) {
        const json = await res.json();
        // Als DB leeg is, injecteren we mock data om de UI te tonen
        if (json.length === 0) {
          setActions([
            {
              id: 'mock-1', agentType: 'SEO_AGENT', title: 'Lanceer 5 nieuwe landingspagina\'s',
              description: 'AI heeft 5 low-competition keywords gevonden. Hosting kost €0.50/m.',
              status: 'PENDING', estimatedCost: 2.50, estimatedRevenue: 450.00,
              transactionFees: 12.00, netProfitImpact: 435.50, riskLevel: 'LOW', suggestedAt: new Date().toISOString()
            },
            {
              id: 'mock-2', agentType: 'ADS_AGENT', title: 'Schaal Facebook campagne #A4',
              description: 'RoAS is momenteel 4.2. Voorgestelde dagbudget verhoging: +€200.',
              status: 'PENDING', estimatedCost: 200.00, estimatedRevenue: 840.00,
              transactionFees: 24.50, netProfitImpact: 615.50, riskLevel: 'MEDIUM', suggestedAt: new Date().toISOString()
            }
          ]);
        } else {
          setActions(json);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadActions(); }, []);

  const handleReview = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    // Optimistic UI update
    setActions(prev => prev.filter(a => a.id !== id));
    
    // In een echte setup zouden we de POST doen:
    if (!id.startsWith('mock')) {
      await fetch('/api/actions/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ actionId: id, status })
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-300 font-sans p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-red-900/30 pb-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-red-500 uppercase tracking-widest flex items-center gap-3">
            <ShieldAlert className="w-6 h-6" /> ENTERPRISE BLACK BOX
          </h1>
          <p className="text-xs text-red-900/80 mt-1 font-mono uppercase">
            Micro-Financial Precision Tracking & Human Command Override
          </p>
        </div>
        <button onClick={loadActions} className="p-2 bg-red-950/20 text-red-500 hover:bg-red-900/40 rounded-lg border border-red-900/30 transition-all">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* LEFT PANE: REVIEW QUEUE */}
        <div className="space-y-6">
          <h2 className="text-sm font-mono text-zinc-500 uppercase flex items-center gap-2">
            <Target className="w-4 h-4 text-rose-500" /> Review Queue ({actions.length} Pending)
          </h2>
          
          <div className="space-y-4">
            <AnimatePresence>
              {actions.map(action => (
                <motion.div
                  key={action.id}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -50 }}
                  className="bg-[#0a0a0a] border border-red-900/40 rounded-xl p-5 relative overflow-hidden group"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-rose-600" />
                  
                  <div className="flex justify-between items-start mb-3 pl-3">
                    <div>
                      <span className="text-[10px] font-mono text-rose-500 bg-rose-950/30 px-2 py-0.5 rounded border border-rose-900/50">
                        {action.agentType}
                      </span>
                      <h3 className="text-zinc-100 font-bold mt-2">{action.title}</h3>
                      <p className="text-xs text-zinc-500 mt-1">{action.description}</p>
                    </div>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                      action.riskLevel === 'LOW' ? 'bg-emerald-950/30 text-emerald-500 border-emerald-900/50' : 
                      action.riskLevel === 'MEDIUM' ? 'bg-amber-950/30 text-amber-500 border-amber-900/50' : 
                      'bg-red-950/30 text-red-500 border-red-900/50'
                    }`}>
                      RISK: {action.riskLevel}
                    </span>
                  </div>

                  {/* Extreme Financial Precision Data */}
                  <div className="grid grid-cols-4 gap-2 mb-4 pl-3">
                    <div className="bg-zinc-950/50 p-2 rounded border border-zinc-900/50">
                      <div className="text-[9px] text-zinc-600 uppercase">Est. Cost</div>
                      <div className="text-xs font-mono text-zinc-300">{formatEur(action.estimatedCost)}</div>
                    </div>
                    <div className="bg-zinc-950/50 p-2 rounded border border-zinc-900/50">
                      <div className="text-[9px] text-zinc-600 uppercase">Est. Revenue</div>
                      <div className="text-xs font-mono text-emerald-400">{formatEur(action.estimatedRevenue)}</div>
                    </div>
                    <div className="bg-zinc-950/50 p-2 rounded border border-zinc-900/50">
                      <div className="text-[9px] text-zinc-600 uppercase">Tx Fees</div>
                      <div className="text-xs font-mono text-amber-400">-{formatEur(action.transactionFees)}</div>
                    </div>
                    <div className="bg-red-950/20 p-2 rounded border border-red-900/30">
                      <div className="text-[9px] text-rose-500/80 uppercase font-bold">Net Impact</div>
                      <div className="text-xs font-mono text-rose-400 font-bold">+{formatEur(action.netProfitImpact)}</div>
                    </div>
                  </div>

                  <div className="flex gap-2 pl-3">
                    <button onClick={() => handleReview(action.id, 'APPROVED')} className="flex-1 flex items-center justify-center gap-2 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-mono border border-emerald-500/30 rounded-lg transition-colors">
                      <CheckCircle className="w-4 h-4" /> [ APPROVE ]
                    </button>
                    <button onClick={() => handleReview(action.id, 'REJECTED')} className="flex-1 flex items-center justify-center gap-2 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-mono border border-red-500/30 rounded-lg transition-colors">
                      <XCircle className="w-4 h-4" /> [ REJECT ]
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {!loading && actions.length === 0 && (
              <div className="text-center py-12 text-zinc-600 border border-dashed border-red-900/20 rounded-xl bg-black/20">
                <ShieldAlert className="w-8 h-8 mx-auto mb-2 text-zinc-700" />
                <p className="text-sm font-mono">Geen acties vereisen goedkeuring.</p>
              </div>
            )}
          </div>

          {/* AGENT 15: THE HANDYMAN STATUS */}
          <div className="bg-[#0a0a0a] border border-red-900/40 rounded-xl p-5 mt-6 relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                <Server className="w-4 h-4 text-emerald-500" /> SYSTEM HEALTH & DEVOPS
              </h3>
              <div className="text-[9px] text-emerald-500 border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 rounded uppercase flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Handyman Online
              </div>
            </div>
            
            <p className="text-xs text-zinc-500 mb-4">
              Agent 15 (DevOps Sentinel) patrouilleert 24/7. Auto-recovers Vercel crashes, Supabase disconnects & Social API deactivations.
            </p>

            <div className="space-y-2">
              <div className="flex items-center justify-between bg-zinc-950 p-2 rounded border border-zinc-900">
                <span className="text-[10px] font-mono text-zinc-400">DATABASE LATENCY</span>
                <span className="text-[10px] font-mono text-emerald-400">12ms (HEALTHY)</span>
              </div>
              <div className="flex items-center justify-between bg-zinc-950 p-2 rounded border border-zinc-900">
                <span className="text-[10px] font-mono text-zinc-400">SOCIAL TOKENS</span>
                <span className="text-[10px] font-mono text-emerald-400">VERIFIED</span>
              </div>
              <div className="flex items-center justify-between bg-zinc-950 p-2 rounded border border-zinc-900">
                <span className="text-[10px] font-mono text-zinc-400">LAST HEAL EVENT</span>
                <span className="text-[10px] font-mono text-zinc-500">Geen actie vereist</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANE: FINANCIAL & SEO RADAR */}
        <div className="space-y-6">
          <h2 className="text-sm font-mono text-zinc-500 uppercase flex items-center gap-2">
            <Activity className="w-4 h-4 text-red-500" /> Profit Shield (Micro-Loss Radar)
          </h2>

          {/* KPI Strip (High Precision) */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#0a0a0a] border border-zinc-800/60 rounded-xl p-4">
              <div className="text-[10px] font-mono text-zinc-500 mb-1">GROSS REVENUE</div>
              <div className="text-xl font-bold text-zinc-100">{formatEur(radarData.grossRevenue)}</div>
            </div>
            <div className="bg-red-950/20 border border-red-900/40 rounded-xl p-4 shadow-[0_0_15px_rgba(220,38,38,0.1)]">
              <div className="text-[10px] font-mono text-red-500 mb-1">NET PROFIT (After Fees)</div>
              <div className="text-xl font-bold text-red-500">{formatEur(radarData.netProfit)}</div>
              <div className="text-[10px] text-red-400/80 mt-1 tracking-widest uppercase">Margin: {radarData.margin}%</div>
            </div>
            
            <div className="bg-[#0a0a0a] border border-amber-900/30 rounded-xl p-4">
              <div className="text-[10px] font-mono text-amber-500 mb-1">TRANSACTION FEES</div>
              <div className="text-lg font-mono text-amber-400">-{formatEur(radarData.totalFees)}</div>
              <div className="text-[10px] text-zinc-500 mt-1">Stripe, Server, Gas</div>
            </div>
            <div className="bg-[#0a0a0a] border border-rose-900/30 rounded-xl p-4">
              <div className="text-[10px] font-mono text-rose-500 mb-1 flex items-center justify-between">
                MICRO-LOSSES <Zap className="w-3 h-3 text-rose-500" />
              </div>
              <div className="text-lg font-mono text-rose-400">-{formatEur(radarData.microLosses)}</div>
              <div className="text-[10px] text-zinc-500 mt-1">Flagged by AI-COO</div>
            </div>
          </div>

          {/* Chart */}
          <div className="bg-[#0a0a0a] border border-red-900/30 rounded-xl p-5">
            <h3 className="text-[10px] font-mono text-zinc-500 uppercase mb-4">Precision Tracking (Intraday)</h3>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={radarData.historical} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="time" tick={{ fill: '#52525b', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#52525b', fontSize: 10 }} tickFormatter={v => `€${v}`} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ background: '#0a0a0a', border: '1px solid #7f1d1d', borderRadius: '8px' }}
                  itemStyle={{ fontSize: '12px', fontFamily: 'monospace' }}
                  labelStyle={{ color: '#a1a1aa', fontSize: '10px' }}
                />
                <Area type="monotone" dataKey="profit" stroke="#ef4444" fill="url(#colorProfit)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Server Status */}
          <div className="flex gap-2">
            <div className="flex-1 bg-zinc-950/50 border border-zinc-900/50 rounded-lg p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-zinc-600" />
                <span className="text-[10px] font-mono text-zinc-500 uppercase">Core Systems</span>
              </div>
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
            </div>
            <div className="flex-1 bg-zinc-950/50 border border-zinc-900/50 rounded-lg p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-zinc-600" />
                <span className="text-[10px] font-mono text-zinc-500 uppercase">Loss-Detection AI</span>
              </div>
              <div className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)] animate-pulse" />
            </div>
          </div>

          {/* BILLIONAIRE SOCIAL ENGINE RADAR */}
          <div className="bg-[#0a0a0a] border border-red-900/40 rounded-xl p-5 mt-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <Globe className="w-32 h-32 text-red-500" />
            </div>
            
            <div className="flex items-center justify-between mb-4 relative z-10">
              <h3 className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                <Share2 className="w-4 h-4 text-red-500" /> GLOBAL BROADCASTING HUB
              </h3>
              <div className="text-[9px] text-emerald-500 border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 rounded uppercase">
                Active Campaigns: 0
              </div>
            </div>

            <p className="text-xs text-zinc-500 mb-4 pr-12 relative z-10">
              Ultra-Top Niveau distributie. Koppel platformen om de Content Agent toestemming te geven organische posts en premium advertenties (RoAS) wereldwijd te lanceren.
            </p>

            <div className="grid grid-cols-2 gap-3 relative z-10">
              {/* Instagram */}
              <button className="flex items-center gap-3 p-3 bg-zinc-950/60 border border-zinc-800/50 hover:border-red-500/50 rounded-lg group transition-all">
                <Camera className="w-5 h-5 text-zinc-400 group-hover:text-red-400 transition-colors" />
                <div className="text-left">
                  <div className="text-xs font-bold text-zinc-300">Instagram</div>
                  <div className="text-[9px] text-zinc-600 font-mono">DISCONNECTED</div>
                </div>
              </button>

              {/* TikTok (Using Video icon) */}
              <button className="flex items-center gap-3 p-3 bg-zinc-950/60 border border-zinc-800/50 hover:border-red-500/50 rounded-lg group transition-all">
                <Video className="w-5 h-5 text-zinc-400 group-hover:text-red-400 transition-colors" />
                <div className="text-left">
                  <div className="text-xs font-bold text-zinc-300">TikTok</div>
                  <div className="text-[9px] text-zinc-600 font-mono">DISCONNECTED</div>
                </div>
              </button>

              {/* Facebook */}
              <button className="flex items-center gap-3 p-3 bg-zinc-950/60 border border-zinc-800/50 hover:border-red-500/50 rounded-lg group transition-all">
                <MessageSquare className="w-5 h-5 text-zinc-400 group-hover:text-red-400 transition-colors" />
                <div className="text-left">
                  <div className="text-xs font-bold text-zinc-300">Facebook</div>
                  <div className="text-[9px] text-zinc-600 font-mono">DISCONNECTED</div>
                </div>
              </button>

              {/* LinkedIn */}
              <button className="flex items-center gap-3 p-3 bg-zinc-950/60 border border-zinc-800/50 hover:border-red-500/50 rounded-lg group transition-all">
                <Briefcase className="w-5 h-5 text-zinc-400 group-hover:text-red-400 transition-colors" />
                <div className="text-left">
                  <div className="text-xs font-bold text-zinc-300">LinkedIn</div>
                  <div className="text-[9px] text-zinc-600 font-mono">DISCONNECTED</div>
                </div>
              </button>
            </div>
            
            <button className="w-full mt-4 py-2 bg-red-950/30 hover:bg-red-900/50 text-red-400 text-[10px] font-mono border border-red-900/50 rounded-lg transition-colors uppercase tracking-widest">
              + Connect Billionaire Setup
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
