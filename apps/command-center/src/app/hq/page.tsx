"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DollarSign, BarChart2, Globe, ShoppingCart, Code, Cpu, Zap } from 'lucide-react';

import DeepSpaceBackground from '@/components/DeepSpaceBackground';
import SciFiHUD from '@/components/SciFiHUD';
import AIBrain from '@/components/AIBrain';
import AgentWindow from '@/components/AgentWindow';
import SettingsMenu from '@/components/SettingsMenu';
import CommandBar, { OrionState } from '@/components/CommandBar';
import AgentCard from '@/components/AgentCard';
import AgentTerminal from '@/components/AgentTerminal';
import { useProactiveEngine } from '@/hooks/useProactiveEngine';

const INITIAL_AGENTS = [
  { id: 999, title: "WEALTH & OPPORTUNITY ENGINE", icon: "Zap", status: "HUNTING", color: "text-amber-400", isStandby: false },
  { id: 1, title: "FINANCIËN & BETALINGEN", icon: "DollarSign", status: "MONITOREN", color: "text-green-400", isStandby: false },
  { id: 2, title: "SEO & MARKETING", icon: "BarChart2", status: "STANDBY", color: "text-purple-400", isStandby: true },
  { id: 3, title: "SCRAPER & LEADS", icon: "Globe", status: "AAN HET ZOEKEN", color: "text-blue-400", isStandby: false },
  { id: 4, title: "E-COMMERCE & MEDIA", icon: "ShoppingCart", status: "GENEREREN", color: "text-pink-400", isStandby: false },
  { id: 99, title: "CUSTOM AI PLUGIN", icon: "Code", status: "STANDBY", color: "text-yellow-400", isStandby: true },
];

