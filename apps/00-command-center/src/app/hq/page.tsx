"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DollarSign, BarChart2, Globe, ShoppingCart, Code, Users, Brain,
  Shield, Activity, Eye, Terminal, ChevronRight, Cpu, Wifi, Lock,
  TrendingUp, Zap, Database, Radio, Layers, ArrowUpRight
} from 'lucide-react';

import CommandBar, { OrionState } from '@/components/CommandBar';
import AgentTerminal from '@/components/AgentTerminal';
import { useOrionVoice } from '@/hooks/useOrionVoice';
import SettingsMenu from '@/components/SettingsMenu';

// =====================================================
// DATA
// =====================================================
const AGENTS = [
  { id: 1, title: "AFFILIATE",     icon: DollarSign,  status: "DEPLOYING",  color: "#34d399", revenue: "€2.847",  trend: "+12%", load: 72 },
  { id: 2, title: "ADS ENGINE",    icon: BarChart2,   status: "A/B TEST",   color: "#a78bfa", revenue: "€1.204",  trend: "+8%",  load: 58 },
  { id: 3, title: "DIGITAL",       icon: Code,        status: "LIVE",       color: "#60a5fa", revenue: "€892",    trend: "+24%", load: 41 },
  { id: 4, title: "SAAS",          icon: Users,       status: "RETENTIE",   color: "#f472b6", revenue: "€3.100",  trend: "+5%",  load: 84 },
  { id: 5, title: "DROPSHIP",      icon: ShoppingCart, status: "FULFILLING", color: "#fb923c", revenue: "€1.560",  trend: "+18%", load: 63 },
  { id: 6, title: "FUNNELS",       icon: Globe,       status: "CONVERTING", color: "#22d3ee", revenue: "€640",    trend: "+31%", load: 37 },
];

const LIVE_FEED = [
  { time: "05:09", msg: "Measure Twice verification passed", type: "ok" },
  { time: "05:07", msg: "Affiliate link rotation deployed — 12 pages", type: "ok" },
  { time: "05:05", msg: "Ads budget blocked: margin < 12%", type: "alert" },
  { time: "05:03", msg: "430 market reports indexed to RAG memory", type: "info" },
  { time: "05:01", msg: "SAAS churn prediction — 2 at-risk", type: "warn" },
  { time: "04:58", msg: "DropShip prompt corrected by Master AI", type: "ok" },
  { time: "04:55", msg: "Funnel A/B test: Variant B winning +18%", type: "ok" },
  { time: "04:52", msg: "Digital product download spike detected", type: "info" },
];

// =====================================================
// HOLOGRAM SVG RINGS
// =====================================================
function HoloRings() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {/* Outer measurement ring */}
      <svg className="absolute w-[340px] h-[340px] ring-spin opacity-[0.12]" viewBox="0 0 200 200" fill="none">
        <circle cx="100" cy="100" r="97" stroke="rgba(34,211,238,0.4)" strokeWidth="0.3" strokeDasharray="2 6" />
        {Array.from({ length: 72 }).map((_, i) => {
          const a = (i * 5) * (Math.PI / 180);
          const r1 = 93, r2 = i % 6 === 0 ? 88 : 91;
          return <line key={i} x1={100+Math.cos(a)*r1} y1={100+Math.sin(a)*r1} x2={100+Math.cos(a)*r2} y2={100+Math.sin(a)*r2} stroke="rgba(34,211,238,0.3)" strokeWidth={i%6===0?"0.8":"0.3"} />;
        })}
      </svg>
      {/* Middle ring */}
      <svg className="absolute w-[270px] h-[270px] ring-spin-rev opacity-[0.08]" viewBox="0 0 200 200" fill="none">
        <circle cx="100" cy="100" r="97" stroke="rgba(255,255,255,0.2)" strokeWidth="0.3" strokeDasharray="1 10" />
      </svg>
      {/* Inner ring */}
      <svg className="absolute w-[210px] h-[210px] ring-spin-slow opacity-[0.06]" viewBox="0 0 200 200" fill="none">
        <circle cx="100" cy="100" r="97" stroke="rgba(244,63,94,0.2)" strokeWidth="0.3" strokeDasharray="4 4" />
      </svg>
    </div>
  );
}

