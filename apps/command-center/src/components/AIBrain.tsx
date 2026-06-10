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

    const cx = width / 2;
    const cy = 120; // Brain center

    // Semantic Nodes Definition
    const semanticNodes = [
      { id: 'n1', label: 'CASHFLOW', group: 'finance', x: cx - 40, y: cy - 20, tx: cx - 40, ty: cy - 20 },
      { id: 'n2', label: 'STRIPE_API', group: 'finance', x: cx - 60, y: cy + 10, tx: cx - 60, ty: cy + 10 },
      { id: 'n3', label: 'META_ADS', group: 'wealth', x: cx + 50, y: cy - 30, tx: cx + 50, ty: cy - 30 },
      { id: 'n4', label: 'TRENDS', group: 'wealth', x: cx + 30, y: cy + 20, tx: cx + 30, ty: cy + 20 },
      { id: 'n5', label: 'CRAWLER', group: 'seo', x: cx, y: cy - 50, tx: cx, ty: cy - 50 },
      { id: 'n6', label: 'LEADS_DB', group: 'seo', x: cx + 10, y: cy + 40, tx: cx + 10, ty: cy + 40 },
      { id: 'n7', label: 'ORION_CORE', group: 'core', x: cx, y: cy, tx: cx, ty: cy },
    ];

    // Background filler nodes for density
    const fillerNodes: { x: number, y: number, tx: number, ty: number, radius: number }[] = [];
    for (let i = 0; i < 100; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 60;
      fillerNodes.push({
        x: cx + Math.cos(angle) * radius,
        y: cy + Math.sin(angle) * radius,
        tx: cx + Math.cos(angle) * radius,
        ty: cy + Math.sin(angle) * radius,
        radius: Math.random() * 1.5 + 0.5
      });
    }

    let animationId: number;
    let time = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      
      const speedMult = orionState === 'THINKING' ? 3 : orionState === 'EXECUTING' ? 5 : 1;
      time += 0.02 * speedMult;

      // Update target positions based on state
      if (orionState === 'THINKING') {
        // Tight cluster
        semanticNodes.forEach((n, i) => {
          n.tx = cx + Math.cos(time * 2 + i) * 15;
          n.ty = cy + Math.sin(time * 2 + i) * 15;
        });
        fillerNodes.forEach((n, i) => {
          n.tx = cx + Math.cos(i) * 30;
          n.ty = cy + Math.sin(i) * 30;
        });
      } else if (orionState === 'EXECUTING') {
        // Structured grid/flow
        semanticNodes.forEach((n, i) => {
          n.tx = cx + (i % 3 - 1) * 40;
          n.ty = cy + Math.floor(i / 3 - 1) * 40;
        });
        fillerNodes.forEach((n, i) => {
          n.tx = cx + (Math.random() - 0.5) * 120;
          n.ty = cy + (Math.random() - 0.5) * 80 + Math.sin(time * 5 + i) * 20;
        });
      } else {
        // Idle - gentle drift
        semanticNodes.forEach((n, i) => {
          n.tx = cx + Math.cos(time * 0.5 + i) * 45;
          n.ty = cy + Math.sin(time * 0.5 + i) * 35;
        });
        fillerNodes.forEach((n, i) => {
          n.tx = cx + Math.cos(time * 0.2 + i) * 70;
          n.ty = cy + Math.sin(time * 0.2 + i) * 50;
        });
      }

      // Physics interpolation
      const lerp = (start: number, end: number, amt: number) => (1 - amt) * start + amt * end;
      
      semanticNodes.forEach(n => {
        n.x = lerp(n.x, n.tx, 0.05 * speedMult);
        n.y = lerp(n.y, n.ty, 0.05 * speedMult);
      });

      fillerNodes.forEach(n => {
        n.x = lerp(n.x, n.tx, 0.02 * speedMult);
        n.y = lerp(n.y, n.ty, 0.02 * speedMult);
      });

      // Draw filler nodes and connections
      ctx.fillStyle = orionState === 'COMPLETED' ? 'rgba(74, 222, 128, 0.6)' : 'rgba(0, 240, 255, 0.4)';
      ctx.strokeStyle = orionState === 'COMPLETED' ? 'rgba(74, 222, 128, 0.1)' : 'rgba(0, 240, 255, 0.05)';
      ctx.lineWidth = 0.5;

      ctx.beginPath();
      fillerNodes.forEach(n => {
        ctx.moveTo(n.x, n.y);
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
      });
      ctx.fill();

      // Connect filler nodes slightly
      ctx.beginPath();
      for (let i = 0; i < fillerNodes.length; i += 3) {
        for (let j = i + 1; j < fillerNodes.length; j += 4) {
          const dist = Math.hypot(fillerNodes[i].x - fillerNodes[j].x, fillerNodes[i].y - fillerNodes[j].y);
          if (dist < 20) {
            ctx.moveTo(fillerNodes[i].x, fillerNodes[i].y);
            ctx.lineTo(fillerNodes[j].x, fillerNodes[j].y);
          }
        }
      }
      ctx.stroke();

      // Draw Semantic Nodes
      ctx.lineWidth = orionState === 'EXECUTING' ? 1.5 : 0.8;
      ctx.strokeStyle = orionState === 'COMPLETED' ? 'rgba(74, 222, 128, 0.8)' : 'rgba(0, 240, 255, 0.5)';
      
      // Connect Semantic Nodes to Core
      const coreNode = semanticNodes.find(n => n.id === 'n7');
      if (coreNode) {
        ctx.beginPath();
        semanticNodes.forEach(n => {
          if (n.id !== 'n7') {
            ctx.moveTo(coreNode.x, coreNode.y);
            ctx.lineTo(n.x, n.y);
          }
        });
        ctx.stroke();
      }

      // Render Semantic Nodes and Labels
      semanticNodes.forEach(n => {
        const radius = n.id === 'n7' ? 8 : 4;
        
        ctx.beginPath();
        ctx.arc(n.x, n.y, radius + (orionState === 'THINKING' ? Math.random() * 2 : 0), 0, Math.PI * 2);
        ctx.fillStyle = n.id === 'n7' ? '#fff' : (orionState === 'COMPLETED' ? '#4ade80' : '#06b6d4');
        ctx.shadowBlur = 10;
        ctx.shadowColor = ctx.fillStyle;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Draw Labels
        ctx.font = '8px monospace';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.fillText(n.label, n.x + 8, n.y + 3);
      });

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationId);
  }, [orionState]);

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
