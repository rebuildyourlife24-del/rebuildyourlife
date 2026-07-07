"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Bot, Send, User, ChevronRight, Activity, Shield, Hexagon, Network, Workflow, Brain, Settings } from 'lucide-react';
import { useChat } from '@ai-sdk/react';

// ============================================================================
// MAIN LAYOUT
// ============================================================================
export default function AgenticOSCommandCenter() {
  return (
    <div className="w-screen h-screen bg-[#050505] text-white font-sans overflow-hidden flex">
      
      {/* MAIN COMMAND CENTER (75% WIDTH) */}
      <div className="flex-1 flex flex-col p-6 gap-6 h-full relative">
        {/* Subtle Background Glows */}
        <div className="absolute top-[20%] left-[20%] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[20%] right-[20%] w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none"></div>

        {/* HEADER */}
        <header className="flex flex-col items-center justify-center shrink-0 z-10 relative">
          <h1 className="text-4xl font-bold tracking-widest uppercase mb-1 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
            AGENTIC OS
          </h1>
          <p className="text-amber-500/80 text-[10px] uppercase tracking-[0.3em] font-bold mb-6">
            Autonomous Commerce Command Center
          </p>
          
          <div className="flex items-center gap-16 text-amber-500/60">
            <HeaderIcon icon={<Hexagon size={16} />} label="Autonomous Agents" />
            <HeaderIcon icon={<Activity size={16} />} label="Data Intelligence" />
            <HeaderIcon icon={<Network size={16} />} label="Workflow Automation" />
            <HeaderIcon icon={<Brain size={16} />} label="Decision Engine" />
            <HeaderIcon icon={<Workflow size={16} />} label="Multi-Channel Control" />
          </div>
        </header>

        {/* 3x2 GRID (THE 6 MONITORS) */}
        <div className="grid grid-cols-3 grid-rows-2 gap-4 flex-1 min-h-0 z-10">
          
          {/* PANEL 1: DASHBOARD (FINANCIALS) */}
          <MonitorPanel title="Dashboard">
            <FinancialDashboard />
          </MonitorPanel>

          {/* PANEL 2: SYSTEM OVERVIEW (NEURAL NET) */}
          <MonitorPanel title="Agentic OS - System Overview">
            <NeuralNetworkOverview />
          </MonitorPanel>

          {/* PANEL 3: AGENT ACTIVITY & DECISIONS */}
          <div className="flex flex-col gap-4">
            <MonitorPanel title="Agent Activity" className="flex-[3]">
              <AgentActivityList />
            </MonitorPanel>
            <MonitorPanel title="Decision Engine" className="flex-[2]">
              <DecisionEngineWidget />
            </MonitorPanel>
          </div>

          {/* PANEL 4: STORE PERFORMANCE (WORLD MAP) */}
          <MonitorPanel title="Store Performance">
            <StorePerformanceWithMap />
          </MonitorPanel>

          {/* PANEL 5: REAL-TIME ANALYTICS */}
          <MonitorPanel title="Real-Time Analytics">
            <RealTimeAnalytics />
          </MonitorPanel>

          {/* PANEL 6: AUTOMATION WORKFLOWS & STATUS */}
          <div className="flex flex-col gap-4">
            <MonitorPanel title="Automation Workflows" className="flex-[3]">
              <WorkflowNodeGraph />
            </MonitorPanel>
            <MonitorPanel title="System Status" className="flex-[2]">
              <SystemStatusWidget />
            </MonitorPanel>
          </div>

        </div>
      </div>

      {/* FULLTIME OPEN AI ASSISTANT (25% WIDTH) */}
      <div className="w-[350px] border-l border-white/10 bg-[#0a0a0a] flex flex-col shrink-0 relative z-20 shadow-[-10px_0_30px_rgba(0,0,0,0.5)]">
        <FulltimeAIAssistant />
      </div>

    </div>
  );
}

// ============================================================================
// COMPONENTS
// ============================================================================

function HeaderIcon({ icon, label }: { icon: React.ReactNode, label: string }) {
  return (
    <div className="flex flex-col items-center gap-2 group cursor-pointer">
      <div className="w-10 h-10 border border-amber-500/30 rounded-lg flex items-center justify-center text-amber-500 group-hover:bg-amber-500/10 group-hover:border-amber-500/60 transition-all shadow-[0_0_15px_rgba(245,158,11,0.1)] group-hover:shadow-[0_0_20px_rgba(245,158,11,0.3)]">
        {icon}
      </div>
      <span className="text-[8px] uppercase tracking-widest text-zinc-500 group-hover:text-amber-500/80 transition-colors">
        {label}
      </span>
    </div>
  );
}

