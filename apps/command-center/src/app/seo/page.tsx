"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  LineChart, Line, Area, AreaChart, Legend
} from 'recharts';
import {
  TrendingUp, TrendingDown, DollarSign, AlertTriangle, RefreshCw,
  Globe, Users, Target, Zap, ArrowUpRight, ArrowDownRight,
  BarChart2, Activity, Clock, CheckCircle
} from 'lucide-react';

interface AnalyticsData {
  summary: {
    totalRevenue: number;
    totalExpenses: number;
    netProfit: number;
    missedRevenue: number;
    totalDebt: number;
    debtProgress: number;
    mrr: number;
    arr: number;
    revenueGrowth: string;
    premiumUsers: number;
    enterpriseUsers: number;
  };
  growthData: Array<{
    period: string;
    inkomsten: number;
    uitgaven: number;
    winst: number;
    spaarquote: number;
  }>;
  beforeAfter: {
    before: { period: string; revenue: number; expenses: number; profit: number };
    after: { period: string; revenue: number; expenses: number; profit: number };
  };
  fromCache: boolean;
  timestamp: string;
}

function formatEur(n: number) {
  return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(n);
}

function KPICard({ title, value, sub, trend, icon, color = 'cyan' }: {
  title: string; value: string; sub?: string; trend?: 'up' | 'down' | 'neutral';
  icon: React.ReactNode; color?: string;
}) {
  return (
    <div className="bg-[#0e0e11] border border-zinc-800/60 rounded-xl p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{title}</span>
        <div className={`text-${color}-400`}>{icon}</div>
      </div>
      <div className="text-2xl font-bold text-zinc-100">{value}</div>
      {sub && (
        <div className={`flex items-center gap-1 text-xs ${
          trend === 'up' ? 'text-emerald-400' : trend === 'down' ? 'text-red-400' : 'text-zinc-500'
        }`}>
          {trend === 'up' && <ArrowUpRight className="w-3 h-3" />}
          {trend === 'down' && <ArrowDownRight className="w-3 h-3" />}
          {sub}
        </div>
      )}
    </div>
  );
}

