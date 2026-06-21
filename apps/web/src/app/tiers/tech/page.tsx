'use client';

import { motion } from 'framer-motion';
import { Command, ChevronRight, Check } from 'lucide-react';
import Link from 'next/link';

export default function TierTechPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#ff003c]/30 selection:text-white font-sans overflow-x-hidden relative flex flex-col">
      
      {/* NAVIGATION */}
      <nav className="relative z-50 flex items-center justify-between px-6 py-6 md:px-12 md:py-8 w-full border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#ff003c] flex items-center justify-center">
            <Command className="w-5 h-5 text-black" />
          </div>
          <span className="text-white font-black tracking-[0.2em] text-sm uppercase">Sovereign Grid</span>
        </div>
        <Link href="/" className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-colors">
          [ Terug naar Grid ]
        </Link>
      </nav>

      {/* TMF STYLE HEADER */}
      <main className="flex-1 w-full max-w-[1400px] mx-auto px-6 md:px-12 py-12 md:py-24">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 text-[#ff003c] font-black uppercase tracking-[0.3em] text-[10px] mb-8"
        >
          TIER 02 // TECH & APP CLONING
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-6xl md:text-[7rem] lg:text-[9rem] font-black uppercase leading-[0.85] tracking-tighter mb-12"
        >
          <span className="block text-transparent stroke-text-white">SOFTWARE</span>
          <span className="block text-[#ff003c]">SYNDICAAT.</span>
        </motion.h1>

        <style jsx>{`
          .stroke-text-white {
            -webkit-text-stroke: 2px rgba(255, 255, 255, 0.8);
            color: transparent;
          }
          @media (min-width: 768px) {
            .stroke-text-white {
              -webkit-text-stroke: 4px rgba(255, 255, 255, 0.8);
            }
          }
        `}</style>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
          {/* TEXT BLOCK */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-xl md:text-3xl font-medium text-zinc-400 leading-relaxed mb-8 border-l-4 border-[#ff003c] pl-6">
              Grotere verdiensten vereisen zwaarder geschut. Leer apps klonen en software ontwikkelen via The Sovereign Grid.
            </p>
            <ul className="space-y-4 mb-12">
              {[
                'Kloon winstgevende apps via AI-tools',
                'Software-as-a-Service (SaaS) ontwikkeling',
                'Hoge marges, schaalbaar zonder limieten',
                'Directe blueprints voor micro-SaaS'
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-4 text-zinc-300 font-mono text-sm uppercase tracking-wider">
                  <Check className="w-5 h-5 text-[#ff003c]" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* CHECKOUT / ACTION BLOCK */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-[#0a0a0a] border border-[#ff003c]/20 p-8 md:p-12 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#ff003c]/10 rounded-full blur-3xl group-hover:bg-[#ff003c]/20 transition-colors pointer-events-none"></div>
            
            <div className="relative z-10">
              {/* Prijs placeholder: €99 */}
              <div className="text-[#ff003c] font-black text-6xl md:text-7xl tracking-tighter mb-2">€99<span className="text-2xl text-zinc-500">/mnd</span></div>
              <div className="text-xs text-zinc-500 font-mono uppercase tracking-widest mb-12">Bouw software, bezit de infrastructuur</div>

              <Link href="/onboarding" className="block w-full bg-[#ff003c] text-black font-black uppercase tracking-[0.2em] text-center py-6 text-xl hover:bg-white transition-colors">
                Start Executie
              </Link>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