// =====================================================
// AI HOLOGRAM DISPLAY
// =====================================================
function AIHologram({ orionState }: { orionState: OrionState }) {
  const active = orionState !== 'IDLE';
  return (
    <div className="relative flex items-center justify-center h-full">
      {/* Deep glow */}
      <div className={`absolute w-80 h-80 rounded-full transition-all duration-[2000ms] ${active ? 'opacity-25 scale-110' : 'opacity-10'}`}
        style={{ background: 'radial-gradient(circle, rgba(34,211,238,0.5) 0%, rgba(34,211,238,0.1) 35%, transparent 65%)', filter: 'blur(50px)' }}
      />
      {/* Rings */}
      <HoloRings />
      {/* Hologram layers */}
      <div className="relative z-10">
        <div className="absolute inset-0 w-52 h-68 bg-contain bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/hologram_head.png')", filter: 'blur(14px) brightness(2.5)', opacity: active ? 0.2 : 0.08, mixBlendMode: 'screen' }}
        />
        <div className="absolute inset-0 w-52 h-68 bg-contain bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/hologram_head.png')", filter: 'brightness(1.5) saturate(2) hue-rotate(180deg)', opacity: active ? 0.35 : 0.15, mixBlendMode: 'screen' }}
        />
        <div className={`w-52 h-68 bg-contain bg-center bg-no-repeat hologram-alive ${active ? 'opacity-90' : 'opacity-55'}`}
          style={{ backgroundImage: "url('/hologram_head.png')", filter: `brightness(${active ? 1.3 : 1.05}) saturate(1.4)`, mixBlendMode: 'screen' }}
        />
      </div>
      {/* Status */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
        <div className={`w-1.5 h-1.5 rounded-full status-dot ${
          orionState==='IDLE'?'bg-emerald-400 text-emerald-400':orionState==='THINKING'?'bg-cyan-400 text-cyan-400':
          orionState==='EXECUTING'?'bg-blue-400 text-blue-400':orionState==='COMPLETED'?'bg-emerald-400 text-emerald-400':'bg-rose-400 text-rose-400'
        }`} />
        <span className="font-mono text-[9px] tracking-[0.3em] text-white/35 uppercase">ORION · {orionState}</span>
      </div>
    </div>
  );
}