function BeforeAfterCard({ before, after }: { before: any; after: any }) {
  const revenueChange = before.revenue > 0 ? ((after.revenue - before.revenue) / before.revenue * 100).toFixed(1) : '0';
  const profitChange = before.profit > 0 ? ((after.profit - before.profit) / before.profit * 100).toFixed(1) : '0';
  const isRevenueUp = after.revenue >= before.revenue;
  const isProfitUp = after.profit >= before.profit;

  return (
    <div className="bg-[#0e0e11] border border-zinc-800/60 rounded-xl p-6">
      <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Voor / Na Analyse</h3>
      <div className="grid grid-cols-2 gap-4">
        {/* VOOR */}
        <div className="p-4 bg-zinc-900/50 rounded-lg border border-zinc-800/50">
          <div className="text-[10px] font-mono text-zinc-500 mb-3 uppercase">◀ VORIG PERIOD</div>
          <div className="space-y-2">
            <div>
              <div className="text-[10px] text-zinc-600">Inkomsten</div>
              <div className="text-sm font-semibold text-zinc-300">{formatEur(before.revenue)}</div>
            </div>
            <div>
              <div className="text-[10px] text-zinc-600">Uitgaven</div>
              <div className="text-sm font-semibold text-zinc-300">{formatEur(before.expenses)}</div>
            </div>
            <div>
              <div className="text-[10px] text-zinc-600">Winst</div>
              <div className={`text-sm font-semibold ${before.profit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{formatEur(before.profit)}</div>
            </div>
          </div>
        </div>

        {/* NA */}
        <div className="p-4 bg-cyan-950/30 rounded-lg border border-cyan-900/30">
          <div className="text-[10px] font-mono text-cyan-600 mb-3 uppercase">▶ HUIDIG PERIOD</div>
          <div className="space-y-2">
            <div>
              <div className="text-[10px] text-zinc-600">Inkomsten</div>
              <div className="flex items-center gap-1">
                <span className="text-sm font-semibold text-zinc-100">{formatEur(after.revenue)}</span>
                {parseFloat(revenueChange) !== 0 && (
                  <span className={`text-[10px] ${isRevenueUp ? 'text-emerald-400' : 'text-red-400'}`}>
                    {isRevenueUp ? '▲' : '▼'} {Math.abs(parseFloat(revenueChange))}%
                  </span>
                )}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-zinc-600">Uitgaven</div>
              <div className="text-sm font-semibold text-zinc-100">{formatEur(after.expenses)}</div>
            </div>
            <div>
              <div className="text-[10px] text-zinc-600">Winst</div>
              <div className="flex items-center gap-1">
                <span className={`text-sm font-semibold ${after.profit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{formatEur(after.profit)}</span>
                {parseFloat(profitChange) !== 0 && (
                  <span className={`text-[10px] ${isProfitUp ? 'text-emerald-400' : 'text-red-400'}`}>
                    {isProfitUp ? '▲' : '▼'} {Math.abs(parseFloat(profitChange))}%
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SEOAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('MONTHLY');
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  const loadData = async (p: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/analytics?period=${p}&type=full`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
        setLastRefresh(new Date());
      }
    } catch (e) {
      console.error('Analytics load error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(period); }, [period]);

  // Auto-refresh elke 5 minuten
  useEffect(() => {
    const interval = setInterval(() => loadData(period), 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [period]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-xs">
        <p className="text-zinc-400 mb-2 font-mono">{label}</p>
        {payload.map((p: any) => (
          <div key={p.name} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            <span className="text-zinc-300">{p.name}: {formatEur(p.value)}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-300 font-sans p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-xl font-bold text-zinc-100 uppercase tracking-widest">Revenue Intelligence</h1>
          <p className="text-xs text-zinc-500 mt-1 font-mono">
            Cloud Analytics — {data?.fromCache ? '⚡ Cache' : '🔄 Live'} •{' '}
            {lastRefresh ? `Bijgewerkt: ${lastRefresh.toLocaleTimeString('nl-NL')}` : 'Laden...'}
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {['DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY'].map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-mono font-bold tracking-widest transition-all ${
                period === p ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {p === 'DAILY' ? 'DAG' : p === 'WEEKLY' ? 'WEEK' : p === 'MONTHLY' ? 'MAAND' : 'KWARTAAL'}
            </button>
          ))}
          <button
            onClick={() => loadData(period)}
            className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors text-zinc-400 hover:text-zinc-100"
            title="Forceer refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {loading && !data ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[1,2,3,4].map(i => <div key={i} className="h-28 bg-zinc-900/50 rounded-xl animate-pulse border border-zinc-800/50" />)}
        </div>
      ) : data ? (
        <>
          {/* KPI Strip */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <KPICard
              title="Totale Inkomsten"
              value={formatEur(data.summary.totalRevenue)}
              sub={`+${data.summary.revenueGrowth}% vs vorige periode`}
              trend={parseFloat(data.summary.revenueGrowth) >= 0 ? 'up' : 'down'}
              icon={<DollarSign className="w-4 h-4" />}
              color="emerald"
            />
            <KPICard
              title="Netto Winst"
              value={formatEur(data.summary.netProfit)}
              sub={`Marge: ${data.summary.totalRevenue > 0 ? Math.round(data.summary.netProfit / data.summary.totalRevenue * 100) : 0}%`}
              trend={data.summary.netProfit >= 0 ? 'up' : 'down'}
              icon={<TrendingUp className="w-4 h-4" />}
              color="cyan"
            />
            <KPICard
              title="Gemiste Inkomsten"
              value={formatEur(data.summary.missedRevenue)}
              sub="Geïdentificeerd als verlies"
              trend={data.summary.missedRevenue > 0 ? 'down' : 'neutral'}
              icon={<AlertTriangle className="w-4 h-4" />}
              color="amber"
            />
            <KPICard
              title="MRR"
              value={formatEur(data.summary.mrr)}
              sub={`ARR: ${formatEur(data.summary.arr)}`}
              trend="up"
              icon={<Zap className="w-4 h-4" />}
              color="purple"
            />
          </div>

          {/* Tweede KPI rij */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <KPICard
              title="Totale Schuld"
              value={formatEur(data.summary.totalDebt)}
              sub={`${data.summary.debtProgress}% afbetaald`}
              trend="up"
              icon={<Target className="w-4 h-4" />}
              color="red"
            />
            <KPICard
              title="Premium Klanten"
              value={String(data.summary.premiumUsers)}
              sub="Operator abonnement"
              trend="up"
              icon={<Users className="w-4 h-4" />}
              color="blue"
            />
            <KPICard
              title="Enterprise Klanten"
              value={String(data.summary.enterpriseUsers)}
              sub="Business abonnement"
              trend="up"
              icon={<Globe className="w-4 h-4" />}
              color="purple"
            />
            <KPICard
              title="Totale Uitgaven"
              value={formatEur(data.summary.totalExpenses)}
              sub={`vs ${formatEur(data.summary.totalRevenue)} inkomsten`}
              trend={data.summary.totalExpenses < data.summary.totalRevenue ? 'up' : 'down'}
              icon={<Activity className="w-4 h-4" />}
              color="zinc"
            />
          </div>

          {/* Grafieken */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Inkomsten vs Uitgaven grafiek */}
            <div className="lg:col-span-2 bg-[#0e0e11] border border-zinc-800/60 rounded-xl p-5">
              <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-5">Inkomsten vs Uitgaven vs Winst</h3>
              {data.growthData.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={data.growthData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                    <defs>
                      <linearGradient id="colorInkomsten" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#34d399" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorWinst" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                    <XAxis dataKey="period" tick={{ fill: '#52525b', fontSize: 10 }} />
                    <YAxis tick={{ fill: '#52525b', fontSize: 10 }} tickFormatter={v => `€${v}`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Area type="monotone" dataKey="inkomsten" stroke="#34d399" fill="url(#colorInkomsten)" strokeWidth={2} />
                    <Area type="monotone" dataKey="winst" stroke="#06b6d4" fill="url(#colorWinst)" strokeWidth={2} />
                    <Line type="monotone" dataKey="uitgaven" stroke="#f87171" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[220px] flex items-center justify-center text-zinc-600 text-sm">
                  Nog geen budget data. Voeg maandbudgetten toe via het dashboard.
                </div>
              )}
            </div>

            {/* Voor/Na analyse */}
            <BeforeAfterCard before={data.beforeAfter.before} after={data.beforeAfter.after} />
          </div>

          {/* Spaarquote grafiek */}
          {data.growthData.length > 0 && (
            <div className="bg-[#0e0e11] border border-zinc-800/60 rounded-xl p-5 mb-6">
              <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-5">Spaarquote per Periode (%)</h3>
              <ResponsiveContainer width="100%" height={120}>
                <BarChart data={data.growthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis dataKey="period" tick={{ fill: '#52525b', fontSize: 10 }} />
                  <YAxis tick={{ fill: '#52525b', fontSize: 10 }} tickFormatter={v => `${v}%`} />
                  <Tooltip formatter={(v: any) => [`${v}%`, 'Spaarquote']} contentStyle={{ background: '#18181b', border: '1px solid #3f3f46', borderRadius: 8, fontSize: 12 }} />
                  <Bar dataKey="spaarquote" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Cloud sync status */}
          <div className="flex items-center gap-3 p-4 bg-zinc-900/30 border border-zinc-800/40 rounded-xl text-xs text-zinc-500 font-mono">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            <span>Cloud Analytics actief •</span>
            <Clock className="w-3 h-3" />
            <span>Cache TTL: 5 min •</span>
            <BarChart2 className="w-3 h-3" />
            <span>Data gesynchroniseerd: {data.timestamp ? new Date(data.timestamp).toLocaleString('nl-NL') : '—'}</span>
          </div>
        </>
      ) : (
        <div className="text-center py-20 text-zinc-600">
          <AlertTriangle className="w-10 h-10 mx-auto mb-3" />
          <p>Geen data beschikbaar. Voeg budget data toe via het klantdashboard.</p>
        </div>
      )}
    </div>
  );
}
