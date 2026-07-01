"use client";

import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { Activity, Terminal } from "lucide-react";

interface LogEntry {
  id: string;
  timestamp: string;
  agent: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
}

export function AgentLiveTerminal({ title = "Live Agent Matrix" }: { title?: string }) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Fake live data generator for the POC
  useEffect(() => {
    const agents = ["CEO", "CFO", "CMO", "SEO", "CRO"];
    const actions = [
      "Analyzing Shopify revenue data...",
      "Found potential ad fatigue on Meta Ad #1039",
      "Scanning organic keywords for niche overlap",
      "Calculated net profit margin for Q3: 31.4%",
      "A/B testing Hero Section button colors",
      "Pushing update to GraphQL API...",
      "Syncing new product data from supplier"
    ];

    const generateLog = () => {
      const agent = agents[Math.floor(Math.random() * agents.length)];
      const message = actions[Math.floor(Math.random() * actions.length)];
      const types: ("info" | "success" | "warning")[] = ["info", "info", "info", "success", "warning"];
      const type = types[Math.floor(Math.random() * types.length)];

      const newLog: LogEntry = {
        id: Math.random().toString(36).substring(7),
        timestamp: new Date().toLocaleTimeString('nl-NL', { hour12: false }),
        agent,
        message,
        type
      };

      setLogs(prev => {
        const newLogs = [...prev, newLog];
        return newLogs.slice(-50); // Keep last 50 logs
      });
    };

    // Initial logs
    for (let i = 0; i < 5; i++) {
      generateLog();
    }

    const interval = setInterval(() => {
      if (Math.random() > 0.3) {
        generateLog();
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const getColor = (type: string) => {
    switch (type) {
      case 'success': return 'text-emerald-400';
      case 'warning': return 'text-amber-400';
      case 'error': return 'text-red-400';
      default: return 'text-cyan-400';
    }
  };

  return (
    <div className="bg-[#050505] border border-white/10 rounded-2xl overflow-hidden flex flex-col h-[400px]">
      <div className="bg-white/5 border-b border-white/10 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal size={16} className="text-zinc-400" />
          <span className="text-xs font-mono text-zinc-300 uppercase tracking-widest">{title}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[10px] text-emerald-500 font-mono tracking-widest uppercase">System Online</span>
        </div>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto font-mono text-xs space-y-2 custom-scrollbar relative">
        {logs.map((log) => (
          <motion.div
            key={log.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-start gap-3"
          >
            <span className="text-zinc-600 shrink-0">[{log.timestamp}]</span>
            <span className={`shrink-0 font-bold ${getColor(log.type)}`}>[{log.agent}]</span>
            <span className="text-zinc-300">{log.message}</span>
          </motion.div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
