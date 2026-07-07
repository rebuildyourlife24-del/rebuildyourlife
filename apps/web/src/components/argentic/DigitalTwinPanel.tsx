"use client";

import { motion } from "framer-motion";

export function DigitalTwinPanel() {
  const stats = [
    { label: 'Revenue Velocity', val: 84, trend: '+2.4%' },
    { label: 'Growth Trajectory', val: 91, trend: '+1.1%' },
    { label: 'Risk Exposure', val: 18, trend: '-0.5%' },
    { label: 'AI Cognitive Health', val: 96, trend: 'Optimal' },
  ];

  return (
    <div className="border border-white/[0.02] bg-[#050505]/40 backdrop-blur-md p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-8 border-b border-white/[0.02] pb-4">
        <h2 className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500">
          Digital Twin
        </h2>
      </div>
      
      <div className="space-y-6 flex-1 flex flex-col justify-center">
        {stats.map((stat, idx) => (
          <div key={stat.label} className="group">
            <div className="flex justify-between items-baseline mb-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">{stat.label}</span>
              <span className="text-[9px] font-mono text-zinc-600 group-hover:text-zinc-400 transition-colors">{stat.trend}</span>
            </div>
            <div className="h-px w-full bg-white/[0.02] relative">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${stat.val}%` }}
                transition={{ duration: 1.5, delay: 0.2 + (idx * 0.1), ease: [0.22, 1, 0.36, 1] }}
                className={`absolute top-0 left-0 h-full ${stat.label.includes('Risk') ? 'bg-zinc-700' : 'bg-white/40'}`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
