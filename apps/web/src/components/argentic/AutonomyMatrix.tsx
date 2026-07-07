'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, ShieldCheck, Activity, Brain, Lock, Globe } from 'lucide-react';

export function AutonomyMatrix() {
  const [autonomy] = useState({
    decision: 80,
    financial: 40,
    operational: 70,
    communication: 30,
    learning: 100,
  });

  const getStatusColor = (val: number) => {
    if (val < 40) return 'text-zinc-500 bg-zinc-900 border-zinc-700';
    if (val < 80) return 'text-blue-400 bg-blue-900/20 border-blue-800';
    return 'text-red-400 bg-red-900/20 border-red-800';
  };

  const getProgressColor = (val: number) => {
    if (val < 40) return 'bg-zinc-600';
    if (val < 80) return 'bg-blue-500';
    return 'bg-red-500';
  };

  const dimensions = [
    { key: 'decision', label: 'Decision Authority', icon: Brain },
    { key: 'financial', label: 'Financial Authority', icon: Lock },
    { key: 'operational', label: 'Operational Authority', icon: Activity },
    { key: 'communication', label: 'Communication Authority', icon: Globe },
    { key: 'learning', label: 'Learning Authority', icon: ShieldCheck },
  ];

  return (
    <div className="flex flex-col h-full bg-[#0B0B0D]/80 backdrop-blur-md border border-zinc-800/50 rounded-xl p-5 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-2">
        <div className="text-[10px] font-mono tracking-widest text-zinc-500 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          SOVEREIGN CONTROL PLANE
        </div>
      </div>

      <div className="mb-6 mt-2">
        <h2 className="text-xl font-light tracking-wide text-zinc-100 flex items-center gap-3">
          <ShieldAlert className="w-5 h-5 text-red-500" />
          AUTONOMY MATRIX
        </h2>
        <p className="text-xs text-zinc-400 mt-1 font-mono">5-DIMENSIONAL RISK-ADAPTIVE CONTROL</p>
      </div>

      <div className="flex-1 flex flex-col gap-4 justify-center">
        {dimensions.map((dim) => {
          const val = autonomy[dim.key as keyof typeof autonomy];
          const Icon = dim.icon;
          return (
            <div key={dim.key} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-300 flex items-center gap-2">
                  <Icon className="w-3 h-3 text-zinc-500" />
                  {dim.label}
                </span>
                <span className={`px-2 py-0.5 rounded border ${getStatusColor(val)}`}>
                  {val}%
                </span>
              </div>
              <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${val}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className={`h-full ${getProgressColor(val)}`}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-zinc-800/50 flex justify-between items-center text-xs font-mono text-zinc-500">
        <div>STATUS: <span className="text-blue-400">ACTIVE</span></div>
        <div>ADAPTIVE MODE: <span className="text-red-400">HIGH-RISK DETECTED</span></div>
      </div>
    </div>
  );
}
