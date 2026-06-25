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
  Skull
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
              return `[${time}] GOD BOT (Henk) sluit trade ${r.symbol}: +${formatEur(r.pnlAmount)} (${r.pnlPercentage.toFixed(2)}%)`;
            } else if (r.action === 'OPENED_HENK_TRADE') {
              return `[${time}] GOD BOT (Henk) opent 10x trade op ${r.symbol}`;
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
      <div className="flex h-[60vh] items-center justify-center bg-black">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="h-8 w-8 animate-spin text-white" />
          <p className="font-mono text-xs uppercase tracking-widest text-zinc-500">Connecting to Trading Floor...</p>
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

  const displayChartData = chartData.length > 0 ? chartData : [
    { name: 'Start', pnl: 0 },
    { name: 'Tick 1', pnl: 120 },
    { name: 'Tick 2', pnl: -40 },
    { name: 'Tick 3', pnl: 220 },
    { name: 'Tick 4', pnl: 340 },
    { name: 'Tick 5', pnl: 280 },
    { name: 'Tick 6', pnl: 450 },
  ];

  return (
    <div className="space-y-8 pb-20 max-w-7xl mx-auto px-4 select-none">
      
      {/* -------------------- HEADER: BRUTALIST STYLE -------------------- */}
      <div className="border-4 border-white bg-black p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase font-sans">
              Alpha Engine
            </h1>
            <span className="bg-white text-black text-xs font-mono font-bold px-2 py-0.5 uppercase tracking-widest border border-white">
              V1.20
            </span>
          </div>
          <p className="text-zinc-400 font-mono text-xs uppercase tracking-widest mt-2 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-zinc-300" />
            100% Real Live Trading Engine // Bybit & Binance API Integration
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className={`border-2 font-mono text-xs font-bold uppercase tracking-widest px-4 py-2 flex items-center gap-3 ${bot?.status === 'TRADING' ? 'bg-white text-black border-white' : 'bg-black text-zinc-500 border-zinc-800'}`}>
            <span className={`w-2.5 h-2.5 ${bot?.status === 'TRADING' ? 'bg-black animate-pulse' : 'bg-zinc-800'} rounded-none`} />
            System: {bot?.status === 'TRADING' ? 'RUNNING' : 'IDLE'}
          </div>

          <button
            onClick={handleToggleBot}
            disabled={toggling}
            className={`px-6 py-3 font-mono text-sm font-bold uppercase tracking-widest border-2 transition-all ${
              bot?.status === 'TRADING'
                ? 'bg-black border-white text-white hover:bg-white hover:text-black shadow-[4px_4px_0px_#ffffff] active:translate-x-1 active:translate-y-1 active:shadow-[0px_0px_0px_#ffffff]'
                : 'bg-white border-white text-black hover:bg-black hover:text-white shadow-[4px_4px_0px_rgba(255,255,255,0.2)] active:translate-x-1 active:translate-y-1'
            }`}
          >
            {toggling ? 'PROCCESSING...' : bot?.status === 'TRADING' ? 'EMERGENCY STOP' : 'ACTIVATE ENGINE'}
          </button>
        </div>
      </div>

      {/* -------------------- LIVE API CONNECTIVITY ERROR -------------------- */}
      {liveError && (
        <div className="border-4 border-gold bg-[#0a192f]/20 text-white p-4 font-mono text-xs uppercase tracking-wider flex items-center gap-3 shadow-[8px_8px_0px_0px_#ef4444]">
          <ShieldAlert className="w-6 h-6 text-gold flex-shrink-0 animate-bounce" />
          <div>
            <span className="font-bold block text-gold mb-1">EXCHANGE CONNECTIVITY ERROR:</span>
            <span>{liveError}. Please verify your API key, secret, and IP restrictions on the exchange.</span>
          </div>
        </div>
      )}

      {/* -------------------- STATS GRID -------------------- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Cumulative PNL */}
        <div className="border-4 border-white bg-black p-6 relative overflow-hidden shadow-[8px_8px_0px_0px_rgba(255,255,255,0.15)] flex flex-col justify-between min-h-[160px]">
          <div>
            <span className="font-mono text-xs text-zinc-400 uppercase tracking-widest block mb-1">CUMULATIVE PROFIT / LOSS</span>
            <div className="flex items-baseline gap-2">
              <span className={`text-4xl md:text-5xl font-black font-sans tracking-tight ${bot?.currentPnl >= 0 ? 'text-white' : 'text-zinc-500'}`}>
                {bot?.currentPnl >= 0 ? '+' : ''}{formatEur(bot?.currentPnl || 0)}
              </span>
            </div>
          </div>
          <div className="flex justify-between items-center border-t border-zinc-800 pt-4 mt-4 font-mono text-[10px] text-zinc-500">
            <span>ROE: {((bot?.currentPnl / (bot?.allocatedFunds || 1)) * 100).toFixed(2)}%</span>
            <span>SYSTEM LAUNCHED: 24/06/2026</span>
          </div>
        </div>

        {/* Allocated Funds */}
        <div className="border-4 border-white bg-black p-6 shadow-[8px_8px_0px_0px_rgba(255,255,255,0.15)] flex flex-col justify-between min-h-[160px]">
          <div>
            <span className="font-mono text-xs text-zinc-400 uppercase tracking-widest block mb-1">ALLOCATED CAPITAL</span>
            <span className="text-4xl md:text-5xl font-black font-sans tracking-tight text-white">
              {formatEur(bot?.allocatedFunds || 0)}
            </span>
          </div>
          <div className="flex justify-between items-center border-t border-zinc-800 pt-4 mt-4 font-mono text-[10px] text-zinc-500">
            <span>EXCHANGE: {bot?.exchange || 'BYBIT_TESTNET'}</span>
            <span>LEVERAGE: {bot?.mode === 'APEX_AGGRESSIVE' ? 'MAX 20X' : 'MAX 3X'}</span>
          </div>
        </div>

        {/* Risk Profile & Control */}
        <div className="border-4 border-white bg-black p-6 shadow-[8px_8px_0px_0px_rgba(255,255,255,0.15)] flex flex-col justify-between min-h-[160px]">
          <div>
            <span className="font-mono text-xs text-zinc-400 uppercase tracking-widest block mb-2">RISK CONFIGURATION</span>
            
            <div className="grid grid-cols-2 gap-2 border border-zinc-800 p-1 bg-zinc-950">
              <button
                onClick={() => handleModeChange('CONSERVATIVE')}
                className={`py-2 text-center font-mono text-xs font-bold uppercase tracking-wider transition-all ${
                  bot?.mode === 'CONSERVATIVE'
                    ? 'bg-white text-black'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                Conservative
              </button>
              <button
                onClick={() => handleModeChange('APEX_AGGRESSIVE')}
                className={`py-2 text-center font-mono text-xs font-bold uppercase tracking-wider transition-all ${
                  bot?.mode === 'APEX_AGGRESSIVE'
                    ? 'bg-white text-black'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                APEX Mode
              </button>
            </div>
          </div>

          <div className="text-[10px] font-mono text-zinc-500 mt-3 leading-relaxed">
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
          <div className="border-4 border-white bg-black p-6 shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black uppercase tracking-widest text-white">PNL Performance Timeline</h2>
              <span className="font-mono text-xs text-zinc-400">MONOCHROME RENDER</span>
            </div>

            <div className="h-[300px] w-full bg-zinc-950/50 border border-zinc-800 p-2 font-mono">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={displayChartData} margin={{ top: 20, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="pnlGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ffffff" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#ffffff" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#52525b" fontSize={10} tickLine={false} />
                  <YAxis stroke="#52525b" fontSize={10} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#000000', borderColor: '#ffffff', color: '#ffffff', borderRadius: 0, fontFamily: 'monospace' }}
                    labelStyle={{ fontWeight: 'bold' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="pnl" 
                    stroke="#ffffff" 
                    strokeWidth={2} 
                    fillOpacity={1} 
                    fill="url(#pnlGradient)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Active Positions */}
          <div className="border-4 border-white bg-black p-0 shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] overflow-hidden">
            <div className="p-4 border-b-2 border-white flex justify-between items-center bg-zinc-950">
              <h3 className="text-sm font-black uppercase tracking-widest text-white flex items-center gap-2">
                <Layers className="w-4 h-4" />
                Active Market Exposures
              </h3>
              <Badge variant="outline" className="border-white text-white font-mono rounded-none">
                {bot?.trades?.filter((t: any) => t.status === 'OPEN').length} POSITION(S)
              </Badge>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse font-mono text-xs">
                <thead>
                  <tr className="bg-zinc-900 border-b border-zinc-800 text-zinc-400 uppercase tracking-widest text-[9px]">
                    <th className="p-4 font-normal">Asset Pair</th>
                    <th className="p-4 font-normal">Type / Leverage</th>
                    <th className="p-4 font-normal text-right">Entry Price</th>
                    <th className="p-4 font-normal text-right">Target Duration</th>
                    <th className="p-4 font-normal text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="text-zinc-300">
                  {bot?.trades?.filter((t: any) => t.status === 'OPEN').map((trade: any) => (
                    <tr key={trade.id} className="border-b border-zinc-800 hover:bg-zinc-900/50 transition-colors">
                      <td className="p-4 font-bold text-white">{trade.symbol}</td>
                      <td className="p-4">
                        <span className="bg-white text-black px-2 py-0.5 font-bold uppercase text-[10px]">
                          {trade.type} {trade.leverage}x
                        </span>
                      </td>
                      <td className="p-4 text-right text-white font-bold">{trade.entryPrice.toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 4 })}</td>
                      <td className="p-4 text-right text-zinc-500">EXCHANGE ORDER</td>
                      <td className="p-4 text-right">
                        <span className="text-white border border-white px-2 py-0.5 text-[9px] uppercase font-bold animate-pulse">
                          EXECUTING
                        </span>
                      </td>
                    </tr>
                  ))}
                  {bot?.trades?.filter((t: any) => t.status === 'OPEN').length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-zinc-600 uppercase tracking-widest">
                        NO ACTIVE EXCHANGES POSITIONS. BOT IS MONITORING BYBIT TICKERS.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Trade Ledger */}
          <div className="border-4 border-white bg-black p-0 shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] overflow-hidden">
            <div className="p-4 border-b-2 border-white flex justify-between items-center bg-zinc-950">
              <h3 className="text-sm font-black uppercase tracking-widest text-white">
                Audited Trade Ledger
              </h3>
              <span className="font-mono text-xs text-zinc-500">LAST 10 TRADES</span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse font-mono text-xs">
                <thead>
                  <tr className="bg-zinc-900 border-b border-zinc-800 text-zinc-400 uppercase tracking-widest text-[9px]">
                    <th className="p-4 font-normal">Execution Time</th>
                    <th className="p-4 font-normal">Asset</th>
                    <th className="p-4 font-normal">Side</th>
                    <th className="p-4 font-normal text-right">Entry</th>
                    <th className="p-4 font-normal text-right">Exit</th>
                    <th className="p-4 font-normal text-right">PnL Amount</th>
                    <th className="p-4 font-normal text-right">PnL %</th>
                  </tr>
                </thead>
                <tbody className="text-zinc-300">
                  {closedTrades.slice(0, 10).map((trade: any) => (
                    <tr key={trade.id} className="border-b border-zinc-800 hover:bg-zinc-900/50 transition-colors">
                      <td className="p-4 text-zinc-500">{new Date(trade.closedAt || trade.openedAt).toLocaleTimeString()}</td>
                      <td className="p-4 font-bold text-white">{trade.symbol}</td>
                      <td className="p-4 text-zinc-400">{trade.type} {trade.leverage}x</td>
                      <td className="p-4 text-right">{trade.entryPrice.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}</td>
                      <td className="p-4 text-right">{trade.exitPrice?.toLocaleString('nl-NL', { minimumFractionDigits: 2 }) || '-'}</td>
                      <td className={`p-4 text-right font-bold ${trade.pnlAmount >= 0 ? 'text-white' : 'text-zinc-600'}`}>
                        {trade.pnlAmount >= 0 ? '+' : ''}{formatEur(trade.pnlAmount)}
                      </td>
                      <td className={`p-4 text-right font-bold ${trade.pnlAmount >= 0 ? 'text-white' : 'text-zinc-600'}`}>
                        {trade.pnlAmount >= 0 ? '+' : ''}{trade.pnlPercentage.toFixed(2)}%
                      </td>
                    </tr>
                  ))}
                  {closedTrades.length === 0 && (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-zinc-600 uppercase tracking-widest">
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
          <div className="border-4 border-white bg-black p-6 shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
            <h3 className="text-lg font-black uppercase tracking-widest text-white mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Engine Simulation
            </h3>
            
            <p className="text-zinc-400 font-mono text-xs leading-relaxed mb-6">
              De API endpoints kunnen direct vanuit deze War Room gesimuleerd worden. Trigger willekeurige marktbewegingen of activeer automatische realtime ticks.
            </p>

            <div className="space-y-4">
              <div className="flex items-center justify-between border border-zinc-800 p-3 bg-zinc-950 font-mono text-xs">
                <span className="text-zinc-400 uppercase">Auto-tick (6s):</span>
                <button
                  onClick={() => setAutoSimulate(!autoSimulate)}
                  className={`px-3 py-1 font-bold border uppercase text-[10px] ${autoSimulate ? 'bg-white text-black border-white' : 'bg-black text-zinc-500 border-zinc-800'}`}
                >
                  {autoSimulate ? 'ACTIVE' : 'PAUSED'}
                </button>
              </div>

              <button
                onClick={triggerSimulation}
                disabled={simulating}
                className="w-full py-3 bg-white text-black font-mono text-xs font-bold uppercase tracking-widest border border-white hover:bg-black hover:text-white transition-all shadow-[4px_4px_0px_#ffffff] active:translate-x-1 active:translate-y-1 active:shadow-none"
              >
                {simulating ? 'SIMULATING MARKET...' : 'TRIGGER MARKET TICK'}
              </button>
            </div>

            {/* Simulation Log Console */}
            <div className="mt-6 border border-zinc-800 bg-zinc-950 p-4 font-mono text-[9px] text-zinc-400 h-[150px] overflow-y-auto space-y-1 custom-scrollbar">
              <div className="text-white border-b border-zinc-800 pb-1 mb-2 uppercase tracking-widest font-bold">
                Console Output log
              </div>
              {simLogs.map((log, idx) => (
                <div key={idx} className="leading-normal border-l-2 border-zinc-700 pl-2">
                  {log}
                </div>
              ))}
              {simLogs.length === 0 && (
                <div className="text-zinc-700 italic">Console idle. Wachten op markt ticks...</div>
              )}
            </div>
          </div>

          {/* Credentials Config */}
          <div className="border-4 border-white bg-black p-6 shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
            <h3 className="text-lg font-black uppercase tracking-widest text-white mb-4 flex items-center gap-2">
              <Key className="w-5 h-5" />
              Exchange Keys
            </h3>
            
            <form onSubmit={handleSaveConfig} className="space-y-4">
              <div className="space-y-1.5">
                <label className="font-mono text-[10px] text-zinc-400 uppercase block">Selected Exchange</label>
                <select
                  value={exchange}
                  onChange={(e) => setExchange(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 text-white font-mono text-xs p-3 focus:outline-none focus:border-white transition-colors"
                >
                  <option value="BYBIT_TESTNET">BYBIT TESTNET (SANDBOX)</option>
                  <option value="BYBIT">BYBIT MAINNET (LIVE)</option>
                  <option value="BINANCE">BINANCE EXCHANGE</option>
                  <option value="KRAKEN">KRAKEN GLOBAL</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-mono text-[10px] text-zinc-400 uppercase block">Allocated Capital ($)</label>
                <input
                  type="number"
                  value={allocatedFunds}
                  onChange={(e) => setAllocatedFunds(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 text-white font-mono text-xs p-3 focus:outline-none focus:border-white transition-colors"
                  placeholder="Instelkosten"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="font-mono text-[10px] text-zinc-400 uppercase block">API Key</label>
                  <button
                    type="button"
                    onClick={() => setShowKeys(!showKeys)}
                    className="font-mono text-[9px] text-zinc-500 hover:text-white uppercase flex items-center gap-1"
                  >
                    {showKeys ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    {showKeys ? 'Hide' : 'Show'}
                  </button>
                </div>
                <input
                  type={showKeys ? 'text' : 'password'}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 text-white font-mono text-xs p-3 focus:outline-none focus:border-white transition-colors"
                  placeholder="Envision Api Key..."
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-mono text-[10px] text-zinc-400 uppercase block">API Secret</label>
                <input
                  type={showKeys ? 'text' : 'password'}
                  value={apiSecret}
                  onChange={(e) => setApiSecret(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 text-white font-mono text-xs p-3 focus:outline-none focus:border-white transition-colors"
                  placeholder="Envision Api Secret..."
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 mt-2 bg-white text-black font-mono text-xs font-bold uppercase tracking-widest border border-white hover:bg-black hover:text-white transition-all shadow-[4px_4px_0px_#ffffff] active:translate-x-1 active:translate-y-1"
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
            className="border-4 border-zinc-200 bg-zinc-950 p-6 shadow-[8px_8px_0px_0px_rgba(255,255,255,0.5)] space-y-6"
          >
            <div className="border-b border-zinc-800 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-2xl font-black uppercase tracking-tight text-white flex items-center gap-3 font-sans">
                  <Skull className="w-6 h-6 text-white" />
                  Supreme Performance Fee Cockpit
                </h3>
                <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest mt-1">
                  Global System Administrator Dashboard // Performance Fee: 20%
                </p>
              </div>
              <div className="bg-white text-black font-mono text-xs font-bold px-4 py-2 uppercase tracking-widest border border-white">
                Overseer: HENK SEMLER
              </div>
            </div>

            {/* Supreme Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 font-mono">
              <div className="bg-black border border-zinc-800 p-4">
                <span className="text-[9px] text-zinc-500 uppercase block mb-1">TOTAL FEES EARNED</span>
                <span className="text-2xl font-bold text-white">{formatEur(systemStats?.totalFeesEarned || 0)}</span>
              </div>
              <div className="bg-black border border-zinc-800 p-4">
                <span className="text-[9px] text-zinc-500 uppercase block mb-1">TOTAL SYSTEM CAPITAL</span>
                <span className="text-2xl font-bold text-white">{formatEur(systemStats?.totalAllocatedFunds || 0)}</span>
              </div>
              <div className="bg-black border border-zinc-800 p-4">
                <span className="text-[9px] text-zinc-500 uppercase block mb-1">TOTAL SYSTEM PNL</span>
                <span className="text-2xl font-bold text-white">{systemStats?.totalSystemPnl >= 0 ? '+' : ''}{formatEur(systemStats?.totalSystemPnl || 0)}</span>
              </div>
              <div className="bg-black border border-zinc-800 p-4">
                <span className="text-[9px] text-zinc-500 uppercase block mb-1">ACTIVE SYSTEM BOTS</span>
                <span className="text-2xl font-bold text-white">{systemStats?.activeBots} / {systemStats?.totalBots}</span>
              </div>
            </div>

            {/* Global Bots List */}
            <div className="border border-zinc-800 bg-black overflow-hidden">
              <div className="p-3 bg-zinc-900 border-b border-zinc-800 flex justify-between items-center">
                <span className="font-mono text-xs font-bold text-white uppercase">Systeem Bots Registratie</span>
                <span className="font-mono text-[9px] text-zinc-500">REALTIME NETWORK LOG</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse font-mono text-xs">
                  <thead>
                    <tr className="border-b border-zinc-800 text-zinc-500 uppercase tracking-widest text-[9px] bg-zinc-950">
                      <th className="p-3 font-normal">Operator</th>
                      <th className="p-3 font-normal">Bot Email</th>
                      <th className="p-3 font-normal">Exchange</th>
                      <th className="p-3 font-normal">Status</th>
                      <th className="p-3 font-normal">Modus</th>
                      <th className="p-3 font-normal text-right">Capital</th>
                      <th className="p-3 font-normal text-right">Accumulated PnL</th>
                    </tr>
                  </thead>
                  <tbody className="text-zinc-300">
                    {systemStats?.botsList?.map((sysBot: any) => (
                      <tr key={sysBot.botId} className="border-b border-zinc-800/50 hover:bg-zinc-900/30 transition-colors">
                        <td className="p-3 font-bold text-white">{sysBot.userName}</td>
                        <td className="p-3 text-zinc-400">{sysBot.email}</td>
                        <td className="p-3 text-[10px] text-zinc-500">{sysBot.exchange}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 text-[9px] font-bold ${sysBot.status === 'TRADING' ? 'bg-white text-black' : 'border border-zinc-800 text-zinc-600'}`}>
                            {sysBot.status}
                          </span>
                        </td>
                        <td className="p-3 text-[10px]">{sysBot.mode}</td>
                        <td className="p-3 text-right text-white font-bold">{formatEur(sysBot.allocatedFunds)}</td>
                        <td className={`p-3 text-right font-bold ${sysBot.currentPnl >= 0 ? 'text-white' : 'text-zinc-600'}`}>
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

