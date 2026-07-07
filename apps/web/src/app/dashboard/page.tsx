"use client";

import React, { useState, useEffect } from 'react';
import { Activity, Brain, Server, Shield, Zap, Search, Globe, ChevronRight, Workflow, Database, Layers, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/auth';

// ============================================================================
// WEBSOCKET AGENT CONNECTION
// ============================================================================
function useAgentStatus() {
  const [agents, setAgents] = useState<any[]>([
    { id: "router", status: "idle", task: "Awaiting initialization" },
    { id: "ceo", status: "idle", task: "System cold" },
    { id: "cmo", status: "idle", task: "System cold" },
    { id: "coo", status: "idle", task: "System cold" },
    { id: "orion", status: "idle", task: "Offline" },
  ]);

  useEffect(() => {
    // In production, this would be wss://...
    const ws = new WebSocket('ws://localhost:8000/ws/agents');
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'AGENT_UPDATE') {
          setAgents(data.payload.agents);
        }
      } catch (e) {
        console.error("WS parse error", e);
      }
    };

    return () => ws.close();
  }, []);

  return agents;
}

export default function JarvisCommandOS() {
  const { user } = useAuth();
  const liveAgents = useAgentStatus();
  const [cmdOpen, setCmdOpen] = useState(false);

  // Command Palette toggle via Cmd+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCmdOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  // Compute active agent
  const activeAgent = liveAgents.find(a => a.status === 'active');
  const thinkingAgent = liveAgents.find(a => a.status === 'thinking');
  const currentAction = activeAgent || thinkingAgent || liveAgents[0];

  return (
    <div className="w-screen h-screen bg-[#02040a] text-white font-sans overflow-hidden flex flex-col relative selection:bg-cyan-500/30">
      
      {/* GLOBAL BACKGROUND - Extremely subtle world map and glows */}
      <div 
        className="absolute inset-0 z-0 opacity-10 bg-center bg-no-repeat bg-contain"
        style={{ backgroundImage: "url('/world-map-hud.png')", mixBlendMode: 'screen' }}
      ></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-900/10 blur-[120px] rounded-full pointer-events-none"></div>

      {/* TOP NAVIGATION / STATUS BAR */}
      <header className="h-12 border-b border-cyan-900/40 bg-black/50 backdrop-blur-md flex items-center justify-between px-6 z-40">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
             <div className="relative flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-pulse"></div>
                <div className="absolute w-2.5 h-2.5 rounded-full bg-cyan-500 blur-[4px]"></div>
             </div>
             <span className="font-mono text-xs tracking-[0.2em] text-cyan-400">ARGENTIC // AEIP</span>
          </div>
          
          <nav className="hidden md:flex gap-6 text-[11px] uppercase tracking-widest text-zinc-500 font-semibold">
            <span className="text-cyan-400 cursor-pointer">Command Center</span>
            <span className="hover:text-zinc-300 cursor-pointer transition-colors">Neural Network</span>
            <span className="hover:text-zinc-300 cursor-pointer transition-colors">Digital Twin</span>
          </nav>
          
          {/* GAMIFICATION STATS */}
          <div className="hidden lg:flex items-center gap-6 border-l border-white/10 pl-6 ml-2">
            <div className="flex flex-col">
               <span className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold mb-1">Clearance</span>
               <div className="flex items-center gap-1.5">
                 <Shield size={12} className="text-amber-400" />
                 <span className="text-xs font-mono text-white font-bold">LVL {(user as any)?.clearanceLevel || 1}</span>
               </div>
            </div>
            <div className="flex flex-col w-32">
               <div className="flex justify-between items-end mb-1">
                 <span className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold">XP</span>
                 <span className="text-[9px] font-mono text-cyan-400">{(user as any)?.experiencePoints || 0} / {((user as any)?.clearanceLevel || 1) * 1000}</span>
               </div>
               <div className="h-1 bg-zinc-900 rounded-full overflow-hidden">
                 <div className="h-full bg-cyan-500 shadow-[0_0_10px_#06b6d4] transition-all duration-1000" style={{ width: `${Math.min(100, (((user as any)?.experiencePoints || 0) / (((user as any)?.clearanceLevel || 1) * 1000)) * 100)}%` }}></div>
               </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
           <div className="flex flex-col items-end">
              <span className="text-[9px] uppercase tracking-widest text-zinc-500">System Time</span>
              <span className="text-xs font-mono text-zinc-300">{new Date().toLocaleTimeString()}</span>
           </div>
           <div className="flex flex-col items-end">
              <span className="text-[9px] uppercase tracking-widest text-zinc-500">Network</span>
              <span className="text-xs font-mono text-emerald-400">SECURE</span>
           </div>
        </div>
      </header>

      {/* MAIN GRID LAYOUT */}
      <main className="flex-1 p-6 grid grid-cols-12 grid-rows-6 gap-6 relative z-10 max-w-[2000px] mx-auto w-full">
         
         {/* LEFT COLUMN: THE SYNDICATE FLEET */}
         <section className="col-span-3 row-span-6 flex flex-col gap-6">
            <HudPanel title="The Syndicate (Agent Fleet)" icon={<Shield size={14}/>} className="flex-1">
               <div className="flex flex-col gap-3 mt-2">
                  {liveAgents.map((ag) => (
                    <AgentRow key={ag.id} agent={ag} />
                  ))}
               </div>
            </HudPanel>
            
            <HudPanel title="System Resources" icon={<Server size={14}/>} className="h-48">
               <div className="flex flex-col gap-4 mt-2">
                  <ResourceBar label="Compute Core (GPU)" value={78} color="cyan" />
                  <ResourceBar label="Memory Bank (Orion)" value={42} color="amber" />
                  <ResourceBar label="Network I/O" value={91} color="emerald" />
               </div>
            </HudPanel>
         </section>

         {/* CENTER COLUMN: THE NEURAL STREAM (Replacement for 3D) */}
         <section className="col-span-6 row-span-6 flex flex-col gap-6">
            <div className="flex-1 bg-black/40 border border-cyan-900/30 backdrop-blur-sm rounded-xl relative overflow-hidden flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.5)]">
               {/* Decorative corners */}
               <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-cyan-500/50"></div>
               <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-cyan-500/50"></div>
               <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-cyan-500/50"></div>
               <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-cyan-500/50"></div>
               
               <div className="p-4 border-b border-cyan-900/30 flex justify-between items-center">
                  <span className="text-xs font-mono text-cyan-500/80 uppercase tracking-[0.2em]">Neural Processing Stream</span>
                  <span className="text-[10px] font-mono text-zinc-500">LATENCY: 14ms</span>
               </div>

               <div className="flex-1 flex flex-col items-center justify-center relative p-8">
                  {/* Central Abstract Neural Representation */}
                  <div className="relative w-full max-w-md aspect-square flex items-center justify-center">
                     {/* Pulsing rings based on activity */}
                     <motion.div 
                        animate={{ 
                           scale: [1, 1.2, 1],
                           opacity: [0.1, 0.3, 0.1]
                        }}
                        transition={{ 
                           duration: currentAction?.status === 'active' ? 1.5 : 4, 
                           repeat: Infinity,
                           ease: "linear"
                        }}
                        className="absolute inset-0 rounded-full border border-cyan-500/30"
                     ></motion.div>
                     <motion.div 
                        animate={{ 
                           scale: [1, 1.5, 1],
                           opacity: [0.05, 0.15, 0.05],
                           rotate: [0, 90, 0]
                        }}
                        transition={{ 
                           duration: currentAction?.status === 'active' ? 2 : 6, 
                           repeat: Infinity,
                           ease: "linear"
                        }}
                        className="absolute inset-4 rounded-full border-2 border-dashed border-cyan-400/20"
                     ></motion.div>

                     {/* Core Intelligence Hub */}
                     <div className="z-10 bg-[#02040a] border border-cyan-500/50 p-6 rounded-full relative shadow-[0_0_50px_rgba(6,182,212,0.15)] flex flex-col items-center justify-center w-48 h-48">
                        <Brain size={48} className="text-cyan-400 mb-2" strokeWidth={1} />
                        <span className="text-[10px] uppercase font-mono tracking-widest text-cyan-500 font-bold">J.A.R.V.I.S. Core</span>
                     </div>
                  </div>

                  {/* Active Event Feed below the core */}
                  <div className="mt-12 text-center w-full max-w-lg z-20">
                     <span className="text-[10px] uppercase font-mono tracking-[0.3em] text-zinc-500 block mb-2">Current Operation</span>
                     <div className="bg-[#02040a]/80 border border-cyan-900/50 rounded-lg p-4 backdrop-blur-md shadow-2xl">
                        <div className="flex items-center justify-center gap-3 mb-1">
                           <span className="text-xs font-bold text-white uppercase tracking-wider">{currentAction?.id}</span>
                           <span className={`text-[9px] px-2 py-0.5 rounded-sm uppercase tracking-widest font-mono border ${
                              currentAction?.status === 'active' ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400' :
                              currentAction?.status === 'thinking' ? 'bg-amber-500/20 border-amber-500/50 text-amber-400' :
                              'bg-zinc-800/50 border-zinc-700 text-zinc-400'
                           }`}>
                              {currentAction?.status}
                           </span>
                        </div>
                        <p className="text-sm text-cyan-100/70 font-light font-mono mt-2">{currentAction?.task}</p>
                     </div>
                  </div>
               </div>
            </div>
         </section>

         {/* RIGHT COLUMN: DATA STREAM & TIMELINE */}
         <section className="col-span-3 row-span-6 flex flex-col gap-6">
            <HudPanel title="Global Digital Twin" icon={<Globe size={14}/>} className="h-64">
               <div className="flex-1 bg-[url('/world-map-hud.png')] bg-cover bg-center opacity-80 mix-blend-screen relative mt-2 border border-white/5 rounded-lg overflow-hidden h-full">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#02040a] via-transparent to-transparent"></div>
                  {/* Fake nodes on map */}
                  <div className="absolute top-[40%] left-[20%] w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-[0_0_10px_#06b6d4]"></div>
                  <div className="absolute top-[30%] left-[50%] w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-[0_0_10px_#06b6d4] animate-pulse"></div>
                  <div className="absolute top-[50%] left-[70%] w-1 h-1 bg-amber-400 rounded-full shadow-[0_0_10px_#f59e0b]"></div>
                  
                  <div className="absolute bottom-2 left-2 flex gap-4">
                     <div>
                        <span className="block text-[8px] uppercase text-zinc-500">Live Nodes</span>
                        <span className="block text-xs font-mono text-cyan-400">1,204</span>
                     </div>
                     <div>
                        <span className="block text-[8px] uppercase text-zinc-500">Threats</span>
                        <span className="block text-xs font-mono text-zinc-400">0</span>
                     </div>
                  </div>
               </div>
            </HudPanel>

            <HudPanel title="Event Log" icon={<Database size={14}/>} className="flex-1">
               <div className="flex flex-col gap-4 mt-4 relative">
                  {/* Timeline Line */}
                  <div className="absolute left-[7px] top-2 bottom-0 w-px bg-zinc-800"></div>

                  <LogEntry time="JUST NOW" text="CEO Core evaluated growth metrics. Delegated to CMO." active />
                  <LogEntry time="2m ago" text="Orion successfully synced vector embeddings to DB." />
                  <LogEntry time="12m ago" text="Router received batch update from Shopify webhook." />
                  <LogEntry time="1h ago" text="System initialization complete. Handshake OK." />
               </div>
            </HudPanel>
         </section>
      </main>

      {/* SPOTLIGHT COMMAND PALETTE */}
      <AnimatePresence>
        {cmdOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.15 }}
            className="absolute top-[20%] left-1/2 -translate-x-1/2 w-full max-w-2xl bg-[#090b10]/95 backdrop-blur-3xl border border-cyan-500/30 rounded-xl shadow-[0_40px_100px_rgba(0,0,0,0.9),0_0_60px_rgba(6,182,212,0.15)] z-[100] overflow-hidden flex flex-col"
          >
            <div className="flex items-center px-6 py-5 border-b border-white/10">
              <Search className="text-cyan-400 w-5 h-5 mr-4" />
              <input 
                type="text" 
                placeholder="Enter command or query J.A.R.V.I.S..." 
                className="w-full bg-transparent border-none outline-none text-white text-lg placeholder-zinc-500 font-light"
                autoFocus
              />
              <span className="text-[10px] bg-white/5 border border-white/10 px-2 py-1 rounded text-zinc-400 font-mono tracking-widest uppercase">ESC</span>
            </div>
            <div className="p-2 flex flex-col gap-1 max-h-[400px] overflow-y-auto">
               <span className="text-[9px] uppercase tracking-[0.2em] text-zinc-600 px-4 py-3 font-bold">Suggested Commands</span>
               
               <CommandItem icon={<Workflow size={16}/>} text="Launch Marketing Optimization Flow" />
               <CommandItem icon={<Database size={16}/>} text="Query Orion Memory DB" />
               <CommandItem icon={<Brain size={16}/>} text="Override CEO Core Logic" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

// ============================================================================
// UI COMPONENTS
// ============================================================================

function HudPanel({ title, children, className = "", icon }: { title: string, children: React.ReactNode, className?: string, icon?: React.ReactNode }) {
  return (
    <div className={`bg-[#02040a]/60 backdrop-blur-md border border-white/[0.06] rounded-xl flex flex-col overflow-hidden relative shadow-lg ${className}`}>
      <div className="h-10 border-b border-white/[0.05] flex items-center px-4 bg-gradient-to-r from-white/[0.02] to-transparent shrink-0 gap-2">
        {icon && <span className="text-cyan-500/70">{icon}</span>}
        <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-zinc-400">{title}</span>
      </div>
      <div className="flex-1 p-4 overflow-y-auto custom-scrollbar">
        {children}
      </div>
    </div>
  );
}

function AgentRow({ agent }: { agent: any }) {
  const isActive = agent.status === 'active';
  const isThinking = agent.status === 'thinking';
  
  return (
    <div className={`p-3 border rounded-lg flex flex-col gap-2 transition-colors ${
      isActive ? 'bg-cyan-950/20 border-cyan-500/30' :
      isThinking ? 'bg-amber-950/20 border-amber-500/30' :
      'bg-white/[0.01] border-white/[0.03]'
    }`}>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
           <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-cyan-400 animate-pulse' : isThinking ? 'bg-amber-400' : 'bg-zinc-700'}`}></div>
           <span className={`text-xs font-bold uppercase tracking-wider ${isActive || isThinking ? 'text-white' : 'text-zinc-500'}`}>{agent.id}</span>
        </div>
        <span className={`text-[9px] uppercase tracking-widest font-mono ${isActive ? 'text-cyan-400' : isThinking ? 'text-amber-400' : 'text-zinc-600'}`}>
          {agent.status}
        </span>
      </div>
      <div className="text-[10px] text-zinc-500 font-mono pl-3.5 border-l border-white/5 ml-0.5">
        &gt; {agent.task || '...'}
      </div>
    </div>
  );
}

function ResourceBar({ label, value, color }: { label: string, value: number, color: 'cyan'|'amber'|'emerald' }) {
  const bgColors = {
     cyan: 'bg-cyan-500 shadow-[0_0_10px_#06b6d4]',
     amber: 'bg-amber-500 shadow-[0_0_10px_#f59e0b]',
     emerald: 'bg-emerald-500 shadow-[0_0_10px_#10b981]'
  };
  return (
    <div>
      <div className="flex justify-between text-[10px] uppercase tracking-wider mb-1.5">
        <span className="text-zinc-500">{label}</span>
        <span className="text-zinc-400 font-mono">{value}%</span>
      </div>
      <div className="h-1 bg-zinc-900 rounded-full overflow-hidden">
        <div className={`h-full ${bgColors[color]}`} style={{ width: `${value}%` }}></div>
      </div>
    </div>
  );
}

function LogEntry({ time, text, active = false }: { time: string, text: string, active?: boolean }) {
  return (
    <div className="relative pl-6">
      <div className={`absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full border-2 border-[#02040a] z-10 ${active ? 'bg-cyan-400 shadow-[0_0_8px_#06b6d4]' : 'bg-zinc-800'}`}></div>
      <span className={`text-[9px] uppercase tracking-widest font-mono ${active ? 'text-cyan-400' : 'text-zinc-600'}`}>{time}</span>
      <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">{text}</p>
    </div>
  );
}

function CommandItem({ icon, text }: { icon: React.ReactNode, text: string }) {
  return (
    <div className="px-4 py-3 mx-2 hover:bg-cyan-900/20 hover:border-cyan-500/30 border border-transparent rounded-lg cursor-pointer flex items-center gap-3 text-sm text-zinc-400 hover:text-white group transition-all">
       <span className="text-zinc-600 group-hover:text-cyan-400 transition-colors">{icon}</span>
       {text}
       <ChevronRight size={14} className="ml-auto text-transparent group-hover:text-cyan-500/50" />
    </div>
  );
}
