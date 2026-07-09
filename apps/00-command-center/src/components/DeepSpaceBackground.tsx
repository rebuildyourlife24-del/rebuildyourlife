"use client";

import { useEffect, useRef } from 'react';

export default function DeepSpaceBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const stars: { x: number, y: number, radius: number, speed: number, alpha: number, glow: string }[] = [];
    const colors = ['#ffffff', '#cceeff', '#ffd1b3', '#b3d9ff'];

    for (let i = 0; i < 400; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.5,
        speed: Math.random() * 0.05 + 0.01,
        alpha: Math.random(),
        glow: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    let animationFrameId: number;

    const render = () => {
      // Clear with deep space color
      ctx.fillStyle = '#02000a';
      ctx.fillRect(0, 0, width, height);

      // Draw subtle nebula gradients
      const grd1 = ctx.createRadialGradient(width * 0.2, height * 0.2, 0, width * 0.2, height * 0.2, width * 0.5);
      grd1.addColorStop(0, 'rgba(30, 10, 60, 0.3)');
      grd1.addColorStop(1, 'transparent');
      ctx.fillStyle = grd1;
      ctx.fillRect(0, 0, width, height);

      const grd2 = ctx.createRadialGradient(width * 0.8, height * 0.8, 0, width * 0.8, height * 0.8, width * 0.6);
      grd2.addColorStop(0, 'rgba(10, 40, 60, 0.2)');
      grd2.addColorStop(1, 'transparent');
      ctx.fillStyle = grd2;
      ctx.fillRect(0, 0, width, height);

      // Draw and move stars
      stars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        
        ctx.shadowBlur = 10;
        ctx.shadowColor = star.glow;
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.abs(Math.sin(Date.now() * 0.001 * star.speed * 10 + star.alpha))})`;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Move stars slowly to the left
        star.x -= star.speed;
        if (star.x < 0) {
          star.x = width;
          star.y = Math.random() * height;
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
    />
  );
}
