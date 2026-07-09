'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

// LAYER 10: Business Operating System (AI Direction)
const AI_DIRECTORS = [
  { name: 'CEO AI', status: 'ACTIVE', focus: 'Strategic Growth & Governance' },
  { name: 'COO AI', status: 'ACTIVE', focus: 'Workflow & Automation' },
  { name: 'CFO AI', status: 'ACTIVE', focus: 'Capital & Resource Allocation' },
  { name: 'CTO AI', status: 'IDLE', focus: 'Platform Architecture & Scaling' },
  { name: 'CMO AI', status: 'ACTIVE', focus: 'Market Positioning' },
  { name: 'Legal AI', status: 'STANDBY', focus: 'Compliance & Contracts' },
  { name: 'Sales AI', status: 'ACTIVE', focus: 'Revenue Generation' },
];

// LAYER 5: Data Platform (The Spine)
const DATA_PLATFORM = [
  { name: 'PostgreSQL (Orion)', type: 'Identity & Auth', status: 'SYNCED', ip: 'eu-north-1' },
  { name: 'PostgreSQL (Vault)', type: 'Financial & Secure', status: 'SYNCED', ip: 'eu-central-1' },
  { name: 'PostgreSQL (Quantum)', type: 'Compute & Logic', status: 'SYNCED', ip: 'eu-west-1' },
  { name: 'PostgreSQL (Sovereign)', type: 'Agent State', status: 'SYNCED', ip: 'eu-west-1' },
  { name: 'PostgreSQL (Hermes)', type: 'Messaging & Events', status: 'SYNCED', ip: 'eu-west-1' },
  { name: 'Pinecone Vector DB', type: 'Knowledge Store', status: 'SYNCED', ip: 'us-east-1' },
  { name: 'Redis / Upstash', type: 'Rate Limit & Cache', status: 'ACTIVE', ip: 'global' },
];

// NEW LAYER: Revenue Intelligence Platform
const REVENUE_INTELLIGENCE = [
  { metric: 'Opportunity Discovery', value: '3 Active Niches' },
  { metric: 'ROI Analytics', value: '+142% MoM' },
  { metric: 'Growth Intelligence', value: 'A/B Testing Running' },
];

// LAYER 9: Enterprise Operations (Event Log)
const OPERATIONS_LOG = [
  { time: 'JUST NOW', log: 'Policy Engine verified smart contract constraints.' },
  { time: '2M AGO', log: 'CEO AI approved new Affiliate Marketing workflow.' },
  { time: '12M AGO', log: 'Pinecone indexed 420 new knowledge fragments.' },
  { time: '1H AGO', log: 'CI/CD Deployment successful. Platform healthy.' },
];

