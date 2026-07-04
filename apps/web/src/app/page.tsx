'use client';

import { motion } from 'framer-motion';
import { Command, ChevronRight, Play } from 'lucide-react';
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
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#ff003c]/30 selection:text-white font-sans overflow-x-hidden relative">
      
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
          <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/80 via-[#ff003c]/5 to-[#050505] mix-blend-multiply z-10"></div>
        )}
      </div>

      {/* NAVIGATION */}
      <nav className="relative z-50 flex items-center justify-between px-6 py-6 md:px-12 md:py-8 w-full">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#ff003c] flex items-center justify-center">
            <Command className="w-5 h-5 text-black" />
          </div>
          <span className="text-white font-black tracking-[0.2em] text-sm uppercase">Sovereign Grid</span>
        </div>
        <Link href="/onboarding" className="text-xs font-black uppercase tracking-[0.2em] text-white hover:text-[#ff003c] transition-colors border border-white/20 hover:border-[#ff003c] px-6 py-3 bg-black/50 backdrop-blur-md">
          Client Access
        </Link>
      </nav>

      {/* HERO CONTENT - BRUTALIST MTV/TMF STYLE */}
      <main className={`relative z-20 flex flex-col justify-center min-h-[80vh] px-6 md:px-12 transition-opacity duration-700 ${videoPlaying ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        
        <div className="max-w-[1400px] w-full mx-auto">
          {/* Status Label */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="inline-flex items-center gap-3 px-4 py-2 bg-[#ff003c] text-black font-black uppercase tracking-[0.3em] text-[10px] sm:text-xs mb-8 md:mb-12"
          >
            <span className="w-2 h-2 bg-black rounded-full animate-pulse"></span>
            System Initiated // Public Access
          </motion.div>

          {/* MASSIVE TYPOGRAPHY */}
          <motion.h1 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-7xl md:text-[9rem] lg:text-[12rem] font-black uppercase leading-[0.85] tracking-tighter mb-8"
          >
            <span className="block text-white">ONTKOPPEL</span>
            <span className="block text-transparent stroke-text-red">DE MATRIX.</span>
          </motion.h1>

          <style jsx>{`
            .stroke-text-red {
              -webkit-text-stroke: 2px #ff003c;
              color: transparent;
            }
            @media (min-width: 768px) {
              .stroke-text-red {
                -webkit-text-stroke: 4px #ff003c;
              }
            }
          `}</style>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-end mt-12 md:mt-24"
          >
            {/* Play Cinematic Intro Button */}
            <button 
              onClick={handlePlayVideo}
              className="group flex items-center gap-6 cursor-pointer w-fit"
            >
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-white/20 group-hover:border-[#ff003c] flex items-center justify-center transition-all group-hover:scale-105 bg-black/40 backdrop-blur-sm">
                <Play className="w-8 h-8 text-white group-hover:text-[#ff003c] ml-1 transition-colors" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-[#ff003c] uppercase tracking-[0.2em] mb-1">Bekijk de Transmissie</div>
                <div className="text-xl md:text-2xl font-black text-white uppercase tracking-wider">Start Film</div>
              </div>
            </button>

            {/* Brutalist Paragraph */}
            <div className="text-lg md:text-xl text-zinc-400 font-medium leading-relaxed border-l-4 border-[#ff003c] pl-6 py-2 max-w-xl">
              Geen theorie. Geen motivatie. Wij bouwen <strong className="text-white">autonome algoritmes</strong> die de economie exploiteren terwijl jij slaapt. Het The Syndicate systeem is genadeloos.
            </div>
          </motion.div>
        </div>
      </main>

      {/* TICKER TAPE MARQUEE - BOTTOM OF SCREEN */}
      <div className={`fixed bottom-0 left-0 w-full bg-[#ff003c] overflow-hidden z-40 border-t-4 border-black transition-transform duration-700 ${videoPlaying ? 'translate-y-full' : 'translate-y-0'}`}>
        <div className="py-3 flex whitespace-nowrap">
          <motion.div
            className="flex items-center text-black font-black uppercase tracking-[0.2em] text-xl"
            variants={marqueeVariants}
            animate="animate"
          >
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center">
                <span className="mx-8">AGENTIC COMMERCE ACTIVE</span>
                <span className="mx-8 opacity-50">///</span>
                <span className="mx-8">100% AUTONOMOUS EXECUTIONS</span>
                <span className="mx-8 opacity-50">///</span>
                <span className="mx-8">THE ARCHITECT IS WATCHING</span>
                <span className="mx-8 opacity-50">///</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
      
      {/* GLOBAL ENTER BUTTON */}
      <div className={`fixed bottom-24 right-6 md:right-12 z-50 transition-opacity duration-700 ${videoPlaying ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <Link href="/onboarding" className="group flex flex-col items-end">
          <div className="bg-[#ff003c] hover:bg-white text-black px-8 py-6 flex items-center justify-between gap-8 transition-colors shadow-[0_0_40px_rgba(255,0,60,0.4)]">
            <span className="text-2xl font-black uppercase tracking-widest">Systeem Toegang</span>
            <ChevronRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
          </div>
          <div className="mt-2 text-[10px] text-zinc-500 font-mono uppercase tracking-widest text-right">
            Capaciteit: Zeer Gelimiteerd
          </div>
        </Link>
      </div>

    </div>
  );
}
