'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  Video, 
  BarChart3, 
  RefreshCw, 
  AlertTriangle, 
  Coins, 
  Flame, 
  Plus, 
  CheckCircle, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Sliders,
  Terminal,
  Tv,
  Cpu
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ProgressBar } from '@/components/ui/ProgressBar';

// Recharts imports for data visualization
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid 
} from 'recharts';

interface Campaign {
  id: string;
  campaignName: string;
  platform: string;
  totalViews: number;
  totalImpressions: number;
  status: string;
  mediaPath: string | null;
  budgetCredits: number;
  renderStatus: string;
  renderProgress: number;
  viewsHistory: Array<{ date: string; views: number; impressions: number }>;
  createdAt: string;
}

export default function TrafficPage() {
  const [credits, setCredits] = useState<number>(0);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  
  // Loading states
  const [isLoadingCredits, setIsLoadingCredits] = useState(true);
  const [isLoadingCampaigns, setIsLoadingCampaigns] = useState(true);
  const [isLaunching, setIsLaunching] = useState(false);
  const [isBuying, setIsBuying] = useState(false);
  const [isBoosting, setIsBoosting] = useState(false);

  // Forms
  const [campaignName, setCampaignName] = useState('');
  const [budget, setBudget] = useState(250);
  const [buyAmount, setBuyAmount] = useState(500);

  // Modals & Notifications
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showSandboxModal, setShowSandboxModal] = useState(false);
  const [sandboxTxId, setSandboxTxId] = useState('');
  const [sandboxCredits, setSandboxCredits] = useState(0);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch initial data
  useEffect(() => {
    fetchCredits();
    fetchCampaigns();
    
    // Check URL parameters for simulated payment completion
    const urlParams = new URLSearchParams(window.location.search);
    const simulatePayment = urlParams.get('simulate-payment');
    const tx = urlParams.get('tx');
    const creds = urlParams.get('credits');

    if (simulatePayment === 'true' && tx && creds) {
      setSandboxTxId(tx);
      setSandboxCredits(parseInt(creds));
      setShowSandboxModal(true);
      
      // Clean up URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    // Polling active/rendering campaigns
    const interval = setInterval(() => {
      pollCampaigns();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const addLog = (msg: string) => {
    setTerminalLogs(prev => [...prev.slice(-8), `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const fetchCredits = async () => {
    try {
      setIsLoadingCredits(true);
      const res = await fetch('/api/traffic');
      const json = await res.json();
      if (json.status === 'success') {
        setCredits(json.data.credits);
      }
    } catch (err) {
      console.error('Failed to fetch credits', err);
    } finally {
      setIsLoadingCredits(false);
    }
  };

  const fetchCampaigns = async () => {
    try {
      setIsLoadingCampaigns(true);
      const res = await fetch('/api/traffic/campaigns');
      const json = await res.json();
      if (json.status === 'success') {
        setCampaigns(json.data);
        if (json.data.length > 0 && !selectedCampaign) {
          setSelectedCampaign(json.data[0]);
        }
      }
    } catch (err) {
      console.error('Failed to fetch campaigns', err);
    } finally {
      setIsLoadingCampaigns(false);
    }
  };

  const pollCampaigns = async () => {
    try {
      const res = await fetch('/api/traffic/campaigns');
      const json = await res.json();
      if (json.status === 'success') {
        setCampaigns(json.data);
        // Update currently selected campaign details
        if (selectedCampaign) {
          const updated = json.data.find((c: Campaign) => c.id === selectedCampaign.id);
          if (updated) {
            setSelectedCampaign(updated);
          }
        }
      }
    } catch (err) {
      console.error('Campaign polling failed', err);
    }
  };

  const handleBuyCredits = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsBuying(true);
    setErrorMessage(null);
    addLog(`INITIATING AD-CREDIT TRANSACTION FOR ${buyAmount} CREDITS...`);

    try {
      const res = await fetch('/api/traffic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credits: buyAmount })
      });
      const json = await res.json();
      if (json.status === 'success') {
        addLog(`PAYMENT SESSION CREATED: REDIRECTING TO MOLLIE SANDBOX...`);
        setShowBuyModal(false);
        // In local development, this will redirect back to traffic page with query params
        window.location.href = json.data.checkoutUrl;
      } else {
        setErrorMessage(json.error || 'Failed to initiate purchase');
      }
    } catch (err) {
      setErrorMessage('Network error during payment initialization');
    } finally {
      setIsBuying(false);
    }
  };

  const handleCompleteSandboxPayment = async () => {
    setIsBuying(true);
    addLog(`CONFIRMING TRANSACTIE ${sandboxTxId} OP MOLLIE TEST GRID...`);
    try {
      const res = await fetch('/api/traffic/complete-purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ purchaseId: sandboxTxId })
      });
      const json = await res.json();
      if (json.status === 'success') {
        addLog(`SUCCESS: ${sandboxCredits} AD-CREDITS RECHARGE COMPLETED.`);
        setShowSandboxModal(false);
        fetchCredits();
      } else {
        setErrorMessage(json.error || 'Betaling kon niet worden voltooid.');
      }
    } catch (err) {
      setErrorMessage('Fout bij het communiceren met de Mollie simulator.');
    } finally {
      setIsBuying(false);
    }
  };

  const handleLaunchCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (credits < budget) {
      setErrorMessage(`Onvoldoende ad-credits. U heeft ${budget} credits nodig.`);
      return;
    }

    setIsLaunching(true);
    setErrorMessage(null);
    addLog(`QUEUEING TIKTOK VIDEO RENDER: "${campaignName.toUpperCase()}"...`);

    try {
      const res = await fetch('/api/traffic/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ campaignName, budgetCredits: budget })
      });
      const json = await res.json();
      if (json.status === 'success') {
        addLog(`RENDER ENGINE DEPLOYED. RESOURCE RESERVED: ${budget} CREDITS.`);
        setCampaignName('');
        setCredits(prev => prev - budget);
        fetchCampaigns();
      } else {
        setErrorMessage(json.error || 'Campaign launch failed');
      }
    } catch (err) {
      setErrorMessage('Network error. Failed to dispatch render agent.');
    } finally {
      setIsLaunching(false);
    }
  };

  const handleTriggerViral = async (campaignId: string) => {
    setIsBoosting(true);
    addLog(`WARNING: INJECTING VIRAL VECTOR ALGORITHM ON CAMPAIGN ID ${campaignId}...`);
    try {
      const res = await fetch(`/api/traffic/campaigns/${campaignId}/viral`, {
        method: 'POST'
      });
      const json = await res.json();
      if (json.status === 'success') {
        addLog(`ALGORITHM DEPLOYED: VIEWS HISTORY MASSIVELY ENHANCED.`);
        setSelectedCampaign(json.data);
        fetchCampaigns();
      }
    } catch (err) {
      console.error('Failed to trigger viral boost', err);
    } finally {
      setIsBoosting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto font-sans text-white min-h-[85vh] space-y-8 pb-12 select-none relative z-10">
      
      {/* Background glow */}
      <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-cyan-900/10 blur-[150px] rounded-full pointer-events-none -z-10"></div>

      {/* Top Banner / Future Blue Header */}
      <div className="bg-black/40 border border-white/5 rounded-2xl p-8 backdrop-blur-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-[0_0_50px_rgba(6,182,212,0.1)]">
        <div>
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-widest flex items-center gap-4 text-white">
            PR TRAFFIC ENGINE <Cpu className="w-8 h-8 text-cyan-400" />
          </h1>
          <p className="text-cyan-400/60 mt-2 text-xs md:text-sm uppercase font-bold tracking-widest">Autonome TikTok Ad & Video Render Factory • Fase 3 Imperial Expansion</p>
        </div>
        
        {/* Credits Widget */}
        <div className="bg-cyan-950/20 border border-cyan-500/30 rounded-xl p-5 min-w-[280px]">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] uppercase font-bold text-cyan-500 tracking-widest flex items-center gap-1.5">
              <Coins className="w-4 h-4" /> AD-CREDITS BALANCE
            </span>
          </div>
          <div className="text-4xl font-black text-white flex items-baseline gap-2 mb-4">
            {isLoadingCredits ? (
              <span className="animate-pulse opacity-50">---</span>
            ) : (
              <span>{credits}</span>
            )}
            <span className="text-xs text-zinc-500 uppercase tracking-widest">Credits</span>
          </div>
          <button 
            onClick={() => setShowBuyModal(true)}
            className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-black uppercase tracking-widest text-xs py-3 px-4 rounded-lg transition-all duration-200 flex justify-center items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Buy Ad-Credits (Mollie)
          </button>
        </div>
      </div>

      {/* Grid: Console / Control Panel & Campaign Listing */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Launch Campaign Panel */}
        <div className="lg:col-span-1 bg-black/40 border border-white/5 rounded-2xl p-6 backdrop-blur-md space-y-6">
          <h2 className="text-sm font-black uppercase tracking-widest border-b border-white/5 pb-4 flex items-center gap-2 text-white">
            <Sliders className="w-4 h-4 text-cyan-500" /> CAMPAIGN DEPLOYMENT
          </h2>

          <form onSubmit={handleLaunchCampaign} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest">Campaign Identifier</label>
              <input 
                type="text" 
                placeholder="e.g. DUBAI_HOOK_V1" 
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                required
                className="w-full bg-zinc-950 border border-white/10 rounded-xl focus:border-cyan-500/50 focus:outline-none px-4 py-3 text-white text-sm transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest">Platform Vector</label>
              <input 
                type="text" 
                disabled 
                value="TIKTOK ADS (VIDEO RENDERS)" 
                className="w-full bg-black/60 border border-white/5 rounded-xl px-4 py-3 text-cyan-500/50 text-xs font-bold tracking-widest"
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest">Ad Budget Allocation</label>
                <span className="text-xs text-cyan-400 font-bold">{budget} Credits</span>
              </div>
              <input 
                type="range" 
                min="50" 
                max="2000" 
                step="50"
                value={budget}
                onChange={(e) => setBudget(parseInt(e.target.value))}
                className="w-full accent-cyan-500 h-2 bg-zinc-900 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-cyan-400 [&::-webkit-slider-thumb]:rounded-full"
              />
              <div className="flex justify-between text-[9px] text-zinc-600 font-bold uppercase tracking-widest">
                <span>50 Cr (Micro)</span>
                <span>2000 Cr (Viral)</span>
              </div>
            </div>

            {errorMessage && (
              <div className="border border-red-500/30 bg-red-950/20 rounded-xl p-4 text-xs flex items-center gap-3 text-red-400">
                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium">{errorMessage}</span>
              </div>
            )}

            <button 
              type="submit" 
              disabled={isLaunching || !campaignName}
              className="w-full bg-white text-black hover:bg-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl font-bold uppercase tracking-widest py-3.5 transition-colors flex justify-center items-center gap-2"
            >
              {isLaunching ? 'DEPLOYING...' : '⚡ LAUNCH TIKTOK ADS'}
            </button>
          </form>

          {/* Mini Terminal Logs */}
          <div className="bg-black/60 border border-white/5 rounded-xl p-5">
            <h4 className="text-[9px] uppercase font-bold text-zinc-500 tracking-widest flex items-center gap-2 mb-3">
              <Terminal className="w-3.5 h-3.5" /> Terminal System Logs
            </h4>
            <div className="text-[10px] font-mono text-cyan-400/70 space-y-2 overflow-y-auto max-h-[160px] custom-scrollbar">
              {terminalLogs.length === 0 ? (
                <span className="text-zinc-600 font-medium">[SYSTEM IDLE. AWAITING OPERATION...]</span>
              ) : (
                terminalLogs.map((log, idx) => <div key={idx} className="leading-relaxed">{log}</div>)
              )}
            </div>
          </div>
        </div>

        {/* Campaign Monitor / Dashboard Listing */}
        <div className="lg:col-span-2 bg-black/40 border border-white/5 rounded-2xl p-6 backdrop-blur-md flex flex-col justify-between">
          <div className="space-y-6">
            <h2 className="text-sm font-black uppercase tracking-widest border-b border-white/5 pb-4 flex items-center justify-between text-white">
              <span className="flex items-center gap-2"><Video className="w-4 h-4 text-cyan-500" /> CAMPAIGN DEPLOYMENT GRID</span>
              <button 
                onClick={() => { fetchCampaigns(); fetchCredits(); }}
                className="text-[10px] uppercase text-zinc-500 hover:text-cyan-400 flex items-center gap-1.5 transition-colors font-bold"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Refresh
              </button>
            </h2>

            {isLoadingCampaigns ? (
              <div className="py-16 text-center text-cyan-500 uppercase tracking-widest text-xs font-bold animate-pulse">
                SCANNEN VAN AD-VECTORS...
              </div>
            ) : campaigns.length === 0 ? (
              <div className="py-20 text-center rounded-xl bg-zinc-950/50 border border-white/5">
                <AlertTriangle className="w-10 h-10 text-zinc-600 mx-auto mb-4" />
                <h3 className="text-white font-bold uppercase tracking-widest text-xs mb-2">Geen actieve campagnes</h3>
                <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Launcheer een TikTok ad hiernaast om renders te genereren.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[460px] overflow-y-auto pr-2 custom-scrollbar">
                {campaigns.map((c) => {
                  const isRendering = c.renderStatus === 'RENDERING';
                  const isSelected = selectedCampaign?.id === c.id;

                  return (
                    <div 
                      key={c.id} 
                      onClick={() => setSelectedCampaign(c)}
                      className={`cursor-pointer p-5 rounded-xl border transition-all duration-200 ${
                        isSelected 
                          ? 'border-cyan-500/50 bg-cyan-950/20 shadow-[0_0_15px_rgba(6,182,212,0.15)]' 
                          : 'border-white/5 bg-zinc-950/50 hover:bg-zinc-900/50 hover:border-white/10'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <span className="text-xs font-bold uppercase text-white tracking-wider truncate max-w-[150px]">{c.campaignName}</span>
                        <span className={`text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${
                          c.status === 'VIRAL' 
                            ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' 
                            : c.status === 'ACTIVE' 
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                              : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                        }`}>
                          {c.status}
                        </span>
                      </div>

                      {/* Video Render progress */}
                      {isRendering ? (
                         <div className="mt-4 space-y-2">
                           <div className="flex justify-between text-[9px] uppercase font-bold text-cyan-500 tracking-widest">
                             <span>RE-RENDERING METADATA...</span>
                             <span>{c.renderProgress}%</span>
                           </div>
                           <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                             <div 
                               className="h-full bg-cyan-500 rounded-full transition-all duration-500"
                               style={{ width: `${c.renderProgress}%` }}
                             />
                           </div>
                         </div>
                      ) : (
                        <div className="mt-4 grid grid-cols-2 gap-4 border-t border-white/5 pt-4 text-xs">
                          <div>
                            <span className="text-zinc-500 block uppercase text-[9px] font-bold tracking-widest mb-1">TOTAL VIEWS</span>
                            <span className="text-white font-black text-sm">{c.totalViews.toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-zinc-500 block uppercase text-[9px] font-bold tracking-widest mb-1">BUDGET USED</span>
                            <span className="text-cyan-400 font-black text-sm">{c.budgetCredits} <span className="text-[10px] text-zinc-500">CR</span></span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Selected Campaign Statistics & Viral Boost Injection */}
      <AnimatePresence mode="wait">
        {selectedCampaign && selectedCampaign.renderStatus === 'COMPLETED' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-black/40 border border-white/5 rounded-2xl p-6 md:p-8 backdrop-blur-md space-y-8"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/5 pb-6">
              <div>
                <span className="text-[10px] font-bold text-cyan-500 uppercase tracking-widest mb-2 block flex items-center gap-2"><Tv className="w-3.5 h-3.5" /> CAMPAIGN AUDIT MONITOR</span>
                <h3 className="text-2xl md:text-3xl font-black uppercase text-white tracking-widest">{selectedCampaign.campaignName}</h3>
              </div>

              <div className="flex flex-wrap gap-3">
                {/* Viral Boost Knop */}
                {selectedCampaign.status !== 'VIRAL' ? (
                  <button
                    onClick={() => handleTriggerViral(selectedCampaign.id)}
                    disabled={isBoosting}
                    className="bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/50 text-orange-400 rounded-xl font-bold uppercase tracking-widest px-6 py-3 text-xs transition-colors flex items-center gap-3 disabled:opacity-50"
                  >
                    <Flame className="w-4 h-4" /> INJECT VIRAL ALGORITHM (BOOST)
                  </button>
                ) : (
                  <span className="bg-orange-500/20 border border-orange-500/50 text-orange-400 rounded-xl px-6 py-3 text-xs font-bold uppercase tracking-widest flex items-center gap-3">
                    <Flame className="w-4 h-4 text-orange-400 animate-pulse" /> VIRAL MULTIPLIER ACTIVE (12.0X)
                  </span>
                )}
              </div>
            </div>

            {/* Campaign analytics metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              <div className="bg-zinc-950/50 border border-white/5 rounded-xl p-5">
                <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Estimated Views</span>
                <span className="text-2xl font-black text-white block mt-2">{selectedCampaign.totalViews.toLocaleString()}</span>
              </div>
              
              <div className="bg-zinc-950/50 border border-white/5 rounded-xl p-5">
                <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Estimated Impressions</span>
                <span className="text-2xl font-black text-white block mt-2">{selectedCampaign.totalImpressions.toLocaleString()}</span>
              </div>

              <div className="bg-zinc-950/50 border border-white/5 rounded-xl p-5">
                <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Click-Through Rate (CTR)</span>
                <span className="text-2xl font-black text-cyan-400 block mt-2">{(selectedCampaign.status === 'VIRAL' ? 8.4 : 3.2).toFixed(1)}%</span>
              </div>

              <div className="bg-zinc-950/50 border border-white/5 rounded-xl p-5">
                <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Viral Multiplier</span>
                <span className="text-2xl font-black text-white block mt-2">{selectedCampaign.status === 'VIRAL' ? '12.0x' : '1.0x'}</span>
              </div>
            </div>

            {/* Graphic Chart (Recharts) */}
            <div className="h-80 pt-4">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-6 flex items-center gap-2">
                <BarChart3 className="w-4 h-4" /> 7-Day Performance Flow Matrix (Views / Impressions)
              </h4>
              {selectedCampaign.viewsHistory && selectedCampaign.viewsHistory.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={selectedCampaign.viewsHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="#27272a" strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(9, 9, 11, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', backdropFilter: 'blur(10px)' }}
                      itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                      labelStyle={{ color: '#06b6d4', fontSize: '10px', textTransform: 'uppercase', tracking: 'widest', marginBottom: '4px' }}
                    />
                    <Area type="monotone" dataKey="views" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center rounded-xl border border-white/5 bg-zinc-950/30 text-zinc-500 uppercase tracking-widest text-[10px] font-bold">
                  AWAITING DATASHEET POPULATION FROM AD NETWORKS...
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL: Buy credits modal */}
      {showBuyModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-950 border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl space-y-6">
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-3">
                <Coins className="w-5 h-5 text-cyan-500" /> RECHARGE CREDITS
              </h3>
              <button onClick={() => setShowBuyModal(false)} className="text-zinc-500 hover:text-white transition-colors">
                <Plus className="w-5 h-5 rotate-45" />
              </button>
            </div>

            <form onSubmit={handleBuyCredits} className="space-y-6">
              <p className="text-[11px] leading-relaxed text-zinc-400 font-medium">Selecteer het aantal ad-credits om de TikTok video-render pipelines op te laden. Tarieven worden veilig verwerkt via Mollie.</p>
              
              <div className="space-y-3">
                <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest">Credit Pack Size</label>
                <div className="relative">
                  <select 
                    value={buyAmount}
                    onChange={(e) => setBuyAmount(parseInt(e.target.value))}
                    className="w-full bg-black border border-white/10 rounded-xl focus:border-cyan-500/50 focus:outline-none px-4 py-3.5 text-white text-sm appearance-none"
                  >
                    <option value={250}>250 Credits (€25.00)</option>
                    <option value={500}>500 Credits (€50.00)</option>
                    <option value={1000}>1000 Credits (€100.00)</option>
                    <option value={2500}>2500 Credits (€250.00)</option>
                  </select>
                  <ChevronRight className="w-4 h-4 text-zinc-500 absolute right-4 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none" />
                </div>
              </div>

              <div className="bg-cyan-950/20 border border-cyan-500/20 rounded-xl p-4 text-[11px] text-cyan-400 flex items-start gap-3">
                <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">Instant recharge via Mollie test/live omgeving geactiveerd voor jouw account.</span>
              </div>

              <button 
                type="submit" 
                disabled={isBuying}
                className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-black uppercase tracking-widest py-3.5 rounded-xl transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
              >
                {isBuying ? 'PROCESSING...' : '💳 RECHARGE VIA MOLLIE'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: MOLLIE SANDBOX SIMULATOR */}
      {showSandboxModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-950 border border-cyan-500/30 rounded-2xl p-8 max-w-md w-full shadow-[0_0_30px_rgba(6,182,212,0.15)] space-y-6">
            <div className="border-b border-white/10 pb-4 flex items-center gap-4">
              <div className="w-3 h-3 bg-cyan-500 animate-ping rounded-full" />
              <h3 className="text-sm font-black uppercase tracking-widest text-cyan-400">
                MOLLIE GATEWAY (SANDBOX)
              </h3>
            </div>

            <div className="space-y-5 text-sm font-medium text-zinc-300">
              <div className="bg-black/50 p-5 rounded-xl border border-white/5 space-y-3">
                <div className="flex justify-between"><span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">TRANSACTION ID:</span> <span className="text-white text-xs">{sandboxTxId}</span></div>
                <div className="flex justify-between"><span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">CREDIT PACKAGE:</span> <span className="text-cyan-400 font-bold text-xs">{sandboxCredits} Credits</span></div>
                <div className="flex justify-between"><span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">PAYMENT TOTAL:</span> <span className="text-white text-xs">€{(sandboxCredits/10).toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">ENVIRONMENT:</span> <span className="text-emerald-400 text-[10px] uppercase font-bold tracking-widest">local_sandbox</span></div>
              </div>

              <p className="text-[11px] leading-relaxed text-zinc-400 text-center px-2">U heeft zojuist de Mollie gateway betaling afgerond in testmodus. Klik op de onderstaande knop om de credits direct bij te schrijven op uw Rebuild account.</p>
            </div>

            <button 
              onClick={handleCompleteSandboxPayment}
              disabled={isBuying}
              className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-black uppercase tracking-widest py-3.5 rounded-xl transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
            >
              {isBuying ? 'PROCESSING...' : '✅ CONFIRM & UPDATE SALDO'}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
