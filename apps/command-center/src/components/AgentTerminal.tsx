"use client";

import { useEffect, useState, useRef } from 'react';
import { Terminal, X } from 'lucide-react';
import { motion } from 'framer-motion';

const MOCK_LOGS: Record<string, string[]> = {
  "WEALTH & OPPORTUNITY ENGINE": [
    "> Initializing Meta Ad Library Crawler v2.4...",
    "> Bypassing rate limits (Proxy pool active: 142 nodes)",
    "> Scanning 'Dropshipping' and 'Print on Demand' keywords...",
    "> Found 1,402 active campaigns running > 30 days.",
    "> Analyzing ROI indicators (engagement-to-ad-spend ratio)...",
    "> ALERT: High potential niche identified: 'Ergonomic Home Office'.",
    "> Competitor A ad spend: ~$4k/day. Margin est: 62%.",
    "> Scraping supplier catalogs via AliExpress API...",
    "> Found 12 viable suppliers with <7 days shipping to EU/US.",
    "> Generating 0€ investment strategy...",
    "> Compiling TikTok organic viral hook templates...",
    "> Strategy ready. Waiting for user authorization."
  ],
  "FINANCIËN & BETALINGEN": [
    "> Connecting to Stripe API...",
    "> Fetching recent transactions...",
    "> Verified 14 successful payments.",
    "> Parsing invoice PDF attachments from inbox...",
    "> Warning: 2 unpaid invoices detected (overdue > 5 days).",
    "> Re-calculating cashflow runway...",
    "> Cashflow runway: 142 days.",
    "> Pinging Bank API for balance updates..."
  ],
  "SEO & MARKETING": [
    "> Running Google Lighthouse audits on 4 domains...",
    "> Parsing Google Search Console data...",
    "> Analyzing keyword cannibalization...",
    "> Found 3 long-tail keyword opportunities (Low Competition, High Volume).",
    "> Generating content briefs...",
    "> Dispatching 14 tasks to copywriters...",
    "> Monitoring backlink velocity..."
  ]
};

const DEFAULT_LOGS = [
  "> System ready.",
  "> Awaiting commands.",
  "> Monitoring sub-routines...",
  "> Memory usage: 42%"
];

interface AgentTerminalProps {
  agentTitle: string;
  onClose: () => void;
}

export default function AgentTerminal({ agentTitle, onClose }: AgentTerminalProps) {
  const [logs, setLogs] = useState<string[]>([`> Connected to ${agentTitle} daemon...`]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sourceLogs = MOCK_LOGS[agentTitle] || DEFAULT_LOGS;
    let currentIndex = 0;

    const interval = setInterval(() => {
      if (currentIndex < sourceLogs.length) {
        setLogs(prev => [...prev, sourceLogs[currentIndex]]);
        currentIndex++;
      } else {
        // Loop back to simulate continuous running, or just add ambient dots
        setLogs(prev => [...prev, "> " + Array(Math.floor(Math.random() * 5) + 3).fill('.').join('')]);
      }
    }, Math.random() * 1500 + 500); // Random delay between 0.5s and 2s

    return () => clearInterval(interval);
  }, [agentTitle]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <motion.div 
      initial={{ opacity: 0, x: 50, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 50, scale: 0.95 }}
      className="absolute right-4 top-24 bottom-24 w-80 lg:w-96 bg-black/80 backdrop-blur-md border border-cyan-500/30 rounded-xl overflow-hidden shadow-[0_0_30px_rgba(0,240,255,0.1)] z-50 flex flex-col"
    >
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-cyan-950/40 border-b border-cyan-500/20">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-mono text-cyan-400">{agentTitle}_LIVE_STREAM</span>
        </div>
        <button onClick={onClose} className="text-cyan-500 hover:text-cyan-300 transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Terminal Body */}
      <div 
        ref={scrollRef}
        className="flex-1 p-4 overflow-y-auto font-mono text-xs md:text-sm custom-scrollbar"
      >
        {logs.map((log, i) => (
          <div 
            key={i} 
            className={`mb-2 ${log.includes('ALERT') || log.includes('Warning') ? 'text-amber-400' : 'text-cyan-300/80'} ${i === logs.length - 1 ? 'animate-pulse' : ''}`}
          >
            {log}
          </div>
        ))}
        {/* Blinking cursor */}
        <div className="w-2 h-4 bg-cyan-400 animate-pulse mt-2" />
      </div>
    </motion.div>
  );
}
