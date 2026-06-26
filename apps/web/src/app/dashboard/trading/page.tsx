'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  RefreshCw, 
  Zap, 
  ShieldAlert, 
  Key, 
  Layers, 
  Eye, 
  EyeOff, 
  Cpu, 
  Skull,
  Crosshair
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

function formatEur(n: number) {
  return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(n);
}

export default function TradingDashboard() {
  // Trading Bot State
  const [bot, setBot] = useState<any>(null);
  const [isSupremeOverseer, setIsSupremeOverseer] = useState(false);
  const [systemStats, setSystemStats] = useState<any>(null);
  const [liveError, setLiveError] = useState<string | null>(null);

  // Form State
  const [exchange, setExchange] = useState('BYBIT_TESTNET');
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const [allocatedFunds, setAllocatedFunds] = useState('5000');
  const [showKeys, setShowKeys] = useState(false);

  // UI State
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const [autoSimulate, setAutoSimulate] = useState(true);
  const [simLogs, setSimLogs] = useState<string[]>([]);

  const autoSimIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Haal botgegevens op
  const fetchBotData = async () => {
    try {
      const res = await fetch('/api/trading');
      if (res.ok) {
        const data = await res.json();
        setBot(data.bot);
        setIsSupremeOverseer(data.isSupremeOverseer);
        setSystemStats(data.systemStats);
        setLiveError(data.liveError || null);
        
        // Formulier pre-populate
        if (data.bot) {
          setExchange(data.bot.exchange || 'BYBIT_TESTNET');
          setAllocatedFunds(data.bot.allocatedFunds.toString());
          if (data.bot.apiKey) setApiKey(data.bot.apiKey);
          if (data.bot.apiSecret) setApiSecret(data.bot.apiSecret);
        }
      }
    } catch (err) {
      console.error('Fout bij ophalen bot data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBotData();
  }, []);

  // Realtime Simulatie Interval (om de 6 seconden ticken op de achtergrond)
  useEffect(() => {
    if (autoSimulate && bot?.status === 'TRADING') {
      autoSimIntervalRef.current = setInterval(async () => {
        await triggerSimulation();
      }, 6000);
    } else {
      if (autoSimIntervalRef.current) {
        clearInterval(autoSimIntervalRef.current);
      }
    }

    return () => {
      if (autoSimIntervalRef.current) {
        clearInterval(autoSimIntervalRef.current);
      }
    };
  }, [autoSimulate, bot?.status]);

  // Simuleer een markt tick
  const triggerSimulation = async () => {
    setSimulating(true);
    try {
      const res = await fetch('/api/trading/simulate', {
        method: 'POST',
      });
      if (res.ok) {
        const data = await res.json();
        if (data.results && data.results.length > 0) {
          const newLogs = data.results.map((r: any) => {
            const time = new Date().toLocaleTimeString();
            if (r.action === 'CLOSED_TRADE') {
              const execType = r.execution === 'REAL_EXCHANGE' ? 'LIVE ORDER' : 'LIVE TICKER';
              return `[${time}] [${execType}] Bot [${r.userEmail}] sluit ${r.symbol}: Netto PNL ${r.pnlAmount >= 0 ? '+' : ''}${formatEur(r.pnlAmount)} (${r.pnlPercentage.toFixed(2)}%) - Fee: ${formatEur(r.performanceFeePaid)}`;
            } else if (r.action === 'OPENED_TRADE') {
              const execType = r.execution === 'REAL_EXCHANGE' ? 'LIVE ORDER' : 'LIVE TICKER';
              return `[${time}] [${execType}] Bot [${r.userEmail}] opent ${r.type} ${r.symbol} op ${r.entryPrice.toFixed(2)} met ${r.leverage}x leverage`;
            } else if (r.action === 'CLOSED_HENK_TRADE') {
              return `[${time}] OVERSEER (Henk) sluit trade ${r.symbol}: +${formatEur(r.pnlAmount)} (${r.pnlPercentage.toFixed(2)}%)`;
            } else if (r.action === 'OPENED_HENK_TRADE') {
              return `[${time}] OVERSEER (Henk) opent 10x trade op ${r.symbol}`;
            } else if (r.action === 'ERROR') {
              return `[${time}] ⚠️ EXECUTIE FOUT: ${r.error}`;
            }
            return `[${time}] Bot [${r.userEmail}] status: ${r.action}`;
          });
          setSimLogs(prev => [...newLogs, ...prev].slice(0, 15));
        }
        await fetchBotData();
      }
    } catch (err) {
      console.error('Fout bij simulatie:', err);
    } finally {
      setSimulating(false);
    }
  };

  // Bot Status Omschakelen (Start / Stop)
  const handleToggleBot = async () => {
    if (!bot) return;
    setToggling(true);
    try {
      const res = await fetch('/api/trading/toggle', {
        method: 'POST',
      });
      if (res.ok) {
        const data = await res.json();
        setBot(data.bot);
        setSimLogs(prev => [`[${new Date().toLocaleTimeString()}] Systeem status gewijzigd naar: ${data.bot.status}`, ...prev]);
      }
    } catch (err) {
      console.error('Fout bij omschakelen bot status:', err);
    } finally {
      setToggling(false);
    }
  };

  // Bot Modus Omschakelen (Conservative / Apex)
  const handleModeChange = async (newMode: string) => {
    if (!bot) return;
    try {
      const res = await fetch('/api/trading', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: newMode }),
      });
      if (res.ok) {
        const data = await res.json();
        setBot(data.bot);
        setSimLogs(prev => [`[${new Date().toLocaleTimeString()}] Risicoprofiel ingesteld op: ${newMode}`, ...prev]);
      }
    } catch (err) {
      console.error('Fout bij wijzigen modus:', err);
    }
  };

  // Configuratie opslaan
  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/trading', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exchange,
          apiKey: apiKey || null,
          apiSecret: apiSecret || null,
          allocatedFunds: parseFloat(allocatedFunds) || 0,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setBot(data.bot);
        setSimLogs(prev => [`[${new Date().toLocaleTimeString()}] API en Budget configuratie opgeslagen.`, ...prev]);
        await fetchBotData();
      }
    } catch (err) {
      console.error('Fout bij opslaan:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center bg-transparent">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="h-8 w-8 animate-spin text-cyan-500" />
          <p className="font-sans text-xs font-bold uppercase tracking-widest text-cyan-400">Connecting to Alpha Network...</p>
        </div>
      </div>
    );
  }

  // Bereken grafiekdata op basis van gesloten trades
  const closedTrades = bot?.trades?.filter((t: any) => t.status === 'CLOSED') || [];
  
  let cumulativePnl = 0;
  const chartData = closedTrades
    .slice()
    .reverse() 
    .map((trade: any, index: number) => {
      cumulativePnl += trade.pnlAmount;
      return {
        name: `Trade ${index + 1}`,
        pnl: cumulativePnl,
        pnlFormatted: formatEur(cumulativePnl),
        symbol: trade.symbol,
      };
    });

  const displayChartData = chartData;

  return (
    <div className="space-y-8 pb-20 max-w-7xl mx-auto px-4 select-none relative z-10 font-sans min-h-[85vh]">
      
      {/* Background glow */}
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-cyan-900/10 blur-[150px] rounded-full pointer-events-none -z-10"></div>

      {/* -------------------- HEADER: FUTURE BLUE STYLE -------------------- */}
      <div className="bg-black/40 border border-white/5 rounded-2xl p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-[0_0_50px_rgba(6,182,212,0.1)] backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-4">
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-widest uppercase flex items-center gap-4">
              ALPHA ENGINE <Cpu className="w-8 h-8 text-cyan-400" />
            </h1>
            <span className="bg-cyan-500/20 text-cyan-400 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-cyan-500/30">
              V1.20
            </span>
          </div>
          <p className="text-cyan-400/60 text-xs font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
            100% Real Live Trading Engine // Bybit & Binance API Integration
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className={`border font-bold text-xs uppercase tracking-widest px-5 py-3 rounded-xl flex items-center gap-3 transition-colors ${
            bot?.status === 'TRADING' 
              ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.15)]' 
              : 'bg-zinc-950 text-zinc-500 border-white/5'
          }`}>
            <span className={`w-2.5 h-2.5 rounded-full ${bot?.status === 'TRADING' ? 'bg-cyan-400 animate-pulse' : 'bg-zinc-700'}`} />
            System: {bot?.status === 'TRADING' ? 'RUNNING' : 'IDLE'}
          </div>

          <button
            onClick={handleToggleBot}
            disabled={toggling}
            className={`px-8 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${
              bot?.status === 'TRADING'
                ? 'bg-white text-black hover:bg-zinc-200 shadow-lg'
                : 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-[0_0_20px_rgba(6,182,212,0.2)]'
            }`}
          >
            {toggling ? 'PROCCESSING...' : bot?.status === 'TRADING' ? 'EMERGENCY STOP' : 'ACTIVATE ENGINE'}
          </button>
        </div>
      </div>

      {/* -------------------- LIVE API CONNECTIVITY ERROR -------------------- */}
      {liveError && (
        <div className="border border-red-500/30 bg-red-950/20 rounded-xl p-4 text-xs font-bold uppercase tracking-wider flex items-center gap-3 text-red-400">
          <ShieldAlert className="w-6 h-6 flex-shrink-0 animate-bounce" />
          <div>
            <span className="block mb-1">EXCHANGE CONNECTIVITY ERROR:</span>
            <span className="text-[10px] text-red-400/80">{liveError}. Please verify your API key, secret, and IP restrictions on the exchange.</span>
          </div>
        </div>
      )}

      {/* -------------------- STATS GRID -------------------- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Cumulative PNL */}
        <div className="bg-black/40 border border-white/5 rounded-2xl p-6 md:p-8 backdrop-blur-md shadow-lg flex flex-col justify-between min-h-[160px] group hover:border-white/10 transition-colors">
          <div>
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest block mb-2">CUMULATIVE PROFIT / LOSS</span>
            <div className="flex items-baseline gap-2">
              <span className={`text-4xl md:text-5xl font-black tracking-tight ${bot?.currentPnl >= 0 ? 'text-white' : 'text-zinc-500'}`}>
                {bot?.currentPnl >= 0 ? '+' : ''}{formatEur(bot?.currentPnl || 0)}
              </span>
            </div>
          </div>
          <div className="flex justify-between items-center border-t border-white/5 pt-5 mt-5 text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
            <span>ROE: {((bot?.currentPnl / (bot?.allocatedFunds || 1)) * 100).toFixed(2)}%</span>
            <span>LAUNCHED: 24/06/2026</span>
          </div>
        </div>

        {/* Allocated Funds */}
        <div className="bg-black/40 border border-white/5 rounded-2xl p-6 md:p-8 backdrop-blur-md shadow-lg flex flex-col justify-between min-h-[160px] group hover:border-white/10 transition-colors">
          <div>
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest block mb-2">ALLOCATED CAPITAL</span>
            <span className="text-4xl md:text-5xl font-black tracking-tight text-white">
              {formatEur(bot?.allocatedFunds || 0)}
            </span>
          </div>
          <div className="flex justify-between items-center border-t border-white/5 pt-5 mt-5 text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
            <span>EXCHANGE: {bot?.exchange || 'BYBIT_TESTNET'}</span>
            <span className="text-cyan-400">LEVERAGE: {bot?.mode === 'APEX_AGGRESSIVE' ? 'MAX 20X' : 'MAX 3X'}</span>
          </div>
        </div>

        {/* Risk Profile & Control */}
        <div className="bg-black/40 border border-white/5 rounded-2xl p-6 md:p-8 backdrop-blur-md shadow-lg flex flex-col justify-between min-h-[160px] group hover:border-white/10 transition-colors">
          <div>
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest block mb-3">RISK CONFIGURATION</span>
            
            <div className="grid grid-cols-2 gap-2 bg-black/50 p-1.5 rounded-xl border border-white/5">
              <button
                onClick={() => handleModeChange('CONSERVATIVE')}
                className={`py-2.5 rounded-lg text-center text-[10px] font-bold uppercase tracking-widest transition-all ${
                  bot?.mode === 'CONSERVATIVE'
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.1)]'
                    : 'text-zinc-500 hover:text-white hover:bg-zinc-900'
                }`}
              >
                Conservative
              </button>
              <button
                onClick={() => handleModeChange('APEX_AGGRESSIVE')}
                className={`py-2.5 rounded-lg text-center text-[10px] font-bold uppercase tracking-widest transition-all ${
                  bot?.mode === 'APEX_AGGRESSIVE'
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.1)]'
                    : 'text-zinc-500 hover:text-white hover:bg-zinc-900'
                }`}
              >
                APEX Mode
              </button>
            </div>
          </div>

          <div className="text-[9px] font-bold text-zinc-500 mt-4 leading-relaxed uppercase tracking-widest">
            {bot?.mode === 'APEX_AGGRESSIVE' 
              ? 'WARNING: Agressieve leverage (5-20x), verhoogde volatiliteit. AI jaagt op micro-schommelingen.'
              : 'NORMAL: Defensieve opzet (1-3x leverage). Kapitaalbehoud en stabiele stablecoin yield.'}
          </div>
        </div>

      </div>

      {/* -------------------- MAIN DISPLAY: GRAPH & LIVE POSITIONS -------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Real-time Graph (Left Column - 2/3 wide) */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-black/40 border border-white/5 rounded-2xl p-6 md:p-8 backdrop-blur-md shadow-lg group hover:border-white/10 transition-colors">
            <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
              <h2 className="text-sm font-black uppercase tracking-widest text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-500" />
                PNL Performance Timeline
              </h2>
              <span className="text-[9px] bg-cyan-500/20 text-cyan-400 px-3 py-1 rounded-full border border-cyan-500/30 font-bold tracking-widest animate-pulse">
                LIVE RENDER
              </span>
            </div>

            <div className="h-[350px] w-full bg-zinc-950/50 border border-white/5 rounded-xl p-4 font-mono">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={displayChartData} margin={{ top: 20, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="pnlGradientFuture" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', color: '#06b6d4', borderRadius: '12px', fontFamily: 'monospace', fontSize: '12px' }}
                    labelStyle={{ color: '#a1a1aa' }}
                    itemStyle={{ color: '#06b6d4' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="pnl" 
                    stroke="#06b6d4" 
                    strokeWidth={3} 
                    fillOpacity={1} 
                    fill="url(#pnlGradientFuture)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Active Positions */}
          <div className="bg-black/40 border border-white/5 rounded-2xl overflow-hidden backdrop-blur-md shadow-lg">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-black/40">
              <h3 className="text-sm font-black uppercase tracking-widest text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-500" />
                Active Market Exposures
              </h3>
              <Badge variant="outline" className="border-white/10 text-zinc-400 text-[10px] uppercase font-bold tracking-widest rounded-full px-3">
                {bot?.trades?.filter((t: any) => t.status === 'OPEN').length} POSITION(S)
              </Badge>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-black/60 border-b border-white/5 text-zinc-500 uppercase tracking-widest text-[9px] font-bold">
                    <th className="p-5">Asset Pair</th>
                    <th className="p-5">Type / Leverage</th>
                    <th className="p-5 text-right">Entry Price</th>
                    <th className="p-5 text-right">Target Duration</th>
                    <th className="p-5 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="text-zinc-300">
                  {bot?.trades?.filter((t: any) => t.status === 'OPEN').map((trade: any) => (
                    <tr key={trade.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="p-5 font-bold text-white">{trade.symbol}</td>
                      <td className="p-5">
                        <span className="bg-cyan-950/30 border border-cyan-500/30 text-cyan-400 rounded-md px-2.5 py-1 font-bold uppercase text-[9px] tracking-widest">
                          {trade.type} {trade.leverage}x
                        </span>
                      </td>
                      <td className="p-5 text-right text-white font-medium">{trade.entryPrice.toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 4 })}</td>
                      <td className="p-5 text-right text-zinc-500 font-bold uppercase text-[9px] tracking-widest">EXCHANGE ORDER</td>
                      <td className="p-5 text-right">
                        <span className="inline-flex items-center gap-1.5 text-emerald-400 font-bold tracking-widest text-[9px] bg-emerald-950/20 px-2.5 py-1 rounded-md border border-emerald-500/30 uppercase animate-pulse">
                          EXECUTING
                        </span>
                      </td>
                    </tr>
                  ))}
                  {bot?.trades?.filter((t: any) => t.status === 'OPEN').length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
                        NO ACTIVE EXCHANGES POSITIONS. BOT IS MONITORING BYBIT TICKERS.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Trade Ledger */}
          <div className="bg-black/40 border border-white/5 rounded-2xl overflow-hidden backdrop-blur-md shadow-lg">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-black/40">
              <h3 className="text-sm font-black uppercase tracking-widest text-white flex items-center gap-2">
                <Crosshair className="w-4 h-4 text-cyan-500" />
                Audited Trade Ledger
              </h3>
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">LAST 10 TRADES</span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-black/60 border-b border-white/5 text-zinc-500 uppercase tracking-widest text-[9px] font-bold">
                    <th className="p-5">Execution Time</th>
                    <th className="p-5">Asset</th>
                    <th className="p-5">Side</th>
                    <th className="p-5 text-right">Entry</th>
                    <th className="p-5 text-right">Exit</th>
                    <th className="p-5 text-right">PnL Amount</th>
                    <th className="p-5 text-right">PnL %</th>
                  </tr>
                </thead>
                <tbody className="text-zinc-300">
                  {closedTrades.slice(0, 10).map((trade: any) => (
                    <tr key={trade.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="p-5 text-zinc-500 font-medium">{new Date(trade.closedAt || trade.openedAt).toLocaleTimeString()}</td>
                      <td className="p-5 font-bold text-white">{trade.symbol}</td>
                      <td className="p-5 text-zinc-400 font-medium">{trade.type} {trade.leverage}x</td>
                      <td className="p-5 text-right text-zinc-300">{trade.entryPrice.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}</td>
                      <td className="p-5 text-right text-zinc-300">{trade.exitPrice?.toLocaleString('nl-NL', { minimumFractionDigits: 2 }) || '-'}</td>
                      <td className={`p-5 text-right font-bold ${trade.pnlAmount >= 0 ? 'text-emerald-400' : 'text-zinc-500'}`}>
                        {trade.pnlAmount >= 0 ? '+' : ''}{formatEur(trade.pnlAmount)}
                      </td>
                      <td className={`p-5 text-right font-bold ${trade.pnlAmount >= 0 ? 'text-emerald-400' : 'text-zinc-500'}`}>
                        {trade.pnlAmount >= 0 ? '+' : ''}{trade.pnlPercentage.toFixed(2)}%
                      </td>
                    </tr>
                  ))}
                  {closedTrades.length === 0 && (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
                        NO SETTLED EXCHANGES TRANSACTIONS YET.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Operations & Credentials Form (Right Column - 1/3 wide) */}
        <div className="space-y-8">
          
          {/* Simulation Command Center */}
          <div className="bg-black/40 border border-white/5 rounded-2xl p-6 md:p-8 backdrop-blur-md shadow-lg">
            <h3 className="text-sm font-black uppercase tracking-widest text-white mb-6 flex items-center gap-2 border-b border-white/5 pb-4">
              <Zap className="w-4 h-4 text-cyan-500" />
              Engine Simulation
            </h3>
            
            <p className="text-zinc-400 text-[11px] leading-relaxed mb-6 font-medium">
              De API endpoints kunnen direct vanuit deze War Room gesimuleerd worden. Trigger willekeurige marktbewegingen of activeer automatische realtime ticks.
            </p>

            <div className="space-y-4">
              <div className="flex items-center justify-between border border-white/5 p-4 bg-zinc-950/50 rounded-xl">
                <span className="text-zinc-400 font-bold uppercase tracking-widest text-[10px]">Auto-tick (6s)</span>
                <button
                  onClick={() => setAutoSimulate(!autoSimulate)}
                  className={`px-4 py-2 font-bold rounded-lg uppercase text-[10px] transition-colors tracking-widest ${autoSimulate ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'bg-black text-zinc-500 border border-white/10'}`}
                >
                  {autoSimulate ? 'ACTIVE' : 'PAUSED'}
                </button>
              </div>

              <button
                onClick={triggerSimulation}
                disabled={simulating}
                className="w-full py-4 bg-white hover:bg-zinc-200 text-black font-black text-xs uppercase tracking-widest rounded-xl transition-all disabled:opacity-40"
              >
                {simulating ? 'SIMULATING MARKET...' : 'TRIGGER MARKET TICK'}
              </button>
            </div>

            {/* Simulation Log Console */}
            <div className="mt-6 border border-white/5 bg-black/60 rounded-xl p-4 font-mono text-[9px] text-zinc-400 h-[180px] overflow-y-auto space-y-2 custom-scrollbar">
              <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-3">
                 <span className="text-cyan-500 uppercase tracking-widest font-bold">Terminal Output</span>
                 <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse"></div>
              </div>
              {simLogs.map((log, idx) => (
                <div key={idx} className={`leading-relaxed border-l border-white/10 pl-3 ${log.includes('FOUT') ? 'text-red-400' : log.includes('+') ? 'text-emerald-400' : 'text-zinc-400'}`}>
                  {log}
                </div>
              ))}
              {simLogs.length === 0 && (
                <div className="text-zinc-600 italic mt-4 pl-2">System idle. Wachten op markt ticks...</div>
              )}
            </div>
          </div>

          {/* Credentials Config */}
          <div className="bg-black/40 border border-white/5 rounded-2xl p-6 md:p-8 backdrop-blur-md shadow-lg">
            <h3 className="text-sm font-black uppercase tracking-widest text-white mb-6 flex items-center gap-2 border-b border-white/5 pb-4">
              <Key className="w-4 h-4 text-cyan-500" />
              Exchange Keys
            </h3>
            
            <form onSubmit={handleSaveConfig} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest block">Selected Exchange</label>
                <div className="relative">
                  <select
                    value={exchange}
                    onChange={(e) => setExchange(e.target.value)}
                    className="w-full bg-zinc-950 border border-white/10 rounded-xl text-white font-medium text-xs p-3.5 focus:outline-none focus:border-cyan-500/50 transition-colors appearance-none"
                  >
                    <option value="BYBIT_TESTNET">BYBIT TESTNET (SANDBOX)</option>
                    <option value="BYBIT">BYBIT MAINNET (LIVE)</option>
                    <option value="BINANCE">BINANCE EXCHANGE</option>
                    <option value="KRAKEN">KRAKEN GLOBAL</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest block">Allocated Capital ($)</label>
                <input
                  type="number"
                  value={allocatedFunds}
                  onChange={(e) => setAllocatedFunds(e.target.value)}
                  className="w-full bg-zinc-950 border border-white/10 rounded-xl text-white font-medium text-xs p-3.5 focus:outline-none focus:border-cyan-500/50 transition-colors"
                  placeholder="Instelkosten"
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest block">API Key</label>
                  <button
                    type="button"
                    onClick={() => setShowKeys(!showKeys)}
                    className="text-[9px] text-zinc-400 hover:text-white uppercase font-bold tracking-widest flex items-center gap-1 transition-colors"
                  >
                    {showKeys ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    {showKeys ? 'Hide' : 'Show'}
                  </button>
                </div>
                <input
                  type={showKeys ? 'text' : 'password'}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full bg-zinc-950 border border-white/10 rounded-xl text-white font-medium text-xs p-3.5 focus:outline-none focus:border-cyan-500/50 transition-colors placeholder:text-zinc-600"
                  placeholder="Envision Api Key..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest block">API Secret</label>
                <input
                  type={showKeys ? 'text' : 'password'}
                  value={apiSecret}
                  onChange={(e) => setApiSecret(e.target.value)}
                  className="w-full bg-zinc-950 border border-white/10 rounded-xl text-white font-medium text-xs p-3.5 focus:outline-none focus:border-cyan-500/50 transition-colors placeholder:text-zinc-600"
                  placeholder="Envision Api Secret..."
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 mt-4 bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-black uppercase tracking-widest rounded-xl transition-colors disabled:opacity-40 shadow-[0_0_20px_rgba(6,182,212,0.15)]"
              >
                {submitting ? 'SAVING CONFIG...' : 'COMMIT CONFIGURATION'}
              </button>
            </form>
          </div>

        </div>

      </div>

      {/* -------------------- COCKPIT: SUPREME OVERSEER PERFORMANCE FEE (Henk Mode) -------------------- */}
      <AnimatePresence>
        {isSupremeOverseer && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="bg-black/60 border border-cyan-500/30 rounded-2xl p-6 md:p-8 shadow-[0_0_30px_rgba(6,182,212,0.1)] space-y-6 backdrop-blur-xl relative overflow-hidden"
          >
            {/* Ambient inner glow */}
            <div className="absolute inset-0 bg-cyan-500/5 pointer-events-none" />

            <div className="border-b border-white/5 pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">
              <div>
                <h3 className="text-xl md:text-2xl font-black uppercase tracking-widest text-cyan-400 flex items-center gap-3">
                  <Skull className="w-6 h-6" />
                  Supreme Performance Cockpit
                </h3>
                <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest mt-2">
                  Global System Administrator Dashboard // Performance Fee: 20%
                </p>
              </div>
              <div className="bg-cyan-950/30 text-cyan-400 text-[10px] font-black px-4 py-2 uppercase tracking-widest border border-cyan-500/50 rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.1)]">
                Overseer: HENK SEMLER
              </div>
            </div>

            {/* Supreme Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative z-10">
              <div className="bg-zinc-950/50 border border-white/5 rounded-xl p-5">
                <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest block mb-2">TOTAL FEES EARNED</span>
                <span className="text-2xl font-black text-cyan-400">{formatEur(systemStats?.totalFeesEarned || 0)}</span>
              </div>
              <div className="bg-zinc-950/50 border border-white/5 rounded-xl p-5">
                <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest block mb-2">TOTAL SYSTEM CAPITAL</span>
                <span className="text-2xl font-black text-white">{formatEur(systemStats?.totalAllocatedFunds || 0)}</span>
              </div>
              <div className="bg-zinc-950/50 border border-white/5 rounded-xl p-5">
                <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest block mb-2">TOTAL SYSTEM PNL</span>
                <span className={`text-2xl font-black ${systemStats?.totalSystemPnl >= 0 ? 'text-emerald-400' : 'text-zinc-500'}`}>
                  {systemStats?.totalSystemPnl >= 0 ? '+' : ''}{formatEur(systemStats?.totalSystemPnl || 0)}
                </span>
              </div>
              <div className="bg-zinc-950/50 border border-white/5 rounded-xl p-5">
                <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest block mb-2">ACTIVE SYSTEM BOTS</span>
                <span className="text-2xl font-black text-white">{systemStats?.activeBots} / <span className="text-zinc-500">{systemStats?.totalBots}</span></span>
              </div>
            </div>

            {/* Global Bots List */}
            <div className="border border-white/5 rounded-xl overflow-hidden bg-zinc-950/50 relative z-10">
              <div className="p-5 bg-black/40 border-b border-white/5 flex justify-between items-center">
                <span className="text-xs font-black text-white uppercase tracking-widest">Systeem Bots Registratie</span>
                <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest flex items-center gap-2">
                  <Activity className="w-3 h-3 text-cyan-500" /> REALTIME NETWORK LOG
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-white/5 text-zinc-500 uppercase tracking-widest text-[9px] font-bold bg-black/20">
                      <th className="p-4">Operator</th>
                      <th className="p-4">Bot Email</th>
                      <th className="p-4">Exchange</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Modus</th>
                      <th className="p-4 text-right">Capital</th>
                      <th className="p-4 text-right">Accumulated PnL</th>
                    </tr>
                  </thead>
                  <tbody className="text-zinc-300">
                    {systemStats?.botsList?.map((sysBot: any) => (
                      <tr key={sysBot.botId} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="p-4 font-bold text-white">{sysBot.userName}</td>
                        <td className="p-4 text-zinc-400">{sysBot.email}</td>
                        <td className="p-4 text-[9px] font-bold tracking-widest uppercase text-zinc-500">{sysBot.exchange}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-widest ${sysBot.status === 'TRADING' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'bg-zinc-900 text-zinc-500 border border-white/5'}`}>
                            {sysBot.status}
                          </span>
                        </td>
                        <td className="p-4 text-[9px] font-bold tracking-widest uppercase text-zinc-400">{sysBot.mode}</td>
                        <td className="p-4 text-right text-white font-medium">{formatEur(sysBot.allocatedFunds)}</td>
                        <td className={`p-4 text-right font-bold ${sysBot.currentPnl >= 0 ? 'text-emerald-400' : 'text-zinc-500'}`}>
                          {sysBot.currentPnl >= 0 ? '+' : ''}{formatEur(sysBot.currentPnl)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
