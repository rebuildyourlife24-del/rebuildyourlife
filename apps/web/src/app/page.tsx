'use client';

import { motion } from 'framer-motion';
import { Command, ChevronRight, Play, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function CinematicLandingPage() {
  return (
    <div className="min-h-screen bg-navy text-white selection:bg-gold/30 selection:text-white font-sans flex flex-col relative overflow-hidden">
      
      {/* BACKGROUND */}
      <div className="fixed inset-0 z-0 bg-navy">
        <div className="absolute inset-0 opacity-[0.05] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSIvPgo8L3N2Zz4=')] z-10 pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-navy/80 via-navyLight/20 to-navy mix-blend-multiply z-10"></div>
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-gold/10 blur-[120px] rounded-full pointer-events-none"></div>
      </div>

      {/* NAVIGATION */}
      <nav className="relative z-50 flex items-center justify-between px-6 py-6 md:px-12 md:py-8 w-full">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gold flex items-center justify-center">
            <Command className="w-5 h-5 text-navy" />
          </div>
          <span className="text-white font-black tracking-[0.2em] text-sm uppercase">Sovereign Wealth</span>
        </div>
        <Link href="/onboarding" className="text-xs font-black uppercase tracking-[0.2em] text-white hover:text-gold transition-colors border border-white/20 hover:border-gold px-6 py-3 bg-navy/50 backdrop-blur-md">
          Start Jouw Reis
        </Link>
      </nav>

      {/* HERO SECTION */}
      <main className="relative z-30 flex-1 flex flex-col justify-center px-6 md:px-12 max-w-[1400px] mx-auto w-full py-20">
        <div className="max-w-4xl">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-5xl sm:text-7xl md:text-[7rem] font-black leading-[0.9] uppercase tracking-tighter mb-8">
              Jouw Toekomst.<br/>
              <span className="text-gold block mt-2">Jouw Regels.</span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="flex flex-col md:flex-row gap-8 md:gap-16 items-start md:items-center"
          >
            <Link 
              href="/onboarding"
              className="group flex items-center gap-6 cursor-pointer w-fit"
            >
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-white/20 group-hover:border-gold flex items-center justify-center transition-all group-hover:scale-105 bg-navy/40 backdrop-blur-sm">
                <Play className="w-8 h-8 text-white group-hover:text-gold ml-1 transition-colors" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-gold uppercase tracking-[0.2em] mb-1">Jouw Fundering</div>
                <div className="text-xl md:text-2xl font-black text-white uppercase tracking-wider">Start Visie</div>
              </div>
            </Link>
            
            <div className="text-lg md:text-xl text-zinc-400 font-medium leading-relaxed border-l-4 border-gold pl-6 py-2 max-w-xl">
              Herbouw je leven met zekerheid. Krijg toegang tot de tools, de strategieën en het netwerk dat je nodig hebt voor <strong className="text-white">echte financiële vrijheid</strong>.
            </div>
          </motion.div>
        </div>
      </main>

      {/* TIER SELECTION */}
      <div className="relative z-30 max-w-[1400px] mx-auto w-full px-6 md:px-12 pb-32 flex flex-col md:flex-row justify-center gap-6">
        
        <Link href="/tiers/ecom" className="group flex-1 bg-navyLight/80 backdrop-blur-md border border-white/10 hover:border-gold p-6 transition-all hover:-translate-y-2">
          <div className="text-[10px] text-gold font-mono uppercase tracking-widest mb-2">TIER 01</div>
          <div className="text-xl font-black uppercase tracking-widest mb-1 group-hover:text-gold transition-colors">START-UP BLAUWDRUK</div>
          <div className="text-sm text-zinc-400 font-medium mb-4">De perfecte basis voor jouw eerste e-commerce stappen.</div>
          <div className="flex items-center justify-between mt-auto">
            <span className="text-lg font-bold text-white">€50<span className="text-xs text-zinc-500">/mnd</span></span>
            <ArrowRight className="w-5 h-5 text-zinc-600 group-hover:text-gold transition-colors" />
          </div>
        </Link>

        <Link href="/tiers/tech" className="group flex-1 bg-navyLight/80 backdrop-blur-md border border-white/10 hover:border-gold p-6 transition-all hover:-translate-y-2">
          <div className="text-[10px] text-gold font-mono uppercase tracking-widest mb-2">TIER 02</div>
          <div className="text-xl font-black uppercase tracking-widest mb-1 group-hover:text-gold transition-colors">SCHAALBAAR SUCCES</div>
          <div className="text-sm text-zinc-400 font-medium mb-4">Voor de ondernemer die klaar is voor de volgende stap.</div>
          <div className="flex items-center justify-between mt-auto">
            <span className="text-lg font-bold text-white">€99<span className="text-xs text-zinc-500">/mnd</span></span>
            <ArrowRight className="w-5 h-5 text-zinc-600 group-hover:text-gold transition-colors" />
          </div>
        </Link>

        <Link href="/tiers/elite" className="group flex-1 bg-gold/10 backdrop-blur-md border border-gold p-6 transition-all hover:-translate-y-2 hover:bg-gold/20">
          <div className="text-[10px] text-white font-mono uppercase tracking-widest mb-2">TIER 03</div>
          <div className="text-xl font-black uppercase tracking-widest mb-1 text-white transition-colors">ELITE PARTNERSCHAP</div>
          <div className="text-sm text-zinc-300 font-medium mb-4">Directe 1-op-1 toegang tot onze top-experts.</div>
          <div className="flex items-center justify-between mt-auto">
            <span className="text-lg font-bold text-white">APPLY NOW</span>
            <ArrowRight className="w-5 h-5 text-white transition-colors" />
          </div>
        </Link>

      </div>
    </div>
  );
}
