"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';

export function AppHeader() {
  const [time, setTime] = useState<string>("");
  const pathname = usePathname();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Format: HH:MM:SS:MS
      const h = now.getHours().toString().padStart(2, '0');
      const m = now.getMinutes().toString().padStart(2, '0');
      const s = now.getSeconds().toString().padStart(2, '0');
      const ms = Math.floor(now.getMilliseconds() / 10).toString().padStart(2, '0');
      setTime(`${h}:${m}:${s}:${ms}`);
    };
    
    const timer = setInterval(updateTime, 50);
    return () => clearInterval(timer);
  }, []);

  if (pathname === '/') return null;

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 1, type: "spring" }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-between items-center"
    >
      {/* Background blur layer */}
      <div className="absolute inset-0 bg-[#020202]/50 backdrop-blur-3xl border-b border-neonCyan/10"></div>
      
      {/* LEFT: Branding & Status */}
      <div className="relative z-10 flex items-center gap-6">
        <Link href="/" className="font-black text-white tracking-widest uppercase hover:text-neonCyan transition-colors">
          R Y L
        </Link>
        <div className="hidden md:flex items-center gap-2 text-xs font-mono opacity-80">
          <span className="w-2 h-2 rounded-full bg-neonCyan animate-pulse shadow-[0_0_10px_rgba(6,182,212,0.8)]"></span>
          <span className="text-white">LINK: SECURE</span>
        </div>
      </div>

      {/* CENTER: Live Clock */}
      <div className="relative z-10 hidden lg:block text-neonCyan font-mono text-sm tracking-[0.2em] opacity-80">
        SYS_TIME // {time}
      </div>

      {/* RIGHT: Navigation */}
      <nav className="relative z-10 flex items-center gap-6">
        <Link href="/dashboard/tools" className="text-xs text-zinc-400 uppercase tracking-widest hover:text-white transition-colors">
          The Vault
        </Link>
        <Link href="/coming-soon" className="text-xs text-zinc-400 uppercase tracking-widest hover:text-white transition-colors">
          The Syndicate
        </Link>
        <Link href="/login" className="border border-neonCyan/50 bg-neonCyan/10 text-neonCyan px-4 py-1.5 text-xs font-bold tracking-widest uppercase hover:bg-neonCyan hover:text-[#020202] transition-colors shadow-[0_0_15px_rgba(6,182,212,0.2)]">
          Initiate
        </Link>
      </nav>
    </motion.header>
  );
}

