'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Activity, TrendingUp, TrendingDown, RefreshCw, Zap, ShieldAlert, Crosshair } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

function formatEur(n: number) {
  return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(n);
}

export default function AlphaTradingPage() {
  const [pnl, setPnl] = useState(1450.42);
  const [isAggressive, setIsAggressive] = useState(false);
  const [allocatedFunds, setAllocatedFunds] = useState(45000);

  // Simulatie van live PNL ticks
  useEffect(() => {
    const interval = setInterval(() => {
      const volatility = isAggressive ? 150 : 15;
      const change = (Math.random() - 0.48) * volatility; 
      setPnl(prev => prev + change);
    }, 1500);
    return () => clearInterval(interval);
  }, [isAggressive]);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 max-w-7xl mx-auto pb-20"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-[#1f2937] pb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
             <h1 className="text-4xl font-black text-white tracking-tighter uppercase flex items-center gap-2">
               <Activity className="w-8 h-8 text-emerald-400" />
               Alpha Algo-Trading
             </h1>
             <Badge variant="success" className="animate-pulse tracking-widest text-[10px]">LIVE MARKET</Badge>
          </div>
          <p className="text-zinc-500 uppercase tracking-widest text-sm font-mono">
             High-Frequency AI Engine // E-Commerce Sweeper Active
          </p>
        </div>
        
        {/* Risk Switcher */}
        <div className="flex items-center gap-4 bg-black border border-zinc-800 p-2 rounded-xl">
          <button 
            onClick={() => setIsAggressive(false)}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${!isAggressive ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.3)]' : 'text-zinc-600 hover:text-zinc-400'}`}
          >
            Conservative
          </button>
          <button 
            onClick={() => setIsAggressive(true)}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${isAggressive ? 'bg-red-500/20 text-red-400 border border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.3)]' : 'text-zinc-600 hover:text-zinc-400'}`}
          >
            Apex Aggressive
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main PNL Display */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div variants={itemVariants}>
            <Card className="bg-[#050505] border border-zinc-800 p-8 relative overflow-hidden flex flex-col justify-center min-h-[250px]">
               {/* Background Grid Pattern */}
               <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
               
               <div className="relative z-10 flex flex-col sm:flex-row justify-between items-center">
                 <div>
                   <p className="text-zinc-500 uppercase tracking-widest text-sm mb-2 font-bold">Unrealized PnL (24h)</p>
                   <div className="flex items-center gap-4">
                     <span className={`text-6xl font-black tracking-tighter ${pnl >= 0 ? 'text-emerald-400 drop-shadow-[0_0_20px_rgba(52,211,153,0.3)]' : 'text-red-500 drop-shadow-[0_0_20px_rgba(239,68,68,0.3)]'}`}>
                       {pnl >= 0 ? '+' : ''}{formatEur(pnl)}
                     </span>
                     {pnl >= 0 ? <TrendingUp className="w-10 h-10 text-emerald-400" /> : <TrendingDown className="w-10 h-10 text-red-500" />}
                   </div>
                 </div>
                 
                 <div className="mt-8 sm:mt-0 text-right">
                   <p className="text-zinc-500 uppercase tracking-widest text-[10px] mb-1">Allocated Funds (Swept)</p>
                   <p className="text-2xl font-mono text-white font-bold">{formatEur(allocatedFunds)}</p>
                   <p className="text-cyan-400 text-xs mt-1 font-mono">+ €420.50 since 00:00</p>
                 </div>
               </div>
            </Card>
          </motion.div>

          {/* Active Trades Table */}
          <motion.div variants={itemVariants}>
            <Card className="bg-black border border-zinc-800 p-0 overflow-hidden">
              <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/30">
                 <h3 className="text-white font-bold uppercase tracking-widest text-sm">Active Positions</h3>
                 <Badge variant="outline" className="border-emerald-500/30 text-emerald-400">4 OPEN</Badge>
              </div>
              <div className="p-0 overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-zinc-900/50 text-[10px] uppercase tracking-widest text-zinc-500">
                      <th className="p-4 font-normal">Symbol</th>
                      <th className="p-4 font-normal">Type</th>
                      <th className="p-4 font-normal text-right">Entry</th>
                      <th className="p-4 font-normal text-right">Current</th>
                      <th className="p-4 font-normal text-right">PnL (ROE)</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm font-mono text-white/80">
                    <tr className="border-b border-zinc-800/50 hover:bg-zinc-900/50 transition-colors">
                      <td className="p-4 font-bold text-white">BTC/USDT</td>
                      <td className="p-4"><span className="text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded">LONG 5x</span></td>
                      <td className="p-4 text-right">62,400.00</td>
                      <td className="p-4 text-right text-zinc-400">63,120.50</td>
                      <td className="p-4 text-right text-emerald-400 font-bold">+5.76%</td>
                    </tr>
                    <tr className="border-b border-zinc-800/50 hover:bg-zinc-900/50 transition-colors">
                      <td className="p-4 font-bold text-white">SOL/USDT</td>
                      <td className="p-4"><span className="text-red-400 bg-red-400/10 px-2 py-1 rounded">SHORT 10x</span></td>
                      <td className="p-4 text-right">145.20</td>
                      <td className="p-4 text-right text-zinc-400">142.10</td>
                      <td className="p-4 text-right text-emerald-400 font-bold">+21.34%</td>
                    </tr>
                    <tr className="border-b border-zinc-800/50 hover:bg-zinc-900/50 transition-colors">
                      <td className="p-4 font-bold text-white">ETH/USDT</td>
                      <td className="p-4"><span className="text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded">LONG 2x</span></td>
                      <td className="p-4 text-right">3,100.50</td>
                      <td className="p-4 text-right text-zinc-400">3,080.00</td>
                      <td className="p-4 text-right text-red-500 font-bold">-1.32%</td>
                    </tr>
                    <tr className="hover:bg-zinc-900/50 transition-colors">
                      <td className="p-4 font-bold text-white">USDC/USDT</td>
                      <td className="p-4"><span className="text-cyan-400 bg-cyan-400/10 px-2 py-1 rounded">YIELD</span></td>
                      <td className="p-4 text-right">1.0000</td>
                      <td className="p-4 text-right text-zinc-400">1.0001</td>
                      <td className="p-4 text-right text-cyan-400 font-bold">+12.4% APY</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Right Col: Operations & Danger Zone */}
        <div className="space-y-6">
          <motion.div variants={itemVariants}>
            <Card className="bg-[#111827] border border-zinc-800 p-6">
               <h3 className="text-white font-bold uppercase tracking-widest text-sm mb-6 flex items-center gap-2">
                 <RefreshCw className="w-4 h-4 text-zinc-400" />
                 Sweeper Status
               </h3>
               
               <div className="space-y-4">
                 <div className="bg-black/50 p-4 rounded-lg border border-zinc-800">
                    <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1">E-Commerce Winst Vandaag</p>
                    <p className="text-xl font-bold text-white font-mono">€ 420.50</p>
                 </div>
                 
                 <div className="flex items-center justify-center p-2">
                    <div className="w-[1px] h-8 bg-gradient-to-b from-zinc-800 to-emerald-500/50"></div>
                 </div>

                 <div className="bg-emerald-500/10 p-4 rounded-lg border border-emerald-500/30">
                    <p className="text-xs text-emerald-500 uppercase tracking-widest mb-1">Volgende Sweep Naar Binance</p>
                    <p className="text-lg font-bold text-emerald-400 font-mono">00:00:00 (Midnight)</p>
                 </div>
               </div>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
             <Card className={`p-6 transition-all duration-500 ${isAggressive ? 'bg-red-950/20 border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.15)]' : 'bg-black border-zinc-800'}`}>
                <div className="flex items-center gap-3 mb-4">
                  {isAggressive ? <Crosshair className="w-6 h-6 text-red-500 animate-pulse" /> : <ShieldAlert className="w-6 h-6 text-zinc-600" />}
                  <h3 className={`font-bold uppercase tracking-widest text-sm ${isAggressive ? 'text-red-500' : 'text-zinc-500'}`}>
                    Risico Profiel
                  </h3>
                </div>
                
                <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
                  {isAggressive 
                    ? "Gamble Mode is ACTIEF. De AI gebruikt 50% van de Swept Funds voor High-Frequency 10x+ Leverage trades. Hoge winst, hoog risico." 
                    : "Conservative Mode is ACTIEF. 90% van de fondsen zit in veilige Yield Farming (Stablecoins). Slechts 10% spot-trading."}
                </p>

                <Button className={`w-full font-black tracking-widest uppercase transition-all ${isAggressive ? 'bg-red-600 hover:bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]' : 'bg-zinc-800 hover:bg-zinc-700 text-white'}`}>
                  {isAggressive ? "HALT ALL TRADING" : "ACTIVATE APEX MODE"}
                </Button>
             </Card>
          </motion.div>
        </div>

      </div>
    </motion.div>
  );
}
