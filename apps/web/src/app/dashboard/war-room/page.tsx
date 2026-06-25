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
  FileText
} from 'lucide-react';
import { NeuralSwarm } from '@/components/ui/NeuralSwarm';
import { getWarRoomStatsAction } from '@/app/actions/warRoomData';

// Reusable components
function Monitor1Content({ data }: { data: any }) {
  return (
    <div className="space-y-6 font-mono text-sm">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-black/80 p-4 border border-navy/40 rounded-xl">
          <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Total Vault Balance</div>
          <div className="text-2xl font-black text-emerald-500">€{(data?.totalVaultBalance || 752500).toLocaleString('nl-NL')}</div>
        </div>
        <div className="bg-black/80 p-4 border border-navy/40 rounded-xl">
          <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Active Debt Burden</div>
          <div className="text-2xl font-black text-gold">€{(data?.totalDebt || 0).toLocaleString('nl-NL')}</div>
        </div>
      </div>

      <div className="bg-black/60 p-4 border border-navy/20 rounded-xl space-y-3">
        <div className="text-xs font-bold text-white uppercase tracking-widest border-b border-white/5 pb-1 flex justify-between">
          <span>Monthly Income Matrix</span>
          <span className="text-emerald-500">Active</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-zinc-500">INFLOW (SaaS + Cut)</span>
          <span className="text-white font-bold">€{(data?.monthlyIncome || 12450).toLocaleString('nl-NL')}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-zinc-500">OUTFLOW (Ops + Hosting)</span>
          <span className="text-zinc-400">€{(data?.monthlyExpenses || 3200).toLocaleString('nl-NL')}</span>
        </div>
        <div className="flex justify-between text-xs border-t border-white/5 pt-2 font-bold">
          <span className="text-zinc-400">NET CASH VELOCITY</span>
          <span className="text-emerald-400">+€{((data?.monthlyIncome || 12450) - (data?.monthlyExpenses || 3200)).toLocaleString('nl-NL')}</span>
        </div>
      </div>

      <div className="bg-black/30 p-3 rounded-lg border border-navyLight/10 text-[10px] text-zinc-500 uppercase tracking-wider flex justify-between items-center">
        <span>Treasury Vaults Count: {data?.vaultsCount || 0}</span>
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
      </div>
    </div>
  );
}

function Monitor2Content({ data }: { data: any }) {
  return (
    <div className="space-y-6 font-mono text-sm">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-black/80 p-4 border border-navy/40 rounded-xl">
          <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Franchise Platform Cut</div>
          <div className="text-2xl font-black text-amber-500">25.0%</div>
        </div>
        <div className="bg-black/80 p-4 border border-navy/40 rounded-xl">
          <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Accumulated Tol Fees</div>
          <div className="text-2xl font-black text-emerald-400">€{(data?.totalPlatformRevenue || 4350).toLocaleString('nl-NL')}</div>
        </div>
      </div>

      <div className="bg-black/60 p-4 border border-navy/20 rounded-xl space-y-2">
        <div className="text-xs font-bold text-white uppercase tracking-widest border-b border-white/5 pb-1">Traffic Pipelines</div>
        <div className="flex justify-between text-xs">
          <span className="text-zinc-500">Active Shopify Stores</span>
          <span className="text-white font-bold">{data?.shopifyStoresCount || 0}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-zinc-500">Active PR Campaigns</span>
          <span className="text-white font-bold">{data?.prCampaignsCount || 0}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-zinc-500">Syndicate Social Posts</span>
          <span className="text-white font-bold">{data?.syndicatePostsCount || 0}</span>
        </div>
      </div>

      <div className="text-[10px] text-gold/80 bg-navy/10 p-2.5 rounded border border-navy/40 flex items-center justify-between">
        <span className="animate-pulse">PR TRAFFIC MULTICASTER ONLINE</span>
        <Activity className="w-3.5 h-3.5" />
      </div>
    </div>
  );
}