export default function WarRoom() {
  const [orionState, setOrionState] = useState<OrionState>('IDLE');
  const [agents] = useState(INITIAL_AGENTS);
  const [hoveredAgent, setHoveredAgent] = useState<number | null>(null);
  const [selectedTerminalAgent, setSelectedTerminalAgent] = useState<string | null>(null);
  
  // Ambient Notifications
  const [ambientMessage, setAmbientMessage] = useState<string | null>(null);

  // Proactive Alert Engine
  const { activeAlert, dismissAlert } = useProactiveEngine();

  useEffect(() => {
    if (activeAlert) {
      setOrionState('ALERT');
    } else if (orionState === 'ALERT') {
      setOrionState('IDLE');
    }
  }, [activeAlert]);

  useEffect(() => {
    if (orionState !== 'IDLE') return;
    
    const messages = ["ORION OBSERVING", "SYSTEM NOMINAL", "DETECTED NEW TREND IN MARKET", "SYNCHRONIZING DATA STREAMS"];
    const interval = setInterval(() => {
      if (Math.random() > 0.5) {
        setAmbientMessage(messages[Math.floor(Math.random() * messages.length)]);
        setTimeout(() => setAmbientMessage(null), 4000);
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [orionState]);

  const getIcon = (name: string) => {
    switch (name) {
      case "DollarSign": return <DollarSign className="w-5 h-5" />;
      case "BarChart2": return <BarChart2 className="w-5 h-5" />;
      case "Globe": return <Globe className="w-5 h-5" />;
      case "ShoppingCart": return <ShoppingCart className="w-5 h-5" />;
      case "Code": return <Code className="w-5 h-5" />;
      case "Zap": return <Zap className="w-5 h-5" />;
      default: return <Cpu className="w-5 h-5" />;
    }
  };
  
  const [openWindows, setOpenWindows] = useState<number[]>([1]);

  const toggleWindow = (id: number) => {
    if (openWindows.includes(id)) {
      setOpenWindows(openWindows.filter(w => w !== id));
    } else {
      setOpenWindows([...openWindows, id]);
    }
  };

  const handleCommandComplete = (cmd: string) => {
    console.log("Command executed:", cmd);
  };

  // Coordinates for the spatial SVG lines (mocked center points for agents)
  const getAgentYPos = (index: number) => {
    // Rough calculation based on flex box position (top + padding + height * index)
    return 100 + index * 60;
  };

  return (
    <div className="relative min-h-screen bg-black text-white font-sans overflow-hidden">
      <DeepSpaceBackground />
      <SettingsMenu />

      <main className="relative z-10 pt-20 px-4 md:px-8 h-screen flex flex-col">
        
        {/* Layer 1 & 2: Ambient AI Presence */}
        <AnimatePresence>
          {ambientMessage && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute top-24 left-1/2 -translate-x-1/2 z-0 font-mono text-[10px] tracking-[0.3em] text-cyan-500/40 pointer-events-none"
            >
              {ambientMessage}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Spatial Connection SVG Layer */}
        {hoveredAgent && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 hidden lg:block">
            <motion.line 
              x1="50%" y1="50%" 
              x2="75%" y2={getAgentYPos(agents.findIndex(a => a.id === hoveredAgent))}
              stroke="url(#cyanGlow)" 
              strokeWidth="2"
              strokeDasharray="5 5"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.6 }}
              className="animate-pulse"
            />
            <defs>
              <linearGradient id="cyanGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="1" />
              </linearGradient>
            </defs>
          </svg>
        )}

        <div className="flex-1 flex flex-col lg:flex-row gap-6 mb-24 lg:mb-20">
          
          {/* Mobile Swipe Container */}
          <div className="w-full h-full flex overflow-x-auto snap-x snap-mandatory custom-scrollbar pb-4 lg:overflow-visible lg:snap-none">
            
            {/* View 1: Agent Windows (Left Panel Desktop) */}
            <div className="w-full flex-shrink-0 snap-center lg:w-1/4 flex flex-col gap-4 pointer-events-auto max-h-full overflow-y-auto pr-2 relative z-20">
              {openWindows.map(id => {
                const agent = agents.find(a => a.id === id);
                if (!agent) return null;
                return (
                  <AgentWindow 
                    key={id} id={agent.id} title={agent.title} icon={getIcon(agent.icon)} color={agent.color} isOpen={true} onClose={() => toggleWindow(id)}
                  />
                );
              })}
            </div>

            {/* View 2: The AI Brain Hologram (Center) */}
            <div className="w-full flex-shrink-0 snap-center lg:w-2/4 flex flex-col items-center justify-center pointer-events-auto relative z-10">
              <div className="relative">
                <SciFiHUD />
                <AIBrain activeAgents={agents} orionState={orionState} />
              </div>
            </div>

            {/* View 3: Autonomous Agents List (Right Panel) */}
            <div className="w-full flex-shrink-0 snap-center lg:w-1/4 flex flex-col gap-4 pointer-events-auto relative z-20">
              <div className="glass-panel p-4 rounded-xl border border-white/5 bg-black/40 backdrop-blur-md">
                <h3 className="font-mono text-xs tracking-widest text-cyan-400 mb-4 border-b border-white/10 pb-2">HUIDIGE AGENTEN</h3>
                <div className="space-y-3">
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
            </div>

          </div>
        </div>

        {/* Command Center Input */}
        <div className="absolute bottom-6 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-[600px] z-40 pointer-events-auto">
          <CommandBar 
            orionState={orionState} 
            setOrionState={setOrionState} 
            onCommandComplete={handleCommandComplete} 
          />
        </div>

        {/* Live Terminal Overlay */}
        <AnimatePresence>
          {selectedTerminalAgent && (
            <AgentTerminal 
              agentTitle={selectedTerminalAgent} 
              onClose={() => setSelectedTerminalAgent(null)} 
            />
          )}
        </AnimatePresence>

        {/* Proactive Alert Overlay */}
        <AnimatePresence>
          {activeAlert && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] md:w-[500px] glass-panel bg-amber-950/80 border-amber-500 shadow-[0_0_50px_rgba(245,158,11,0.3)] z-50 p-6 rounded-2xl flex flex-col items-center text-center"
            >
              <Zap className="w-12 h-12 text-amber-400 mb-4 animate-pulse" />
              <h2 className="text-xl font-bold font-mono text-amber-400 mb-2">{activeAlert.title}</h2>
              <p className="text-amber-100/80 text-sm mb-6">{activeAlert.message}</p>
              
              <div className="flex gap-4 w-full">
                <button 
                  onClick={dismissAlert}
                  className="flex-1 py-3 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-400 font-mono rounded-lg transition-colors"
                >
                  YES, SHOW DATA
                </button>
                <button 
                  onClick={dismissAlert}
                  className="flex-1 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white/50 font-mono rounded-lg transition-colors"
                >
                  DISMISS
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </main>
    </div>
  );
}
