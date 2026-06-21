"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export function AppHeader() {
  const [time, setTime] = useState<string>("");

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

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 1, type: "spring" }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-between items-center"
    >
      {/* Background blur layer */}
      <div className="absolute inset-0 bg-navy/50 backdrop-blur-3xl border-b border-white/10"></div>
      
      {/* LEFT: Branding & Status */}
      <div className="relative z-10 flex items-center gap-6">
        <Link href="/" className="font-black text-white tracking-widest uppercase hover:text-danger transition-colors">
          Sovereign Grid
        </Link>
        <div className="hidden md:flex items-center gap-2 text-xs font-mono opacity-80">
          <span className="w-2 h-2 rounded-full bg-danger animate-pulse"></span>
          <span className="text-white">LINK: SECURE</span>
        </div>
      </div>

      {/* CENTER: Live Clock */}
      <div className="relative z-10 hidden lg:block text-danger font-mono text-sm tracking-[0.2em] opacity-80">
        SYS_TIME // {time}
      </div>

      {/* RIGHT: Navigation */}
      <nav className="relative z-10 flex items-center gap-6">
        <Link href="/vault" className="text-xs text-textSecondary uppercase tracking-widest hover:text-white transition-colors">
          The Vault
        </Link>
        <Link href="/" className="text-xs text-textSecondary uppercase tracking-widest hover:text-white transition-colors">
          The Syndicate
        </Link>
        <button className="border border-danger/50 bg-danger/10 text-danger px-4 py-1.5 text-xs font-bold tracking-widest uppercase hover:bg-danger hover:text-white transition-colors">
          Initiate
        </button>
      </nav>
    </motion.header>
  );
}
