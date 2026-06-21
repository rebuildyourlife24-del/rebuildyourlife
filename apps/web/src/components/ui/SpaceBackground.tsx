'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface SpaceBackgroundProps {
  theme?: 'blue' | 'red';
  intensity?: 'calm' | 'warp';
}

export function SpaceBackground({ theme = 'blue', intensity = 'calm' }: SpaceBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let stars: any[] = [];
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
    };

    const initStars = () => {
      stars = [];
      const numStars = window.innerWidth < 768 ? 100 : 300;
      for (let i = 0; i < numStars; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          z: Math.random() * canvas.width,
          size: Math.random() * 1.5 + 0.5,
          opacity: Math.random()
        });
      }
    };

    const drawStars = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      
      // Speed based on intensity
      const speed = intensity === 'warp' ? 15 : 0.5;
      
      // Color based on theme
      const color = theme === 'blue' 
        ? `rgba(34, 211, 238, ` 
        : `rgba(239, 68, 68, `;

      stars.forEach(star => {
        star.z -= speed;
        
        if (star.z <= 0) {
          star.x = Math.random() * canvas.width;
          star.y = Math.random() * canvas.height;
          star.z = canvas.width;
          star.size = Math.random() * 1.5 + 0.5;
        }

        // Perspective projection
        const k = 128.0 / star.z;
        const px = star.x * k + cx;
        const py = star.y * k + cy;

        if (px >= 0 && px <= canvas.width && py >= 0 && py <= canvas.height) {
          const size = star.size * k;
          const opacity = (1 - star.z / canvas.width) * star.opacity;
          
          ctx.beginPath();
          ctx.arc(px, py, size, 0, Math.PI * 2);
          
          if (intensity === 'warp') {
            // Draw lines for warp effect
            ctx.moveTo(px, py);
            ctx.lineTo(px + (star.x - cx) * k * 0.1, py + (star.y - cy) * k * 0.1);
            ctx.strokeStyle = `${color}${opacity})`;
            ctx.lineWidth = size;
            ctx.stroke();
          } else {
            // Normal stars
            ctx.fillStyle = `${color}${opacity})`;
            ctx.fill();
          }
          
          // Glow effect for larger stars
          if (size > 1.5 && theme === 'blue') {
            ctx.shadowBlur = 10;
            ctx.shadowColor = 'rgba(34, 211, 238, 0.5)';
          } else if (size > 1.5 && theme === 'red') {
            ctx.shadowBlur = 15;
            ctx.shadowColor = 'rgba(239, 68, 68, 0.8)';
          } else {
            ctx.shadowBlur = 0;
          }
        }
      });

      animationFrameId = requestAnimationFrame(drawStars);
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    drawStars();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme, intensity]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      className={`fixed inset-0 z-0 pointer-events-none ${
        theme === 'red' ? 'bg-black' : 'bg-black'
      }`}
    >
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full"
      />
      
      {/* Nebulas / Ambient Glows */}
      {theme === 'blue' && (
        <>
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,rgba(8,145,178,0.15),transparent_50%)]"></div>
          <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,rgba(34,211,238,0.1),transparent_50%)]"></div>
        </>
      )}
      
      {theme === 'red' && (
        <>
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(220,38,38,0.15),transparent_60%)]"></div>
          <div className="absolute bottom-0 right-0 w-[200%] h-[200%] -translate-x-1/2 -translate-y-1/2 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(220,38,38,0.03)_3px,rgba(220,38,38,0.03)_3px)] mix-blend-screen pointer-events-none"></div>
        </>
      )}
    </motion.div>
  );
}
