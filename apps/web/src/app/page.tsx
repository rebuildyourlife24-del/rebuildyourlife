'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ShieldCheck, Target, Zap, BrainCircuit, Globe, Activity } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function CinematicLandingPage() {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;
    
    // Core GSAP Revelations
    const elements = gsap.utils.toArray('.reveal');
    elements.forEach((el: any) => {
      gsap.fromTo(el, 
        { autoAlpha: 0, y: 80, filter: 'blur(10px)' },
        { 
          duration: 2, 
          autoAlpha: 1, 
          y: 0, 
          filter: 'blur(0px)',
          ease: "expo.out",
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });

    // Parallax background map
    gsap.to('.parallax-map', {
      yPercent: 30,
      ease: "none",
      scrollTrigger: {
        trigger: contentRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true
      }
    });
  }, []);

  return (
    <div className="relative min-h-screen text-white font-sans bg-[#02040a] selection:bg-blue-500/30 overflow-hidden">
      
      {/* 1. BACKGROUND: THE WORLD MAP & NEURAL CANVAS */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden flex items-center justify-center">
        {/* Deep space void */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-[#02040a] to-[#02040a]"></div>
        
        {/* Parallax High Tech World Map */}
        <div 
          className="parallax-map absolute w-[150vw] h-[150vh] opacity-20 bg-center bg-no-repeat bg-contain"
          style={{ backgroundImage: "url('/world-map-hud.png')", mixBlendMode: 'screen', filter: 'hue-rotate(200deg) saturate(2)' }}
        ></div>

        {/* Neural Nodes (Abstract Animated Overlay) */}
        <div className="absolute inset-0 opacity-30">
           {/* We simulate the neural canvas with floating radiant orbs */}
           <motion.div animate={{ y: [0, -20, 0], opacity: [0.3, 0.8, 0.3] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full shadow-[0_0_20px_#3b82f6]"></motion.div>
           <motion.div animate={{ y: [0, 30, 0], opacity: [0.2, 0.6, 0.2] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }} className="absolute top-1/3 right-1/4 w-3 h-3 bg-indigo-400 rounded-full shadow-[0_0_30px_#6366f1]"></motion.div>
           <motion.div animate={{ x: [0, 40, 0], opacity: [0.4, 0.9, 0.4] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }} className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-blue-300 rounded-full shadow-[0_0_15px_#93c5fd]"></motion.div>
        </div>
      </div>

      {/* FOREGROUND CONTENT */}
      <div ref={contentRef} className="relative z-10">
        
        {/* HERO SECTION: THE CORE */}
        <section className="min-h-screen flex flex-col justify-center items-center text-center px-6 relative">
          
          {/* THE BRAIN HUD (Centerpiece) */}
          <motion.div 
             initial={{ scale: 0.8, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             transition={{ duration: 3, ease: "easeOut" }}
             className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none z-[-1] flex items-center justify-center"
          >
             {/* Pulsing rings */}
             <div className="absolute inset-0 rounded-full border border-blue-500/10 animate-[spin_20s_linear_infinite]"></div>
             <div className="absolute inset-8 rounded-full border border-dashed border-blue-400/20 animate-[spin_30s_linear_infinite_reverse]"></div>
             
             {/* Central Brain Glow */}
             <div className="w-64 h-64 rounded-full bg-blue-900/20 blur-3xl animate-pulse"></div>
          </motion.div>

          <div className="reveal flex flex-col items-center">
            {/* System Status HUD */}
            <div className="flex items-center gap-3 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-900/10 backdrop-blur-md mb-8">
               <div className="relative flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
                  <div className="absolute w-2 h-2 rounded-full bg-blue-400 blur-[4px]"></div>
               </div>
               <span className="text-[9px] tracking-[0.4em] uppercase font-mono text-blue-300">AEIP Core Active</span>
            </div>

            <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-black uppercase tracking-tighter leading-[0.8] mb-8 mix-blend-screen drop-shadow-2xl font-serif">
              REBUILD <br /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-white/80 to-blue-900/50">YOUR LIFE</span>
            </h1>
            
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-blue-100/60 font-light mb-12 leading-relaxed backdrop-blur-sm">
              Een ongeëvenaard ecosysteem voor de ondernemer die weigert te verliezen. Aangedreven door autonome AI-agenten en militaire-graad architectuur.
            </p>
            
            <Link 
              href="/auth/login"
              className="group relative inline-flex items-center gap-4 px-10 py-5 bg-[#02040a]/40 backdrop-blur-xl border border-blue-500/30 overflow-hidden transition-all hover:border-blue-400 shadow-[0_0_40px_rgba(59,130,246,0.15)] rounded-sm"
            >
              <div className="absolute inset-0 w-0 bg-blue-600 transition-all duration-700 ease-out group-hover:w-full -z-10"></div>
              <BrainCircuit className="w-5 h-5 text-blue-400 group-hover:text-white transition-colors" />
              <span className="relative z-10 text-xs font-bold tracking-[0.3em] uppercase group-hover:text-white transition-colors duration-300 text-blue-100">
                Initialiseer Protocol
              </span>
            </Link>
          </div>
          
          {/* Scroll Indicator */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
             <div className="w-[1px] h-12 bg-gradient-to-b from-blue-500 to-transparent"></div>
             <span className="text-[8px] tracking-[0.4em] uppercase text-blue-500/50">Afdalen</span>
          </div>
        </section>

        {/* DATA STREAM / ARCHITECTURE SECTION */}
        <section className="py-32 px-6 max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-8">
           
           {/* Left Info Panel */}
           <div className="md:col-span-4 flex flex-col gap-8 reveal">
              <div className="glass-panel p-8 rounded-xl relative overflow-hidden group">
                 <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-transparent"></div>
                 <Globe className="w-8 h-8 text-blue-400 mb-6" />
                 <h3 className="text-2xl font-serif font-bold uppercase tracking-wider mb-4">Globaal Bereik</h3>
                 <p className="text-blue-100/50 text-sm leading-relaxed">
                   Verbind met het AEIP systeem vanuit elke hoek van de wereld. Uw data wordt asynchroon verwerkt en beschermd door de Orion Vault.
                 </p>
              </div>

              <div className="glass-panel p-8 rounded-xl relative overflow-hidden group">
                 <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-600 to-transparent"></div>
                 <Activity className="w-8 h-8 text-indigo-400 mb-6" />
                 <h3 className="text-2xl font-serif font-bold uppercase tracking-wider mb-4">Real-time Executie</h3>
                 <p className="text-blue-100/50 text-sm leading-relaxed">
                   De autonome CEO en CMO agenten analyseren markttrends in real-time. Geen vertraging, brute efficiëntie.
                 </p>
              </div>
           </div>

           {/* Center Cinematic Display */}
           <div className="md:col-span-8 glass p-1 rounded-2xl reveal min-h-[500px] relative overflow-hidden flex items-center justify-center shadow-[0_0_100px_rgba(30,58,138,0.2)]">
              {/* Internal Glass Window */}
              <div className="absolute inset-0 m-1 bg-[#02040a]/80 rounded-xl backdrop-blur-2xl border border-white/5 overflow-hidden">
                 {/* Decorative Grid */}
                 <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 bg-repeat bg-[length:30px_30px]"></div>
                 
                 {/* Interface Mockup Elements */}
                 <div className="absolute top-6 left-6 right-6 flex justify-between items-center border-b border-blue-900/30 pb-4">
                    <div className="flex gap-2">
                       <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                       <div className="w-3 h-3 rounded-full bg-amber-500/50"></div>
                       <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                    </div>
                    <span className="text-[10px] font-mono tracking-widest text-blue-500">LIVE FEED // J.A.R.V.I.S.</span>
                 </div>

                 <div className="absolute inset-0 mt-20 p-8 flex flex-col justify-center items-center text-center">
                    <ShieldCheck className="w-16 h-16 text-blue-500/50 mb-6 animate-pulse" />
                    <h2 className="text-3xl font-light tracking-widest mb-4">FINANCIËLE VESTING</h2>
                    <p className="text-sm font-mono text-blue-300/60 max-w-md mx-auto">
                       Encryptie niveau 4 actief. Vermogen wordt geherstructureerd via gedecentraliseerde knooppunten. Schulden worden systematisch geëlimineerd door het algoritme.
                    </p>
                 </div>
              </div>
           </div>

        </section>

        {/* PILLARS / HUD METRICS */}
        <section className="py-32 px-6 max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="reveal p-8 border border-white/5 bg-blue-950/10 backdrop-blur-md rounded-lg hover:bg-blue-900/20 transition-all group">
            <Target className="w-8 h-8 text-blue-400 mb-6 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-bold uppercase tracking-widest mb-4">Laser Focus</h3>
            <div className="w-full h-px bg-gradient-to-r from-blue-500/50 to-transparent mb-4"></div>
            <p className="text-blue-100/50 text-sm leading-relaxed">
              Krijg direct toegang tot bewezen bedrijfsmodellen en E-commerce blauwdrukken via de neurale link.
            </p>
          </div>
          
          <div className="reveal p-8 border border-white/5 bg-blue-950/10 backdrop-blur-md rounded-lg hover:bg-blue-900/20 transition-all group mt-0 md:mt-16">
            <Zap className="w-8 h-8 text-indigo-400 mb-6 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-bold uppercase tracking-widest mb-4">Snelheid</h3>
            <div className="w-full h-px bg-gradient-to-r from-indigo-500/50 to-transparent mb-4"></div>
            <p className="text-blue-100/50 text-sm leading-relaxed">
              Taken die mensen in weken doen, voert de swarm in seconden uit. Genereer content, ads en code on the fly.
            </p>
          </div>

          <div className="reveal p-8 border border-white/5 bg-blue-950/10 backdrop-blur-md rounded-lg hover:bg-blue-900/20 transition-all group mt-0 md:mt-32">
            <BrainCircuit className="w-8 h-8 text-sky-400 mb-6 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-bold uppercase tracking-widest mb-4">Elite Netwerk</h3>
            <div className="w-full h-px bg-gradient-to-r from-sky-500/50 to-transparent mb-4"></div>
            <p className="text-blue-100/50 text-sm leading-relaxed">
              Omring jezelf met winnaars in de exclusieve RYL command room. Vertraging is geen optie meer.
            </p>
          </div>
        </section>

        {/* FOOTER PADDING & FINAL CTA */}
        <section className="h-[70vh] flex flex-col items-center justify-center border-t border-white/5 bg-gradient-to-t from-[#02040a] to-transparent mt-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/world-map-hud.png')] bg-cover bg-center opacity-5 mix-blend-screen filter hue-rotate-180"></div>
          <div className="text-center reveal relative z-10">
            <div className="w-16 h-16 mx-auto border-2 border-blue-500/30 rounded-full flex items-center justify-center mb-8 relative">
               <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
               <div className="absolute inset-[-10px] border border-blue-500/10 rounded-full animate-[spin_4s_linear_infinite]"></div>
            </div>
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-widest mb-8 font-serif">Systeem Gereed</h2>
            <Link 
              href="/auth/login" 
              className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black hover:bg-blue-500 hover:text-white transition-colors duration-500 text-xs font-bold tracking-[0.2em] uppercase rounded-sm"
            >
              Access Command Center
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}

