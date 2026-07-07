'use client';

import React from 'react';
import { Gavel, Scale, AlertTriangle, Fingerprint, BrainCircuit } from 'lucide-react';
import { motion } from 'framer-motion';

export function AICourt() {
  const testimonies = [
    {
      role: 'STRATEGY AI',
      icon: BrainCircuit,
      position: 'Approve',
      evidence: 'Historical campaign ROI > 120%',
      confidence: 91,
      risk: 'Medium',
      color: 'text-blue-400',
    },
    {
      role: 'FINANCE AI',
      icon: Scale,
      position: 'Challenge',
      evidence: 'Projected revenue ignores inventory constraints.',
      confidence: 88,
      risk: 'High',
      color: 'text-orange-400',
    },
    {
      role: 'RISK AI',
      icon: AlertTriangle,
      position: 'Wait',
      evidence: 'Market volatility in ad-spend detected.',
      confidence: 94,
      risk: 'High',
      color: 'text-red-400',
    },
    {
      role: 'ETHICS AI',
      icon: Fingerprint,
      position: 'Pass',
      evidence: 'No brand safety violations in copy.',
      confidence: 99,
      risk: 'Low',
      color: 'text-zinc-400',
    }
  ];

  return (
    <div className="flex flex-col h-full bg-[#0B0B0D]/80 backdrop-blur-md border border-zinc-800/50 rounded-xl p-5 relative">
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h2 className="text-xl font-light tracking-wide text-zinc-100 flex items-center gap-3">
            <Gavel className="w-5 h-5 text-purple-500" />
            AI COURT TRIBUNAL
          </h2>
          <p className="text-xs text-zinc-400 mt-1 font-mono">MULTI-AGENT CROSS-EXAMINATION</p>
        </div>
        <div className="px-3 py-1 bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 rounded text-[10px] font-mono tracking-wider animate-pulse">
          3 DECISIONS PENDING
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
        {testimonies.map((t, idx) => {
          const Icon = t.icon;
          return (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-black/40 border border-zinc-800/50 p-3 rounded-lg flex flex-col gap-2"
            >
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono text-zinc-500 flex items-center gap-1.5">
                  <Icon className="w-3 h-3" />
                  {t.role}
                </span>
                <span className={`text-xs font-mono font-bold ${t.color}`}>
                  {t.position}
                </span>
              </div>
              <p className="text-sm text-zinc-300 font-light border-l-2 border-zinc-800 pl-3 py-1">
                "{t.evidence}"
              </p>
              <div className="flex justify-between text-[10px] font-mono text-zinc-600">
                <span>CONFIDENCE: {t.confidence}%</span>
                <span>RISK: {t.risk}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-zinc-800 flex justify-between items-center">
        <div className="text-xs font-mono text-zinc-500">
          STATUS: <span className="text-orange-400">DELIBERATING</span>
        </div>
        <button className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-mono rounded tracking-wider transition-colors">
          OVERRIDE RULING
        </button>
      </div>
    </div>
  );
}