// =====================================================
// LIVE FEED PANEL (Bottom-left floating)
// =====================================================
function LiveFeed() {
  return (
    <div className="holo-panel rounded-2xl p-5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Radio className="w-3.5 h-3.5 text-cyan-400/50" />
          <span className="text-[10px] font-mono text-white/30 tracking-[0.2em] uppercase">Live Feed</span>
        </div>
        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 status-dot text-cyan-400" />
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2.5 data-stream">
        {LIVE_FEED.map((log, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
            className="flex gap-3 items-start"
          >
            <span className="text-[8px] font-mono text-white/15 mt-1 shrink-0 w-7 tabular-nums">{log.time}</span>
            <div className={`w-1 h-1 rounded-full mt-1.5 shrink-0 ${
              log.type==='alert'?'bg-rose-400':log.type==='warn'?'bg-amber-400':log.type==='ok'?'bg-emerald-400/60':'bg-white/15'
            }`} />
            <span className={`text-[10px] leading-relaxed ${
              log.type==='alert'?'text-rose-300/60':log.type==='warn'?'text-amber-300/50':'text-white/30'
            }`}>{log.msg}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// =====================================================
// NEURAL OVERVIEW (shows connections & load)
// =====================================================
function NeuralOverview() {
  return (
    <div className="holo-panel rounded-2xl p-5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Layers className="w-3.5 h-3.5 text-violet-400/50" />
          <span className="text-[10px] font-mono text-white/30 tracking-[0.2em] uppercase">Neural Load</span>
        </div>
        <span className="text-[9px] font-mono text-emerald-400/40">HEALTHY</span>
      </div>
      <div className="flex-1 flex flex-col gap-3">
        {AGENTS.map((a, i) => {
          const Icon = a.icon;
          return (
            <motion.div key={a.id} className="flex items-center gap-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 }}>
              <Icon className="w-3 h-3 shrink-0 opacity-50" style={{ color: a.color }} />
              <div className="flex-1 h-[3px] bg-white/[0.03] rounded-full overflow-hidden">
                <motion.div className="h-full rounded-full" style={{ backgroundColor: a.color }}
                  initial={{ width: 0 }} animate={{ width: `${a.load}%` }}
                  transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: i * 0.12 }}
                />
              </div>
              <span className="text-[8px] font-mono text-white/20 w-6 text-right tabular-nums">{a.load}%</span>
            </motion.div>
          );
        })}
      </div>
      <div className="mt-4 pt-3 border-t border-white/[0.03] flex items-center justify-between">
        <span className="text-[8px] font-mono text-white/15 tracking-widest">MEASURE TWICE PROTOCOL</span>
        <div className="flex items-center gap-1.5">
          <div className="w-1 h-1 rounded-full bg-emerald-400 status-dot text-emerald-400" />
          <span className="text-[8px] font-mono text-emerald-400/40">ACTIVE</span>
        </div>
      </div>
    </div>
  );
}

// =====================================================
// SYSTEM STATS BAR (top info strip)
// =====================================================
function SystemStats() {
  const [time, setTime] = useState('');
  useEffect(() => {
    const update = () => setTime(new Date().toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  const stats = [
    { icon: Cpu, label: "CPU", value: "23%" },
    { icon: Database, label: "MEM", value: "4.2 GB" },
    { icon: Wifi, label: "NET", value: "ENCRYPTED" },
    { icon: Lock, label: "SEC", value: "LEVEL 5" },
    { icon: Eye, label: "AGENTS", value: "6 ACTIVE" },
  ];

  return (
    <div className="flex items-center justify-between px-8 py-3">
      {/* Left: Title */}
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
          <Brain className="w-3.5 h-3.5 text-cyan-400/60" />
        </div>
        <div>
          <h1 className="text-[13px] font-semibold text-white/70 tracking-wide">THE GODBRAIN</h1>
          <p className="text-[8px] text-white/15 font-mono tracking-[0.3em]">AUTONOMOUS COMMAND CENTER v3.0</p>
        </div>
      </div>

      {/* Center: Stats */}
      <div className="flex items-center gap-6">
        {stats.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-center gap-2">
            <Icon className="w-3 h-3 text-white/15" />
            <div>
              <p className="text-[7px] font-mono text-white/15 tracking-widest">{label}</p>
              <p className="text-[10px] font-mono text-white/40">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Right: Time + Status */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/[0.06] border border-emerald-500/[0.1]">
          <div className="w-1 h-1 rounded-full bg-emerald-400 status-dot text-emerald-400" />
          <span className="text-[9px] font-mono text-emerald-400/50">ONLINE</span>
        </div>
        <span className="text-[11px] font-mono text-white/20 tabular-nums tracking-wider">{time}</span>
      </div>
    </div>
  );
}

// =====================================================
// MAIN COMMAND CENTER
// =====================================================
export default function WarRoom() {
  const [orionState, setOrionState] = useState<OrionState>('IDLE');
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const { isSpeaking } = useOrionVoice();

  return (
    <div className="relative h-screen w-full overflow-hidden">

      {/* ===== CINEMATIC ENVIRONMENT ===== */}
      <div className="space-panorama" />
      <div className="volumetric-light" />
      <div className="window-frame-top" />
      <div className="led-strip-left" />
      <div className="led-strip-right" />
      <div className="floor-reflection" />
      <div className="noise-overlay" />
      <div className="scanline-overlay" />

      {/* ===== CONTENT ===== */}
      <div className="relative z-10 h-full flex flex-col">

        {/* Top System Bar */}
        <SystemStats />

        {/* Main Area */}
        <div className="flex-1 flex min-h-0 px-6 gap-5">

          {/* LEFT: AI Hologram */}
          <div className="w-[28%] flex flex-col">
            <div className="flex-1 relative floating-slow">
              <AIHologram orionState={orionState} />
            </div>
          </div>

          {/* CENTER: Agent Grid */}
          <div className="w-[44%] flex flex-col gap-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-cyan-400/40" />
                <span className="text-[10px] font-mono text-white/25 tracking-[0.2em] uppercase">Revenue Streams</span>
              </div>
              <div className="flex items-center gap-1.5">
                <TrendingUp className="w-3 h-3 text-emerald-400/40" />
                <span className="text-[10px] font-mono text-emerald-400/40">€10.243 MTD</span>
              </div>
            </div>

            {/* Agent Cards Grid */}
            <div className="grid grid-cols-3 gap-3 flex-1 content-start">
              {AGENTS.map((agent, i) => {
                const Icon = agent.icon;
                return (
                  <motion.div
                    key={agent.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedAgent(agent.title)}
                    className="agent-card rounded-xl p-4 cursor-pointer"
                    style={{ '--card-accent': `${agent.color}30` } as React.CSSProperties}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${agent.color}08`, border: `1px solid ${agent.color}15` }}>
                        <Icon className="w-3.5 h-3.5" style={{ color: agent.color, opacity: 0.7 }} />
                      </div>
                      <ArrowUpRight className="w-3 h-3 text-white/[0.06] group-hover:text-white/20 transition-colors" />
                    </div>
                    <p className="text-[10px] font-medium text-white/50 tracking-wider mb-0.5">{agent.title}</p>
                    <p className="text-[8px] font-mono text-white/15 mb-3">{agent.status}</p>
                    <div className="flex items-end justify-between">
                      <span className="text-lg font-semibold text-white/75 tracking-tight">{agent.revenue}</span>
                      <span className="text-[10px] font-mono font-medium" style={{ color: agent.color, opacity: 0.6 }}>{agent.trend}</span>
                    </div>
                    {/* Load bar */}
                    <div className="mt-3 h-[2px] bg-white/[0.03] rounded-full overflow-hidden">
                      <motion.div className="h-full rounded-full" style={{ backgroundColor: agent.color, opacity: 0.4 }}
                        initial={{ width: 0 }} animate={{ width: `${agent.load}%` }}
                        transition={{ duration: 1.2, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* RIGHT: Live Feed + Neural */}
          <div className="w-[28%] flex flex-col gap-4">
            <div className="flex-1 floating">
              <LiveFeed />
            </div>
            <div className="h-[45%]">
              <NeuralOverview />
            </div>
          </div>

        </div>

        {/* Bottom spacer for command bar */}
        <div className="h-24" />
      </div>

      {/* ===== COMMAND BAR ===== */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-6">
        <CommandBar orionState={orionState} setOrionState={setOrionState} onCommandComplete={(c) => console.log(c)} />
      </div>

      {/* ===== AGENT TERMINAL OVERLAY ===== */}
      <AnimatePresence>
        {selectedAgent && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-2xl"
            onClick={() => setSelectedAgent(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 30 }}
              transition={{ type: "spring", damping: 28, stiffness: 180 }}
              className="w-full max-w-3xl h-[70vh] holo-panel rounded-3xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <AgentTerminal agentTitle={selectedAgent} onClose={() => setSelectedAgent(null)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <SettingsMenu />
    </div>
  );
}
