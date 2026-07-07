"use client";

import { useState } from "react";
import { Activity } from "lucide-react";

export function ArgenticSidebar() {
  const [activeTab, setActiveTab] = useState("NEXUS");

  const tabs = [
    'MISSION', 'COMMAND', 'NEXUS', 'BOARDROOM', 'PANOPTICON', 
    'DIGITAL TWIN', 'AGENTS', 'MEMORY', 'GENOME', 'KNOWLEDGE', 
    'RESEARCH', 'OPERATIONS', 'AUTOMATION', 'TREASURY', 
    'SIMULATION', 'REALITY ENGINE', 'AI FACTORY', 'EVOLUTION', 
    'OBSERVABILITY', 'SECURITY', 'SETTINGS'
  ];

  return (
    <div className="flex flex-col gap-6 h-full border-r border-white/[0.02] pr-4">
      <div className="space-y-[2px]">
        {tabs.map((tab) => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`w-full text-left px-4 py-2.5 text-[9px] font-mono uppercase tracking-[0.2em] transition-colors duration-300 border-l-[1.5px] ${
              activeTab === tab 
                ? 'border-[#C8A96B] text-white bg-white/[0.01]' 
                : 'border-transparent text-zinc-600 hover:text-zinc-400 hover:bg-white/[0.005]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="mt-auto p-4 border-t border-white/[0.02]">
        <h3 className="text-[9px] font-mono uppercase tracking-[0.2em] text-zinc-500 mb-4 flex items-center gap-2">
          <Activity className="w-3 h-3" /> System Vitals
        </h3>
        <div className="space-y-3">
          {[
            { label: 'Compute Load', val: '24%', status: 'optimal' },
            { label: 'API Latency', val: '42ms', status: 'optimal' },
            { label: 'Decision Queue', val: '3 Pending', status: 'warning' },
          ].map((stat) => (
            <div key={stat.label} className="flex justify-between items-center">
              <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-600">{stat.label}</span>
              <span className={`text-[10px] font-mono ${stat.status === 'warning' ? 'text-[#C8A96B]' : 'text-zinc-300'}`}>
                {stat.val}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
