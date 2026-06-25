'use client';

import { motion } from 'framer-motion';
import { Command, ChevronRight, Play, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useState, useRef } from 'react';

// Ticker tape animation variants
const marqueeVariants = {
  animate: {
    x: [0, -1036],
    transition: {
      x: {
        repeat: Infinity,
        repeatType: "loop",
        duration: 10,
        ease: "linear",
      },
    },
  },
};

export default function CinematicLandingPage() {
  const [videoPlaying, setVideoPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlayVideo = () => {
    setVideoPlaying(true);
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#0055A4]/30 selection:text-white font-sans overflow-x-hidden relative">
      
      {/* 4K CINEMATIC FILM BACKGROUND */}
      <div className="fixed inset-0 z-0">
        {/* Placeholder for the high-end film intro. Using a dark overlay for now. */}
        {/* In production, the src should point to a highly optimized 4K cinematic MP4 */}
        <video 
          ref={videoRef}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${videoPlaying ? 'opacity-100' : 'opacity-40'}`}
          loop 
          muted={!videoPlaying}
          playsInline
          poster="/placeholder-poster.jpg"
        >
          {/* Replace with actual video URL when available */}
          <source src="https://assets.mixkit.co/videos/preview/mixkit-set-of-plateaus-seen-from-the-sky-in-a-dark-41793-large.mp4" type="video/mp4" />
        </video>
        
        {/* Vignette & Grain */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_0%,rgba(5,5,5,0.9)_100%)] pointer-events-none z-10"></div>
        <div className="absolute inset-0 opacity-[0.05] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSIvPgo8L3N2Zz4=')] z-10 pointer-events-none"></div>
        
        {/* Brutalist Red Gradient Overlay (Only visible when video is not full-focus) */}
        {!videoPlaying && (
          <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/80 via-[#0055A4]/5 to-[#050505] mix-blend-multiply z-10"></div>
        )}
      </div>

      {/* NAVIGATION */}
      <nav className="relative z-50 flex items-center justify-between px-6 py-6 md:px-12 md:py-8 w-full">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#0055A4] flex items-center justify-center">
            <Command className="w-5 h-5 text-black" />
          </div>
          <span className="text-white font-black tracking-[0.2em] text-sm uppercase">Sovereign Wealth Generator</span>
        </div>
        <Link href="/onboarding" className="text-xs font-black uppercase tracking-[0.2em] text-white hover:text-[#0055A4] transition-colors border border-white/20 hover:border-[#0055A4] px-6 py-3 bg-black/50 backdrop-blur-md">
          Start Jouw Reis
        </Link>
      </nav>

      {/* HERO SECTION */}
      <main className={`relative z-30 flex-1 flex flex-col justify-center px-6 md:px-12 max-w-[1400px] mx-auto w-full transition-opacity duration-700 ${videoPlaying ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <div className="max-w-4xl mt-[-8vh]">
          
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="inline-flex items-center gap-3 px-4 py-2 bg-[#0055A4] text-white font-black uppercase tracking-[0.3em] text-[10px] sm:text-xs mb-8 md:mb-12"
          >
            <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
            Hermes Upgrade // Geactiveerd
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            <h1 className="text-5xl sm:text-7xl md:text-[7rem] font-black leading-[0.9] uppercase tracking-tighter mb-8">
              Jouw Toekomst.<br/>
              <span className="stroke-text-red block mt-2">Jouw Regels.</span>
            </h1>

            <style jsx>{`
              .stroke-text-red {
                -webkit-text-stroke: 2px #0055A4;
                color: transparent;
              }
              @media (min-width: 768px) {
                .stroke-text-red {
                  -webkit-text-stroke: 4px #0055A4;
                }
              }
            `}</style>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="flex flex-col md:flex-row gap-8 md:gap-16 items-start md:items-center"
          >
            <button 
              onClick={handlePlayVideo}
              className="group flex items-center gap-6 cursor-pointer w-fit"
            >
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-white/20 group-hover:border-[#0055A4] flex items-center justify-center transition-all group-hover:scale-105 bg-black/40 backdrop-blur-sm">
                <Play className="w-8 h-8 text-white group-hover:text-[#0055A4] ml-1 transition-colors" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-[#0055A4] uppercase tracking-[0.2em] mb-1">Jouw Fundering</div>
                <div className="text-xl md:text-2xl font-black text-white uppercase tracking-wider">Start Visie</div>
              </div>
            </button>
            
            {/* Brutalist Paragraph */}
            <div className="text-lg md:text-xl text-zinc-400 font-medium leading-relaxed border-l-4 border-[#0055A4] pl-6 py-2 max-w-xl">
              Herbouw je leven met zekerheid. Krijg toegang tot de tools, de strategieën en het netwerk dat je nodig hebt voor <strong className="text-white">echte financiële en persoonlijke vrijheid</strong>. Geen loze beloftes, maar een bewezen fundering.
            </div>
          </motion.div>
        </div>
      </main>

      {/* TICKER TAPE MARQUEE - BOTTOM OF SCREEN */}
      <div className={`fixed bottom-0 left-0 w-full bg-[#0055A4] overflow-hidden z-40 border-t-4 border-black transition-transform duration-700 ${videoPlaying ? 'translate-y-full' : 'translate-y-0'}`}>
        <div className="py-3 flex whitespace-nowrap">
          <motion.div
            className="flex items-center text-white font-black uppercase tracking-[0.2em] text-xl"
            animate={{ x: [0, -1035] }}
            transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
          >
            <span className="mx-8">STABILITEIT</span>
            <span>//</span>
            <span className="mx-8">GROEI</span>
            <span>//</span>
            <span className="mx-8">VRIJHEID</span>
            <span>//</span>
            <span className="mx-8">NETWERK VAN EXPERTS</span>
            <span>//</span>
            <span className="mx-8">24/7 SUPPORT</span>
            <span>//</span>
            <span className="mx-8">JOUW GROEI IS ONZE MISSIE</span>
            <span>//</span>
            
            <span className="mx-8">STABILITEIT</span>
            <span>//</span>
            <span className="mx-8">GROEI</span>
            <span>//</span>
            <span className="mx-8">VRIJHEID</span>
            <span>//</span>
            <span className="mx-8">NETWERK VAN EXPERTS</span>
            <span>//</span>
            <span className="mx-8">24/7 SUPPORT</span>
            <span>//</span>
            <span className="mx-8">JOUW GROEI IS ONZE MISSIE</span>
            <span>//</span>
          </motion.div>
        </div>
      </div>
      
      {/* TIER SELECTION - SCROLLABLE IN DOCUMENT FLOW */}
      <div className={`relative z-30 max-w-[1400px] mx-auto w-full px-6 md:px-12 pb-32 flex flex-col md:flex-row justify-center gap-6 transition-opacity duration-700 ${videoPlaying ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        
        <Link href="/tiers/ecom" className="group flex-1 bg-black/80 backdrop-blur-md border border-white/10 hover:border-[#0055A4] p-6 transition-all hover:-translate-y-2">
          <div className="text-[10px] text-[#0055A4] font-mono uppercase tracking-widest mb-2">TIER 01</div>
          <div className="text-xl font-black uppercase tracking-widest mb-1 group-hover:text-[#0055A4] transition-colors">START-UP BLAUWDRUK</div>
          <div className="text-sm text-zinc-400 font-medium mb-4">De perfecte basis voor jouw eerste e-commerce stappen. Betrouwbare ondersteuning en bewezen systemen.</div>
          <div className="flex items-center justify-between mt-auto">
            <span className="text-lg font-bold">€50<span className="text-xs text-zinc-500">/mnd</span></span>
            <ArrowRight className="w-5 h-5 text-zinc-600 group-hover:text-[#0055A4] transition-colors" />
          </div>
        </Link>

        <Link href="/tiers/tech" className="group flex-1 bg-black/80 backdrop-blur-md border border-white/10 hover:border-[#0055A4] p-6 transition-all hover:-translate-y-2">
          <div className="text-[10px] text-[#0055A4] font-mono uppercase tracking-widest mb-2">TIER 02</div>
          <div className="text-xl font-black uppercase tracking-widest mb-1 group-hover:text-[#0055A4] transition-colors">SCHAALBAAR SUCCES</div>
          <div className="text-sm text-zinc-400 font-medium mb-4">Voor de ondernemer die klaar is voor de volgende stap. Geavanceerde software en persoonlijke begeleiding.</div>
          <div className="flex items-center justify-between mt-auto">
            <span className="text-lg font-bold">€99<span className="text-xs text-zinc-500">/mnd</span></span>
            <ArrowRight className="w-5 h-5 text-zinc-600 group-hover:text-[#0055A4] transition-colors" />
          </div>
        </Link>

        <Link href="/tiers/elite" className="group flex-1 bg-[#0055A4]/10 backdrop-blur-md border border-[#0055A4] p-6 transition-all hover:-translate-y-2 hover:bg-[#0055A4]">
          <div className="text-[10px] text-white font-mono uppercase tracking-widest mb-2">TIER 03</div>
          <div className="text-xl font-black uppercase tracking-widest mb-1 text-white transition-colors">ELITE PARTNERSCHAP</div>
          <div className="text-sm text-zinc-300 font-medium mb-4 group-hover:text-black">Directe 1-op-1 toegang tot onze top-experts. Wij bouwen het Sovereign Wealth systeem mét jou.</div>
          <div className="flex items-center justify-between mt-auto">
            <span className="text-lg font-bold text-white group-hover:text-black">APPLY NOW</span>
            <ArrowRight className="w-5 h-5 text-white group-hover:text-black transition-colors" />
          </div>
        </Link>

      </div>

    </div>
  );
}
