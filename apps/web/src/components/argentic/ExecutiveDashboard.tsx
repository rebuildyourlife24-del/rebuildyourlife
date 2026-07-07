'use client';

import React from 'react';
import { Shield, Brain, Target, LineChart, Activity, TrendingUp, AlertTriangle } from 'lucide-react';

export function ExecutiveDashboard() {
  const metrics = [
    { label: 'Decision Quality Index', value: '88/100', trend: '+4', icon: Brain, color: 'text-indigo-400' },
    { label: 'Trust Index', value: '94%', trend: '+1.2%', icon: Shield, color: 'text-emerald-400' },
    { label: 'Capital Safety', value: 'High', details: '>180 Days Runway', icon: Activity, color: 'text-blue-400' },
    { label: 'Prediction Accuracy', value: '92.5%', trend: '+3.1%', icon: LineChart, color: 'text-purple-400' },
    { label: 'Knowledge Growth', value: '24 Rules', trend: 'Validated this week', icon: TrendingUp, color: 'text-amber-400' }
  ];

  const objectives = [
    { name: 'Revenue Growth', weight: '40%', progress: 75 },
    { name: 'Cash Preservation', weight: '30%', progress: 90 },
    { name: 'Customer Satisfaction', weight: '15%', progress: 85 },
    { name: 'Operational Efficiency', weight: '15%', progress: 60 }
  ];

  return (
    <div className="bg-black border border-white/10 rounded-xl p-6 text-white font-sans">
      <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
        <h2 className="text-xl font-light tracking-wide flex items-center gap-3">
          <Activity className="w-5 h-5 text-indigo-400" />
          EXECUTIVE INTELLIGENCE DASHBOARD
        </h2>
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-400/20">
          <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
          SYSTEM ALIGNED
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        {metrics.map((m, idx) => (
          <div key={idx} className="bg-white/5 border border-white/10 rounded-lg p-4 flex flex-col hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-2 text-white/50 text-xs mb-3 font-mono uppercase tracking-wider">
              <m.icon className={`w-4 h-4 ${m.color}`} />
              {m.label}
            </div>
            <div className="text-2xl font-light tracking-tight mb-1">{m.value}</div>
            <div className="text-xs text-white/40">{m.trend || m.details}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Objective Progress */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-5">
          <h3 className="text-sm text-white/60 font-mono mb-6 uppercase tracking-wider flex items-center gap-2">
            <Target className="w-4 h-4 text-emerald-400" />
            Objective Alignment
          </h3>
          <div className="space-y-5">
            {objectives.map((obj, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-light">{obj.name}</span>
                  <span className="text-white/50 text-xs font-mono">WT: {obj.weight}</span>
                </div>
                <div className="w-full bg-black rounded-full h-1.5 overflow-hidden border border-white/10">
                  <div 
                    className="bg-emerald-400 h-full rounded-full" 
                    style={{ width: `${obj.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enterprise Health Radar / Constraints */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-5">
          <h3 className="text-sm text-white/60 font-mono mb-6 uppercase tracking-wider flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            Active Constraints
          </h3>
          <div className="space-y-3">
            {[
              { rule: 'Cash runway > 180 days', status: 'PASS', val: '240 Days' },
              { rule: 'Debt ratio < 30%', status: 'PASS', val: '12%' },
              { rule: 'Refund rate < 3%', status: 'PASS', val: '1.8%' },
              { rule: 'CPA < €35', status: 'WARNING', val: '€32.50' }
            ].map((c, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-black border border-white/5 rounded">
                <span className="text-sm font-light text-white/80">{c.rule}</span>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-white/40">{c.val}</span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                    c.status === 'PASS' 
                      ? 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20' 
                      : 'bg-amber-400/10 text-amber-400 border-amber-400/20'
                  }`}>
                    {c.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
