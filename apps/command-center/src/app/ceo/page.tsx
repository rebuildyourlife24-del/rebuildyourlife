'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, ShieldCheck, Cpu, Globe2, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function CinematicCommandCenter() {
  const [streamLogs, setStreamLogs] = useState<string[]>([
    "> INITIALIZING DECISION_LEDGER...",
    "> SYNDICATE COMMUNICATION ESTABLISHED.",
    "> REVENUE_GENOME [E-COM] OPTIMIZING AD SPEND..."
  ]);

  useEffect(() => {
    const logs = [
      "> AGENT ATHENA: SEO BLOG PUBLISHED.",
      "> ORION: ROI INCREASED BY 2.4%.",
      "> VAULT: NEW KNOWLEDGE NODE VERIFIED.",
      "> SECURITY: NO ANOMALIES DETECTED.",
      "> SYNDICATE: IDLE CAPACITY AT 14%.",
      "> HERMES: DROPSHIP ORDER #491 FULFILLED.",
      "> APOLLO: META ADS CTR OPTIMAL."
    ];
    
    const interval = setInterval(() => {
      setStreamLogs(prev => {
        const newLog = logs[Math.floor(Math.random() * logs.length)];
        const updated = [...prev, newLog];
        if (updated.length > 6) return updated.slice(updated.length - 6);
        return updated;
      });
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#02040a] text-slate-50 font-sans p-6 overflow-hidden relative">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_rgba(6,182,212,0.03)_0%,_transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 z-0 bg-[url('/grid.svg')] opacity-[0.02] pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 flex justify-between items-center mb-8 border-b border-blue-900/30 pb-4">
        <div className="flex items-center gap-4">
          <div className="text-2xl font-serif font-bold uppercase tracking-[0.2em]">RYL_OS</div>
          <div className="h-4 w-px bg-blue-500/30"></div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_#22d3ee]"></div>
            <span className="font-mono text-xs text-cyan-400 tracking-widest">SYSTEM OPTIMAL</span>
          </div>
        </div>
        <div className="font-mono text-xs text-slate-400 tracking-widest flex items-center gap-3">
          <ShieldCheck className="w-4 h-4 text-blue-500" />
          CEO: AUTHENTICATED
        </div>
      </header>

      {/* Main Grid */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-120px)]">
        
        {/* LEFT: The Syndicate */}
        <div className="col-span-3 bg-[#0a0f19]/60 backdrop-blur-md border border-white/5 rounded-lg p-5 shadow-2xl relative overflow-hidden flex flex-col">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>
          
          <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-4">
            <h2 className="font-mono text-xs text-slate-400 tracking-[0.2em] uppercase">The Syndicate</h2>
            <span className="font-mono text-xs text-blue-400">Active: 42</span>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
            {/* Agent 1 */}
            <div className="flex items-center gap-3 p-3 bg-white/[0.02] border border-white/[0.03] rounded hover:border-blue-500/50 hover:bg-blue-500/5 transition-all cursor-pointer group">
              <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]"></div>
              <div>
                <h4 className="font-semibold text-sm group-hover:text-blue-400 transition-colors">Orion (CEO)</h4>
                <p className="font-mono text-[10px] text-slate-500">Global Overseer</p>
              </div>
            </div>
            {/* Agent 2 */}
            <div className="flex items-center gap-3 p-3 bg-white/[0.02] border border-white/[0.03] rounded hover:border-blue-500/50 hover:bg-blue-500/5 transition-all cursor-pointer group">
              <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]"></div>
              <div>
                <h4 className="font-semibold text-sm group-hover:text-blue-400 transition-colors">Apollo (CMO)</h4>
                <p className="font-mono text-[10px] text-slate-500">Traffic Routing</p>
              </div>
            </div>
            {/* Agent 3 */}
            <div className="flex items-center gap-3 p-3 bg-white/[0.02] border border-white/[0.03] rounded hover:border-amber-500/50 hover:bg-amber-500/5 transition-all cursor-pointer group">
              <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_#f59e0b] animate-pulse"></div>
              <div>
                <h4 className="font-semibold text-sm group-hover:text-amber-400 transition-colors">Hermes (E-Com)</h4>
                <p className="font-mono text-[10px] text-slate-500">AutoDS Fulfillment</p>
              </div>
            </div>
            {/* Agent 4 */}
            <div className="flex items-center gap-3 p-3 bg-white/[0.02] border border-white/[0.03] rounded hover:border-blue-500/50 hover:bg-blue-500/5 transition-all cursor-pointer group">
              <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]"></div>
              <div>
                <h4 className="font-semibold text-sm group-hover:text-blue-400 transition-colors">Athena (SEO)</h4>
                <p className="font-mono text-[10px] text-slate-500">Content Indexing</p>
              </div>
            </div>
          </div>
        </div>

        {/* CENTER: Neural Core */}
        <div className="col-span-5 bg-[#0a0f19]/60 backdrop-blur-md border border-blue-500/20 rounded-lg p-5 shadow-[0_0_40px_rgba(59,130,246,0.1)_inset] relative flex flex-col justify-center items-center">
          <div className="absolute top-4 left-0 right-0 flex justify-center">
            <h2 className="font-mono text-xs text-cyan-400 tracking-[0.2em] uppercase">Neural Processing Stream</h2>
          </div>

          {/* Brain Icon */}
          <motion.div 
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="relative w-48 h-48 my-12"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(6,182,212,0.3)_0%,_transparent_70%)] blur-xl animate-[pulse_3s_infinite_alternate]"></div>
            <Cpu className="w-full h-full text-cyan-400 drop-shadow-[0_0_15px_#22d3ee] opacity-80" strokeWidth={1} />
          </motion.div>

          {/* Live Data Stream */}
          <div className="w-full bg-black/40 border border-white/5 rounded p-4 h-48 overflow-hidden flex flex-col justify-end">
            <div className="space-y-2">
              {streamLogs.map((log, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="font-mono text-[10px] text-cyan-400/80 border-l-2 border-blue-500 pl-3"
                >
                  {log}
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: Governance Inbox */}
        <div className="col-span-4 bg-[#0a0f19]/60 backdrop-blur-md border border-white/5 rounded-lg p-5 shadow-2xl relative flex flex-col">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>
          
          <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-4">
            <h2 className="font-mono text-xs text-slate-400 tracking-[0.2em] uppercase flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              Governance Inbox
            </h2>
            <span className="font-mono text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded">2 Pending</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4">
            {/* Card 1 */}
            <div className="bg-black/40 border border-white/5 border-l-4 border-l-blue-500 p-4 rounded">
              <h5 className="font-mono text-[10px] text-slate-400 mb-2">REQ_ID: 9942-ALPHA</h5>
              <p className="text-sm text-slate-300 mb-4 font-light">Agent Apollo requests €500 budget increase for winning Meta Ad campaign.</p>
              <div className="flex gap-2">
                <button className="flex-1 py-2 border border-cyan-500/50 text-cyan-400 font-mono text-[10px] tracking-widest hover:bg-cyan-500 hover:text-black transition-all flex justify-center items-center gap-2">
                  <CheckCircle2 className="w-3 h-3" /> APPROVE
                </button>
                <button className="flex-1 py-2 border border-white/10 text-slate-400 font-mono text-[10px] tracking-widest hover:bg-white/10 transition-all">
                  DENY
                </button>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-black/40 border border-white/5 border-l-4 border-l-amber-500 p-4 rounded">
              <h5 className="font-mono text-[10px] text-slate-400 mb-2">REQ_ID: 9943-BETA</h5>
              <p className="text-sm text-slate-300 mb-4 font-light">Agent Hermes proposes to kill dropship product SKU-84. CTR below threshold.</p>
              <div className="flex gap-2">
                <button className="flex-1 py-2 border border-amber-500/50 text-amber-500 font-mono text-[10px] tracking-widest hover:bg-amber-500 hover:text-black transition-all flex justify-center items-center gap-2">
                  <CheckCircle2 className="w-3 h-3" /> EXECUTE
                </button>
                <button className="flex-1 py-2 border border-white/10 text-slate-400 font-mono text-[10px] tracking-widest hover:bg-white/10 transition-all">
                  REVIEW DATA
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
