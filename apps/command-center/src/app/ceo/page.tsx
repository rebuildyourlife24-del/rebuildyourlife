'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

// Mock data reflecting the actual Argentic AEIP Architecture
const ENGINES = [
  { name: 'Commerce OS', status: 'ACTIVE', latency: '12ms' },
  { name: 'CRM OS', status: 'IDLE', latency: '18ms' },
  { name: 'SaaS OS', status: 'IDLE', latency: '21ms' },
  { name: 'Affiliate OS', status: 'STANDBY', latency: '-' },
  { name: 'Agency OS', status: 'STANDBY', latency: '-' },
  { name: 'Creator OS', status: 'ACTIVE', latency: '8ms' },
  { name: 'Education OS', status: 'OFFLINE', latency: '-' },
  { name: 'Finance OS', status: 'ACTIVE', latency: '15ms' },
  { name: 'Marketing OS', status: 'IDLE', latency: '24ms' },
  { name: 'Marketplace OS', status: 'IDLE', latency: '19ms' },
];

const DATABASES = [
  { name: 'Orion', role: 'Auth / Main', status: 'SYNCED', ip: 'eu-north-1' },
  { name: 'Vault', role: 'Finance / Secure', status: 'SYNCED', ip: 'eu-central-1' },
  { name: 'Quantum', role: 'Compute / Logic', status: 'SYNCED', ip: 'eu-west-1' },
  { name: 'Sovereign', role: 'Agent Fleet', status: 'SYNCED', ip: 'eu-west-1' },
  { name: 'Hermes', role: 'Comms / Router', status: 'SYNCED', ip: 'eu-west-1' },
];

const EVENTS = [
  { time: 'JUST NOW', log: 'Vault database successfully unpaused and synced.' },
  { time: '2M AGO', log: 'Pinecone vector memory indexed 1,204 new vectors.' },
  { time: '12M AGO', log: 'Commerce OS received webhook from Shopify.' },
  { time: '1H AGO', log: 'System initialization complete. Handshake OK.' },
];

