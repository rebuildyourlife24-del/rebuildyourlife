'use client';

import React from 'react';
import { Radar, AlertOctagon, TrendingDown, ArrowRight } from 'lucide-react';

export function EarlyWarningRadar() {
  const warnings = [
    {
      title: 'Supplier risk detected',
      probability: 82,
      impact: 'High',
      horizon: '45 days',
      recommendation: 'Find alternative supplier',
      icon: AlertOctagon,
      color: 'text-red-500',
      bg: 'bg-red-500/10 border-red-500/20'
    },
    {
      title: 'Meta costs +50% scenario',
      probability: 64,
      impact: 'Medium',
      horizon: '14 days',
      recommendation: 'Diversify channels',
      icon: TrendingDown,
      color: 'text-orange-500',
      bg: 'bg-orange-500/10 border-orange-500/20'
    }
  ];

  return (
    <div className="flex flex-col h-full bg-[#0B0B0D]/80 backdrop-blur-md border border-zinc-800/50 rounded-xl p-5 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <Radar className="w-32 h-32 text-blue-500 animate-[spin_10s_linear_infinite]" />
      </div>

      <div className="mb-6 relative z-10">
        <h2 className="text-xl font-light tracking-wide text-zinc-100 flex items-center gap-3">
          <Radar className="w-5 h-5 text-blue-400" />
          EARLY WARNING RADAR
        </h2>
        <p className="text-xs text-zinc-400 mt-1 font-mono">PREDICTIVE THREAT MODELING</p>
      </div>

      <div className="flex-1 flex flex-col gap-4 relative z-10">
        {warnings.map((warn, idx) => {
          const Icon = warn.icon;
          return (
            <div key={idx} className={`p-4 rounded-lg border ${warn.bg} flex flex-col gap-3`}>
              <div className="flex items-start gap-3">
                <Icon className={`w-5 h-5 ${warn.color} mt-0.5`} />
                <div className="flex-1">
                  <h3 className={`text-sm font-medium ${warn.color}`}>{warn.title}</h3>
                  <div className="grid grid-cols-3 gap-2 mt-2 text-[10px] font-mono text-zinc-400">
                    <div>
                      <span className="block text-zinc-500">PROBABILITY</span>
                      {warn.probability}%
                    </div>
                    <div>
                      <span className="block text-zinc-500">IMPACT</span>
                      {warn.impact}
                    </div>
                    <div>
                      <span className="block text-zinc-500">HORIZON</span>
                      {warn.horizon}
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-2 pt-2 border-t border-zinc-800/50 flex justify-between items-center text-xs text-zinc-300">
                <span className="text-zinc-500 font-mono text-[10px]">RECOMMENDED ACTION</span>
                <button className="flex items-center gap-1 hover:text-white transition-colors">
                  {warn.recommendation} <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
