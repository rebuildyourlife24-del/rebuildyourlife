"use client";

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface AgentPulse {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  active: boolean;
}

export default function AIBrain({ activeAgents }: { activeAgents: any[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Colors corresponding to agents
  const agentColors: Record<number, string> = {
    1: '#4ade80', // Green
    2: '#c084fc', // Purple
    3: '#60a5fa', // Blue
    4: '#f472b6', // Pink
    99: '#facc15' // Yellow (Custom Plugin)
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 300;
    let height = 400;
    canvas.width = width;
    canvas.height = height;

    // Define positions for nodes inside the "brain" area of the head
    const baseNodes: AgentPulse[] = [
      { id: 1, x: 120, y: 150, color: agentColors[1], size: 15, active: false },
      { id: 2, x: 180, y: 130, color: agentColors[2], size: 15, active: false },
      { id: 3, x: 140, y: 220, color: agentColors[3], size: 15, active: false },
      { id: 4, x: 200, y: 180, color: agentColors[4], size: 15, active: false },
      { id: 99, x: 160, y: 100, color: agentColors[99], size: 15, active: false }
    ];

    let animationId: number;
    let time = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      time += 0.05;

      // Draw neural connections between nodes
      ctx.beginPath();
      for (let i = 0; i < baseNodes.length; i++) {
        for (let j = i + 1; j < baseNodes.length; j++) {
          const n1 = baseNodes[i];
          const n2 = baseNodes[j];
          const dist = Math.hypot(n1.x - n2.x, n1.y - n2.y);
          if (dist < 100) {
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);
          }
        }
      }
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.15)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Draw agent nodes
      baseNodes.forEach(node => {
        // Check if this agent is in the activeAgents list and not on standby
        const agent = activeAgents.find(a => a.id === node.id || (node.id === 99 && a.id > 4));
        const isStandby = agent?.isStandby;
        const isActive = !!agent;

        if (isActive) {
          const pulseSize = isStandby ? 0 : Math.sin(time + node.id) * 5;
          const currentSize = node.size + pulseSize;
          const alpha = isStandby ? 0.3 : 0.8 + Math.sin(time * 2 + node.id) * 0.2;

          ctx.beginPath();
          ctx.arc(node.x, node.y, currentSize, 0, Math.PI * 2);
          ctx.fillStyle = node.color;
          ctx.globalAlpha = alpha;
          ctx.shadowBlur = isStandby ? 5 : 20 + pulseSize * 2;
          ctx.shadowColor = node.color;
          ctx.fill();
          
          // Inner core
          ctx.beginPath();
          ctx.arc(node.x, node.y, currentSize * 0.4, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.fill();
        }
      });
      
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
      animationId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationId);
  }, [activeAgents]);

  return (
    <div className="relative w-[300px] h-[400px] mx-auto z-10 perspective-1000">
      {/* Abstract Transparent Human Head Silhouette */}
      <svg 
        className="absolute inset-0 w-full h-full opacity-30 drop-shadow-[0_0_15px_rgba(0,255,255,0.5)] pointer-events-none" 
        viewBox="0 0 300 400" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          d="M150 20C100 20 50 60 40 120C30 180 50 220 60 260C70 300 100 360 140 380C160 390 190 380 210 350C230 320 250 280 260 230C270 180 250 100 210 60C180 30 160 20 150 20Z" 
          stroke="url(#headGradient)" 
          strokeWidth="2" 
          fill="rgba(0, 240, 255, 0.05)"
        />
        <defs>
          <linearGradient id="headGradient" x1="150" y1="20" x2="150" y2="380" gradientUnits="userSpaceOnUse">
            <stop stopColor="#00f0ff" />
            <stop offset="1" stopColor="#a855f7" stopOpacity="0.2" />
          </linearGradient>
        </defs>
      </svg>

      {/* AI Brain Canvas */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full pointer-events-none mix-blend-screen"
      />

      {/* Ambient Glow */}
      <div className="absolute inset-0 bg-cyan-500/10 blur-[100px] rounded-full mix-blend-screen pointer-events-none" />
    </div>
  );
}
