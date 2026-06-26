'use client';

import { motion } from 'framer-motion';
import { Command, Play, ArrowRight, ShieldCheck, Target, Zap } from 'lucide-react';
import Link from 'next/link';

export default function MatrixLandingPage() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-cyan-500/30 selection:text-white font-sans flex flex-col relative overflow-hidden">
      
      {/* BACKGROUND */}
      <div className="fixed inset-0 z-0 bg-black">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] z-10 pointer-events-none"></div>
        {/* Cyberpunk Blue Glows */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-cyan-600/10 blur-[150px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none"></div>
      </div>

      {/* NAVIGATION */}
      <nav className="relative z-50 flex items-center justify-between px-6 py-6 md:px-12 md:py-8 w-full border-b border-white/5 bg-black/50 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-cyan-500 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.5)]">
            <Command className="w-5 h-5 text-black" />
          </div>
          <span className="text-white font-black tracking-[0.2em] text-sm uppercase hidden sm:block">Rebuild Your Life</span>
        </div>
        
        {/* Main Menu */}
        <div className="hidden lg:flex items-center gap-8">
          <Link href="#features" className="text-[10px] font-bold text-zinc-400 hover:text-cyan-400 uppercase tracking-widest transition-colors">Systeem</Link>
          <Link href="#pricing" className="text-[10px] font-bold text-zinc-400 hover:text-cyan-400 uppercase tracking-widest transition-colors">Toegang</Link>
          <Link href="/admin" className="text-[10px] font-bold text-red-500 hover:text-red-400 uppercase tracking-widest transition-colors flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            God Mode
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/auth/login" className="text-xs font-black uppercase tracking-[0.2em] text-cyan-400 hover:text-white transition-colors border border-cyan-500/50 hover:border-cyan-400 px-6 py-3 bg-cyan-950/30 backdrop-blur-md shadow-[0_0_15px_rgba(6,182,212,0.15)] hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]">
            Dashboard Login
          </Link>
        </div>
      </nav>

      {/* INTRO VIDEO (PANORAMA) */}
      <motion.div 
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.5, ease: "easeInOut" }}
        className="w-full relative z-40 overflow-hidden bg-black/80 backdrop-blur-md border-b border-cyan-500/20"
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-6">
          <div className="w-full aspect-[21/9] md:aspect-[32/9] rounded-none border border-cyan-500/30 relative overflow-hidden bg-black flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.1)] group">
            {/* Placeholder for the actual video */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10">
              <Play className="w-12 h-12 text-cyan-500/50 mb-4 group-hover:text-cyan-400 transition-colors" />
              <div className="text-cyan-400 font-mono text-sm tracking-widest uppercase animate-pulse">Inkomend Video Signaal...</div>
              <div className="text-zinc-600 text-xs mt-2 font-mono">[ 7-15 sec Panorama Introductie ]</div>
            </div>
            
            {/* Scanline effect over video */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(6,182,212,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] z-20 pointer-events-none opacity-50"></div>
            
            {/* Real video tag (commented out until we have the file) */}
            {/* 
            <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover opacity-60">
              <source src="/pad-naar-je-video.mp4" type="video/mp4" />
            </video> 
            */}
          </div>
        </div>
      </motion.div>

      {/* HERO SECTION */}
      <main className="relative z-30 flex-1 flex flex-col justify-center px-6 md:px-12 max-w-[1400px] mx-auto w-full py-20">
        <div className="max-w-4xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 mb-6">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-bold tracking-widest text-cyan-400 uppercase">Het systeem is live</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl md:text-[6rem] font-black leading-[1] uppercase tracking-tighter mb-6">
              <span className="sr-only">Het AI Besturingssysteem voor Jouw Succes. </span>
              Ontsnap aan de massa.<br/>
              <span className="text-cyan-400 block mt-2 drop-shadow-[0_0_25px_rgba(6,182,212,0.3)]">Herbouw Je Leven.</span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="flex flex-col md:flex-row gap-8 md:gap-12 items-start md:items-center mt-12"
          >
            <Link 
              href="/onboarding"
              className="group flex items-center gap-6 cursor-pointer w-fit"
            >
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-none border-2 border-cyan-500/30 group-hover:border-cyan-400 flex items-center justify-center transition-all bg-black/80 backdrop-blur-sm group-hover:shadow-[0_0_30px_rgba(6,182,212,0.3)]">
                <Play className="w-8 h-8 text-white group-hover:text-cyan-400 ml-1 transition-colors" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-cyan-400 uppercase tracking-[0.2em] mb-1">Initialiseer Protocol</div>
                <div className="text-xl md:text-2xl font-black text-white uppercase tracking-wider">Start Jouw Reis</div>
                <div className="text-[10px] text-zinc-500 mt-1 uppercase tracking-widest font-bold">Direct toegang tot de War Room</div>
              </div>
            </Link>
            
            <div className="text-lg md:text-xl text-zinc-400 font-medium leading-relaxed border-l-2 border-cyan-500/50 pl-6 py-1 max-w-xl">
              Geen excuses meer. Wij bieden de systemen, de financiële strategieën en het netwerk om schulden te elimineren en <strong className="text-white">absolute vrijheid</strong> te claimen.
            </div>
          </motion.div>
        </div>
        
        {/* FEATURES */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 max-w-5xl"
        >
          <div className="flex items-start gap-4 p-4 border border-white/5 bg-white/[0.02]">
            <ShieldCheck className="w-6 h-6 text-cyan-400 mt-1" />
            <div>
              <h3 className="text-white font-bold uppercase tracking-wider mb-2">Financiële Vesting</h3>
              <p className="text-sm text-zinc-500">Los schulden op en bouw een ondoordringbare financiële fundering.</p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-4 border border-white/5 bg-white/[0.02]">
            <Target className="w-6 h-6 text-cyan-400 mt-1" />
            <div>
              <h3 className="text-white font-bold uppercase tracking-wider mb-2">Laser Focus</h3>
              <p className="text-sm text-zinc-500">Krijg direct toegang tot bewezen bedrijfsmodellen en E-commerce blauwdrukken.</p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-4 border border-white/5 bg-white/[0.02]">
            <Command className="w-6 h-6 text-cyan-400 mt-1" />
            <div>
              <h3 className="text-white font-bold uppercase tracking-wider mb-2">Elite Netwerk</h3>
              <p className="text-sm text-zinc-500">Omring jezelf met winnaars in de exclusieve RYL command room.</p>
            </div>
          </div>
        </motion.div>
      </main>

      {/* TIER SELECTION */}
      <div className="relative z-30 max-w-[1400px] mx-auto w-full px-6 md:px-12 pb-32 pt-20">
        
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white">Kies Jouw Toegangsniveau</h2>
          <div className="w-24 h-1 bg-cyan-500 mx-auto mt-6 shadow-[0_0_15px_rgba(6,182,212,0.6)]"></div>
        </div>

        <div className="flex flex-col lg:flex-row justify-center gap-6">
          
          <Link href="/tiers/ecom" className="group flex-1 bg-black/60 backdrop-blur-xl border border-white/10 hover:border-cyan-500/50 p-8 transition-all hover:-translate-y-2 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-white/10 group-hover:bg-cyan-500 transition-colors"></div>
            <div className="text-[10px] text-cyan-400 font-mono uppercase tracking-widest mb-3">Toegangscode: TIER 01</div>
            <div className="text-2xl font-black uppercase tracking-widest mb-2 group-hover:text-white text-zinc-300 transition-colors">START-UP BLAUWDRUK</div>
            <div className="text-sm text-zinc-500 font-medium mb-8">De perfecte basis voor jouw eerste e-commerce en business stappen. Fix je fundament.</div>
            <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/5">
              <span className="text-2xl font-black text-white">EUR 50<span className="text-sm text-zinc-600 font-medium">/mnd</span></span>
              <ArrowRight className="w-6 h-6 text-zinc-700 group-hover:text-cyan-400 transition-colors" />
            </div>
          </Link>

          <Link href="/tiers/tech" className="group flex-1 bg-cyan-950/20 backdrop-blur-xl border border-cyan-500/30 hover:border-cyan-400 p-8 transition-all hover:-translate-y-2 relative overflow-hidden shadow-[0_0_30px_rgba(6,182,212,0.05)] hover:shadow-[0_0_40px_rgba(6,182,212,0.15)]">
            <div className="absolute top-0 left-0 w-full h-1 bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.8)]"></div>
            <div className="text-[10px] text-cyan-300 font-mono uppercase tracking-widest mb-3">Toegangscode: TIER 02</div>
            <div className="text-2xl font-black uppercase tracking-widest mb-2 text-white">SCHAALBAAR SUCCES</div>
            <div className="text-sm text-zinc-400 font-medium mb-8">Voor de ondernemer die klaar is voor agressieve schaalvergroting en geavanceerde AI systemen.</div>
            <div className="flex items-center justify-between mt-auto pt-6 border-t border-cyan-500/20">
              <span className="text-2xl font-black text-white">EUR 99<span className="text-sm text-cyan-800 font-medium">/mnd</span></span>
              <ArrowRight className="w-6 h-6 text-cyan-500 group-hover:text-cyan-300 transition-colors" />
            </div>
          </Link>

          <Link href="/tiers/elite" className="group flex-1 bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/30 p-8 transition-all hover:-translate-y-2 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-white/20 group-hover:bg-white transition-colors"></div>
            <div className="text-[10px] text-zinc-400 font-mono uppercase tracking-widest mb-3">Toegangscode: TIER 03</div>
            <div className="text-2xl font-black uppercase tracking-widest mb-2 text-zinc-300 group-hover:text-white transition-colors">ELITE PARTNERSCHAP</div>
            <div className="text-sm text-zinc-500 font-medium mb-8">Directe 1-op-1 toegang tot onze top-experts, war room en private equity netwerk.</div>
            <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/5">
              <span className="text-xl font-black text-white uppercase tracking-widest">Op Aanvraag</span>
              <ArrowRight className="w-6 h-6 text-zinc-600 group-hover:text-white transition-colors" />
            </div>
          </Link>

        </div>

        {/* TRUST SIGNALS */}
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 mt-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
          <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest w-full text-center md:w-auto md:mr-2">Veilig Afrekenen via:</div>
          <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded border border-white/10">
            <ShieldCheck className="w-4 h-4 text-zinc-400" />
            <span className="text-xs font-black tracking-widest text-zinc-300">MOLLIE</span>
          </div>
          <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded border border-white/10">
            <span className="text-xs font-black tracking-widest text-zinc-300">iDEAL</span>
          </div>
          <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded border border-white/10">
            <span className="text-xs font-black tracking-widest text-zinc-300">CREDITCARD</span>
          </div>
        </div>
      </div>

      {/* SEO MANIFESTO (Hidden visually for clean look, visible for crawlers and reading) */}
      <div className="bg-black border-t border-white/5 py-16">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 opacity-30 hover:opacity-70 transition-opacity duration-500">
          <h2 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-4">Rebuild Your Life: Het AI E-commerce Besturingssysteem</h2>
          <div className="prose prose-invert prose-sm text-zinc-600 max-w-4xl">
            <p className="mb-4">Welkom bij Rebuild Your Life. Wij bieden ambitieuze ondernemers de ultieme E-commerce blauwdrukken, AI business automatisering en toegang tot een exclusief private equity netwerk. Ons platform fungeert als jouw persoonlijke commandocentrum (War Room) waarmee je schulden elimineert, vermogen opbouwt, en schaalbare bedrijfsmodellen lanceert met behulp van de nieuwste kunstmatige intelligentie.</p>
            <p>Onze AI Coworkers en geavanceerde dashboards stellen je in staat om razendsnel data te analyseren, winstgevende producten te vinden en je conversie drastisch te verhogen. Sluit je aan bij de elite en claim jouw financiële vrijheid met onze bewezen systemen.</p>
          </div>
        </div>
      </div>

    </div>
  );
}