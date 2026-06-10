"use client";

import { useEffect, useRef } from 'react';
import { OrionState } from './CommandBar';

export default function AIBrain({ activeAgents, orionState = 'IDLE' }: { activeAgents: { id: number; title: string; isStandby?: boolean; [key: string]: unknown }[], orionState?: OrionState }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 400;
    const height = 500;
    canvas.width = width;
    canvas.height = height;

    const nodes: { x: number, y: number, vx: number, vy: number, baseRadius: number }[] = [];
    
    for (let i = 0; i < 200; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      
      const cx = width / 2;
      const brainRadiusY = 70;
      const brainRadiusX = 85;
      const brainCenterY = 120;
      
      const isBrain = (Math.pow(x - cx, 2) / Math.pow(brainRadiusX, 2)) + (Math.pow(y - brainCenterY, 2) / Math.pow(brainRadiusY, 2)) <= 1;
      const isSpine = y > 180 && y < 350 && Math.abs(x - cx) < 15;

      if (isBrain || isSpine) {
        nodes.push({
          x, y,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          baseRadius: Math.random() * 1.5 + 0.5
        });
      }
    }

    const agentColors: Record<number, string> = {
      1: '#4ade80', 2: '#c084fc', 3: '#60a5fa', 4: '#f472b6', 99: '#facc15'
    };
    
    const agentNodes = [
      { id: 1, x: 180, y: 100 }, { id: 2, x: 220, y: 110 }, 
      { id: 3, x: 170, y: 140 }, { id: 4, x: 230, y: 130 }, 
      { id: 99, x: 200, y: 80 }
    ];

    let animationId: number;
    let time = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Speed multiplier based on state
      const speedMult = orionState === 'THINKING' ? 3 : orionState === 'EXECUTING' ? 5 : 1;
      time += 0.02 * speedMult;

      ctx.fillStyle = orionState === 'COMPLETED' ? 'rgba(74, 222, 128, 0.9)' : 'rgba(0, 240, 255, 0.8)';
      ctx.strokeStyle = orionState === 'COMPLETED' ? 'rgba(74, 222, 128, 0.3)' : 'rgba(0, 240, 255, 0.2)';
      ctx.lineWidth = orionState === 'EXECUTING' ? 1.5 : 0.5;

      nodes.forEach(node => {
        node.x += node.vx * speedMult;
        node.y += node.vy * speedMult;

        node.vx += (Math.random() - 0.5) * 0.05 * speedMult;
        node.vy += (Math.random() - 0.5) * 0.05 * speedMult;
        
        node.vx *= 0.95;
        node.vy *= 0.95;

        if (node.x < 100 || node.x > 300) node.vx *= -1;
        if (node.y < 50 || node.y > 400) node.vy *= -1;

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.baseRadius * (orionState === 'THINKING' ? 1.5 : 1), 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.beginPath();
      const connectionDist = orionState === 'EXECUTING' ? 40 : 25;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dist = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
          if (dist < connectionDist) {
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
          }
        }
      }
      ctx.stroke();

      agentNodes.forEach(node => {
        const agent = activeAgents.find(a => a.id === node.id || (node.id === 99 && a.id > 4));
        if (agent) {
          const isStandby = agent.isStandby;
          const color = agentColors[node.id];
          const pulse = isStandby ? 0 : Math.sin(time * 3 + node.id) * 3;
          const radius = 6 + pulse;

          ctx.beginPath();
          ctx.arc(node.x, node.y, radius * 2, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.globalAlpha = orionState === 'EXECUTING' ? 0.6 : 0.2;
          ctx.fill();

          ctx.beginPath();
          ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
          ctx.shadowBlur = isStandby ? 5 : 20;
          ctx.shadowColor = color;
          ctx.globalAlpha = isStandby ? 0.4 : 1;
          ctx.fill();
          
          ctx.beginPath();
          ctx.arc(node.x, node.y, radius * 0.4, 0, Math.PI * 2);
          ctx.fillStyle = '#fff';
          ctx.fill();
          
          ctx.shadowBlur = 0;
          ctx.globalAlpha = 1;
        }
      });

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationId);
  }, [activeAgents, orionState]);

  const isTalking = orionState === 'THINKING' || orionState === 'EXECUTING';

  return (
    <div className="relative w-[400px] h-[500px] flex items-center justify-center z-10 perspective-1000">
      <div 
        className={`absolute inset-0 w-full h-full bg-center bg-no-repeat bg-contain opacity-80 mix-blend-screen transition-transform duration-100 ${isTalking ? 'scale-[1.02] translate-y-[-2px] brightness-125' : 'scale-100 translate-y-0 brightness-100'}`}
        style={{ backgroundImage: "url('/hologram_head.png')" }}
      />
      <div className={`absolute top-[60px] w-[200px] h-[150px] bg-cyan-500/20 blur-[50px] rounded-full mix-blend-screen pointer-events-none transition-all duration-300 ${orionState === 'THINKING' ? 'opacity-100 scale-110' : orionState === 'EXECUTING' ? 'opacity-100 scale-125 bg-cyan-400/40' : 'opacity-60 scale-100'}`} />
      
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full pointer-events-none mix-blend-screen"
      />
    </div>
  );
}
