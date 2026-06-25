'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { 
  Brain, 
  Terminal as TerminalIcon, 
  Cpu, 
  Coins, 
  Film, 
  Mail, 
  RefreshCw, 
  ExternalLink, 
  Globe, 
  Sparkles,
  Layers,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { 
  generateVibeEcommerceAction, 
  runSyntheticOperatorsAction, 
  getSyntheticLogsAction 
} from '@/actions/synthetic';
import { getFranchises } from '@/actions/franchise';

interface LogLine {
  id: string;
  timestamp: string;
  source: 'SYSTEM' | 'CFO' | 'PR_AGENT' | 'CRM_AGENT' | 'VIBE_ENGINEER';
  action: string;
  target?: string;
  status: 'SUCCESS' | 'WARNING' | 'FAILED';
  details: string;
}

export default function SyntheticDashboardPage() {
  // States
  const [vibePrompt, setVibePrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isTriggeringOperators, setIsTriggeringOperators] = useState(false);
  const [activeTab, setActiveTab] = useState<'console' | 'brand'>('console');
  
  // Real database models
  const [franchises, setFranchises] = useState<any[]>([]);
  const [selectedFranchiseId, setSelectedFranchiseId] = useState<string>('');
  const [lastGeneratedStore, setLastGeneratedStore] = useState<any | null>(null);
  
  // Terminal logs state
  const [terminalLogs, setTerminalLogs] = useState<LogLine[]>([]);
  const [autoScroll, setAutoScroll] = useState(true);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Load franchises & initial database logs on mount
  useEffect(() => {
    fetchInitialData();
  }, []);

  // Auto-scroll terminal
  useEffect(() => {
    if (autoScroll && terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [terminalLogs, autoScroll]);

  const fetchInitialData = async () => {
    try {
      // 1. Get user's existing franchises
      const list = await getFranchises();
      setFranchises(list);
      if (list.length > 0) {
        setSelectedFranchiseId(list[0].id);
        // Stel de eerste in als default detail view
        setLastGeneratedStore({
          name: list[0].name,
          theme: list[0].theme,
          title: list[0].title,
          description: list[0].description,
          subdomain: list[0].subdomain,
          settings: JSON.parse(list[0].settings || '{}'),
          products: JSON.parse(list[0].products || '[]'),
        });
      }

      // 2. Fetch real database logs from AgentDossier
      const logsResponse = await getSyntheticLogsAction();
      if (logsResponse.success && logsResponse.dossiers) {
        const formattedLogs: LogLine[] = logsResponse.dossiers.map((d: any) => ({
          id: d.id,
          timestamp: new Date(d.timestamp).toLocaleTimeString(),
          source: d.agentType as any,
          action: d.action,
          target: d.target || undefined,
          status: d.status as any,
          details: d.details || '',
        }));
        
        // Voeg een welkomstbericht toe van Orion
        setTerminalLogs([
          {
            id: 'init-sys',
            timestamp: new Date().toLocaleTimeString(),
            source: 'SYSTEM',
            action: 'INITIALIZE',
            status: 'SUCCESS',
            details: 'ORION Swarm Grid connected. Synthetic CFO, PR and CRM agents initialized and operational.',
          },
          ...formattedLogs.reverse(),
        ]);
      }
    } catch (err) {
      console.error('Failed to load initial synthetic data:', err);
    }
  };

  // Generate Brand layout from Vibe Prompt
  const handleGenerateVibe = async () => {
    if (!vibePrompt.trim()) return;
    setIsGenerating(true);
    
    // Add local terminal status
    addTerminalLog('SYSTEM', 'REQUEST_TRANSLATION', 'AI Router', 'SUCCESS', `Dispatched brand engineering pipeline request with prompt: "${vibePrompt}"...`);

    try {
      const res = await generateVibeEcommerceAction(vibePrompt);
      if (res.success && res.data) {
        const generated = res.parsedData;
        setLastGeneratedStore(generated);
        
        // Refresh local franchise list
        const updatedList = await getFranchises();
        setFranchises(updatedList);
        setSelectedFranchiseId(res.data.id);

        addTerminalLog(
          'VIBE_ENGINEER', 
          'CREATE_STORE', 
          res.data.name, 
          'SUCCESS', 
          `Store generated with vibe theme: ${generated.theme}. Primary: ${generated.settings?.primaryColor}, Font: ${generated.settings?.fontFamily}. Subdomain registered: ${res.data.subdomain}.rebuildyourlife.eu`
        );
        
        // Switch to Brand layout tab to show off the generated results
        setActiveTab('brand');
        setVibePrompt('');
      } else {
        addTerminalLog('SYSTEM', 'ENGINEERING_FAILED', 'AI Router', 'FAILED', res.error || 'Vibe compilation failed.');
      }
    } catch (err: any) {
      addTerminalLog('SYSTEM', 'CRITICAL_EXCEPTION', 'Grid System', 'FAILED', err.message || 'Fatal error during generation.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Trigger Synthetic Operators
  const handleTriggerOperators = async () => {
    const targetId = selectedFranchiseId;
    if (!targetId) {
      addTerminalLog('SYSTEM', 'EXECUTE_DENIED', 'Swarm Scheduler', 'WARNING', 'No target franchise selected. Select or generate a brand first.');
      return;
    }

    const currentFranchise = franchises.find(f => f.id === targetId);
    const storeName = currentFranchise ? currentFranchise.name : 'Unknown Store';

    setIsTriggeringOperators(true);
    addTerminalLog('SYSTEM', 'DEPLOY_SWARM', storeName, 'SUCCESS', `Triggering Synthetic Swarm (CFO, PR, CRM) for brand: "${storeName}"...`);

    try {
      const res = await runSyntheticOperatorsAction(targetId);
      if (res.success && res.results) {
        // Voeg de logs van de daadwerkelijke backend acties direct toe aan de console
        res.results.forEach((op: any) => {
          let source: LogLine['source'] = 'SYSTEM';
          if (op.operator === 'CFO') source = 'CFO';
          if (op.operator === 'PR') source = 'PR_AGENT';
          if (op.operator === 'CRM') source = 'CRM_AGENT';

          addTerminalLog(
            source,
            op.action,
            storeName,
            'SUCCESS',
            op.message
          );
        });

        // Update de franchises omzet e.d. in de state
        const updatedList = await getFranchises();
        setFranchises(updatedList);
      } else {
        addTerminalLog('SYSTEM', 'SWARM_FAILED', storeName, 'FAILED', res.error || 'Autonomous execution aborted by overseer.');
      }
    } catch (err: any) {
      addTerminalLog('SYSTEM', 'CRITICAL_EXCEPTION', storeName, 'FAILED', err.message || 'Swarm communication breakdown.');
    } finally {
      setIsTriggeringOperators(false);
    }
  };

  // Helper to add local UI logs
  const addTerminalLog = (
    source: LogLine['source'],
    action: string,
    target: string | undefined,
    status: LogLine['status'],
    details: string
  ) => {
    const newLine: LogLine = {
      id: Math.random().toString(),
      timestamp: new Date().toLocaleTimeString(),
      source,
      action,
      target,
      status,
      details,
    };
    setTerminalLogs(prev => [...prev, newLine]);
  };

  const getSourceBadgeColor = (source: LogLine['source']) => {
    switch (source) {
      case 'SYSTEM': return 'bg-zinc-800 text-zinc-100 border-zinc-700';
      case 'CFO': return 'bg-emerald-950 text-emerald-400 border-emerald-900';
      case 'PR_AGENT': return 'bg-purple-950 text-purple-400 border-purple-900';
      case 'CRM_AGENT': return 'bg-cyan-950 text-cyan-400 border-cyan-900';
      case 'VIBE_ENGINEER': return 'bg-amber-950 text-amber-400 border-amber-900';
    }
  };

  const getStatusIcon = (status: LogLine['status']) => {
    switch (status) {
      case 'SUCCESS': return <span className="text-emerald-400 font-bold">[OK]</span>;
      case 'WARNING': return <span className="text-amber-400 font-bold">[WRN]</span>;
      case 'FAILED': return <span className="text-gold font-bold">[ERR]</span>;
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto min-h-[85vh] flex flex-col font-mono text-zinc-200 p-4 lg:p-8 bg-black">
      
      {/* HEADER: Brutalist Platinum Banner */}
      <div className="border-4 border-zinc-800 bg-zinc-950 p-6 mb-8 shadow-[8px_8px_0px_0px_rgba(38,38,38,1)] flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl lg:text-5xl font-black text-white tracking-tighter uppercase flex items-center gap-3">
            <Cpu className="w-8 h-8 lg:w-12 h-12 text-zinc-400" />
            SYNTHETIC COGNITION COMMAND
          </h1>
          <p className="text-zinc-500 text-xs mt-2 tracking-widest uppercase flex items-center gap-2">
            <span className="w-3 h-3 bg-emerald-500 border border-emerald-400 animate-pulse inline-block"></span>
            SWARM CONSOLE V1.0 // PLATINUM SYSTEM CONTROL
          </p>
        </div>
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <select 
            value={selectedFranchiseId} 
            onChange={(e) => {
              const id = e.target.value;
              setSelectedFranchiseId(id);
              const store = franchises.find(f => f.id === id);
              if (store) {
                setLastGeneratedStore({
                  name: store.name,
                  theme: store.theme,
                  title: store.title,
                  description: store.description,
                  subdomain: store.subdomain,
                  settings: JSON.parse(store.settings || '{}'),
                  products: JSON.parse(store.products || '[]'),
                });
              }
            }}
            className="bg-black text-white border-2 border-zinc-700 p-2.5 text-xs font-bold focus:outline-none focus:border-white w-full lg:w-64"
          >
            {franchises.length === 0 ? (
              <option value="">GEEN WINKELS ACTIEF</option>
            ) : (
              franchises.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name.toUpperCase()} (OMZET: €{f.revenue.toFixed(2)})
                </option>
              ))
            )}
          </select>
          <Button 
            onClick={fetchInitialData}
            variant="secondary"
            className="border-2 border-zinc-700 bg-zinc-900 text-white p-2.5 h-auto rounded-none hover:bg-zinc-800"
            title="Herlaad database gegevens"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Vibe Prompt Engineering Console (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-8">
          
          {/* Prompt input card */}
          <Card className="rounded-none border-4 border-zinc-800 bg-zinc-950 p-6 shadow-[6px_6px_0px_0px_rgba(38,38,38,1)]">
            <h3 className="text-md font-black tracking-wider text-white mb-4 uppercase flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-zinc-400" />
              1. VIBE PROMPT COMPILER
            </h3>
            <p className="text-xs text-zinc-400 mb-6 uppercase">
              Voer een vibe prompt in. De Sovereign AI router zal dit live vertalen naar een brute layout, merkkleuren, fonts en unieke e-commerce producten.
            </p>
            
            <div className="space-y-4">
              <textarea
                value={vibePrompt}
                onChange={(e) => setVibePrompt(e.target.value)}
                placeholder="Bijv. cyberpunk neon fitness merk, concrete industrial coffee brand, luxury gold biohacking lab..."
                disabled={isGenerating}
                rows={3}
                className="w-full bg-black text-white border-2 border-zinc-700 p-3 text-xs font-bold placeholder-zinc-600 focus:outline-none focus:border-white font-mono resize-none"
              />
              
              <Button
                onClick={handleGenerateVibe}
                loading={isGenerating}
                className="w-full bg-white hover:bg-zinc-200 text-black font-black text-xs uppercase p-4 rounded-none border-2 border-white tracking-widest flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_rgba(115,115,115,1)]"
              >
                {isGenerating ? 'GENERATING PROTOCOL...' : 'INITIALIZE VIBE COMPILATION'}
              </Button>
            </div>
          </Card>

          {/* Swarm Trigger control */}
          <Card className="rounded-none border-4 border-zinc-800 bg-zinc-950 p-6 shadow-[6px_6px_0px_0px_rgba(38,38,38,1)]">
            <h3 className="text-md font-black tracking-wider text-white mb-4 uppercase flex items-center gap-2">
              <Layers className="w-5 h-5 text-zinc-400" />
              2. SYNTHETIC OPERATORS CONTROL
            </h3>
            <p className="text-xs text-zinc-400 mb-6 uppercase">
              Laat de Synthetic Operators autonoom acties uitvoeren op je geselecteerde winkel. CFO verwerkt winst sweeps, PR bouwt TikTok campagnes en CRM sluit B2B leads.
            </p>
            
            <Button
              onClick={handleTriggerOperators}
              loading={isTriggeringOperators}
              disabled={!selectedFranchiseId || isTriggeringOperators}
              className="w-full bg-zinc-900 hover:bg-zinc-800 border-2 border-zinc-700 text-white font-black text-xs uppercase p-4 rounded-none tracking-widest flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_rgba(38,38,38,1)]"
            >
              {isTriggeringOperators ? 'EXECUTING SWARM RUN...' : 'TRIGGER AUTONOMOUS SYNTHETIC SWARM'}
            </Button>

            {/* Quick overview of operators */}
            <div className="mt-6 space-y-3 font-mono text-[10px]">
              <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                <span className="text-emerald-400 font-bold">CFO (Sophia / CFO-01)</span>
                <span className="text-zinc-500 uppercase">Revenue sweeping & Ledger auditing</span>
              </div>
              <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                <span className="text-purple-400 font-bold">PR AGENT (Elena / PR-01)</span>
                <span className="text-zinc-500 uppercase">Video hook renders & TikTok seeding</span>
              </div>
              <div className="flex justify-between items-center pb-1">
                <span className="text-cyan-400 font-bold">CRM AGENT (Marcus / CRM-01)</span>
                <span className="text-zinc-500 uppercase">Wholesale outreach & Lead scoring</span>
              </div>
            </div>
          </Card>
        </div>

        {/* RIGHT COLUMN: Terminal Log & Brand Detail View (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Tabs header */}
          <div className="flex border-b-4 border-zinc-800">
            <button
              onClick={() => setActiveTab('console')}
              className={`px-6 py-3 font-black text-xs uppercase border-t-2 border-x-2 rounded-none tracking-widest transition-all ${
                activeTab === 'console'
                  ? 'bg-zinc-950 border-zinc-800 text-white border-b-4 border-b-black -mb-[4px]'
                  : 'bg-black border-transparent text-zinc-500 hover:text-zinc-300'
              }`}
            >
              TERMINAL FEED (LOGS)
            </button>
            <button
              onClick={() => setActiveTab('brand')}
              className={`px-6 py-3 font-black text-xs uppercase border-t-2 border-x-2 rounded-none tracking-widest transition-all ${
                activeTab === 'brand'
                  ? 'bg-zinc-950 border-zinc-800 text-white border-b-4 border-b-black -mb-[4px]'
                  : 'bg-black border-transparent text-zinc-500 hover:text-zinc-300'
              }`}
            >
              BRAND VISUALIZER
            </button>
          </div>

          {/* TAB 1: Terminal Log */}
          {activeTab === 'console' && (
            <Card className="rounded-none border-4 border-zinc-800 bg-black p-4 shadow-[6px_6px_0px_0px_rgba(38,38,38,1)] flex flex-col min-h-[500px]">
              {/* Terminal header */}
              <div className="flex justify-between items-center border-b-2 border-zinc-800 pb-3 mb-4 text-[10px] text-zinc-500 uppercase">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-gold inline-block"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-600 inline-block"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-green-600 inline-block"></span>
                  <span className="font-bold text-zinc-400 ml-2">SYSTEM CONSOLE LOG</span>
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={autoScroll} 
                      onChange={(e) => setAutoScroll(e.target.checked)}
                      className="accent-white cursor-pointer"
                    />
                    AUTO-SCROLL
                  </label>
                  <button 
                    onClick={() => setTerminalLogs([])}
                    className="hover:text-white transition-colors"
                  >
                    CLEAR
                  </button>
                </div>
              </div>

              {/* Terminal Logs scroll container */}
              <div className="flex-1 overflow-y-auto max-h-[400px] space-y-3 pr-2 text-xs font-mono select-text scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                {terminalLogs.length === 0 ? (
                  <div className="text-zinc-600 italic uppercase py-8 text-center">
                    Console empty. Initialize a vibe prompt or trigger swarm agents to generate activity.
                  </div>
                ) : (
                  terminalLogs.map((log) => (
                    <div key={log.id} className="flex flex-col gap-1 border-b border-zinc-900/50 pb-2">
                      <div className="flex flex-wrap items-center gap-2 text-[10px]">
                        <span className="text-zinc-600 font-bold">[{log.timestamp}]</span>
                        <span className={`px-2 py-0.5 border text-[9px] font-black uppercase ${getSourceBadgeColor(log.source)}`}>
                          {log.source}
                        </span>
                        <span className="text-zinc-400 font-black uppercase">{log.action}</span>
                        {log.target && (
                          <span className="text-zinc-600">➔ {log.target}</span>
                        )}
                        <span className="ml-auto">{getStatusIcon(log.status)}</span>
                      </div>
                      <p className="text-zinc-300 pl-4 whitespace-pre-wrap leading-relaxed text-[11px]">
                        {log.details}
                      </p>
                    </div>
                  ))
                )}
                <div ref={terminalEndRef} />
              </div>

              {/* Terminal footer blink line */}
              <div className="border-t-2 border-zinc-900 pt-3 mt-4 flex items-center gap-2 text-xs text-zinc-500 font-bold">
                <span className="text-emerald-400 animate-pulse font-mono">RebuildSwarm@Orion:~$</span>
                <span className="text-zinc-400 font-mono">await synthetic_operators.stream()</span>
                <span className="w-2.5 h-4 bg-zinc-400 animate-[blink_1s_infinite] inline-block"></span>
              </div>
            </Card>
          )}

          {/* TAB 2: Brand Visualizer */}
          {activeTab === 'brand' && (
            <Card className="rounded-none border-4 border-zinc-800 bg-zinc-950 p-6 shadow-[6px_6px_0px_0px_rgba(38,38,38,1)] min-h-[500px]">
              {!lastGeneratedStore ? (
                <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
                  <AlertTriangle className="w-12 h-12 text-zinc-600" />
                  <p className="text-sm text-zinc-500 uppercase font-bold">Geen gegenereerde layout geladen</p>
                  <p className="text-xs text-zinc-600 max-w-xs uppercase">
                    Vul links een vibe prompt in en compileer om hier het design-systeem te inspecteren.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Brand Header info */}
                  <div className="border-b-2 border-zinc-850 pb-4 flex justify-between items-start gap-4">
                    <div>
                      <h2 className="text-2xl font-black text-white tracking-tight uppercase">
                        {lastGeneratedStore.name}
                      </h2>
                      <p className="text-zinc-400 text-xs mt-1 uppercase font-bold tracking-wider">
                        {lastGeneratedStore.title}
                      </p>
                      {lastGeneratedStore.subdomain && (
                        <a 
                          href={`https://${lastGeneratedStore.subdomain}.rebuildyourlife.eu`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-[10px] text-zinc-500 hover:text-white uppercase tracking-widest mt-1.5 flex items-center gap-1 inline-flex"
                        >
                          <Globe className="w-3.5 h-3.5" />
                          {lastGeneratedStore.subdomain}.rebuildyourlife.eu
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                    <Badge className="bg-zinc-800 text-zinc-200 border-zinc-700 uppercase tracking-widest px-3 py-1 text-[9px] rounded-none">
                      THEME: {lastGeneratedStore.theme}
                    </Badge>
                  </div>

                  {/* Description */}
                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-black block mb-1">BRAND PHILOSOPHY / DESCRIPTION</span>
                    <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                      {lastGeneratedStore.description}
                    </p>
                  </div>

                  {/* Colors & Typography Specs */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 border-y-2 border-zinc-900 py-4">
                    <div>
                      <span className="text-[9px] text-zinc-500 uppercase tracking-wider block mb-1">PRIMARY</span>
                      <div className="flex items-center gap-2">
                        <span 
                          className="w-5 h-5 border border-zinc-700 inline-block shadow-sm"
                          style={{ backgroundColor: lastGeneratedStore.settings?.primaryColor || '#ffffff' }}
                        ></span>
                        <span className="text-xs font-mono">{lastGeneratedStore.settings?.primaryColor}</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-[9px] text-zinc-500 uppercase tracking-wider block mb-1">SECONDARY</span>
                      <div className="flex items-center gap-2">
                        <span 
                          className="w-5 h-5 border border-zinc-700 inline-block shadow-sm"
                          style={{ backgroundColor: lastGeneratedStore.settings?.secondaryColor || '#888888' }}
                        ></span>
                        <span className="text-xs font-mono">{lastGeneratedStore.settings?.secondaryColor}</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-[9px] text-zinc-500 uppercase tracking-wider block mb-1">BACKGROUND</span>
                      <div className="flex items-center gap-2">
                        <span 
                          className="w-5 h-5 border border-zinc-700 inline-block shadow-sm"
                          style={{ backgroundColor: lastGeneratedStore.settings?.backgroundColor || '#000000' }}
                        ></span>
                        <span className="text-xs font-mono">{lastGeneratedStore.settings?.backgroundColor}</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-[9px] text-zinc-500 uppercase tracking-wider block mb-1">FONT FAMILY</span>
                      <span className="text-xs font-bold block truncate" style={{ fontFamily: lastGeneratedStore.settings?.fontFamily }}>
                        {lastGeneratedStore.settings?.fontFamily || 'Courier New'}
                      </span>
                    </div>
                  </div>

                  {/* Generated Products preview */}
                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-black block mb-4">GENERATED VIBE PRODUCTS</span>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {Array.isArray(lastGeneratedStore.products) && lastGeneratedStore.products.map((prod: any, idx: number) => (
                        <div 
                          key={prod.sku || idx} 
                          className="border-2 border-zinc-800 bg-black p-3 hover:border-zinc-500 transition-colors flex flex-col justify-between"
                        >
                          <div>
                            {prod.image && (
                              <div className="w-full h-28 bg-zinc-900 border border-zinc-800 overflow-hidden relative mb-2.5">
                                <img 
                                  src={prod.image} 
                                  alt={prod.name}
                                  className="w-full h-full object-cover grayscale contrast-125 hover:grayscale-0 transition-all duration-300"
                                  onError={(e) => {
                                    // Fallback if image fails to load
                                    (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=300&q=80`;
                                  }}
                                />
                              </div>
                            )}
                            <div className="flex justify-between items-start gap-1 mb-1">
                              <span className="text-[8px] bg-zinc-900 px-1 text-zinc-400 font-mono truncate">{prod.sku}</span>
                              <span className="text-xs font-bold text-white tracking-tight">€{prod.price}</span>
                            </div>
                            <h4 className="text-xs font-black text-zinc-100 uppercase tracking-tight line-clamp-1 mb-1.5">
                              {prod.name}
                            </h4>
                            <p className="text-[10px] text-zinc-400 line-clamp-3 leading-relaxed font-sans mb-3">
                              {prod.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </Card>
          )}

        </div>

      </div>

      {/* Brutalist Custom Blink Animation CSS helper */}
      <style jsx global>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>

    </div>
  );
}
