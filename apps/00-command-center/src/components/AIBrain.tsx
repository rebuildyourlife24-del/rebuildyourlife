"use client";

import { useEffect, useRef, useCallback } from 'react';
import { OrionState } from './CommandBar';

interface Particle {
  x: number; y: number; z: number;
  vx: number; vy: number; vz: number;
  size: number; opacity: number;
  color: string; life: number; maxLife: number;
}

interface NeuralNode {
  id: string; label: string; group: string;
  x: number; y: number; tx: number; ty: number;
  pulsePhase: number; size: number;
}

export default function AIBrain({ orionState = 'IDLE', isSpeaking = false }: { orionState?: OrionState, isSpeaking?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef(orionState);
  const speakingRef = useRef(isSpeaking);
  const animRef = useRef<number>(0);
  const timeRef = useRef(0);
  const particlesRef = useRef<Particle[]>([]);

  stateRef.current = orionState;
  speakingRef.current = isSpeaking;

  const createParticle = useCallback((cx: number, cy: number, state: OrionState): Particle => {
    const angle = Math.random() * Math.PI * 2;
    const speed = state === 'EXECUTING' ? Math.random() * 4 + 1 : Math.random() * 1.5 + 0.3;
    const colors = state === 'ALERT' ? ['#f59e0b', '#ef4444', '#f97316'] :
                   state === 'COMPLETED' ? ['#4ade80', '#22d3ee', '#a78bfa'] :
                   state === 'THINKING' ? ['#06b6d4', '#818cf8', '#38bdf8'] :
                   ['#06b6d4', '#0ea5e9', '#67e8f9', '#a5f3fc'];
    return {
      x: cx + (Math.random() - 0.5) * 60,
      y: cy + (Math.random() - 0.5) * 60,
      z: Math.random(),
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      vz: (Math.random() - 0.5) * 0.02,
      size: Math.random() * 2.5 + 0.5,
      opacity: Math.random() * 0.8 + 0.2,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: 0,
      maxLife: Math.random() * 80 + 40,
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Responsive canvas
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width || 400;
      canvas.height = rect.height || 500;
    };
    resize();

    const getSize = () => ({ w: canvas.width, h: canvas.height });

    // Initialiseer neural nodes
    const buildNodes = (w: number, h: number): NeuralNode[] => {
      const cx = w / 2; const cy = h * 0.28;
      return [
        { id: 'core', label: 'ORION', group: 'core', x: cx, y: cy, tx: cx, ty: cy, pulsePhase: 0, size: 10 },
        { id: 'n1', label: 'CASHFLOW', group: 'finance', x: cx - 55, y: cy - 30, tx: cx - 55, ty: cy - 30, pulsePhase: 0.5, size: 5 },
        { id: 'n2', label: 'MOLLIE', group: 'finance', x: cx - 70, y: cy + 20, tx: cx - 70, ty: cy + 20, pulsePhase: 1.2, size: 4 },
        { id: 'n3', label: 'META ADS', group: 'wealth', x: cx + 60, y: cy - 35, tx: cx + 60, ty: cy - 35, pulsePhase: 0.8, size: 5 },
        { id: 'n4', label: 'TRENDS', group: 'wealth', x: cx + 45, y: cy + 25, tx: cx + 45, ty: cy + 25, pulsePhase: 1.8, size: 4 },
        { id: 'n5', label: 'SEO', group: 'seo', x: cx + 10, y: cy - 60, tx: cx + 10, ty: cy - 60, pulsePhase: 2.1, size: 4 },
        { id: 'n6', label: 'LEADS', group: 'seo', x: cx + 20, y: cy + 50, tx: cx + 20, ty: cy + 50, pulsePhase: 2.8, size: 4 },
        { id: 'n7', label: 'MEMORY', group: 'memory', x: cx - 30, y: cy + 55, tx: cx - 30, ty: cy + 55, pulsePhase: 3.2, size: 5 },
        { id: 'n8', label: 'RISK', group: 'risk', x: cx - 60, y: cy - 50, tx: cx - 60, ty: cy - 50, pulsePhase: 1.5, size: 4 },
      ];
    };

    let { w, h } = getSize();
    let nodes = buildNodes(w, h);

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const render = () => {
      ({ w, h } = getSize());
      ctx.clearRect(0, 0, w, h);

      const state = stateRef.current;
      const speaking = speakingRef.current;
      const t = timeRef.current;
      const cx = w / 2;
      const cy = h * 0.28;
      const speedMult = state === 'EXECUTING' ? 4 : state === 'THINKING' ? 2.5 : 1;
      timeRef.current += 0.016 * speedMult;

      // === HOLOGRAM HEAD GLOW LAYERS ===
      const glowRadius = state === 'EXECUTING' ? 180 : state === 'THINKING' ? 150 : speaking ? 130 : 100;
      const glowColors = state === 'ALERT' ? ['rgba(245,158,11,0.15)', 'rgba(239,68,68,0.08)'] :
                         state === 'COMPLETED' ? ['rgba(74,222,128,0.15)', 'rgba(34,211,238,0.08)'] :
                         ['rgba(6,182,212,0.12)', 'rgba(14,165,233,0.06)'];

      glowColors.forEach((color, i) => {
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowRadius * (1 + i * 0.5));
        grad.addColorStop(0, color);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, glowRadius * (1 + i * 0.5), 0, Math.PI * 2);
        ctx.fill();
      });

      // === PULSERENDE RINGEN ===
      const ringCount = state === 'EXECUTING' ? 4 : speaking ? 3 : 2;
      for (let r = 0; r < ringCount; r++) {
        const phase = (t * 0.8 + r * 0.5) % 1;
        const ringR = 50 + phase * 140;
        const ringOpacity = state === 'IDLE' ? (1 - phase) * 0.12 : (1 - phase) * 0.25;
        const ringColor = state === 'ALERT' ? `rgba(245,158,11,${ringOpacity})` :
                          state === 'COMPLETED' ? `rgba(74,222,128,${ringOpacity})` :
                          `rgba(6,182,212,${ringOpacity})`;
        ctx.strokeStyle = ringColor;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(cx, cy, ringR, 0, Math.PI * 2);
        ctx.stroke();
      }

      // === SCANNING RADAR ===
      if (state !== 'IDLE') {
        const radarAngle = t * 2;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(radarAngle);
        const sweep = ctx.createLinearGradient(0, 0, 100, 0);
        sweep.addColorStop(0, state === 'EXECUTING' ? 'rgba(6,182,212,0.4)' : 'rgba(6,182,212,0.2)');
        sweep.addColorStop(1, 'rgba(6,182,212,0)');
        ctx.fillStyle = sweep;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, 120, -0.3, 0.3);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }

      // === GELUID GOLVEN (SPEAKING) ===
      if (speaking) {
        for (let w2 = 0; w2 < 4; w2++) {
          const waveR = 40 + ((t * 12 + w2 * 25) % 100);
          const waveOp = Math.max(0, (1 - waveR / 140) * 0.6);
          const mouthY = cy + h * 0.15;
          ctx.strokeStyle = `rgba(6,182,212,${waveOp})`;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(cx, mouthY, waveR, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      // === NEURAL NODES TARGET POSITIES ===
      if (state === 'THINKING') {
        nodes.forEach((n, i) => {
          if (n.id === 'core') { n.tx = cx; n.ty = cy; return; }
          n.tx = cx + Math.cos(t * 3 + i * 0.8) * 20;
          n.ty = cy + Math.sin(t * 3 + i * 0.8) * 20;
        });
      } else if (state === 'EXECUTING') {
        nodes.forEach((n, i) => {
          if (n.id === 'core') { n.tx = cx; n.ty = cy; return; }
          const angle = (i / (nodes.length - 1)) * Math.PI * 2;
          n.tx = cx + Math.cos(angle + t * 0.5) * 65;
          n.ty = cy + Math.sin(angle + t * 0.5) * 50;
        });
      } else {
        // Idle drift
        const base = buildNodes(w, h);
        nodes.forEach((n, i) => {
          const bn = base[i];
          if (!bn) return;
          n.tx = bn.tx + Math.cos(t * 0.4 + i) * 8;
          n.ty = bn.ty + Math.sin(t * 0.4 + i) * 8;
        });
      }

      // Interpoleer posities
      const lerpSpeed = 0.04 * speedMult;
      nodes.forEach(n => {
        n.x = lerp(n.x, n.tx, lerpSpeed);
        n.y = lerp(n.y, n.ty, lerpSpeed);
        n.pulsePhase += 0.03 * speedMult;
      });

      // === VERBINDINGSLIJNEN TUSSEN NODES ===
      const coreNode = nodes.find(n => n.id === 'core')!;
      nodes.forEach(n => {
        if (n.id === 'core') return;
        const dist = Math.hypot(n.x - coreNode.x, n.y - coreNode.y);
        const lineOp = state === 'EXECUTING' ? 0.6 : state === 'THINKING' ? 0.5 : 0.25;
        const lineColor = state === 'ALERT' ? `rgba(245,158,11,${lineOp})` :
                          state === 'COMPLETED' ? `rgba(74,222,128,${lineOp})` :
                          `rgba(6,182,212,${lineOp * (1 - dist / 200)})`;

        // Animerende stroom langs lijn
        const progress = (t * 1.5 + n.pulsePhase) % 1;
        const px = lerp(coreNode.x, n.x, progress);
        const py = lerp(coreNode.y, n.y, progress);

        ctx.strokeStyle = lineColor;
        ctx.lineWidth = 0.8;
        ctx.setLineDash([4, 6]);
        ctx.beginPath();
        ctx.moveTo(coreNode.x, coreNode.y);
        ctx.lineTo(n.x, n.y);
        ctx.stroke();
        ctx.setLineDash([]);

        // Datastroom bolletje
        ctx.fillStyle = state === 'COMPLETED' ? 'rgba(74,222,128,0.9)' : 'rgba(6,182,212,0.9)';
        ctx.shadowBlur = 6;
        ctx.shadowColor = ctx.fillStyle;
        ctx.beginPath();
        ctx.arc(px, py, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // === NEURAL NODES TEKENEN ===
      nodes.forEach(n => {
        const pulse = Math.sin(n.pulsePhase) * 0.3 + 1;
        const nodeSize = n.size * pulse * (state === 'THINKING' ? 1.5 : 1);
        const nodeColor = n.id === 'core' ? '#ffffff' :
                          n.group === 'finance' ? '#34d399' :
                          n.group === 'wealth' ? '#f59e0b' :
                          n.group === 'memory' ? '#a78bfa' :
                          n.group === 'risk' ? '#f87171' :
                          '#06b6d4';

        ctx.beginPath();
        ctx.arc(n.x, n.y, nodeSize, 0, Math.PI * 2);
        ctx.fillStyle = nodeColor;
        ctx.shadowBlur = n.id === 'core' ? 20 : 10;
        ctx.shadowColor = nodeColor;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Labels
        if (state !== 'IDLE' || n.id === 'core') {
          ctx.font = n.id === 'core' ? 'bold 9px monospace' : '7px monospace';
          ctx.fillStyle = `rgba(255,255,255,${n.id === 'core' ? 0.9 : 0.6})`;
          ctx.fillText(n.label, n.x + nodeSize + 3, n.y + 3);
        }
      });

      // === PARTICLES ===
      if (state !== 'IDLE') {
        if (Math.random() < 0.3) {
          particlesRef.current.push(createParticle(cx, cy, state));
        }
      }

      particlesRef.current = particlesRef.current.filter(p => p.life < p.maxLife);
      particlesRef.current.forEach(p => {
        p.life++;
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.97;
        p.vy *= 0.97;
        const lifeRatio = p.life / p.maxLife;
        const pOp = p.opacity * (1 - lifeRatio);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = pOp;
        ctx.shadowBlur = 4;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (1 - lifeRatio * 0.5), 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
      });

      // === COMPLETED FLASH ===
      if (state === 'COMPLETED') {
        const flashOp = Math.max(0, Math.sin(t * 4) * 0.15);
        ctx.fillStyle = `rgba(74,222,128,${flashOp})`;
        ctx.fillRect(0, 0, w, h);
      }

      animRef.current = requestAnimationFrame(render);
    };

    render();
    return () => {
      cancelAnimationFrame(animRef.current);
    };
  }, [createParticle]);

  const isActive = orionState !== 'IDLE';
  const glowClass = orionState === 'ALERT' ? 'hue-rotate-[30deg]' :
                    orionState === 'COMPLETED' ? 'hue-rotate-[120deg]' : '';

  return (
    <div className="relative flex items-center justify-center" style={{ width: '100%', maxWidth: 420, height: 520 }}>

      {/* ACHTERGROND GLOW */}
      <div className={`absolute inset-0 rounded-full transition-all duration-700 pointer-events-none
        ${orionState === 'ALERT' ? 'bg-amber-500/10' :
          orionState === 'COMPLETED' ? 'bg-green-500/10' :
          orionState === 'EXECUTING' ? 'bg-cyan-400/15' :
          orionState === 'THINKING' ? 'bg-cyan-500/10' : 'bg-cyan-500/5'}
        blur-3xl`}
      />

      {/* HOLOGRAM HEAD IMAGE — meerdere lagen voor diepte */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {/* Achterste glow-laag */}
        <div
          className={`absolute w-72 h-96 bg-contain bg-center bg-no-repeat transition-all duration-300 ${glowClass}
            ${isActive ? 'opacity-20 scale-105' : 'opacity-10 scale-100'}`}
          style={{
            backgroundImage: "url('/hologram_head.png')",
            filter: 'blur(8px) brightness(3)',
          }}
        />
        {/* Midden kleur-laag */}
        <div
          className={`absolute w-72 h-96 bg-contain bg-center bg-no-repeat transition-all duration-200
            ${isActive ? 'opacity-40 scale-[1.01]' : 'opacity-25 scale-100'}`}
          style={{
            backgroundImage: "url('/hologram_head.png')",
            filter: 'brightness(1.8) saturate(2) hue-rotate(180deg)',
            mixBlendMode: 'screen',
          }}
        />
        {/* Voorste scherpe laag */}
        <div
          className={`absolute w-72 h-96 bg-contain bg-center bg-no-repeat transition-all duration-150
            ${isActive ? 'opacity-85 scale-100' : 'opacity-55 scale-[0.99]'}
            ${isSpeaking ? 'animate-pulse' : ''}`}
          style={{
            backgroundImage: "url('/hologram_head.png')",
            filter: `brightness(${isActive ? 1.4 : 1.1}) saturate(1.5)`,
            mixBlendMode: 'screen',
          }}
        />
        {/* Scanline overlay */}
        <div
          className="absolute w-72 h-96 pointer-events-none opacity-10"
          style={{
            background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(6,182,212,0.3) 2px, rgba(6,182,212,0.3) 4px)',
            mixBlendMode: 'overlay',
          }}
        />
      </div>

      {/* NEURAL CANVAS */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ mixBlendMode: 'screen' }}
      />

      {/* STATUS INDICATOR */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${
          orionState === 'IDLE' ? 'bg-cyan-500/60 animate-pulse' :
          orionState === 'THINKING' ? 'bg-blue-400 animate-ping' :
          orionState === 'EXECUTING' ? 'bg-cyan-400 animate-spin' :
          orionState === 'COMPLETED' ? 'bg-green-400' :
          'bg-amber-400 animate-bounce'
        }`} />
        <span className="font-mono text-[9px] tracking-[0.3em] text-white/50">
          ORION {orionState}
        </span>
      </div>
    </div>
  );
}
