"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Globe, LayoutDashboard, Users, Activity, BarChart2, Video, PenTool, Database, MonitorPlay, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import Link from 'next/link';

export default function SeoDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="flex h-screen w-full bg-slate-950 text-slate-200 overflow-hidden font-sans selection:bg-cyan-500/30">
      
      {/* Background Effects */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none mix-blend-screen">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-cyan-900/30 blur-[150px] rounded-full"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-900/20 blur-[150px] rounded-full"></div>
      </div>

      {/* System Switcher (Top Right) */}
      <div className="absolute top-4 right-4 z-50 flex bg-black/60 backdrop-blur-md rounded-md border border-white/10 p-0.5">
        <a href="https://rebuildyourlife.eu/hq" className="px-3 py-1.5 text-white/50 hover:text-white hover:bg-white/10 text-[10px] font-bold font-mono tracking-wider uppercase rounded-sm transition-all flex items-center gap-1.5">
          <MonitorPlay className="w-3 h-3" />
          WAR ROOM
        </a>
        <a href="https://enterprise.ai-henksemler.nl" className="px-3 py-1.5 text-white/50 hover:text-white hover:bg-white/10 text-[10px] font-bold font-mono tracking-wider uppercase rounded-sm transition-all flex items-center gap-1.5">
          <LayoutDashboard className="w-3 h-3" />
          ENTERPRISE OS
        </a>
        <a href="https://rebuildyourlife.eu/admin" className="px-3 py-1.5 text-white/50 hover:text-white hover:bg-white/10 text-[10px] font-bold font-mono tracking-wider uppercase rounded-sm transition-all flex items-center gap-1.5">
          <Users className="w-3 h-3" />
          ADMIN CRM
        </a>
        <div className="px-3 py-1.5 bg-cyan-500/20 text-cyan-400 text-[10px] font-bold font-mono tracking-wider uppercase rounded-sm shadow-[0_0_10px_rgba(6,182,212,0.2)] flex items-center gap-1.5 border-l border-white/10 ml-1">
          <BarChart2 className="w-3 h-3" />
          SEO ENGINE
        </div>
      </div>

      {/* Sidebar */}
      <aside className="w-72 border-r border-white/10 bg-black/40 backdrop-blur-xl z-20 flex flex-col relative">
        <div className="p-6 border-b border-white/10 flex items-center gap-3">
          <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-400 border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-white tracking-wide">SEO COMMAND</h1>
            <div className="text-[10px] font-mono text-cyan-500/70 tracking-widest uppercase">Global Control Unit</div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
          <div className="text-xs font-mono tracking-widest text-white/30 px-3 pb-2 pt-4 uppercase">Directives</div>
          
          <button onClick={() => setActiveTab('overview')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'overview' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.1)]' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200 border border-transparent'}`}>
            <Activity className="w-5 h-5" /> Executive Overview
          </button>
          
          <button onClick={() => setActiveTab('queue')} className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'queue' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.1)]' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200 border border-transparent'}`}>
            <div className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5" /> Review Queue</div>
            <span className="bg-amber-500/20 text-amber-400 text-xs py-0.5 px-2 rounded-md font-mono border border-amber-500/30">12 Pending</span>
          </button>

          <div className="text-xs font-mono tracking-widest text-white/30 px-3 pb-2 pt-6 uppercase">Production Studio</div>
          
          <button onClick={() => setActiveTab('webbuilder')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'webbuilder' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.1)]' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200 border border-transparent'}`}>
            <LayoutDashboard className="w-5 h-5" /> Webbuilder Studio
          </button>
          
          <button onClick={() => setActiveTab('video')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'video' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.1)]' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200 border border-transparent'}`}>
            <Video className="w-5 h-5" /> Media & Video Editor
          </button>

          <div className="text-xs font-mono tracking-widest text-white/30 px-3 pb-2 pt-6 uppercase">Intelligence</div>

          <button onClick={() => setActiveTab('board')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'board' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.1)]' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200 border border-transparent'}`}>
            <ShieldAlert className="w-5 h-5" /> Board of Directors
          </button>

          <button onClick={() => setActiveTab('logs')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'logs' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.1)]' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200 border border-transparent'}`}>
            <Database className="w-5 h-5" /> Black Box Logs
          </button>
        </nav>

        {/* CISO Status Widget */}
        <div className="p-4 border-t border-white/10 bg-black/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono text-slate-400 uppercase">CISO Security Agent</span>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </div>
          <div className="text-xs text-slate-500 font-mono">0 Threats Detected</div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 relative z-10 flex flex-col h-full overflow-hidden">
        
        {/* Topbar: Action / Context */}
        <header className="h-20 border-b border-white/10 bg-black/20 backdrop-blur-sm flex items-center justify-between px-8">
          <div>
            <h2 className="text-xl font-semibold text-white capitalize">{activeTab.replace('-', ' ')}</h2>
            <p className="text-sm text-slate-400 font-mono mt-1">Live data synchronisatie actief.</p>
          </div>
          
          {/* Noodknop (Kill Switch) */}
          <button className="group flex items-center gap-2 px-4 py-2 bg-danger/10 hover:bg-danger/20 border border-danger/30 rounded-lg transition-all shadow-[0_0_15px_rgba(239,68,68,0.1)] hover:shadow-[0_0_25px_rgba(239,68,68,0.3)]">
            <AlertTriangle className="w-4 h-4 text-danger group-hover:animate-pulse" />
            <span className="text-danger font-bold text-sm tracking-wider uppercase">Emergency Kill Switch</span>
          </button>
        </header>

        {/* Dynamic Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div 
                key="overview"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                {/* Placeholder Widgets */}
                <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-black/40 backdrop-blur-md">
                  <div className="text-sm text-slate-400 font-medium mb-1">Global Traffic</div>
                  <div className="text-3xl font-bold text-white mb-2">124.5K</div>
                  <div className="text-xs text-emerald-400 flex items-center gap-1">+12.4% vs last month</div>
                </div>
                <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-black/40 backdrop-blur-md">
                  <div className="text-sm text-slate-400 font-medium mb-1">SEO Leads Generated</div>
                  <div className="text-3xl font-bold text-white mb-2">3,492</div>
                  <div className="text-xs text-emerald-400 flex items-center gap-1">+5.2% vs last month</div>
                </div>
                <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-black/40 backdrop-blur-md">
                  <div className="text-sm text-slate-400 font-medium mb-1">Active Campaigns</div>
                  <div className="text-3xl font-bold text-white mb-2">14</div>
                  <div className="text-xs text-slate-500 flex items-center gap-1">Across 4 platforms</div>
                </div>
                <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-black/40 backdrop-blur-md border-t-2 border-t-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.1)]">
                  <div className="text-sm text-amber-400/80 font-medium mb-1 font-mono">Agent Workload</div>
                  <div className="text-3xl font-bold text-amber-400 mb-2">89%</div>
                  <div className="text-xs text-amber-400/60 flex items-center gap-1">Operating at peak efficiency</div>
                </div>
                
                {/* Large Chart Placeholder */}
                <div className="col-span-1 lg:col-span-4 glass-panel h-96 mt-4 rounded-2xl border border-white/5 bg-black/40 flex items-center justify-center">
                  <div className="text-center">
                    <BarChart2 className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-500 font-mono text-sm">Real-time Traffic Graph Placeholder</p>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'queue' && (
              <motion.div key="queue" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <h3 className="text-lg font-medium text-white mb-6 flex items-center gap-3">
                  Human Control Queue <span className="bg-amber-500/20 text-amber-400 text-xs px-2 py-1 rounded border border-amber-500/30">Action Required</span>
                </h3>
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="glass-panel p-6 rounded-xl border border-white/5 bg-black/40 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-xs font-mono text-purple-400 bg-purple-400/10 px-2 py-0.5 rounded border border-purple-400/20">SEO AGENT</span>
                          <span className="text-sm text-slate-400">Targeting keyword: "Schuldsanering 2026"</span>
                        </div>
                        <p className="text-white font-medium">Proposed 14 meta-title changes and 2 new blog drafts.</p>
                      </div>
                      <div className="flex gap-3">
                        <button className="px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-sm font-medium border border-emerald-500/30 rounded-lg transition-colors flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4" /> Approve
                        </button>
                        <button className="px-4 py-2 bg-danger/10 hover:bg-danger/20 text-danger text-sm font-medium border border-danger/30 rounded-lg transition-colors flex items-center gap-2">
                          <XCircle className="w-4 h-4" /> Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Other Placeholders */}
            {['webbuilder', 'video', 'board', 'logs'].includes(activeTab) && (
              <motion.div key={activeTab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="h-full flex items-center justify-center">
                <div className="text-center max-w-md">
                  <div className="w-20 h-20 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(6,182,212,0.15)]">
                    <PenTool className="w-8 h-8 text-cyan-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3 capitalize">{activeTab.replace('-', ' ')} Environment</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    This module is currently establishing secure database connections and preparing the AI sandbox environment. Full deployment scheduled for next phase.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
