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
  Tv
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

  // Render simulation visual progress bar
  const renderProgressBarASCII = (progress: number) => {
    const totalBars = 10;
    const filledBars = Math.round((progress / 100) * totalBars);
    const emptyBars = totalBars - filledBars;
    const barStr = '█'.repeat(filledBars) + '░'.repeat(emptyBars);
    return `[${barStr}] ${progress}%`;
  };

  return (
    <div className="font-mono text-white min-h-screen space-y-8 pb-12 select-none">
      
      {/* Top Banner / Brutalist Header */}
      <div className="border-4 border-white bg-black p-8 shadow-[6px_6px_0px_0px_rgba(255,255,255,0.15)] flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-extrabold uppercase tracking-tighter flex items-center gap-4">
            PR TRAFFIC ENGINE <Tv className="w-8 h-8 text-white animate-pulse" />
          </h1>
          <p className="text-zinc-400 mt-2 text-sm uppercase">Autonome TikTok Ad & Video Render Factory • Fase 3 Imperial Expansion</p>
        </div>
        
        {/* Credits Widget */}
        <div className="border-2 border-zinc-700 bg-zinc-900/80 p-4 min-w-[240px] shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)]">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs uppercase font-bold text-zinc-400 flex items-center gap-1">
              <Coins className="w-4 h-4" /> AD-CREDITS BALANCE
            </span>
          </div>
          <div className="text-3xl font-extrabold text-white flex items-baseline gap-2">
            {isLoadingCredits ? (
              <span className="animate-pulse">---</span>
            ) : (
              <span>{credits}</span>
            )}
            <span className="text-xs text-zinc-500 uppercase">Credits</span>
          </div>
          <button 
            onClick={() => setShowBuyModal(true)}
            className="w-full mt-3 bg-white text-black font-bold uppercase text-xs py-2 px-3 hover:bg-black hover:text-white border border-white transition-all duration-100 shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)]"
          >
            + Buy Ad-Credits (Mollie)
          </button>
        </div>
      </div>

      {/* Grid: Console / Control Panel & Campaign Listing */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Launch Campaign Panel */}
        <div className="lg:col-span-1 border-4 border-white bg-black p-6 shadow-[6px_6px_0px_0px_rgba(255,255,255,0.15)] space-y-6">
          <h2 className="text-xl font-bold uppercase tracking-tight border-b-2 border-zinc-800 pb-3 flex items-center gap-2">
            <Sliders className="w-5 h-5 text-white" /> CAMPAIGN DEPLOYMENT
          </h2>

          <form onSubmit={handleLaunchCampaign} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs uppercase font-bold text-zinc-400">Campaign Identifier</label>
              <input 
                type="text" 
                placeholder="e.g. DUBAI_HOOK_V1" 
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                required
                className="w-full bg-zinc-900 border-2 border-zinc-800 focus:border-white focus:outline-none p-3 text-white text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase font-bold text-zinc-400">Platform Vector</label>
              <input 
                type="text" 
                disabled 
                value="TIKTOK ADS (VIDEO RENDERS)" 
                className="w-full bg-zinc-950 border-2 border-zinc-900 p-3 text-zinc-500 text-xs font-bold"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs uppercase font-bold text-zinc-400">Ad Budget Allocation</label>
                <span className="text-xs text-white font-bold">{budget} Credits</span>
              </div>
              <input 
                type="range" 
                min="50" 
                max="2000" 
                step="50"
                value={budget}
                onChange={(e) => setBudget(parseInt(e.target.value))}
                className="w-full accent-white"
              />
              <div className="flex justify-between text-[10px] text-zinc-500 font-bold uppercase">
                <span>50 Cr (Micro)</span>
                <span>2000 Cr (Viral)</span>
              </div>
            </div>

            {errorMessage && (
              <div className="border border-gold bg-navy/20 p-3 text-gold text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <button 
              type="submit" 
              disabled={isLaunching || !campaignName}
              className="w-full bg-white text-black font-extrabold uppercase py-3 border-2 border-white hover:bg-black hover:text-white transition-all duration-150 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] disabled:opacity-50"
            >
              {isLaunching ? 'RENDER ENGINE DEPLOYING...' : '⚡ LAUNCH TIKTOK ADS'}
            </button>
          </form>

          {/* Mini Brutalist Terminal Logs */}
          <div className="border border-zinc-800 bg-zinc-950/50 p-4">
            <h4 className="text-[10px] uppercase font-bold text-zinc-500 flex items-center gap-1 mb-2">
              <Terminal className="w-3 h-3" /> Terminal System Logs
            </h4>
            <div className="text-[10px] font-mono text-zinc-400 space-y-1 overflow-y-auto max-h-[160px]">
              {terminalLogs.length === 0 ? (
                <span className="text-zinc-600">[SYSTEM IDLE. AWAITING OPERATION...]</span>
              ) : (
                terminalLogs.map((log, idx) => <div key={idx}>{log}</div>)
              )}
            </div>
          </div>
        </div>

        {/* Campaign Monitor / Dashboard Listing */}
        <div className="lg:col-span-2 border-4 border-white bg-black p-6 shadow-[6px_6px_0px_0px_rgba(255,255,255,0.15)] flex flex-col justify-between">
          <div className="space-y-6">
            <h2 className="text-xl font-bold uppercase tracking-tight border-b-2 border-zinc-800 pb-3 flex items-center justify-between">
              <span className="flex items-center gap-2"><Video className="w-5 h-5 text-white" /> CAMPAIGN DEPLOYMENT GRID</span>
              <button 
                onClick={() => { fetchCampaigns(); fetchCredits(); }}
                className="text-xs uppercase text-zinc-400 hover:text-white flex items-center gap-1"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Refresh
              </button>
            </h2>

            {isLoadingCampaigns ? (
              <div className="py-12 text-center text-zinc-500 uppercase animate-pulse">
                SCANNEN VAN AD-VECTORS...
              </div>
            ) : campaigns.length === 0 ? (
              <div className="py-16 text-center border-2 border-dashed border-zinc-800 bg-zinc-950/30">
                <AlertTriangle className="w-8 h-8 text-zinc-600 mx-auto mb-3" />
                <h3 className="text-white font-bold uppercase text-sm mb-1">Geen actieve campagnes</h3>
                <p className="text-xs text-zinc-500 uppercase">Launcheer een TikTok ad hiernaast om renders te genereren.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[460px] overflow-y-auto pr-2">
                {campaigns.map((c) => {
                  const isRendering = c.renderStatus === 'RENDERING';
                  const isSelected = selectedCampaign?.id === c.id;

                  return (
                    <div 
                      key={c.id} 
                      onClick={() => setSelectedCampaign(c)}
                      className={`cursor-pointer p-4 border-2 transition-all duration-100 ${
                        isSelected 
                          ? 'border-white bg-zinc-900 shadow-[3px_3px_0px_0px_rgba(255,255,255,1)]' 
                          : 'border-zinc-800 bg-zinc-950 hover:border-zinc-500'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm font-extrabold uppercase text-white truncate max-w-[150px]">{c.campaignName}</span>
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 border ${
                          c.status === 'VIRAL' 
                            ? 'border-gold bg-navy/40 text-gold font-extrabold animate-pulse' 
                            : c.status === 'ACTIVE' 
                              ? 'border-emerald-500 bg-emerald-950/40 text-emerald-500' 
                              : 'border-yellow-500 bg-yellow-950/40 text-yellow-500'
                        }`}>
                          {c.status}
                        </span>
                      </div>

                      {/* Video Render progress */}
                      {isRendering ? (
                        <div className="mt-4 space-y-1">
                          <div className="flex justify-between text-[10px] uppercase font-bold text-yellow-500">
                            <span>RE-RENDERING METADATA...</span>
                          </div>
                          <div className="font-mono text-xs text-yellow-500 bg-yellow-500/10 p-2 border border-yellow-500/20">
                            {renderProgressBarASCII(c.renderProgress)}
                          </div>
                        </div>
                      ) : (
                        <div className="mt-4 grid grid-cols-2 gap-4 border-t border-zinc-800 pt-3 text-xs">
                          <div>
                            <span className="text-zinc-500 block uppercase text-[10px] font-bold">TOTAL VIEWS</span>
                            <span className="text-white font-extrabold text-sm">{c.totalViews.toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-zinc-500 block uppercase text-[10px] font-bold">BUDGET USED</span>
                            <span className="text-white font-extrabold text-sm">{c.budgetCredits} Credits</span>
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
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="border-4 border-white bg-black p-6 shadow-[6px_6px_0px_0px_rgba(255,255,255,0.15)] space-y-6"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b-2 border-zinc-800 pb-4">
              <div>
                <span className="text-[10px] font-bold text-zinc-500 uppercase">CAMPAIGN AUDIT MONITOR</span>
                <h3 className="text-2xl font-bold uppercase text-white tracking-tight">{selectedCampaign.campaignName}</h3>
              </div>

              <div className="flex flex-wrap gap-3">
                {/* Viral Boost Knop */}
                {selectedCampaign.status !== 'VIRAL' ? (
                  <button
                    onClick={() => handleTriggerViral(selectedCampaign.id)}
                    disabled={isBoosting}
                    className="bg-black border-2 border-gold text-gold hover:bg-gold hover:text-black font-extrabold uppercase px-4 py-2 text-xs transition-all duration-100 flex items-center gap-2 shadow-[3px_3px_0px_0px_rgba(239,68,68,0.2)]"
                  >
                    <Flame className="w-4 h-4 animate-bounce" /> INJECT VIRAL ALGORITHM (BOOST)
                  </button>
                ) : (
                  <span className="border-2 border-gold/30 bg-navy/20 text-gold px-4 py-2 text-xs font-extrabold uppercase flex items-center gap-2">
                    <Flame className="w-4 h-4 text-gold" /> VIRAL MULTIPLIER ACTIVE (12.0X)
                  </span>
                )}
              </div>
            </div>

            {/* Campaign analytics metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="border border-zinc-800 bg-zinc-950 p-4">
                <span className="text-[10px] font-bold text-zinc-500 uppercase">Estimated Views</span>
                <span className="text-2xl font-extrabold text-white block mt-1">{selectedCampaign.totalViews.toLocaleString()}</span>
              </div>
              
              <div className="border border-zinc-800 bg-zinc-950 p-4">
                <span className="text-[10px] font-bold text-zinc-500 uppercase">Estimated Impressions</span>
                <span className="text-2xl font-extrabold text-white block mt-1">{selectedCampaign.totalImpressions.toLocaleString()}</span>
              </div>

              <div className="border border-zinc-800 bg-zinc-950 p-4">
                <span className="text-[10px] font-bold text-zinc-500 uppercase">Click-Through Rate (CTR)</span>
                <span className="text-2xl font-extrabold text-white block mt-1">{(selectedCampaign.status === 'VIRAL' ? 8.4 : 3.2).toFixed(1)}%</span>
              </div>

              <div className="border border-zinc-800 bg-zinc-950 p-4">
                <span className="text-[10px] font-bold text-zinc-500 uppercase">Viral Multiplier</span>
                <span className="text-2xl font-extrabold text-white block mt-1">{selectedCampaign.status === 'VIRAL' ? '12.0x' : '1.0x'}</span>
              </div>
            </div>

            {/* Graphic Chart (Recharts) */}
            <div className="h-72 mt-6">
              <h4 className="text-xs font-bold uppercase text-zinc-400 mb-4 flex items-center gap-2">
                <BarChart3 className="w-4 h-4" /> 7-Day Performance Flow Matrix (Views / Impressions)
              </h4>
              {selectedCampaign.viewsHistory && selectedCampaign.viewsHistory.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={selectedCampaign.viewsHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ffffff" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#ffffff" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="#27272a" strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" stroke="#71717a" fontSize={10} tickLine={false} />
                    <YAxis stroke="#71717a" fontSize={10} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#000', border: '2px solid #52525b', borderRadius: '0px', fontFamily: 'monospace' }}
                      itemStyle={{ color: '#fff' }}
                      labelStyle={{ color: '#888' }}
                    />
                    <Area type="monotone" dataKey="views" stroke="#ffffff" strokeWidth={2} fillOpacity={1} fill="url(#colorViews)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center border border-zinc-800 text-zinc-500 uppercase text-xs">
                  AWAITING DATASHEET POPULATION FROM AD NETWORKS...
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL: Buy credits modal */}
      {showBuyModal && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center p-4 z-50">
          <div className="border-4 border-white bg-black p-6 max-w-md w-full shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)] space-y-6">
            <div className="flex justify-between items-start border-b-2 border-zinc-800 pb-3">
              <h3 className="text-xl font-bold uppercase flex items-center gap-2">
                <Coins className="w-5 h-5" /> RECHARGE CREDITS
              </h3>
              <button onClick={() => setShowBuyModal(false)} className="text-zinc-500 hover:text-white font-bold uppercase text-xs">Close [X]</button>
            </div>

            <form onSubmit={handleBuyCredits} className="space-y-4">
              <p className="text-xs text-zinc-400 uppercase">Selecteer het aantal ad-credits om de TikTok video-render pipelines op te laden. Tarieven worden berekend via Mollie.</p>
              
              <div className="space-y-2">
                <label className="text-xs uppercase font-bold text-zinc-400">Credit Pack Size</label>
                <select 
                  value={buyAmount}
                  onChange={(e) => setBuyAmount(parseInt(e.target.value))}
                  className="w-full bg-zinc-900 border-2 border-zinc-800 focus:border-white focus:outline-none p-3 text-white text-sm"
                >
                  <option value={250}>250 Credits (€25.00)</option>
                  <option value={500}>500 Credits (€50.00)</option>
                  <option value={1000}>1000 Credits (€100.00)</option>
                  <option value={2500}>2500 Credits (€250.00)</option>
                </select>
              </div>

              <div className="border border-zinc-800 bg-zinc-950 p-3 text-xs text-zinc-400 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-white flex-shrink-0" />
                <span>Instant recharge via Mollie test/live omgeving</span>
              </div>

              <button 
                type="submit" 
                disabled={isBuying}
                className="w-full bg-white text-black font-extrabold uppercase py-3 border-2 border-white hover:bg-black hover:text-white transition-all duration-150 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]"
              >
                {isBuying ? 'PROCESSING PAYMENT GATEWAY...' : '💳 RECHARGE VIA MOLLIE'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: MOLLIE SANDBOX SIMULATOR */}
      {showSandboxModal && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center p-4 z-50">
          <div className="border-4 border-gold bg-black p-8 max-w-md w-full shadow-[8px_8px_0px_0px_rgba(239,68,68,0.2)] space-y-6">
            <div className="border-b-2 border-gold pb-3 flex items-center gap-3">
              <div className="w-3 h-3 bg-gold animate-ping rounded-full" />
              <h3 className="text-xl font-bold uppercase tracking-tight text-gold font-mono">
                MOLLIE_PAYMENT_GATEWAY_V3 (SANDBOX)
              </h3>
            </div>

            <div className="space-y-4 text-xs font-mono text-zinc-400">
              <div className="bg-zinc-950 p-4 border border-zinc-900 space-y-2 text-zinc-300">
                <div><span className="text-zinc-500">TRANSACTION ID:</span> {sandboxTxId}</div>
                <div><span className="text-zinc-500">CREDIT PACKAGE:</span> {sandboxCredits} Credits</div>
                <div><span className="text-zinc-500">PAYMENT TOTAL:</span> €{(sandboxCredits/10).toFixed(2)}</div>
                <div><span className="text-zinc-500">ENVIRONMENT:</span> local_sandbox_gateway</div>
              </div>

              <p className="uppercase text-[10px] text-zinc-500">U heeft zojuist de Mollie gateway betaling afgerond in testmodus. Klik op de onderstaande knop om de credits direct bij te schrijven op uw Rebuild account.</p>
            </div>

            <button 
              onClick={handleCompleteSandboxPayment}
              disabled={isBuying}
              className="w-full bg-gold text-black font-extrabold uppercase py-3 border-2 border-gold hover:bg-black hover:text-gold transition-all duration-150 shadow-[4px_4px_0px_0px_rgba(239,68,68,0.2)]"
            >
              {isBuying ? 'PROCESSING TRANSACTION...' : '✅ CONFIRM betaling & UPDATE SALDO'}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