function Monitor3Content() {
  const [renderProgress, setRenderProgress] = useState(78);
  useEffect(() => {
    const timer = setInterval(() => {
      setRenderProgress(p => (p >= 100 ? 0 : p + 2));
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-6 font-mono text-sm">
      <div className="bg-black/80 p-4 border border-navy/40 rounded-xl space-y-2">
        <div className="text-[10px] text-zinc-500 uppercase tracking-wider">Video rendering queue</div>
        <div className="flex justify-between items-center text-xs">
          <span className="text-zinc-300">FACELLESS_PROMO_V2.mp4</span>
          <span className="text-goldLight font-bold">{renderProgress}%</span>
        </div>
        <div className="w-full bg-zinc-950 h-1.5 rounded-full overflow-hidden border border-navyLight/30">
          <div className="bg-gold h-full transition-all duration-500" style={{ width: `${renderProgress}%` }}></div>
        </div>
      </div>

      <div className="bg-black/60 p-4 border border-navy/20 rounded-xl space-y-2 text-xs">
        <div className="text-xs font-bold text-white uppercase tracking-widest border-b border-white/5 pb-1">FFmpeg Live Parameters</div>
        <div className="flex justify-between">
          <span className="text-zinc-500">Analog Tape Noise Jitter</span>
          <span className="text-emerald-500">0.08Hz [ENABLED]</span>
        </div>
        <div className="flex justify-between">
          <span className="text-zinc-500">Handheld Shake Jitter</span>
          <span className="text-emerald-500">Amplitude 1.2 [ENABLED]</span>
        </div>
        <div className="flex justify-between">
          <span className="text-zinc-500">Audio Room EQ Reverb</span>
          <span className="text-zinc-400">Decay 0.4s [OK]</span>
        </div>
        <div className="flex justify-between">
          <span className="text-zinc-500">Encoding Speed</span>
          <span className="text-amber-500">4.5x Realtime</span>
        </div>
      </div>

      <div className="text-[9px] text-zinc-500 leading-tight">
        * Dynamic filter pipeline applied automatically to simulate physical imperfection (grain, chromatic aberration).
      </div>
    </div>
  );
}

function Monitor4Content({ data }: { data: any }) {
  return (
    <div className="space-y-6 font-mono text-sm">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-black/80 p-4 border border-navy/40 rounded-xl">
          <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Circadian Sleep Score</div>
          <div className="text-2xl font-black text-emerald-400">{data?.latestHealthLog?.sleepScore || 88}/100</div>
        </div>
        <div className="bg-black/80 p-4 border border-navy/40 rounded-xl">
          <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Routines Completed</div>
          <div className="text-2xl font-black text-white">{data?.pendingTasksCount === 0 ? "100%" : `${data?.pendingTasksCount || 4} Tasks Left`}</div>
        </div>
      </div>

      <div className="bg-black/60 p-4 border border-navy/20 rounded-xl space-y-2 text-xs">
        <div className="text-xs font-bold text-white uppercase tracking-widest border-b border-white/5 pb-1">Biological Metrics</div>
        <div className="flex justify-between">
          <span className="text-zinc-500">Active Rebuild Programs</span>
          <span className="text-white font-bold">{data?.activeProgramsCount || 1}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-zinc-500">Current Program Progress</span>
          <span className="text-zinc-300 font-bold">{data?.programProgress || 45}%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-zinc-500">Water Consumption target</span>
          <span className="text-zinc-400">{data?.latestHealthLog?.waterMl || 3000} ml / 3000 ml</span>
        </div>
        <div className="flex justify-between">
          <span className="text-zinc-500">Daily Steps Target</span>
          <span className="text-emerald-500 font-bold">{data?.latestHealthLog?.steps || 10500} / 10000</span>
        </div>
      </div>

      <div className="bg-black/30 p-2.5 rounded border border-navy/20 text-[10px] text-zinc-500 uppercase tracking-wider flex justify-between items-center">
        <span>Cognitive state: OPTIMAL</span>
        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
      </div>
    </div>
  );
}

function Monitor5Content({ data }: { data: any }) {
  return (
    <div className="space-y-6 font-mono text-sm">
      <div className="bg-black/60 p-4 border border-navy/20 rounded-xl space-y-3">
        <div className="text-xs font-bold text-white uppercase tracking-widest border-b border-white/5 pb-1 flex justify-between">
          <span>AI Taskforce Uplink</span>
          <span className="text-emerald-500">Synchronized</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-zinc-500">Synthetic Operators Load</span>
          <span className="text-white">5 Active Workers</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-zinc-500">Orion Neural Link Uptime</span>
          <span className="text-emerald-400">99.98%</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-zinc-500">Clearance API Keys</span>
          <span className="text-zinc-400">{data?.apiKeysCount || 1} Active</span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Recent System Actions</div>
        <div className="bg-black/80 rounded-xl border border-navy/30 p-3 max-h-[120px] overflow-y-auto space-y-1.5 custom-scrollbar text-[11px]">
          {data?.recentLogs && data.recentLogs.length > 0 ? (
            data.recentLogs.map((log: any) => (
              <div key={log.id} className="flex justify-between text-zinc-400 border-b border-white/5 pb-0.5">
                <span className="truncate max-w-[160px] text-gold/80 font-bold">{log.action}</span>
                <span className="text-[10px] text-zinc-600 font-mono">{log.entityType}</span>
              </div>
            ))
          ) : (
            <div className="text-zinc-600 text-center py-2">No recent events recorded.</div>
          )}
        </div>
      </div>
    </div>
  );
}

function WarRoomGrid() {
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [jblSoundbarConnected, setJblSoundbarConnected] = useState(true);
  const [systemLoad, setSystemLoad] = useState(12);

  // Poll database stats
  useEffect(() => {
    const fetchStats = async () => {
      const res = await getWarRoomStatsAction();
      if (res.success) {
        setStats(res.stats);
      }
    };
    fetchStats();
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, []);

  // System load oscillation simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemLoad(l => Math.max(8, Math.min(25, l + (Math.random() > 0.5 ? 1 : -1))));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-[1800px] mx-auto min-h-[85vh] flex flex-col font-sans relative z-10">
      
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-6 mb-8 relative">
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gold/80 to-transparent"></div>
        
        <div className="flex items-center gap-6 px-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gold blur-xl opacity-20 animate-pulse"></div>
            <div className="w-14 h-14 bg-black border border-gold/40 flex items-center justify-center rounded-2xl relative z-10 shadow-[inset_0_0_20px_rgba(255,0,51,0.2)]">
              <Skull className="w-8 h-8 text-gold" />
            </div>
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-red-100 to-zinc-500 tracking-tighter">
              Sovereign Command Grid
            </h1>
            <p className="text-gold uppercase tracking-[0.3em] text-[10px] font-bold mt-2 flex items-center gap-2 font-mono">
              <span className="w-2 h-2 rounded-full bg-gold animate-pulse shadow-[0_0_8px_rgba(255,0,51,0.8)]"></span>
              Cockpit mode: Laptop grid active
            </p>
          </div>
        </div>

        {/* Global Settings & Physical Connections */}
        <div className="mt-6 md:mt-0 px-4 flex flex-wrap gap-4 items-center">
          {/* JBL Soundbar integration */}
          <div className="flex items-center gap-2.5 bg-black/80 border border-navy/40 px-4 py-2 rounded-xl text-xs font-mono">
            <Volume2 className={`w-4 h-4 ${jblSoundbarConnected ? 'text-gold animate-pulse' : 'text-zinc-500'}`} />
            <div>
              <div className="text-[8px] text-zinc-500 uppercase">JBL Soundbar 5.1</div>
              <div className="text-white font-bold">{jblSoundbarConnected ? 'CONNECTED' : 'DISCONNECTED'}</div>
            </div>
          </div>

          {/* System Load */}
          <div className="flex items-center gap-2.5 bg-black/80 border border-navy/40 px-4 py-2 rounded-xl text-xs font-mono">
            <Activity className="w-4 h-4 text-gold" />
            <div>
              <div className="text-[8px] text-zinc-500 uppercase">System Sync Load</div>
              <div className="text-white font-bold">{systemLoad}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of the 5 TV Screens */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 pb-8">
        
        {/* MONITOR 1: CAPITAL & WEALTH */}
        <div className="bg-[#050505] border border-navyLight/20 rounded-[2rem] hover:border-gold/40 transition-all duration-500 p-8 flex flex-col justify-between group relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full blur-2xl pointer-events-none"></div>
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-gold" />
                Monitor 1: Wealth & Capital
              </h3>
              <button 
                onClick={() => window.open('/dashboard/war-room?monitor=1', '_blank')}
                className="p-2 border border-navyLight/30 rounded-lg hover:bg-navy/20 transition-colors"
                title="Fullscreen Monitor View"
              >
                <Tv className="w-4 h-4 text-gold" />
              </button>
            </div>
            <Monitor1Content data={stats?.monitor1} />
          </div>
          <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center text-[10px] text-zinc-500 font-mono">
            <span>Uplink Secure</span>
            <span>TV CAST 1</span>
          </div>
        </div>

        {/* MONITOR 2: SYNDICATE & TRAFFIC */}
        <div className="bg-[#050505] border border-navyLight/20 rounded-[2rem] hover:border-gold/40 transition-all duration-500 p-8 flex flex-col justify-between group relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full blur-2xl pointer-events-none"></div>
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Network className="w-5 h-5 text-gold" />
                Monitor 2: Syndicate Ops
              </h3>
              <button 
                onClick={() => window.open('/dashboard/war-room?monitor=2', '_blank')}
                className="p-2 border border-navyLight/30 rounded-lg hover:bg-navy/20 transition-colors"
                title="Fullscreen Monitor View"
              >
                <Tv className="w-4 h-4 text-gold" />
              </button>
            </div>
            <Monitor2Content data={stats?.monitor2} />
          </div>
          <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center text-[10px] text-zinc-500 font-mono">
            <span>Uplink Secure</span>
            <span>TV CAST 2</span>
          </div>
        </div>

        {/* MONITOR 3: CONTENT & VIDEO GENERATION */}
        <div className="bg-[#050505] border border-navyLight/20 rounded-[2rem] hover:border-gold/40 transition-all duration-500 p-8 flex flex-col justify-between group relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full blur-2xl pointer-events-none"></div>
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Cpu className="w-5 h-5 text-gold" />
                Monitor 3: Content Forge
              </h3>
              <button 
                onClick={() => window.open('/dashboard/war-room?monitor=3', '_blank')}
                className="p-2 border border-navyLight/30 rounded-lg hover:bg-navy/20 transition-colors"
                title="Fullscreen Monitor View"
              >
                <Tv className="w-4 h-4 text-gold" />
              </button>
            </div>
            <Monitor3Content />
          </div>
          <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center text-[10px] text-zinc-500 font-mono">
            <span>FFmpeg Rendering Active</span>
            <span>TV CAST 3</span>
          </div>
        </div>

        {/* MONITOR 4: VITALITY & HEALTH */}
        <div className="bg-[#050505] border border-navyLight/20 rounded-[2rem] hover:border-gold/40 transition-all duration-500 p-8 flex flex-col justify-between group relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full blur-2xl pointer-events-none"></div>
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Heart className="w-5 h-5 text-gold" />
                Monitor 4: Vitality Core
              </h3>
              <button 
                onClick={() => window.open('/dashboard/war-room?monitor=4', '_blank')}
                className="p-2 border border-navyLight/30 rounded-lg hover:bg-navy/20 transition-colors"
                title="Fullscreen Monitor View"
              >
                <Tv className="w-4 h-4 text-gold" />
              </button>
            </div>
            <Monitor4Content data={stats?.monitor4} />
          </div>
          <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center text-[10px] text-zinc-500 font-mono">
            <span>Uplink Secure</span>
            <span>TV CAST 4</span>
          </div>
        </div>

        {/* MONITOR 5: SOVEREIGN CORE & AI */}
        <div className="bg-[#050505] border border-navyLight/20 rounded-[2rem] hover:border-gold/40 transition-all duration-500 p-8 flex flex-col justify-between group relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full blur-2xl pointer-events-none"></div>
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-gold" />
                Monitor 5: Overseer System
              </h3>
              <button 
                onClick={() => window.open('/dashboard/war-room?monitor=5', '_blank')}
                className="p-2 border border-navyLight/30 rounded-lg hover:bg-navy/20 transition-colors"
                title="Fullscreen Monitor View"
              >
                <Tv className="w-4 h-4 text-gold" />
              </button>
            </div>
            <Monitor5Content data={stats?.monitor5} />
          </div>
          <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center text-[10px] text-zinc-500 font-mono">
            <span>Uplink Secure</span>
            <span>TV CAST 5</span>
          </div>
        </div>

        {/* COMPONENT 6: PHYSICAL CONTROLLER WIDGET */}
        <div className="bg-[#050505] border border-zinc-900 rounded-[2rem] p-8 flex flex-col justify-between group relative overflow-hidden shadow-2xl border-dashed">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,0,0,0.02)_0%,transparent_70%)] pointer-events-none"></div>
          <div>
            <h3 className="text-xl font-bold text-zinc-400 mb-4 flex items-center gap-2">
              <Command className="w-5 h-5 text-zinc-500" />
              Homebase Matrix Control
            </h3>
            <p className="text-xs text-zinc-500 leading-relaxed font-mono">
              Dit controlecentrum is ontwikkeld om gedistribueerd te worden over 5 monitoren/TVs in je thuisbasis. Open de URL's op je TV screens om ze live te synchroniseren.
            </p>
            
            <div className="mt-6 space-y-2.5">
              <button 
                onClick={() => {
                  for (let i = 1; i <= 5; i++) {
                    window.open(`/dashboard/war-room?monitor=${i}`, `TV_Monitor_${i}`);
                  }
                }}
                className="w-full bg-navyLight/20 hover:bg-gold hover:text-black border border-gold/30 text-goldLight font-bold font-mono py-3 rounded-xl transition-all duration-300 text-xs tracking-wider uppercase"
              >
                Launch all 5 screens in new tabs
              </button>
            </div>
          </div>
          <div className="text-[10px] font-mono text-zinc-600 flex justify-between mt-6">
            <span>MATRIX V1.0</span>
            <span>ACTIVE OPERATOR</span>
          </div>
        </div>

      </div>
    </div>
  );
}

