'use client';

import React from 'react';
import { Gavel, Target, Activity, AlertTriangle, CheckCircle, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';

export function AICourt() {
  const dqiDimensions = [
    { label: 'Evidence Quality', val: 90 },
    { label: 'Strategic Align', val: 85 },
    { label: 'Financial Impact', val: 75 },
    { label: 'Risk Exposure', val: 60 },
    { label: 'Forecast Stability', val: 80 }
  ];

  const scenarios = [
    { type: 'EXPECTED', outcome: 'ROI +24%, CPA stable', prob: '60%', color: 'text-emerald-400' },
    { type: 'BEST CASE', outcome: 'ROI +45%, CPA drops 10%', prob: '15%', color: 'text-blue-400' },
    { type: 'WORST CASE', outcome: 'ROI -5%, CPA spikes 20%', prob: '20%', color: 'text-orange-400' },
    { type: 'BLACK SWAN', outcome: 'Ad account suspended', prob: '5%', color: 'text-red-400' }
  ];

  return (
    <div className="flex flex-col h-full bg-[#0B0B0D]/90 backdrop-blur-md border border-white/10 rounded-xl p-5 relative font-sans text-white">
      <div className="mb-5 border-b border-white/10 pb-4 flex justify-between items-start">
        <div>
          <h2 className="text-xl font-light tracking-wide flex items-center gap-3">
            <Gavel className="w-5 h-5 text-indigo-400" />
            CONSTITUTIONAL COMPLIANCE
          </h2>
          <p className="text-xs text-white/50 mt-1 font-mono uppercase">Executive Brief & Scenario Simulation</p>
        </div>
        <div className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded text-[10px] font-mono tracking-wider">
          DQI: 88/100
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-6 custom-scrollbar">
        {/* Executive Brief Section */}
        <div>
          <h3 className="text-xs font-mono text-white/50 mb-3 flex items-center gap-2">
            <Target className="w-3 h-3" />
            SITUATION & RECOMMENDATION
          </h3>
          <div className="bg-black/50 border border-white/5 p-4 rounded-lg space-y-3 text-sm font-light text-white/80">
            <div className="grid grid-cols-4 gap-2">
              <span className="text-white/40 font-mono text-xs">OBJECTIVE:</span>
              <span className="col-span-3 text-emerald-400">Revenue Growth (40% Weight)</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              <span className="text-white/40 font-mono text-xs">EVIDENCE:</span>
              <span className="col-span-3">High confidence from recent market signals on campaign #C9.</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              <span className="text-white/40 font-mono text-xs">PROPOSAL:</span>
              <span className="col-span-3">Scale budget by 20% across top performing ad-sets.</span>
            </div>
          </div>
        </div>

        {/* DQI Radar / Bars */}
        <div>
          <h3 className="text-xs font-mono text-white/50 mb-3 flex items-center gap-2">
            <Activity className="w-3 h-3" />
            DECISION QUALITY MATRIX (TOP 5)
          </h3>
          <div className="grid grid-cols-1 gap-2">
            {dqiDimensions.map((d, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs font-mono">
                <span className="text-white/60 w-1/3">{d.label}</span>
                <div className="flex-1 mx-3 bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${d.val}%` }}
                    className="bg-indigo-400 h-full"
                  />
                </div>
                <span className="text-white/80 w-8 text-right">{d.val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 4-Scenario Simulation */}
        <div>
          <h3 className="text-xs font-mono text-white/50 mb-3 flex items-center gap-2">
            <ShieldAlert className="w-3 h-3" />
            4-SCENARIO SIMULATION
          </h3>
          <div className="space-y-2">
            {scenarios.map((s, idx) => (
              <div key={idx} className="bg-black/40 border border-white/5 p-3 rounded flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border border-current ${s.color} bg-current/10 w-24 text-center`}>
                    {s.type}
                  </span>
                  <span className="text-sm font-light text-white/80">{s.outcome}</span>
                </div>
                <span className="text-xs font-mono text-white/40">{s.prob}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-white/10 flex justify-between items-center">
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
          <CheckCircle className="w-4 h-4" />
          GOVERNANCE: APPROVE WITH LIMITS
        </div>
        <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-mono rounded tracking-wider transition-colors">
          AUTHORIZE EXECUTION
        </button>
      </div>
    </div>
  );
}
