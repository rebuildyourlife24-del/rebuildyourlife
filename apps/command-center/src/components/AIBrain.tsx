"use client";

import { useEffect, useRef } from 'react';

export default function AIBrain({ activeAgents }: { activeAgents: { id: number; title: string; isStandby?: boolean; [key: string]: unknown }[] }) {
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

    // Generate constellation nodes inside a human silhouette (head + shoulders)
    const nodes: { x: number, y: number, vx: number, vy: number, baseRadius: number }[] = [];
    
    for (let i = 0; i < 250; i++) {
      let x = Math.random() * width;
      let y = Math.random() * height;
      
      // Basic bounding box for a head and shoulders silhouette
      const cx = width / 2;
      const headRadiusY = 120;
      const headRadiusX = 90;
      const headCenterY = 150;
      
      // Check if point is inside head ellipse
      const isHead = (Math.pow(x - cx, 2) / Math.pow(headRadiusX, 2)) + (Math.pow(y - headCenterY, 2) / Math.pow(headRadiusY, 2)) <= 1;
      
      // Check if point is inside shoulders (bottom half)
      const isShoulders = y > 250 && y < 500 && Math.abs(x - cx) < (y - 150) * 0.8;

      if (isHead || isShoulders) {
        nodes.push({
          x, y,
          vx: (Math.random() - 0.5) * 0.2,
          vy: (Math.random() - 0.5) * 0.2,
          baseRadius: Math.random() * 1.5 + 0.5
        });
      }
    }

    // Special Agent Nodes (The glowing pulses in the brain)
    const agentColors: Record<number, string> = {
      1: '#4ade80', 2: '#c084fc', 3: '#60a5fa', 4: '#f472b6', 99: '#facc15'
    };
    
    const agentNodes = [
      { id: 1, x: 180, y: 120 }, { id: 2, x: 220, y: 140 }, 
      { id: 3, x: 160, y: 170 }, { id: 4, x: 240, y: 160 }, 
      { id: 99, x: 200, y: 100 }
    ];

    let animationId: number;
    let time = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      time += 0.02;

      // Update and draw constellation nodes
      ctx.fillStyle = 'rgba(0, 240, 255, 0.6)';
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.1)';
      ctx.lineWidth = 0.5;

      nodes.forEach(node => {
        node.x += node.vx;
        node.y += node.vy;

        // Subtle jiggle
        node.vx += (Math.random() - 0.5) * 0.05;
        node.vy += (Math.random() - 0.5) * 0.05;
        
        // Dampen velocity
        node.vx *= 0.95;
        node.vy *= 0.95;

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.baseRadius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Connect close nodes
      ctx.beginPath();
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dist = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
          if (dist < 30) {
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
          }
        }
      }
      ctx.stroke();

      // Draw active agent pulses inside the brain
      agentNodes.forEach(node => {
        const agent = activeAgents.find(a => a.id === node.id || (node.id === 99 && a.id > 4));
        if (agent) {
          const isStandby = agent.isStandby;
          const color = agentColors[node.id];
          const pulse = isStandby ? 0 : Math.sin(time * 3 + node.id) * 3;
          const radius = 6 + pulse;

          ctx.beginPath();
          ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.shadowBlur = isStandby ? 5 : 20;
          ctx.shadowColor = color;
          ctx.globalAlpha = isStandby ? 0.4 : 0.9;
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
  }, [activeAgents]);

  return (
    <div className="relative w-[400px] h-[500px] flex items-center justify-center z-10 perspective-1000">
      {/* Central Core Glow */}
      <div className="absolute inset-0 bg-cyan-500/10 blur-[80px] rounded-full mix-blend-screen pointer-events-none" />
      
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full pointer-events-none mix-blend-screen"
      />
    </div>
  );
}
