"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DollarSign, BarChart2, Globe, ShoppingCart, Code, Cpu, Zap, LayoutDashboard, Users, Brain } from 'lucide-react';

import DeepSpaceBackground from '@/components/DeepSpaceBackground';
import AIBrain from '@/components/AIBrain';
import AgentWindow from '@/components/AgentWindow';
import SettingsMenu from '@/components/SettingsMenu';
import CommandBar, { OrionState } from '@/components/CommandBar';
import AgentCard from '@/components/AgentCard';
import AgentTerminal from '@/components/AgentTerminal';
import { useProactiveEngine } from '@/hooks/useProactiveEngine';
import { useOrionVoice } from '@/hooks/useOrionVoice';

const INITIAL_AGENTS = [
  { id: 999, title: "WEALTH & OPPORTUNITY ENGINE", icon: "Zap", status: "HUNTING", color: "text-amber-400", isStandby: false },
  { id: 1, title: "FINANCIËN & BETALINGEN", icon: "DollarSign", status: "MONITOREN", color: "text-green-400", isStandby: false },
  { id: 2, title: "SEO & MARKETING", icon: "BarChart2", status: "STANDBY", color: "text-purple-400", isStandby: true },
  { id: 3, title: "SCRAPER & LEADS", icon: "Globe", status: "AAN HET ZOEKEN", color: "text-blue-400", isStandby: false },
  { id: 4, title: "E-COMMERCE & MEDIA", icon: "ShoppingCart", status: "GENEREREN", color: "text-pink-400", isStandby: false },
  { id: 5, title: "ORION GEHEUGEN VAULT", icon: "Brain", status: "LEREN", color: "text-violet-400", isStandby: false },
  { id: 99, title: "CUSTOM AI PLUGIN", icon: "Code", status: "STANDBY", color: "text-yellow-400", isStandby: true },
];

