"use client";

import { useEffect, useState, useRef } from 'react';
import { Terminal, X } from 'lucide-react';
import { motion } from 'framer-motion';

const MOCK_LOGS: Record<string, string[]> = {
  "AFFILIATE SWARM": [
    "> Scanning affiliate networks for high-converting offers...",
    "> Found 47 programs with >8% conversion rate.",
    "> Deploying link rotation across 12 content pages...",
    "> Revenue attribution tracking: ACTIVE",
    "> Daily commission estimate: €142.30",
  ],
  "ADS OPTIMIZER": [
    "> Initializing Meta Ad Library analysis...",
    "> Scanning 1,402 active campaigns (>30 days).",
    "> High potential niche: 'Ergonomic Home Office' — margin 62%.",
    "> A/B test batch #47 deployed — 3 creative variants.",
    "> Budget reallocation: shifting €200 from Set B → Set A.",
  ],
  "DIGITAL PRODUCTS": [
    "> Monitoring Gumroad & LemonSqueezy storefronts...",
    "> 3 new downloads in the last hour.",
    "> Generating upsell email sequence for buyers...",
    "> Product page conversion rate: 4.8% (target: 5%)",
  ],
  "SAAS ENGINE": [
    "> Active subscribers: 124 (MRR: €3,100)",
    "> Churn prediction model updated — 2 at-risk accounts.",
    "> Automated retention email triggered for user #89.",
    "> Feature usage heatmap analysis complete.",
  ],
  "DROPSHIP": [
    "> Checking supplier inventory levels...",
    "> 8 orders fulfilled, 3 pending shipment.",
    "> AliExpress API: 12 suppliers with <7 day EU shipping.",
    "> Profit margin check: all products above 35% threshold.",
  ],
  "FREEMIUM FUNNELS": [
    "> Lead magnet downloads today: 67",
    "> Email sequence open rate: 42% (excellent)",
    "> Conversion to paid: 2.1% — testing new CTA...",
    "> A/B test on landing page header: Variant B winning +18%",
  ],
};

const DEFAULT_LOGS = [
  "> System ready.",
  "> Awaiting commands...",
  "> Monitoring sub-routines...",
];

interface AgentTerminalProps {
  agentTitle: string;
  onClose: () => void;
}

export default function AgentTerminal({ agentTitle, onClose }: AgentTerminalProps) {
  const [logs, setLogs] = useState<string[]>([`> Connected to ${agentTitle}...`]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sourceLogs = MOCK_LOGS[agentTitle] || DEFAULT_LOGS;
    let currentIndex = 0;

    const interval = setInterval(() => {
      if (currentIndex < sourceLogs.length) {
        setLogs(prev => [...prev, sourceLogs[currentIndex]]);
        currentIndex++;
      } else {
        setLogs(prev => [...prev, "> " + Array(Math.floor(Math.random() * 4) + 2).fill('.').join('')]);
      }
    }, Math.random() * 1200 + 600);

    return () => clearInterval(interval);
  }, [agentTitle]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="h-full flex flex-col bg-transparent">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
            <Terminal className="w-3.5 h-3.5 text-cyan-400/80" />
          </div>
          <div>
            <span className="text-xs font-medium text-white/70">{agentTitle}</span>
            <p className="text-[9px] font-mono text-white/25">LIVE STREAM</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
        >
          <X className="w-3.5 h-3.5 text-white/40" />
        </button>
      </div>

      {/* Log Body */}
      <div
        ref={scrollRef}
        className="flex-1 p-6 overflow-y-auto font-mono text-[12px] leading-relaxed custom-scrollbar space-y-2"
      >
        {logs.map((log, i) => (
          <div
            key={i}
            className={`${
              log?.includes('ALERT') || log?.includes('Warning') || log?.includes('at-risk')
                ? 'text-rose-300/70'
                : log?.includes('Found') || log?.includes('excellent') || log?.includes('winning')
                ? 'text-emerald-300/60'
                : 'text-white/35'
            } ${i === logs.length - 1 ? 'text-white/50' : ''}`}
          >
            {log}
          </div>
        ))}
        {/* Blinking cursor */}
        <div className="w-2 h-4 bg-cyan-400/50 cursor-blink mt-1" />
      </div>
    </div>
  );
}