function DedicatedMonitorView({ monitorNumber }: { monitorNumber: number }) {
  const [stats, setStats] = useState<any>(null);
  const [currentTime, setCurrentTime] = useState('');

  // Poll stats
  useEffect(() => {
    const fetchStats = async () => {
      const res = await getWarRoomStatsAction();
      if (res.success) {
        setStats(res.stats);
      }
    };
    fetchStats();
    const interval = setInterval(fetchStats, 3000);
    return () => clearInterval(interval);
  }, []);

  // Time update for clock
  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString('nl-NL'));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const getMonitorTitle = () => {
    switch (monitorNumber) {
      case 1: return 'Capital & Wealth';
      case 2: return 'Syndicate Ops';
      case 3: return 'Content Forge (FFmpeg)';
      case 4: return 'Vitality Core';
      case 5: return 'Overseer System';
      default: return 'Command Grid';
    }
  };

  const renderMonitorContent = () => {
    switch (monitorNumber) {
      case 1: return <Monitor1Content data={stats?.monitor1} />;
      case 2: return <Monitor2Content data={stats?.monitor2} />;
      case 3: return <Monitor3Content />;
      case 4: return <Monitor4Content data={stats?.monitor4} />;
      case 5: return <Monitor5Content data={stats?.monitor5} />;
      default: return <div className="text-center font-mono">Loading data stream...</div>;
    }
  };

  return (
    <div className="fixed inset-0 bg-black text-white flex flex-col font-sans z-[999] overflow-hidden select-none selection:bg-transparent p-12">
      {/* High-tech Grid overlay */}
      <div className="absolute inset-0 bg-[size:64px_64px] pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,0,51,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,0,51,0.5) 1px, transparent 1px)' }}></div>
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gold/[0.03] rounded-full blur-3xl pointer-events-none"></div>

      {/* Screen Header */}
      <div className="flex justify-between items-center border-b border-navyLight/30 pb-6 mb-8 font-mono">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-navy/20 border border-gold/40 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(255,0,51,0.1)]">
            <Tv className="w-5 h-5 text-gold" />
          </div>
          <div>
            <div className="text-[10px] text-zinc-500 uppercase tracking-widest">Sovereign Wall Monitor</div>
            <div className="text-xl font-black uppercase tracking-wider text-gold">Monitor {monitorNumber}: {getMonitorTitle()}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-zinc-500 uppercase tracking-widest">Local Time (Uplink)</div>
          <div className="text-xl font-bold tracking-widest">{currentTime}</div>
        </div>
      </div>

      {/* Content Space (Expanded for Wall Display) */}
      <div className="flex-1 flex flex-col justify-center max-w-5xl mx-auto w-full relative z-10 scale-[1.3] transform origin-center">
        <div className="bg-[#050505] border border-navyLight/30 rounded-[2.5rem] p-12 shadow-2xl relative">
          <div className="absolute top-4 right-6 flex gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-navy"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-gold animate-pulse"></span>
          </div>
          {renderMonitorContent()}
        </div>
      </div>

      {/* Screen Footer */}
      <div className="border-t border-navyLight/30 pt-6 mt-8 flex justify-between items-center font-mono text-xs text-zinc-500">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-gold animate-ping"></span>
          <span className="uppercase tracking-widest">Live telemetry stream active</span>
        </div>
        <div className="uppercase tracking-widest">REBUILD YOUR LIFE NETWORK // MATRIX 1.0</div>
      </div>
    </div>
  );
}

function WarRoomCore() {
  const searchParams = useSearchParams();
  const monitor = searchParams ? searchParams.get('monitor') : null;

  if (monitor) {
    const num = parseInt(monitor, 10);
    if (num >= 1 && num <= 5) {
      return <DedicatedMonitorView monitorNumber={num} />;
    }
  }

  return <WarRoomGrid />;
}

export default function WarRoomPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center font-mono text-zinc-500 text-sm">
        INITIALIZING COMMAND GRID...
      </div>
    }>
      <WarRoomCore />
    </Suspense>
  );
}