export default function AEIPMissionControl() {
  const [time, setTime] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // System Time
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setTime(now.toISOString().split('T')[1].slice(0, 11) + ' UTC');
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Cinematic Background Canvas (Particle Engine)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener('resize', handleResize);

    class Particle {
      x: number; y: number; vx: number; vy: number; radius: number;
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.radius = Math.random() * 1.5;
      }
      update() {
        this.x += this.vx; this.y += this.vy;
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
      }
      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 240, 255, 0.3)';
        ctx.fill();
      }
    }

    const particles: Particle[] = [];
    for (let i = 0; i < 100; i++) {
      particles.push(new Particle());
    }

    let animationFrameId: number;
    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0, 136, 255, ${0.15 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col p-4 gap-4 selection:bg-cyan-900 selection:text-cyan-100">
      
      {/* CINEMATIC BACKGROUND */}
      <div className="absolute inset-0 z-0 bg-[#020305]">
        <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none mix-blend-screen opacity-60" />
        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_rgba(0,136,255,0.03)_0%,_transparent_70%)] pointer-events-none" />
        
        {/* Deep space radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(10,30,50,0.4)_0%,_rgba(2,3,5,0.9)_60%)] pointer-events-none" />
        
        {/* Central Core Glow */}
        <div className="absolute inset-0 flex items-center justify-center opacity-30 mix-blend-screen pointer-events-none">
          <div className="w-[800px] h-[800px] rounded-full border border-[rgba(0,240,255,0.1)] shadow-[0_0_150px_rgba(0,136,255,0.2)] flex items-center justify-center">
            <div className="w-[600px] h-[600px] rounded-full border border-[rgba(255,255,255,0.05)] border-dashed animate-[spin_120s_linear_infinite]" />
            <div className="absolute w-[400px] h-[400px] rounded-full border border-[rgba(0,240,255,0.1)] border-dotted animate-[spin_80s_linear_infinite_reverse]" />
          </div>
        </div>
      </div>

      {/* LAYER 7: MISSION CONTROL (Top Navigation) */}
      <nav className="relative z-10 w-full h-12 flex items-center justify-between px-6 os-panel">
        <div className="flex items-center gap-8">
          <span className="font-serif text-xl tracking-[0.2em] font-medium">RYL OS <span className="text-[var(--color-text-dim)]">|</span> MISSION CONTROL</span>
          <div className="flex items-center gap-6 os-data text-[var(--color-text-dim)]">
            <span className="hover:text-white transition-colors cursor-pointer">WORKSPACES</span>
            <span className="hover:text-white transition-colors cursor-pointer">AI AGENTS</span>
            <span className="hover:text-white transition-colors cursor-pointer">WORKFLOWS</span>
            <span className="hover:text-white transition-colors cursor-pointer">MARKETPLACE</span>
          </div>
        </div>

        <div className="flex items-center gap-8 os-data">
          <div className="flex items-center gap-2">
            <span className="text-[var(--color-text-dim)]">CLEARANCE</span>
            <span className="text-[var(--color-neon-cyan)] glow-cyan">ADMIN</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[var(--color-text-dim)]">SYS_TIME</span>
            <span>{time}</span>
          </div>
          <button className="px-4 py-1.5 border border-[var(--color-neon-cyan)] text-[var(--color-neon-cyan)] hover:bg-[var(--color-neon-cyan)] hover:text-black transition-all glow-box-blue">
            ENGAGE
          </button>
        </div>
      </nav>

      {/* MAIN INTERFACE GRID */}
      <div className="relative z-10 flex-1 flex gap-4 h-[calc(100vh-80px)]">
        
        {/* LEFT COLUMN: LAYER 10 (BUSINESS OPERATING SYSTEM) */}
        <div className="w-[340px] flex flex-col gap-4 h-full">
          <div className="flex-1 os-panel flex flex-col">
            <div className="p-4 border-b border-[var(--color-os-glass-border)] flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-[var(--color-neon-blue)] rounded-full glow-cyan" />
              <span className="os-data">BUSINESS OPERATING SYSTEM (AI DIRECTORS)</span>
            </div>
            <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4">
              {AI_DIRECTORS.map((ai, idx) => (
                <div key={idx} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${ai.status === 'ACTIVE' ? 'bg-[var(--color-neon-cyan)] glow-cyan' : ai.status === 'IDLE' ? 'bg-white/40' : 'bg-[var(--color-text-dim)]'}`} />
                      <span className="os-data font-medium text-white/90">{ai.name}</span>
                    </div>
                    <span className="os-data text-[9px] text-[var(--color-text-dim)]">{ai.status}</span>
                  </div>
                  <div className="pl-3.5 flex items-center gap-2">
                    <span className="text-[var(--color-text-dim)]">└</span>
                    <span className="os-data text-[9px] text-[var(--color-neon-blue)]">{ai.focus}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* REVENUE INTELLIGENCE PLATFORM (Extra Layer) */}
          <div className="h-56 os-panel flex flex-col">
            <div className="p-4 border-b border-[var(--color-os-glass-border)] flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full glow-cyan" />
              <span className="os-data">REVENUE INTELLIGENCE</span>
            </div>
            <div className="p-4 flex flex-col gap-4 justify-center flex-1">
              {REVENUE_INTELLIGENCE.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center pb-2 border-b border-[var(--color-os-glass-border)] last:border-0">
                  <span className="os-data text-[10px] text-[var(--color-text-dim)]">{item.metric}</span>
                  <span className="os-data text-[10px] text-white/90">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CENTER COLUMN: LAYER 2 & 3 (ENTERPRISE KERNEL & AI PLATFORM) */}
        <div className="flex-1 flex flex-col gap-4 h-full relative">
          <div className="absolute top-4 left-4 flex flex-col gap-1">
            <span className="os-data text-white/90">ENTERPRISE KERNEL (LAYER 2)</span>
            <span className="os-data text-[9px] text-[var(--color-text-dim)]">SECURITY | POLICY ENGINE | RULES ENGINE | MESSAGING</span>
          </div>
          
          <div className="absolute top-4 right-4 flex flex-col items-end gap-1">
            <span className="os-data text-white/90">AI PLATFORM (LAYER 3)</span>
            <span className="os-data text-[9px] text-[var(--color-text-dim)]">REASONING | MEMORY | GOAL ENGINE</span>
          </div>

          {/* Central Visualization */}
          <div className="flex-1 flex items-center justify-center">
            <motion.div 
              animate={{ scale: [1, 1.02, 1], opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="w-40 h-40 rounded-full border border-[var(--color-neon-blue)] flex items-center justify-center bg-[#050A15]/80 backdrop-blur-md z-10 glow-box-blue"
            >
              <div className="text-center flex flex-col items-center gap-3">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-neon-cyan)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="opacity-90">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
                <div className="flex flex-col gap-0.5">
                  <span className="os-data text-[11px] text-white font-semibold">AEIP RUNTIME</span>
                  <span className="os-data text-[8px] text-[var(--color-neon-cyan)]">ROUTING ACTIVE</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Current Integration / Platform Status Box */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[500px] os-panel bg-black/80 flex flex-col p-4 border border-[var(--color-neon-cyan)]/30">
            <div className="flex justify-between items-center border-b border-white/10 pb-2 mb-3">
              <span className="os-data text-[9px] text-[var(--color-text-dim)] tracking-[0.2em]">INTEGRATION PLATFORM (LAYER 6)</span>
              <span className="px-2 py-0.5 bg-[var(--color-neon-blue)]/20 text-[var(--color-neon-cyan)] text-[9px] rounded-sm os-data">18 ACTIVE KOPPELINGEN</span>
            </div>
            <div className="flex items-center justify-center gap-6">
              <span className="os-data text-white/60 text-[10px]">Stripe</span>
              <span className="text-[var(--color-text-dim)]">•</span>
              <span className="os-data text-white/60 text-[10px]">OpenAI</span>
              <span className="text-[var(--color-text-dim)]">•</span>
              <span className="os-data text-white font-medium text-[10px]">Shopify (SYNCING)</span>
              <span className="text-[var(--color-text-dim)]">•</span>
              <span className="os-data text-white/60 text-[10px]">HubSpot</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: LAYER 5 & 9 (DATA PLATFORM & ENTERPRISE OPERATIONS) */}
        <div className="w-[360px] flex flex-col gap-4 h-full">
          
          {/* LAYER 5: Data Platform */}
          <div className="h-[340px] os-panel flex flex-col">
            <div className="p-4 border-b border-[var(--color-os-glass-border)] flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-[var(--color-neon-cyan)] rounded-full glow-cyan" />
              <span className="os-data">DATA PLATFORM (LAYER 5)</span>
            </div>
            <div className="p-4 flex flex-col gap-3 overflow-y-auto">
              {DATA_PLATFORM.map((db, idx) => (
                <div key={idx} className="flex justify-between items-center pb-2 border-b border-[var(--color-os-glass-border)] last:border-0">
                  <div className="flex flex-col gap-1">
                    <span className="os-data text-white/90 text-[11px]">{db.name}</span>
                    <span className="os-data text-[9px] text-[var(--color-text-dim)]">{db.type}</span>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="os-data text-[10px] text-[var(--color-neon-cyan)]">{db.status}</span>
                    <span className="os-data text-[8px] text-white/40">{db.ip}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* LAYER 9: Enterprise Operations (Log) */}
          <div className="flex-1 os-panel flex flex-col">
            <div className="p-4 border-b border-[var(--color-os-glass-border)] flex items-center gap-2">
              <div className="w-3 h-3 border border-white/50 rounded-sm flex items-center justify-center">
                <div className="w-1 h-1 bg-white/50" />
              </div>
              <span className="os-data">ENTERPRISE OPERATIONS (LAYER 9)</span>
            </div>
            <div className="p-4 flex flex-col gap-5 overflow-y-auto relative">
              <div className="absolute left-[21px] top-5 bottom-5 w-[1px] bg-[var(--color-os-glass-border)]" />
              
              {OPERATIONS_LOG.map((event, idx) => (
                <div key={idx} className="relative flex gap-3">
                  <div className="w-1.5 h-1.5 mt-1 rounded-full bg-[var(--color-neon-blue)] glow-cyan z-10 shrink-0" />
                  <div className="flex flex-col gap-1">
                    <span className="os-data text-[9px] text-[var(--color-text-dim)]">{event.time}</span>
                    <p className="text-[11px] text-white/80 font-sans leading-relaxed">{event.log}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
