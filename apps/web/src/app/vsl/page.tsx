'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Command, Play, Volume2, Shield, Check, Loader2, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function VslPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInitiatePayment = async () => {
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId: process.env.NEXT_PUBLIC_STRIPE_ELITE_PRICE_ID || 'price_test_123',
          tierName: 'ELITE',
          email: 'elite-lead@sovereign.grid', // TODO: In een echte funnel vraag je hier eerst de email aan
        }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        setError('Uplink-fout. Probeer het opnieuw.');
        setIsLoading(false);
      }
    } catch (err) {
      setError('Verbindingsfout. Probeer opnieuw.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#d4af37]/30 selection:text-white font-sans overflow-x-hidden relative flex flex-col">
      
      {/* Scanline overlay */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.015)_1px,transparent_1px)] bg-[size:100%_4px]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(6,182,212,0.07)_0%,transparent_60%)]"></div>
      </div>

      {/* NAVIGATION */}
      <nav className="relative z-50 flex items-center justify-between px-6 py-6 md:px-12 w-full border-b border-white/5 bg-black/40 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#d4af37] flex items-center justify-center">
            <Command className="w-5 h-5 text-black" />
          </div>
          <span className="text-white font-black tracking-[0.2em] text-sm uppercase">Sovereign Grid</span>
        </div>
        <Link href="/" className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-colors">
          [ Exit Grid ]
        </Link>
      </nav>

      {/* MAIN CONTAINER */}
      <main className="flex-1 relative z-10 w-full max-w-[1200px] mx-auto px-6 py-12 md:py-24 flex flex-col items-center">
        
        {/* UPPER TITLE */}
        <div className="text-[10px] text-[#d4af37] font-mono uppercase tracking-[0.3em] mb-4 bg-white/5 px-3 py-1.5 border border-white/10">
          UPLINK TRANSMISSIE // VERTROUWELIJK
        </div>
        
        <h1 className="text-3xl md:text-6xl font-black text-center uppercase tracking-tighter mb-8 max-w-4xl leading-tight">
          ONTDEK HET ALGORITME DAT <span className="text-[#d4af37]">€15.000+ PER MAAND</span> GENEREERT IN DE SCHADUW-ECONOMIE.
        </h1>

        {/* BRUTALIST CINEMATIC PLAYER */}
        <div className="w-full aspect-video bg-black border border-white/10 relative overflow-hidden group shadow-2xl mb-12">
          {isPlaying ? (
            <div className="w-full h-full relative">
              {/* Fallback real-working cinematic background loop representing system visualization */}
              <iframe 
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=0" 
                className="w-full h-full object-cover absolute inset-0"
                allow="autoplay"
                title="Cinematic Presentation Video"
              ></iframe>
            </div>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950/90 p-8 text-center cursor-pointer" onClick={() => setIsPlaying(true)}>
              {/* Grid Background Effect */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.06)_0%,transparent_70%)] pointer-events-none"></div>
              
              <div className="w-24 h-24 rounded-full border border-[#d4af37] bg-[#d4af37]/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-[0_0_30px_rgba(212,175,55,0.2)]">
                <Play className="w-10 h-10 text-[#d4af37] ml-1.5" />
              </div>
              
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-zinc-500 mb-2">Klik om de audio-uplink te starten</span>
              <span className="text-2xl font-black uppercase tracking-wide text-white">Start de Presentatie</span>
              
              <div className="absolute bottom-6 flex items-center gap-2 text-zinc-600 font-mono text-[10px] uppercase">
                <Volume2 className="w-4 h-4" /> Geluid inschakelen aangeraden
              </div>
            </div>
          )}
        </div>

        {/* MAIN BODY AND CALL TO ACTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 w-full items-start">
          
          {/* Pitch Info Columns */}
          <div className="lg:col-span-7 space-y-6">
            <h3 className="text-2xl font-black uppercase tracking-tight text-white border-l-4 border-[#d4af37] pl-4">
              Wat is de Sovereign Grid Elite?
            </h3>
            <p className="text-zinc-400 leading-relaxed font-light text-lg">
              De Sovereign Grid Elite is ons meest exclusieve uplink-niveau. In plaats van zelfstandig te experimenteren, installeren onze ontwikkelaars en AI-systemen een **complete autonome geldmachine** direct op jouw infrastructuur.
            </p>

            <ul className="space-y-4">
              {[
                'Volledige Setup door ons Elite Developer Team within 24 hours',
                'Autonome integratie van Hermes (Executor) & Orion (Strategist)',
                '1-op-1 begeleiding bij het opschalen naar €10.000+/mnd winst',
                'Directe toegang tot onze private AI SaaS & E-com templates',
                'Levenslange licentie zonder maandelijkse abonnementskosten'
              ].map((benefit, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-zinc-300 font-mono uppercase tracking-wide">
                  <Check className="w-5 h-5 text-[#d4af37] shrink-0 mt-0.5" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Checkout Bento Card */}
          <div className="lg:col-span-5 bg-[#0a0a0a] border border-[#d4af37]/20 p-8 relative overflow-hidden group shadow-xl rounded-lg">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#d4af37]/5 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="relative z-10 flex flex-col">
              <span className="text-[10px] text-[#d4af37] font-mono uppercase tracking-widest mb-2">TIER 03 // ELITE UPLINK</span>
              <h4 className="text-xl font-bold uppercase tracking-wider text-white mb-6">Sovereign Grid Elite</h4>
              
              <div className="flex items-baseline gap-2 mb-8">
                <span className="text-5xl font-black text-[#d4af37]">€2.000</span>
                <span className="text-xs text-zinc-500 font-mono uppercase">Eenmalig / Lifelong</span>
              </div>

              {error && (
                <div className="bg-[#0a192f]/20 border-l-2 border-[#d4af37] p-3 text-xs text-[#d4af37] font-mono mb-4">
                  {error}
                </div>
              )}

              <button
                onClick={handleInitiatePayment}
                disabled={isLoading}
                className="w-full bg-[#d4af37] text-black font-black uppercase tracking-[0.2em] py-5 text-lg hover:bg-white hover:scale-[1.01] transition-all flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(212,175,55,0.2)] disabled:opacity-60 disabled:cursor-not-allowed mb-4"
              >
                {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Shield className="w-5 h-5" />}
                {isLoading ? 'VERBINDING MAKEN...' : 'SECURE GRID UPLINK'}
              </button>

              <p className="text-[9px] text-zinc-600 font-mono uppercase tracking-wider text-center">
                Betaling verloopt beveiligd via Mollie. Inclusief 100% tevredenheidsgarantie.
              </p>
            </div>
          </div>

        </div>

      </main>

    </div>
  );
}

