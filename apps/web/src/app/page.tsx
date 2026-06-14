'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check, ChevronRight, ShieldCheck, PlayCircle, Target, Lock, Cpu } from 'lucide-react';

export default function MarketingFunnelPage() {
  const fadeIn = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6, ease: "easeOut" }
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-gold-500 selection:text-black font-sans overflow-x-hidden">
      
      {/* Navbar */}
      <nav className="relative z-50 border-b border-white/5 bg-black/50 backdrop-blur-md sticky top-0">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-black tracking-tighter text-white uppercase">
              Rebuild<span className="text-gold-500">YourLife</span>
            </span>
          </div>
          <div className="flex gap-4 sm:gap-6 items-center">
            <Link href="/auth/login" className="text-sm font-bold text-zinc-400 hover:text-white transition-colors uppercase tracking-widest hidden sm:block">
              Client Login
            </Link>
            <Link href="#operator" className="px-5 py-2 text-sm font-black bg-gold-500 text-black rounded uppercase tracking-wider transition-all hover:bg-gold-400 hover:scale-105 shadow-[0_0_15px_rgba(212,168,83,0.4)]">
              Start Systeem
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section (The Hook) */}
      <section className="relative pt-24 pb-20 px-6 flex flex-col items-center text-center">
        {/* Glow effect behind hero */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold-500/10 blur-[150px] pointer-events-none rounded-full" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-5xl mx-auto relative z-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-500 font-bold text-sm mb-8 uppercase tracking-widest">
            <ShieldCheck className="w-4 h-4" /> 100% Recovery Guarantee Actief
          </div>

          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tighter mb-6 text-white uppercase leading-[0.9]">
            We Herbouwen Je Leven.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-gold-600 drop-shadow-lg">
              En We Garanderen Het.
            </span>
          </h1>
          
          <p className="text-xl sm:text-2xl text-zinc-400 mb-10 max-w-3xl mx-auto leading-tight font-medium">
            Jouw persoonlijke AI Private Banker en Debt Negotiator. Wij structureren je schulden, genereren autonoom winst, en trekken je uit de overlevingsstand.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="#operator" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gold-500 text-black px-12 py-5 rounded font-black text-xl uppercase tracking-wider transition-all hover:bg-white hover:scale-105 shadow-[0_0_30px_rgba(212,168,83,0.3)]">
              Claim Jouw Toegang
              <ChevronRight className="w-6 h-6" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Video Placeholder (Content Forge) */}
      <section className="relative px-6 pb-32">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            {...fadeIn}
            className="aspect-video w-full bg-zinc-900 border border-zinc-800 rounded-2xl relative overflow-hidden group cursor-pointer shadow-2xl"
          >
            {/* Fake Video Thumbnail / Pattern */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-700 via-black to-black" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
              <PlayCircle className="w-20 h-20 text-gold-500 mb-4 group-hover:scale-110 transition-transform duration-300" strokeWidth={1} />
              <p className="text-zinc-400 font-bold tracking-widest uppercase">Bekijk de Systeem Uitleg (2:14)</p>
              <p className="text-xs text-zinc-600 mt-2">[Content Forge UGC Video Placeholder]</p>
            </div>
            
            {/* Play overlay gradient */}
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
          </motion.div>
        </div>
      </section>

      {/* De Belofte (100% Guarantee) */}
      <section className="py-24 px-6 bg-zinc-950 border-y border-zinc-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <motion.div {...fadeIn} className="space-y-6">
              <h2 className="text-4xl sm:text-5xl font-black uppercase tracking-tight">Geen Excuses.<br/><span className="text-gold-500">Keiharde Resultaten.</span></h2>
              <p className="text-lg text-zinc-400 leading-relaxed font-medium">
                Als onze systemen er niet in slagen om jouw financiële situatie meetbaar te verbeteren, dan faalt dit platform. We hebben The AI Concierge zo geprogrammeerd dat het een wiskundige onmogelijkheid is om niet vooruit te gaan.
              </p>
              <div className="flex items-center gap-4 bg-black p-5 border border-red-900/50 rounded-lg">
                <Lock className="w-8 h-8 text-red-500 shrink-0" />
                <p className="text-sm font-bold text-red-100">
                  Valt de AI-optimalisatie stil? Dan breekt de code uit en escaleert jouw dossier direct naar de menselijke CEO voor handmatige redding.
                </p>
              </div>
            </motion.div>
            
            <motion.div {...fadeIn} transition={{ delay: 0.2 }} className="grid grid-cols-1 gap-6">
              <div className="bg-black p-6 border border-zinc-800 rounded-xl">
                <Target className="w-8 h-8 text-gold-500 mb-4" />
                <h3 className="text-xl font-bold uppercase mb-2">Autonome Debt Engine</h3>
                <p className="text-zinc-400 text-sm">Onderhandelt met schuldeisers en pauzeert incasso's namens jou.</p>
              </div>
              <div className="bg-black p-6 border border-zinc-800 rounded-xl">
                <Cpu className="w-8 h-8 text-gold-500 mb-4" />
                <h3 className="text-xl font-bold uppercase mb-2">The Opportunity Engine</h3>
                <p className="text-zinc-400 text-sm">Creëert actieve inkomstenstromen (SaaS/E-com) op de achtergrond voor jou.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Prijsstrategie (Aggressieve Upsell) */}
      <section id="operator" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeIn} className="text-center mb-20">
            <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tight mb-4">Toegang Tot Het Systeem</h2>
            <p className="text-zinc-400 text-xl font-medium">Word onderdeel van de architectuur.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto items-center">
            
            {/* Starter (Demphasized) */}
            <motion.div {...fadeIn} className="bg-zinc-950 border border-zinc-900 p-8 flex flex-col rounded-xl opacity-80 hover:opacity-100 transition-opacity">
              <div className="mb-8">
                <h3 className="text-xl font-bold text-zinc-500 uppercase mb-2">Starter</h3>
                <div className="text-4xl font-light text-zinc-300 mb-4">€0<span className="text-lg text-zinc-600 ml-1">/mnd</span></div>
                <p className="text-zinc-500 text-sm font-medium">Zelfstandige toegang tot basis dashboards. Geen AI support.</p>
              </div>
              <ul className="space-y-4 mb-10 flex-1">
                {['Basic Overzicht', 'Handmatige data invoer'].map((feature, i) => (
                  <li key={i} className="flex items-center text-zinc-500 text-sm font-bold">
                    <Check className="w-4 h-4 mr-3 text-zinc-700" /> {feature}
                  </li>
                ))}
              </ul>
              <Link href="/auth/register" className="w-full py-4 text-center border border-zinc-800 text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors text-sm font-bold uppercase tracking-wider rounded">
                Kies Starter
              </Link>
            </motion.div>

            {/* Operator (The No-Brainer CTA) */}
            <motion.div {...fadeIn} transition={{ delay: 0.1 }} className="bg-black border-2 border-gold-500 p-10 flex flex-col relative transform md:-translate-y-6 shadow-[0_0_50px_rgba(212,168,83,0.15)] rounded-2xl">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gold-500 text-black px-6 py-1.5 text-xs font-black tracking-widest uppercase rounded shadow-lg">
                Apex Operator
              </div>
              <div className="mb-8 mt-4 text-center">
                <h3 className="text-2xl font-black text-white uppercase mb-2">Volledig Arsenaal</h3>
                <div className="text-6xl font-black text-white mb-4 tracking-tighter">€19<span className="text-2xl text-gold-500">,95</span><span className="text-lg text-zinc-500 ml-1 font-medium">/mnd</span></div>
                <p className="text-gold-400 text-sm font-bold">Jouw persoonlijke legioen van AI's. 100% Garantie.</p>
              </div>
              <div className="bg-zinc-900/50 p-4 rounded-lg mb-8 border border-zinc-800">
                <ul className="space-y-3">
                  {[
                    '24/7 AI Private Banker (The Concierge)', 
                    'Autonome Debt Negotiator (Schuldeisers blokkeren)', 
                    'Toegang tot Opportunity Engine (Autonoom Inkomen)', 
                    '100% Recovery Garantie Protocol'
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start text-white text-sm font-bold">
                      <Check className="w-5 h-5 mr-3 text-gold-500 shrink-0 mt-0.5" /> 
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <Link href="/auth/register?plan=operator" className="w-full py-5 text-center bg-gold-500 text-black hover:bg-white hover:scale-[1.02] transition-all text-lg font-black uppercase tracking-widest rounded shadow-[0_0_20px_rgba(212,168,83,0.4)]">
                Activeer Operator Systeem
              </Link>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-6 bg-black text-center">
        <p className="text-zinc-600 text-xs font-bold uppercase tracking-widest">
          &copy; {new Date().getFullYear()} RebuildYourLife. System Architecture Active.
        </p>
      </footer>
    </div>
  );
}