export default function WarRoom() {
  const [orionState, setOrionState] = useState<OrionState>('IDLE');
  const [agents] = useState(INITIAL_AGENTS);
  const [hoveredAgent, setHoveredAgent] = useState<number | null>(null);
  const [selectedTerminalAgent, setSelectedTerminalAgent] = useState<string | null>(null);
  const [ambientMessage, setAmbientMessage] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'agents' | 'brain' | 'commands'>('brain');

  const { activeAlert, dismissAlert } = useProactiveEngine();
  const { speak, isSpeaking, isMuted, toggleMute } = useOrionVoice();

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    if (activeAlert) {
      timeoutId = setTimeout(() => {
        setOrionState('ALERT');
        speak(`Attentie, CEO. ${activeAlert.message}`);
      }, 0);
    } else if (orionState === 'ALERT') {
      timeoutId = setTimeout(() => setOrionState('IDLE'), 0);
    }
    return () => { if (timeoutId) clearTimeout(timeoutId); };
  }, [activeAlert, orionState, speak]);

  useEffect(() => {
    if (orionState !== 'IDLE') return;
    const messages = ["ORION OBSERVING", "SYSTEEM NOMINAAL", "NIEUWE TREND GEDETECTEERD", "DATA STREAMS GESYNCHRONISEERD", "GEHEUGEN GELADEN"];
    const interval = setInterval(() => {
      if (Math.random() > 0.6) {
        setAmbientMessage(messages[Math.floor(Math.random() * messages.length)]);
        setTimeout(() => setAmbientMessage(null), 4000);
      }
    }, 12000);
    return () => clearInterval(interval);
  }, [orionState]);

  const getIcon = (name: string) => {
    const icons: Record<string, React.ReactNode> = {
      DollarSign: <DollarSign className="w-5 h-5" />,
      BarChart2: <BarChart2 className="w-5 h-5" />,
      Globe: <Globe className="w-5 h-5" />,
      ShoppingCart: <ShoppingCart className="w-5 h-5" />,
      Code: <Code className="w-5 h-5" />,
      Zap: <Zap className="w-5 h-5" />,
      Brain: <Brain className="w-5 h-5" />,
    };
    return icons[name] || <Cpu className="w-5 h-5" />;
  };

  const [openWindows, setOpenWindows] = useState<number[]>([1]);
  const toggleWindow = (id: number) => {
    setOpenWindows(prev => prev.includes(id) ? prev.filter(w => w !== id) : [...prev, id]);
  };
  const handleCommandComplete = (cmd: string, response?: string) => {
    console.log("Commando uitgevoerd:", cmd, response);
  };

  return (
    <div className="h-screen w-full bg-[#030609] text-slate-200 overflow-hidden font-sans selection:bg-cyan-500/30 flex flex-col relative">
      <DeepSpaceBackground />
      <SettingsMenu />

      {/* Voice toggle */}
      <button
        onClick={toggleMute}
        className="absolute bottom-24 right-4 z-50 p-2.5 bg-black/60 border border-white/10 rounded-full hover:bg-white/10 transition-colors backdrop-blur-md"
        title={isMuted ? 'Stem aan' : 'Stem uit'}
      >
        <span className="text-[9px] font-mono text-cyan-400">{isMuted ? '🔇' : '🔊'}</span>
      </button>

      {/* Ambient message */}
      <AnimatePresence>
        {ambientMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-20 left-1/2 -translate-x-1/2 z-20 font-mono text-[10px] tracking-[0.3em] text-cyan-500/40 pointer-events-none whitespace-nowrap"
          >
            {ambientMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* === DESKTOP LAYOUT === */}
      <main className="relative z-10 flex-1 hidden lg:flex flex-col pt-16">
        <div className="flex-1 flex gap-0 px-4 pb-4">

          {/* Links: Agent Windows */}
          <div className="w-72 flex flex-col gap-3 overflow-y-auto pr-3 pt-4 custom-scrollbar">
            {openWindows.map(id => {
              const agent = agents.find(a => a.id === id);
              if (!agent) return null;
              return (
                <AgentWindow key={id} id={agent.id} title={agent.title} icon={getIcon(agent.icon)} color={agent.color} isOpen={true} onClose={() => toggleWindow(id)} />
              );
            })}
            {openWindows.length === 0 && (
              <div className="flex items-center justify-center h-40 text-zinc-600 text-xs font-mono border border-dashed border-zinc-800 rounded-xl">
                Klik op een agent → om een venster te openen
              </div>
            )}
          </div>

          {/* Midden: AI Brain */}
          <div className="flex-1 flex flex-col items-center justify-center relative">
            {/* Spatial SVG verbindingen */}
            {hoveredAgent && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
                <defs>
                  <linearGradient id="cg" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity="0" />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.8" />
                  </linearGradient>
                </defs>
                <motion.line
                  x1="50%" y1="50%"
                  x2="82%" y2={`${15 + agents.findIndex(a => a.id === hoveredAgent) * 8}%`}
                  stroke="url(#cg)"
                  strokeWidth="1.5"
                  strokeDasharray="6 4"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.7 }}
                  className="animate-pulse"
                />
              </svg>
            )}

            <AIBrain orionState={orionState} isSpeaking={isSpeaking} />
          </div>

          {/* Rechts: Agents */}
          <div className="w-72 flex flex-col gap-3 overflow-y-auto pl-3 pt-4 custom-scrollbar">
            <div className="glass-panel px-4 py-3 rounded-xl border border-white/[0.05] bg-black/50 backdrop-blur-md">
              <h3 className="font-mono text-[10px] tracking-widest text-cyan-400 mb-3 border-b border-white/[0.08] pb-2">
                ACTIEVE AGENTEN
              </h3>
              <div className="space-y-2">
                {agents.map(agent => (
                  <AgentCard
                    key={agent.id}
                    id={agent.id}
                    title={agent.title}
                    icon={getIcon(agent.icon)}
                    color={agent.color}
                    isStandby={agent.isStandby}
                    isOpen={openWindows.includes(agent.id)}
                    onToggle={() => toggleWindow(agent.id)}
                    onClick={() => setSelectedTerminalAgent(agent.title)}
                    hoveredAgent={hoveredAgent}
                    setHoveredAgent={setHoveredAgent}
                  />
                ))}
              </div>
            </div>

            {/* Analytics mini-widget */}
            <a href="/seo" className="block p-4 glass-panel rounded-xl border border-white/[0.05] bg-black/40 hover:bg-black/60 transition-colors group">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Revenue Intel</span>
                <BarChart2 className="w-3.5 h-3.5 text-zinc-500 group-hover:text-cyan-400 transition-colors" />
              </div>
              <div className="text-xs text-zinc-400 group-hover:text-zinc-200 transition-colors">Live analytics →</div>
            </a>
          </div>
        </div>

        {/* Command Bar Desktop */}
        <div className="px-4 pb-6">
          <div className="max-w-2xl mx-auto relative">
            <CommandBar orionState={orionState} setOrionState={setOrionState} onCommandComplete={handleCommandComplete} />
          </div>
        </div>
      </main>

      {/* === MOBIEL LAYOUT === */}
      <div className="lg:hidden flex flex-col h-full pt-16">
        {/* Mobiele tabs */}
        <div className="flex items-center justify-center gap-1 px-4 py-2 z-30">
          {[
            { id: 'agents', label: 'AGENTS', icon: <Users className="w-3.5 h-3.5" /> },
            { id: 'brain', label: 'ORION', icon: <Cpu className="w-3.5 h-3.5" /> },
            { id: 'commands', label: 'DASH', icon: <LayoutDashboard className="w-3.5 h-3.5" /> },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id as any)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[11px] font-mono font-bold tracking-wider transition-all ${
                activeView === tab.id
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  : 'text-zinc-500 bg-black/40 border border-white/[0.05]'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Mobiele views */}
        <div className="flex-1 overflow-hidden relative">
          {/* ORION Brain View */}
          <AnimatePresence mode="wait">
            {activeView === 'brain' && (
              <motion.div
                key="brain"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute inset-0 flex flex-col items-center justify-center px-4"
              >
                <div className="scale-[0.85] -mt-8">
                  <AIBrain orionState={orionState} isSpeaking={isSpeaking} />
                </div>
              </motion.div>
            )}

            {/* Agents View */}
            {activeView === 'agents' && (
              <motion.div
                key="agents"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="absolute inset-0 overflow-y-auto px-4 py-3 space-y-2 custom-scrollbar"
              >
                {agents.map(agent => (
                  <AgentCard
                    key={agent.id}
                    id={agent.id}
                    title={agent.title}
                    icon={getIcon(agent.icon)}
                    color={agent.color}
                    isStandby={agent.isStandby}
                    isOpen={openWindows.includes(agent.id)}
                    onToggle={() => toggleWindow(agent.id)}
                    onClick={() => setSelectedTerminalAgent(agent.title)}
                    hoveredAgent={hoveredAgent}
                    setHoveredAgent={setHoveredAgent}
                  />
                ))}
              </motion.div>
            )}

            {/* Dashboard/Commands View */}
            {activeView === 'commands' && (
              <motion.div
                key="commands"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="absolute inset-0 overflow-y-auto px-4 py-3 space-y-3 custom-scrollbar"
              >
                {/* Quick links */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'War Room', href: '/hq', color: 'text-cyan-400' },
                    { label: 'CEO Dash', href: '/ceo', color: 'text-amber-400' },
                    { label: 'SEO Analytics', href: '/seo', color: 'text-purple-400' },
                    { label: 'Enterprise OS', href: 'https://enterprise.ai-henksemler.nl', color: 'text-violet-400' },
                    { label: 'Klanten Site', href: 'https://rebuildyourlife.eu', color: 'text-green-400' },
                    { label: 'Admin CRM', href: 'https://rebuildyourlife.eu/admin', color: 'text-red-400' },
                  ].map(link => (
                    <a
                      key={link.href}
                      href={link.href}
                      className={`p-4 bg-black/50 border border-white/[0.06] rounded-xl text-xs font-mono font-bold tracking-wider ${link.color} hover:bg-white/[0.05] transition-colors`}
                    >
                      {link.label.toUpperCase()}
                    </a>
                  ))}
                </div>

                {openWindows.length > 0 && (
                  <div className="space-y-2">
                    {openWindows.map(id => {
                      const agent = agents.find(a => a.id === id);
                      if (!agent) return null;
                      return (
                        <AgentWindow key={id} id={agent.id} title={agent.title} icon={getIcon(agent.icon)} color={agent.color} isOpen={true} onClose={() => toggleWindow(id)} />
                      );
                    })}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mobiele Command Bar — altijd onderaan */}
        <div className="px-4 pb-6 pt-2 relative z-30">
          <CommandBar orionState={orionState} setOrionState={setOrionState} onCommandComplete={handleCommandComplete} />
        </div>
      </div>

      {/* Agent Terminal Overlay */}
      <AnimatePresence>
        {selectedTerminalAgent && (
          <AgentTerminal agentTitle={selectedTerminalAgent} onClose={() => setSelectedTerminalAgent(null)} />
        )}
      </AnimatePresence>

      {/* Proactive Alert */}
      <AnimatePresence>
        {activeAlert && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-lg glass-panel bg-amber-950/90 border-amber-500/50 shadow-[0_0_60px_rgba(245,158,11,0.2)] z-50 p-6 rounded-2xl text-center"
          >
            <Zap className="w-12 h-12 text-amber-400 mx-auto mb-4 animate-pulse" />
            <h2 className="text-lg font-bold font-mono text-amber-400 mb-2">{activeAlert.title}</h2>
            <p className="text-amber-100/80 text-sm mb-6">{activeAlert.message}</p>
            <div className="flex gap-3">
              <button onClick={dismissAlert} className="flex-1 py-3 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-400 font-mono rounded-xl transition-colors text-sm">
                DATA BEKIJKEN
              </button>
              <button onClick={dismissAlert} className="flex-1 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white/50 font-mono rounded-xl transition-colors text-sm">
                SLUITEN
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
