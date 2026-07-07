"use client";

import { Shield, ChevronRight } from "lucide-react";

export function GeminiBoardroom() {
  return (
    <div className="border border-[#C8A96B]/10 bg-[#050505]/60 backdrop-blur-md p-6 flex flex-col shadow-[inset_0_0_30px_rgba(200,169,107,0.015)] h-full">
      <div className="flex justify-between items-center mb-8 border-b border-white/[0.02] pb-4">
        <h2 className="text-sm font-serif text-[#C8A96B] tracking-wide flex items-center gap-2">
          <Shield className="w-4 h-4 opacity-50" /> Gemini Boardroom
        </h2>
        <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">1 Pending Approval</span>
      </div>
      
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[9px] text-zinc-600 font-mono uppercase tracking-[0.2em]">Decision Reference</span>
            <span className="text-[9px] text-zinc-300 font-mono uppercase bg-white/[0.02] border border-white/[0.04] px-2 py-0.5">#482-DE-EXP</span>
          </div>
          
          <h3 className="text-2xl font-serif font-light tracking-tight text-white mb-3">
            Expand Germany Market
          </h3>
          
          <p className="text-xs text-zinc-400 font-light leading-relaxed max-w-xl font-sans mb-8">
            Nexus Core detecteert een sterke verschuiving in marktsentiment (DACH regio). Simulaties voorspellen 92% ROI zekerheid bij een kapitaalinjectie van €25.000.
          </p>
        </div>
        
        <div>
          <div className="grid grid-cols-3 gap-1 mb-8">
            <div className="border border-white/[0.02] bg-white/[0.005] p-3 flex flex-col gap-1">
              <span className="text-[8px] text-zinc-600 uppercase tracking-widest font-mono">Growth AI</span>
              <span className="text-zinc-300 text-[10px] font-mono uppercase tracking-widest flex items-center gap-1.5">
                <span className="w-1 h-1 bg-white"></span> GO
              </span>
            </div>
            <div className="border border-white/[0.02] bg-white/[0.005] p-3 flex flex-col gap-1">
              <span className="text-[8px] text-zinc-600 uppercase tracking-widest font-mono">Finance AI</span>
              <span className="text-[#C8A96B] text-[10px] font-mono uppercase tracking-widest flex items-center gap-1.5">
                <span className="w-1 h-1 bg-[#C8A96B]"></span> LIMITED GO
              </span>
            </div>
            <div className="border border-white/[0.02] bg-white/[0.005] p-3 flex flex-col gap-1">
              <span className="text-[8px] text-zinc-600 uppercase tracking-widest font-mono">Risk AI</span>
              <span className="text-zinc-500 text-[10px] font-mono uppercase tracking-widest flex items-center gap-1.5">
                <span className="w-1 h-1 bg-zinc-600"></span> WAIT
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            <button className="flex-1 bg-white hover:bg-zinc-200 text-black text-[9px] font-mono uppercase tracking-widest py-3 transition-colors">
              Approve
            </button>
            <button className="flex-1 border border-[#C8A96B]/20 hover:bg-[#C8A96B]/10 text-[#C8A96B] text-[9px] font-mono uppercase tracking-widest py-3 transition-colors">
              Simulate
            </button>
            <button className="flex-1 border border-white/[0.04] hover:bg-white/[0.02] text-zinc-400 text-[9px] font-mono uppercase tracking-widest py-3 transition-colors">
              Reject
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
