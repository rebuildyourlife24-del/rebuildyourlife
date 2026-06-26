'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { 
  Shield, 
  Activity, 
  Skull, 
  Terminal, 
  Cpu, 
  Network, 
  Zap, 
  Lock, 
  ChevronRight, 
  Crosshair, 
  Command,
  TrendingUp,
  Volume2,
  Tv,
  DollarSign,
  Heart,
  Layers,
  FileText,
  RefreshCw
} from 'lucide-react';
import { NeuralSwarm } from '@/components/ui/NeuralSwarm';
import { getWarRoomStatsAction } from '@/app/actions/warRoomData';

// Reusable components
function Monitor1Content({ data }: { data: any }) {
  if (!data) {
    return <div className="text-zinc-500 font-mono text-xs p-4 border border-dashed border-zinc-800 flex justify-center uppercase">Waiting for API Sync...</div>;
  }
  return (
    <div className="space-y-6 font-mono text-sm">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-black/80 p-4 border border-navy/40 rounded-xl">
          <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Total Vault Balance</div>
          <div className="text-2xl font-black text-emerald-500">'{(data?.totalVaultBalance || 0).toLocaleString('nl-NL')}</div>
        </div>
        <div className="bg-black/80 p-4 border border-navy/40 rounded-xl">
          <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Active Debt Burden</div>
          <div className="text-2xl font-black text-gold">'{(data?.totalDebt || 0).toLocaleString('nl-NL')}</div>
        </div>
      </div>

      <div className="bg-black/60 p-4 border border-navy/20 rounded-xl space-y-3">
        <div className="text-xs font-bold text-white uppercase tracking-widest border-b border-white/5 pb-1 flex justify-between">
          <span>Monthly Income Matrix</span>
          <span className="text-emerald-500">Active</span>
        </div>
        {data?.incomeStreams?.map((stream: any, i: number) => (
          <div key={i} className="flex justify-between items-center bg-zinc-950 p-2 rounded">
             <span className="text-zinc-400 text-[11px] uppercase tracking-wider">{stream.name}</span>
             <span className="text-emerald-400 font-bold">'{stream.amount.toLocaleString('nl-NL')}</span>
          </div>
        )) || <div className="text-zinc-600 text-[10px] uppercase">No active streams found in live database</div>}
      </div>
    </div>
  );
}

function Monitor2Content({ data }: { data: any }) {
  if (!data) return <div className="text-zinc-500">...</div>;
  return (
    <div className="space-y-4 font-mono text-xs h-full flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-2">
           <span className="text-cyan-400 uppercase tracking-widest font-bold">Active Opportunities</span>
           <Badge className="bg-cyan-950/50 text-cyan-500">{data?.opportunities?.length || 0} Open</Badge>
        </div>
        
        <div className="space-y-2">
           {data?.opportunities?.map((opp: any, i: number) => (
              <div key={i} className="bg-black/50 p-3 border border-white/5 rounded flex justify-between items-center group hover:border-cyan-500/30 transition-colors">
                 <div>
                    <div className="text-white font-bold">{opp.title}</div>
                    <div className="text-[10px] text-zinc-500">{opp.type}</div>
                 </div>
                 <div className="text-cyan-400 font-black">+'{opp.estValue.toLocaleString()}</div>
              </div>
           )) || <div className="text-zinc-600 uppercase text-[10px] py-4 text-center">No opportunities matched by Orion engine</div>}
        </div>
      </div>
    </div>
  );
}

function Monitor3Content({ data }: { data: any }) {
  if (!data) return <div className="text-zinc-500">...</div>;
  return (
    <div className="space-y-4 font-mono text-xs">
       <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-2">
           <span className="text-red-400 uppercase tracking-widest font-bold">Threat & Risk Analysis</span>
           <Activity className="w-4 h-4 text-red-500 animate-pulse" />
        </div>
        
        <div className="grid grid-cols-1 gap-2">
           <div className="bg-red-950/10 border border-red-900/30 p-3 rounded">
              <div className="text-[10px] text-red-500 mb-1">Global System Threat Level</div>
              <div className="text-xl font-black text-red-400">{data?.threatLevel || 'SECURE'}</div>
           </div>
           
           <div className="mt-4 space-y-2">
              <div className="text-[10px] text-zinc-500 uppercase">Recent Flags</div>
              {data?.alerts?.map((alert: any, i: number) => (
                 <div key={i} className="flex gap-2 text-[10px] bg-black p-2 border-l-2 border-red-500">
                    <span className="text-red-500">[{alert.time}]</span>
                    <span className="text-zinc-300">{alert.message}</span>
                 </div>
              )) || <div className="text-emerald-500 text-[10px] bg-emerald-950/20 p-2">ALL SYSTEMS NOMINAL</div>}
           </div>
        </div>
    </div>
  );
}