function MonitorPanel({ title, children, className = "" }: { title: string, children: React.ReactNode, className?: string }) {
  return (
    <div className={`bg-[#0A0B0E] border border-white/10 rounded-xl flex flex-col overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.8)] ${className}`}>
      <div className="h-8 border-b border-white/5 flex items-center justify-between px-4 bg-white/[0.02]">
        <span className="text-[9px] uppercase tracking-widest font-bold text-zinc-400">{title}</span>
        <div className="flex gap-1.5">
          <div className="w-2 h-2 rounded-full bg-zinc-700/50"></div>
          <div className="w-2 h-2 rounded-full bg-zinc-700/50"></div>
          <div className="w-2 h-2 rounded-full bg-zinc-700/50"></div>
        </div>
      </div>
      <div className="flex-1 relative p-4 overflow-hidden">
        {children}
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// PANEL 1: FINANCIAL DASHBOARD
// ----------------------------------------------------------------------------
function FinancialDashboard() {
  return (
    <div className="flex flex-col h-full gap-4">
      {/* Top Stats */}
      <div className="flex gap-4">
        <div className="flex-[2]">
          <span className="text-[10px] text-zinc-500 uppercase">Total Revenue</span>
          <div className="flex items-end gap-3 mt-1">
            <span className="text-3xl font-light text-white">$2,431,245</span>
            <span className="text-xs text-emerald-400 mb-1">+28.6%</span>
          </div>
          {/* Mock Line Chart */}
          <div className="h-16 mt-4 relative">
             <svg viewBox="0 0 100 30" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                <path d="M0,25 Q5,15 10,20 T20,10 T30,15 T40,5 T50,18 T60,8 T70,12 T80,2 T90,10 T100,0" fill="none" stroke="#06b6d4" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                <path d="M0,25 Q5,15 10,20 T20,10 T30,15 T40,5 T50,18 T60,8 T70,12 T80,2 T90,10 T100,0 L100,30 L0,30 Z" fill="url(#blue-gradient)" opacity="0.2" />
                <defs>
                  <linearGradient id="blue-gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="transparent" />
                  </linearGradient>
                </defs>
             </svg>
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-4 border-l border-white/10 pl-4">
          <div>
            <span className="text-[10px] text-zinc-500 uppercase">Orders</span>
            <div className="flex items-end justify-between mt-1">
              <span className="text-xl text-white">24,342</span>
              <span className="text-[10px] text-emerald-400">99.4%</span>
            </div>
          </div>
          <div>
            <span className="text-[10px] text-zinc-500 uppercase">Net Profit</span>
            <div className="flex items-end justify-between mt-1">
              <span className="text-xl text-white">$842,138</span>
              <span className="text-[10px] text-emerald-400">+31.4%</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Bar Chart (Revenue Overview) */}
      <div className="flex-1 flex flex-col pt-4 border-t border-white/10">
        <span className="text-[10px] text-zinc-500 uppercase mb-2">Revenue Overview</span>
        <div className="flex-1 flex items-end gap-1">
          {Array.from({length: 40}).map((_, i) => (
             <div key={i} className="flex-1 bg-indigo-500/40 hover:bg-indigo-400 transition-colors rounded-t-sm" style={{height: `${Math.random() * 80 + 20}%`}}></div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// PANEL 2: NEURAL NETWORK OVERVIEW
// ----------------------------------------------------------------------------
function NeuralNetworkOverview() {
  const nodes = [
    { label: "Product Research Agent", angle: 0 },
    { label: "Ad Creative Agent", angle: 60 },
    { label: "Customer Support Agent", angle: 120 },
    { label: "Analytics Agent", angle: 180 },
    { label: "Pricing Agent", angle: 240 },
    { label: "Store Optimizing Agent", angle: 300 },
  ];

  return (
    <div className="w-full h-full flex items-center justify-center relative">
      {/* Center Core */}
      <div className="absolute w-20 h-20 bg-cyan-500/10 rounded-full border border-cyan-500/50 flex items-center justify-center z-20 shadow-[0_0_30px_rgba(6,182,212,0.4)]">
        <div className="w-12 h-12 bg-cyan-400 rounded-full flex items-center justify-center shadow-[0_0_20px_#06b6d4]">
          <Brain className="text-black w-6 h-6" />
        </div>
      </div>

      {/* Orbit Rings */}
      <div className="absolute w-48 h-48 border border-white/10 rounded-full z-0"></div>
      <div className="absolute w-72 h-72 border border-white/5 rounded-full z-0 border-dashed"></div>

      {/* Nodes */}
      {nodes.map((node, i) => {
        const rad = (node.angle * Math.PI) / 180;
        const x = Math.cos(rad) * 120;
        const y = Math.sin(rad) * 120;
        return (
          <React.Fragment key={i}>
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" style={{ overflow: 'visible' }}>
              <line x1="50%" y1="50%" x2={`calc(50% + ${x}px)`} y2={`calc(50% + ${y}px)`} stroke="rgba(6,182,212,0.3)" strokeWidth="1" strokeDasharray="4 4" />
            </svg>
            <div 
              className="absolute z-20 flex flex-col items-center gap-2"
              style={{ transform: `translate(${x}px, ${y}px)` }}
            >
              <div className="w-8 h-8 rounded-full bg-black border border-cyan-500/50 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                <Bot size={14} />
              </div>
              {/* <span className="text-[8px] text-zinc-400 uppercase tracking-widest bg-black/80 px-2 py-0.5 rounded border border-white/5 whitespace-nowrap">{node.label}</span> */}
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ----------------------------------------------------------------------------
// PANEL 3: AGENT ACTIVITY
// ----------------------------------------------------------------------------
function AgentActivityList() {
  const agents = [
    { name: "Product Research Agent", task: "Finding winning products", status: "ACTIVE" },
    { name: "Ad Creative Agent", task: "Generating ad variations", status: "ACTIVE" },
    { name: "Store Optimizer Agent", task: "Optimizing conversion rate", status: "ACTIVE" },
    { name: "Customer Support Agent", task: "Handling customer inquiries", status: "ACTIVE" },
    { name: "Inventory Agent", task: "Monitoring stock levels", status: "ACTIVE" },
  ];
  return (
    <div className="flex flex-col gap-3 overflow-y-auto h-full pr-2 custom-scrollbar">
      {agents.map((ag, i) => (
        <div key={i} className="flex items-center justify-between border-b border-white/5 pb-2 last:border-0">
          <div className="flex items-center gap-3">
             <div className="w-6 h-6 rounded bg-white/5 flex items-center justify-center text-zinc-500"><Bot size={12}/></div>
             <div className="flex flex-col">
               <span className="text-xs text-white">{ag.name}</span>
               <span className="text-[10px] text-zinc-500">{ag.task}</span>
             </div>
          </div>
          <span className="text-[9px] text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded uppercase tracking-widest">{ag.status}</span>
        </div>
      ))}
    </div>
  );
}

function DecisionEngineWidget() {
  return (
    <div className="flex h-full gap-4 items-center">
      <div className="flex-1 flex flex-col justify-center">
        <span className="text-[10px] text-zinc-500 uppercase">Total Decisions Today</span>
        <div className="flex items-end gap-3 mt-1">
          <span className="text-2xl text-white">1,246</span>
          <span className="text-[10px] text-emerald-400 mb-1">+23.5%</span>
        </div>
        
        <span className="text-[10px] text-zinc-500 uppercase mt-4">Automated Decisions</span>
        <div className="flex items-end gap-3 mt-1">
          <span className="text-xl text-white">95.4%</span>
        </div>
      </div>
      <div className="w-24 h-24 relative">
        {/* Mock Donut Chart */}
        <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
          <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#6366f1" strokeWidth="4" strokeDasharray="40, 100" />
          <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#06b6d4" strokeWidth="4" strokeDasharray="30, 100" strokeDashoffset="-40" />
          <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#10b981" strokeWidth="4" strokeDasharray="20, 100" strokeDashoffset="-70" />
          <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#f59e0b" strokeWidth="4" strokeDasharray="10, 100" strokeDashoffset="-90" />
        </svg>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// PANEL 4: STORE PERFORMANCE & WORLD MAP
// ----------------------------------------------------------------------------
function StorePerformanceWithMap() {
  const stores = [
    { name: "Main Store", rev: "$1,245,020", trend: "+21.4%", color: "text-emerald-400" },
    { name: "Brand Store", rev: "$632,485", trend: "+18.7%", color: "text-emerald-400" },
    { name: "Niche Store 1", rev: "$342,775", trend: "+31.2%", color: "text-emerald-400" },
  ];
  return (
    <div className="flex h-full gap-4">
      {/* Left: Store List */}
      <div className="flex-[4] flex flex-col gap-3">
        {stores.map((st, i) => (
          <div key={i} className="flex justify-between items-center border-b border-white/5 pb-2">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-emerald-500/20 text-emerald-500 flex items-center justify-center rounded text-[10px] font-bold">a</div>
              <span className="text-xs text-white">{st.name}</span>
            </div>
            <div className="flex gap-4 items-center">
              <span className="text-xs text-white font-mono">{st.rev}</span>
              <span className="text-[10px] text-emerald-400">{st.trend}</span>
            </div>
          </div>
        ))}
        
        <div className="mt-auto pt-2">
           <span className="text-[9px] uppercase tracking-widest text-zinc-500 mb-2 block">Top Countries</span>
           <div className="flex justify-between text-[10px] text-zinc-400"><span className="flex items-center gap-1"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full"/> United States</span> <span>48%</span></div>
           <div className="flex justify-between text-[10px] text-zinc-400"><span className="flex items-center gap-1"><div className="w-1.5 h-1.5 bg-blue-400 rounded-full"/> United Kingdom</span> <span>14%</span></div>
           <div className="flex justify-between text-[10px] text-zinc-400"><span className="flex items-center gap-1"><div className="w-1.5 h-1.5 bg-blue-300 rounded-full"/> Canada</span> <span>8%</span></div>
        </div>
      </div>

      {/* Right: The World Map */}
      <div className="flex-[5] relative flex items-center justify-center opacity-80 mix-blend-screen">
        <svg viewBox="0 0 1000 500" className="w-full h-full fill-white/10" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5">
          {/* Extremely simplified map approximation for visual effect */}
          <path d="M 200,100 Q 250,50 300,80 T 350,150 T 250,300 T 150,200 Z" />
          <path d="M 450,80 Q 550,20 600,100 T 550,250 T 480,180 Z" />
          <path d="M 650,50 Q 800,20 850,150 T 700,300 T 600,200 Z" />
          <path d="M 250,350 Q 300,320 350,450 T 280,480 Z" />
          <path d="M 500,300 Q 550,280 600,400 T 520,450 Z" />
          <path d="M 750,350 Q 850,300 900,450 T 800,480 Z" />
          
          {/* Glowing Dots */}
          <circle cx="280" cy="180" r="8" fill="#06b6d4" className="animate-pulse" />
          <circle cx="280" cy="180" r="24" fill="rgba(6,182,212,0.2)" className="animate-pulse" />
          
          <circle cx="520" cy="120" r="5" fill="#06b6d4" />
          <circle cx="520" cy="120" r="15" fill="rgba(6,182,212,0.2)" />
          
          <circle cx="700" cy="200" r="6" fill="#10b981" />
          <circle cx="700" cy="200" r="18" fill="rgba(16,185,129,0.2)" />
        </svg>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// PANEL 5: REAL-TIME ANALYTICS
// ----------------------------------------------------------------------------
function RealTimeAnalytics() {
  return (
    <div className="flex h-full gap-4">
      <div className="flex-[5] flex flex-col justify-between">
        <div className="flex gap-8">
           <div>
             <span className="text-[10px] text-zinc-500 uppercase">Live Visitors</span>
             <div className="text-2xl text-white mt-1">342</div>
           </div>
           <div>
             <span className="text-[10px] text-zinc-500 uppercase">Page Views</span>
             <div className="text-2xl text-white mt-1">1,876</div>
           </div>
        </div>
        <div className="h-24 mt-auto relative overflow-hidden">
           {/* Mock Area Chart */}
           <svg viewBox="0 0 100 30" className="absolute bottom-0 w-full h-full" preserveAspectRatio="none">
              <path d="M0,28 Q10,20 20,25 T40,10 T60,20 T80,5 T100,15 L100,30 L0,30 Z" fill="url(#blue-gradient-2)" opacity="0.3" />
              <path d="M0,28 Q10,20 20,25 T40,10 T60,20 T80,5 T100,15" fill="none" stroke="#3b82f6" strokeWidth="1" vectorEffect="non-scaling-stroke" />
              <defs>
                <linearGradient id="blue-gradient-2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="transparent" />
                </linearGradient>
              </defs>
           </svg>
        </div>
      </div>
      <div className="flex-[4] flex flex-col border-l border-white/10 pl-4">
        <span className="text-[10px] text-zinc-500 uppercase mb-3">Top Products</span>
        <div className="flex flex-col gap-2">
           <div className="flex justify-between text-xs"><span className="text-white">Smart Watch Pro</span><span className="text-emerald-400 font-mono">$38,742</span></div>
           <div className="flex justify-between text-xs"><span className="text-white">Wireless Earbuds</span><span className="text-emerald-400 font-mono">$25,341</span></div>
           <div className="flex justify-between text-xs"><span className="text-white">LED Strip Lights</span><span className="text-emerald-400 font-mono">$18,582</span></div>
           <div className="flex justify-between text-xs"><span className="text-white">Phone Holder</span><span className="text-emerald-400 font-mono">$12,109</span></div>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// PANEL 6: WORKFLOWS & STATUS
// ----------------------------------------------------------------------------
function WorkflowNodeGraph() {
  return (
    <div className="w-full h-full relative flex items-center justify-center p-2">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[size:10px_10px] opacity-[0.05]" style={{ backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)'}}></div>
      
      {/* Node Lines */}
      <svg className="absolute inset-0 w-full h-full z-0 pointer-events-none">
         <line x1="20%" y1="30%" x2="50%" y2="30%" stroke="rgba(16,185,129,0.3)" strokeWidth="2" />
         <line x1="50%" y1="30%" x2="80%" y2="30%" stroke="rgba(16,185,129,0.3)" strokeWidth="2" />
         
         <line x1="20%" y1="70%" x2="50%" y2="70%" stroke="rgba(16,185,129,0.3)" strokeWidth="2" />
         <line x1="50%" y1="70%" x2="80%" y2="70%" stroke="rgba(16,185,129,0.3)" strokeWidth="2" />
         
         <line x1="50%" y1="30%" x2="50%" y2="70%" stroke="rgba(16,185,129,0.3)" strokeWidth="2" />
      </svg>
      
      {/* Nodes */}
      <div className="absolute left-[10%] top-[20%] w-20 h-10 border border-emerald-500/50 bg-black rounded flex flex-col items-center justify-center z-10 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
        <span className="text-[8px] text-white">Product Research</span>
        <span className="text-[6px] text-emerald-400">Auto</span>
      </div>
      <div className="absolute left-[40%] top-[20%] w-20 h-10 border border-emerald-500/50 bg-black rounded flex flex-col items-center justify-center z-10 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
        <span className="text-[8px] text-white">Ad Creation</span>
        <span className="text-[6px] text-emerald-400">Auto</span>
      </div>
      <div className="absolute left-[70%] top-[20%] w-20 h-10 border border-emerald-500/50 bg-black rounded flex flex-col items-center justify-center z-10 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
        <span className="text-[8px] text-white">Campaign</span>
        <span className="text-[6px] text-emerald-400">Auto</span>
      </div>
      
      <div className="absolute left-[10%] top-[60%] w-20 h-10 border border-emerald-500/50 bg-black rounded flex flex-col items-center justify-center z-10 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
        <span className="text-[8px] text-white">Customer Purchase</span>
        <span className="text-[6px] text-emerald-400">Trigger</span>
      </div>
      <div className="absolute left-[40%] top-[60%] w-20 h-10 border border-emerald-500/50 bg-black rounded flex flex-col items-center justify-center z-10 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
        <span className="text-[8px] text-white">Email Follow-up</span>
        <span className="text-[6px] text-emerald-400">Auto</span>
      </div>
      <div className="absolute left-[70%] top-[60%] w-20 h-10 border border-emerald-500/50 bg-black rounded flex flex-col items-center justify-center z-10 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
        <span className="text-[8px] text-white">Review Request</span>
        <span className="text-[6px] text-emerald-400">Auto</span>
      </div>
    </div>
  );
}

function SystemStatusWidget() {
  return (
    <div className="flex flex-col h-full justify-between">
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
        </div>
        <span className="text-xs text-white">All Systems Operational</span>
      </div>
      
      <div className="mt-4">
        <span className="text-[10px] text-zinc-500 uppercase">Uptime</span>
        <div className="text-2xl text-emerald-400">99.98%</div>
      </div>
      
      <div className="flex flex-col gap-1 mt-auto text-[9px] text-zinc-400 uppercase tracking-widest">
         <div className="flex justify-between"><span>Server Status</span><span className="text-emerald-500 flex items-center gap-1"><div className="w-1 h-1 bg-emerald-500 rounded-full"/> Operational</span></div>
         <div className="flex justify-between"><span>API Connections</span><span className="text-emerald-500 flex items-center gap-1"><div className="w-1 h-1 bg-emerald-500 rounded-full"/> Operational</span></div>
         <div className="flex justify-between"><span>Payment Systems</span><span className="text-emerald-500 flex items-center gap-1"><div className="w-1 h-1 bg-emerald-500 rounded-full"/> Operational</span></div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// FULLTIME AI ASSISTANT (RIGHT SIDEBAR)
// ----------------------------------------------------------------------------
function FulltimeAIAssistant() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/v6/intelligence/chat',
    initialMessages: [
      { id: '1', role: 'assistant', content: 'Agentic OS is fully initialized. Alle autonomie-functies staan op groen. Wat wil je automatiseren of analyseren via de Decision Engine?' }
    ]
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-full relative">
      {/* Header */}
      <div className="h-16 border-b border-white/5 flex items-center gap-3 px-6 shrink-0 bg-black/20">
        <div className="relative">
          <div className="w-8 h-8 rounded-full border border-cyan-500/50 flex items-center justify-center bg-cyan-500/10">
            <Bot className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border border-black shadow-[0_0_8px_#10b981]"></div>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-white font-bold tracking-widest uppercase">SYNDICATE AI</span>
          <span className="text-[9px] text-emerald-400 tracking-widest uppercase">Online & Listening</span>
        </div>
        <button className="ml-auto text-zinc-500 hover:text-white transition-colors">
          <Settings size={14} />
        </button>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 custom-scrollbar bg-[url('/noise.png')] bg-[length:100px_100px] opacity-[0.98]">
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${m.role === 'user' ? 'bg-zinc-800' : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'}`}>
              {m.role === 'user' ? <User size={10} /> : <Bot size={10} />}
            </div>
            <div className={`p-3 rounded-lg max-w-[85%] text-xs leading-relaxed ${m.role === 'user' ? 'bg-zinc-800/80 text-white rounded-tr-none' : 'bg-[#0F1115] border border-white/5 text-zinc-300 rounded-tl-none shadow-[0_5px_15px_rgba(0,0,0,0.3)] whitespace-pre-wrap'}`}>
              {m.content}
            </div>
          </div>
        ))}
        {isLoading && (
           <div className="flex gap-3 flex-row">
             <div className="w-6 h-6 rounded-md flex items-center justify-center shrink-0 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
               <Bot size={10} className="animate-pulse" />
             </div>
             <div className="p-3 rounded-lg max-w-[85%] text-xs bg-[#0F1115] border border-white/5 text-zinc-500 rounded-tl-none flex items-center gap-1">
               <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce"></span>
               <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></span>
               <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
             </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-white/5 bg-black/40 backdrop-blur-md">
        <form onSubmit={handleSubmit} className="relative flex items-center">
          <input 
            type="text" 
            placeholder="Command your AI..." 
            value={input}
            onChange={handleInputChange}
            disabled={isLoading}
            className="w-full bg-[#0A0B0E] border border-white/10 rounded-full py-3 pl-4 pr-12 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-500/50 shadow-inner disabled:opacity-50"
          />
          <button 
            type="submit" 
            disabled={isLoading || !input.trim()}
            className="absolute right-2 w-8 h-8 rounded-full bg-cyan-500 text-black flex items-center justify-center hover:bg-cyan-400 transition-colors disabled:opacity-50 disabled:hover:bg-cyan-500"
          >
            <Send size={12} className="ml-0.5" />
          </button>
        </form>
        <div className="text-center mt-3">
          <span className="text-[8px] text-zinc-600 uppercase tracking-widest font-mono">
            Powered by V6.0 Decision Engine
          </span>
        </div>
      </div>
    </div>
  );
}