export default function AEIPCommandCenter() {
  const [time, setTime] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Time logic
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setTime(now.toISOString().split('T')[1].slice(0, 11) + ' UTC');
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Cinematic Background Canvas logic (Matching Landing Page Quality)
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
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.radius = Math.random() * 1.5;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
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
      
      {/* 1. CINEMATIC BACKGROUND (Matching Landing Page Quality) */}
      <div className="absolute inset-0 z-0 bg-[#020305]">
        <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none mix-blend-screen opacity-60" />
        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_rgba(0,136,255,0.03)_0%,_transparent_70%)] pointer-events-none" />
        
        {/* Central Core Glow */}
        <div className="absolute inset-0 flex items-center justify-center opacity-30 mix-blend-screen pointer-events-none">
          <div className="w-[800px] h-[800px] rounded-full border border-[rgba(0,240,255,0.1)] shadow-[0_0_150px_rgba(0,136,255,0.2)] flex items-center justify-center">
            {/* Inner rings simulating the core */}
            <div className="w-[600px] h-[600px] rounded-full border border-[rgba(255,255,255,0.05)] border-dashed animate-[spin_120s_linear_infinite]" />
            <div className="absolute w-[400px] h-[400px] rounded-full border border-[rgba(0,240,255,0.1)] border-dotted animate-[spin_80s_linear_infinite_reverse]" />
          </div>
        </div>
      </div>

      {/* 2. TOP NAVIGATION BAR (The Bridge) */}
      <nav className="relative z-10 w-full h-12 flex items-center justify-between px-6 os-panel">
        <div className="flex items-center gap-8">
          <span className="font-serif text-xl tracking-[0.2em] font-medium">ARGENTIC <span className="text-[var(--color-text-dim)]">|</span> AEIP</span>
          <div className="flex items-center gap-6 os-data text-[var(--color-text-dim)]">
            <span className="hover:text-white transition-colors cursor-pointer">COMMAND CENTER</span>
          <span className="hover:text-white transition-colors cursor-pointer">SYSTEM OVERVIEW</span>
            <span className="hover:text-white transition-colors cursor-pointer">INFRASTRUCTURE</span>
          </div>
        </div>

        <div className="flex items-center gap-8 os-data">
          <div className="flex items-center gap-2">
            <span className="text-[var(--color-text-dim)]">CLEARANCE</span>
            <span className="text-[var(--color-neon-cyan)] glow-cyan">LVL 5</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[var(--color-text-dim)]">SYS_TIME</span>
            <span>{time}</span>
          </div>
          <button className="px-4 py-1.5 border border-[var(--color-neon-cyan)] text-[var(--color-neon-cyan)] hover:bg-[var(--color-neon-cyan)] hover:text-black transition-all glow-box-blue">
            INITIATE
          </button>
        </div>
      </nav>

      {/* 3. MAIN INTERFACE GRID */}
      <div className="relative z-10 flex-1 flex gap-4 h-[calc(100vh-80px)]">
        
        {/* LEFT COLUMN: THE ENGINE FLEET & RESOURCES */}
        <div className="w-80 flex flex-col gap-4 h-full">
          {/* Engine Fleet Panel */}
          <div className="flex-1 os-panel flex flex-col">
            <div className="p-4 border-b border-[var(--color-os-glass-border)] flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-[var(--color-neon-blue)] rounded-full glow-cyan" />
              <span className="os-data">OPERATING SYSTEMS</span>
            </div>
            <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3">
              {ENGINES.map((engine, idx) => (
                <div key={idx} className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${engine.status === 'ACTIVE' ? 'bg-[var(--color-neon-cyan)] glow-cyan' : engine.status === 'IDLE' ? 'bg-white/40' : engine.status === 'OFFLINE' ? 'bg-[var(--color-alert-red)]' : 'bg-[var(--color-text-dim)]'}`} />
                      <span className="os-data font-medium text-white/90">{engine.name}</span>
                    </div>
                    <span className="os-data text-[10px] text-[var(--color-text-dim)]">{engine.status}</span>
                  </div>
                  <div className="pl-3.5 flex items-center gap-2">
                    <span className="text-[var(--color-text-dim)]">└</span>
                    <span className="os-data text-[10px] text-[var(--color-text-dim)]">Latency: {engine.latency}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System Resources Panel */}
          <div className="h-48 os-panel flex flex-col">
            <div className="p-4 border-b border-[var(--color-os-glass-border)] flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-white/50 rounded-full" />
              <span className="os-data">SYSTEM RESOURCES</span>
            </div>
            <div className="p-4 flex flex-col gap-4 justify-center flex-1">
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between os-data text-[10px]">
                  <span className="text-[var(--color-text-dim)]">COMPUTE CORE (GPU)</span>
                  <span className="text-white/80">78%</span>
                </div>
                <div className="os-progress-track"><div className="os-progress-fill-blue" style={{ width: '78%' }} /></div>
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between os-data text-[10px]">
                  <span className="text-[var(--color-text-dim)]">DATABASE MEMORY (PINECONE)</span>
                  <span className="text-white/80">42%</span>
                </div>
                <div className="os-progress-track"><div className="os-progress-fill-blue" style={{ width: '42%' }} /></div>
              </div>
            </div>
          </div>
        </div>

        {/* CENTER COLUMN: THE SPINE (Core processing) */}
        <div className="flex-1 flex flex-col gap-4 h-full relative">
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className="os-data text-[var(--color-text-dim)]">AEIP CORE ROUTING</span>
          </div>
          
          {/* Central JARVIS / Spine Visualization */}
          <div className="flex-1 flex items-center justify-center">
            <div className="relative flex flex-col items-center">
              {/* Brain Icon / Core */}
              <motion.div 
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="w-32 h-32 rounded-full border border-[var(--color-neon-blue)] flex items-center justify-center bg-[#050A15]/80 backdrop-blur-md z-10 glow-box-blue"
              >
                <div className="text-center flex flex-col items-center gap-2">
                  {/* SVG Brain placeholder */}
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--color-neon-cyan)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="opacity-80">
                    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/>
                    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/>
                  </svg>
                  <span className="os-data text-[10px] text-[var(--color-neon-cyan)]">AEIP CORE</span>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Current Operation Status Box */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-96 os-panel bg-black/80 flex flex-col p-4 border border-[var(--color-neon-cyan)]/30">
            <div className="os-data text-[10px] text-[var(--color-text-dim)] text-center mb-2 tracking-[0.2em]">CURRENT OPERATION</div>
            <div className="flex items-center justify-center gap-3">
              <span className="os-data text-white font-medium">ROUTER</span>
              <span className="px-2 py-0.5 bg-white/10 text-white/50 text-[9px] rounded-sm os-data">IDLE</span>
            </div>
            <div className="text-center text-white/70 font-mono text-sm mt-2">Awaiting initialization</div>
          </div>
        </div>

        {/* RIGHT COLUMN: INTELLIGENCE & LOGS */}
        <div className="w-80 flex flex-col gap-4 h-full">
          {/* Databases / Infrastructure Panel (Replacing global digital twin map for now) */}
          <div className="h-64 os-panel flex flex-col">
            <div className="p-4 border-b border-[var(--color-os-glass-border)] flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-[var(--color-neon-cyan)] rounded-full glow-cyan" />
              <span className="os-data">DATABASE INFRASTRUCTURE</span>
            </div>
            <div className="p-4 flex flex-col gap-3 overflow-y-auto">
              {DATABASES.map((db, idx) => (
                <div key={idx} className="flex justify-between items-center pb-2 border-b border-[var(--color-os-glass-border)] last:border-0">
                  <div className="flex flex-col gap-0.5">
                    <span className="os-data text-white/90">{db.name}</span>
                    <span className="os-data text-[9px] text-[var(--color-text-dim)]">{db.role}</span>
                  </div>
                  <div className="flex flex-col items-end gap-0.5">
                    <span className="os-data text-[10px] text-[var(--color-neon-cyan)]">{db.status}</span>
                    <span className="os-data text-[8px] text-[var(--color-text-dim)]">{db.ip}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Event Log Panel */}
          <div className="flex-1 os-panel flex flex-col">
            <div className="p-4 border-b border-[var(--color-os-glass-border)] flex items-center gap-2">
              <div className="w-3 h-3 border border-white/50 rounded-sm flex items-center justify-center">
                <div className="w-1 h-1 bg-white/50" />
              </div>
              <span className="os-data">EVENT LOG</span>
            </div>
            <div className="p-5 flex flex-col gap-6 overflow-y-auto relative">
              {/* Timeline line */}
              <div className="absolute left-[25px] top-6 bottom-6 w-[1px] bg-[var(--color-os-glass-border)]" />
              
              {EVENTS.map((event, idx) => (
                <div key={idx} className="relative flex gap-4">
                  <div className="w-2 h-2 mt-1 rounded-full bg-[var(--color-neon-blue)] glow-cyan z-10 shrink-0" />
                  <div className="flex flex-col gap-1">
                    <span className="os-data text-[9px] text-[var(--color-text-dim)]">{event.time}</span>
                    <p className="text-xs text-white/80 font-sans leading-relaxed">{event.log}</p>
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