function WarRoomCore() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const monitorParam = searchParams.get('m');
  
  const [data, setData] = useState<any>(null);
  const [systemLoad, setSystemLoad] = useState(12);
  const [isReady, setIsReady] = useState(false);
  
  // Real data fetching instead of intervals that fake data
  useEffect(() => {
    async function fetchLiveData() {
      try {
        const stats = await getWarRoomStatsAction();
        setData(stats);
        setIsReady(true);
      } catch (err) {
        console.error("War room API failed:", err);
      }
    }
    fetchLiveData();
    
    // Poll every 30 seconds for real data
    const interval = setInterval(fetchLiveData, 30000);
    return () => clearInterval(interval);
  }, []);

  // System load visualizer (real metric would come from API, fallback to minor jitter for visual 'active' effect)
  useEffect(() => {
    const loadInterval = setInterval(() => {
       if (data && data.systemLoad) {
           // Base it on real data but give it a "live" feel
           setSystemLoad(l => {
              const base = data.systemLoad;
              const jitter = Math.floor(Math.random() * 5) - 2; // -2 to +2
              return Math.max(0, Math.min(100, base + jitter));
           });
       }
    }, 2000);
    return () => clearInterval(loadInterval);
  }, [data]);

  return (
    <div className="min-h-screen bg-[#020202] text-white p-2 md:p-6 font-mono overflow-hidden relative selection:bg-cyan-500/30 selection:text-white pb-20 md:pb-6">
      {/* Background GRID */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] opacity-30 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-900/10 blur-[150px] rounded-full pointer-events-none" />

      {/* HEADER COMMAND BAR */}
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 bg-black/60 backdrop-blur-md p-4 rounded-xl border border-white/10">
         <div className="flex items-center gap-4">
            <Command className="w-8 h-8 text-cyan-500" />
            <div>
               <h1 className="text-xl md:text-2xl font-black uppercase tracking-widest flex items-center gap-3">
                 COMMAND CENTER <span className="bg-red-500 text-black text-[9px] px-2 py-0.5 rounded-sm animate-pulse">LIVE</span>
               </h1>
               <div className="text-[10px] text-zinc-500 flex gap-4 mt-1">
                  <span>LATENCY: 12ms</span>
                  <span>ENCRYPTION: AES-256</span>
                  <span className="text-cyan-500">NODE: ALPHA-1</span>
               </div>
            </div>
         </div>
         
         <div className="flex gap-4">
            <div className="text-right">
               <div className="text-[10px] text-zinc-500 uppercase">System Load</div>
               <div className="text-cyan-400 font-bold">{systemLoad}%</div>
            </div>
            <div className="w-24 h-8 bg-zinc-900 rounded overflow-hidden relative flex items-end opacity-80">
               {/* Visualizer bars */}
               {[...Array(12)].map((_, i) => (
                  <div key={i} className="flex-1 bg-cyan-500/50 mx-[1px]" style={{ height: `${Math.random() * 100}%`, transition: 'height 0.2s' }} />
               ))}
            </div>
         </div>
      </div>

      {/* MONITOR GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10 mb-8 h-auto lg:h-[65vh]">
         {/* MONITOR 1: Finance / Core */}
         <div 
            onClick={() => router.push('/dashboard/war-room?m=1', { scroll: false })}
            className={`bg-[#050505]/80 border ${monitorParam === '1' ? 'border-cyan-500 shadow-[0_0_30px_rgba(6,182,212,0.15)] scale-[1.02]' : 'border-white/10 hover:border-white/20'} rounded-xl p-6 transition-all cursor-pointer backdrop-blur-sm flex flex-col`}
         >
            <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
               <div className="flex items-center gap-2 text-cyan-400 font-bold uppercase tracking-widest text-xs">
                 <DollarSign className="w-4 h-4" /> MONITOR 01: FISCAL
               </div>
               <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
            </div>
            <div className="flex-1 overflow-y-auto hide-scrollbar pr-2">
               {!isReady ? <RefreshCw className="w-6 h-6 animate-spin text-zinc-700 mx-auto mt-10" /> : <Monitor1Content data={data} />}
            </div>
         </div>

         {/* MONITOR 2: Central Swarm AI */}
         <div 
            onClick={() => router.push('/dashboard/war-room?m=2', { scroll: false })}
            className={`bg-[#050505]/80 border ${monitorParam === '2' ? 'border-gold shadow-[0_0_30px_rgba(212,175,55,0.15)] scale-[1.02]' : 'border-white/10 hover:border-white/20'} rounded-xl p-6 transition-all cursor-pointer backdrop-blur-sm flex flex-col`}
         >
            <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
               <div className="flex items-center gap-2 text-gold font-bold uppercase tracking-widest text-xs">
                 <Network className="w-4 h-4" /> MONITOR 02: ORION & SWARM
               </div>
               <div className="text-[9px] bg-gold/20 text-gold px-2 py-1 rounded">SYNCED</div>
            </div>
            
            <div className="flex-1 flex flex-col items-center justify-center relative">
               <div className="absolute inset-0 z-0 opacity-40">
                  <NeuralSwarm theme="gold" />
               </div>
               <div className="relative z-10 w-full mt-auto">
                  {!isReady ? <RefreshCw className="w-6 h-6 animate-spin text-zinc-700 mx-auto mb-4" /> : <Monitor2Content data={data} />}
               </div>
            </div>
         </div>

         {/* MONITOR 3: Security & Threats */}
         <div 
            onClick={() => router.push('/dashboard/war-room?m=3', { scroll: false })}
            className={`bg-[#050505]/80 border ${monitorParam === '3' ? 'border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.15)] scale-[1.02]' : 'border-white/10 hover:border-white/20'} rounded-xl p-6 transition-all cursor-pointer backdrop-blur-sm flex flex-col`}
         >
            <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
               <div className="flex items-center gap-2 text-red-500 font-bold uppercase tracking-widest text-xs">
                 <Shield className="w-4 h-4" /> MONITOR 03: SECURITY
               </div>
               <div className="w-2 h-2 rounded-full bg-red-500" />
            </div>
            <div className="flex-1 overflow-y-auto hide-scrollbar pr-2">
               {!isReady ? <RefreshCw className="w-6 h-6 animate-spin text-zinc-700 mx-auto mt-10" /> : <Monitor3Content data={data} />}
            </div>
         </div>
      </div>
      
      {/* QUICK ACTIONS BAR */}
      <div className="relative z-10 bg-black/80 border border-white/10 rounded-xl p-4 flex justify-between items-center overflow-x-auto gap-4 hide-scrollbar">
         <button className="flex-shrink-0 bg-white hover:bg-zinc-200 text-black px-6 py-2 text-xs font-black uppercase tracking-widest transition-colors flex items-center gap-2 rounded">
            <Zap className="w-4 h-4 fill-black" /> EXECUTE PROTOCOL OMEGA
         </button>
         
         <div className="flex gap-4">
            <button className="text-[10px] text-zinc-400 hover:text-white uppercase tracking-widest border border-white/10 px-4 py-2 rounded transition-colors flex items-center gap-2">
               <FileText className="w-3 h-3" /> EXPORT LOGS
            </button>
            <button className="text-[10px] text-red-400 hover:bg-red-950 hover:text-red-300 uppercase tracking-widest border border-red-900/50 px-4 py-2 rounded transition-colors flex items-center gap-2">
               <Lock className="w-3 h-3" /> LOCKDOWN
            </button>
         </div>
      </div>
    </div>
  );
}

export default function WarRoomPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#020202] text-white flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full" /></div>}>
      <WarRoomCore />
    </Suspense>
  );
}
