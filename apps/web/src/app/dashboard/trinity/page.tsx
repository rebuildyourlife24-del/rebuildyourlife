'use client';

import { useState } from 'react';
import { TrinityChat } from '@/components/TrinityChat';
import { SovereignCodex } from '@/components/SovereignCodex';
import { Shield, Brain, Network, BookOpen } from 'lucide-react';

export default function TrinityWorkspacePage() {
  const [isCodexOpen, setIsCodexOpen] = useState(false);

  return (
    <div className="flex h-[calc(100vh-6rem)] gap-6 p-6 relative">
      
      {/* Sidebar: System Status */}
      <div className="w-1/4 hidden lg:flex flex-col gap-4">
        
        {/* Protocol Guide Button */}
        <button 
          onClick={() => setIsCodexOpen(true)}
          className="bg-cyan-950/40 border border-cyan-500/50 hover:bg-cyan-900/50 rounded-2xl p-4 backdrop-blur-xl transition-all group flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <BookOpen className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
            <h3 className="text-white font-black tracking-widest uppercase text-sm">Protocol Guide</h3>
          </div>
          <span className="text-[10px] text-cyan-400 font-mono uppercase bg-cyan-950/80 px-2 py-1 rounded">Open Codex</span>
        </button>

        <div className="bg-black/40 border border-cyan-900/30 rounded-2xl p-5 backdrop-blur-xl">
          <div className="flex items-center gap-3 mb-4 border-b border-cyan-900/30 pb-3">
            <Shield className="w-5 h-5 text-cyan-400" />
            <h3 className="text-white font-black tracking-widest uppercase text-sm">Sovereign Grid</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-zinc-500">RYL Agents Active</span>
              <span className="text-cyan-400">50 / 50</span>
            </div>
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-zinc-500">Neural Network</span>
              <span className="text-emerald-400">SYNCING</span>
            </div>
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-zinc-500">Hermes Learning</span>
              <span className="text-emerald-400">ONLINE</span>
            </div>
          </div>
        </div>

        <div className="flex-1 bg-black/40 border border-emerald-900/30 rounded-2xl p-5 backdrop-blur-xl flex flex-col">
          <div className="flex items-center gap-3 mb-4 border-b border-emerald-900/30 pb-3">
            <Brain className="w-5 h-5 text-emerald-400" />
            <h3 className="text-white font-black tracking-widest uppercase text-sm">Hermes Analytics</h3>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50">
            <Network className="w-8 h-8 text-emerald-500 mb-3 opacity-50" />
            <p className="text-xs text-emerald-100 font-mono">
              Hermes is momenteel de data van 50 agents aan het analyseren.
              Voorspellingen verschijnen hier.
            </p>
          </div>
        </div>

      </div>

      {/* Main Area: Trinity Chat */}
      <div className="flex-1 h-full">
        <TrinityChat />
      </div>

      {/* Sovereign Codex Overlay */}
      <SovereignCodex isOpen={isCodexOpen} onClose={() => setIsCodexOpen(false)} />

    </div>
  );
}
