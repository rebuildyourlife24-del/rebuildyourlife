'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PlayCircle, ShieldCheck, Zap, Cpu, ArrowRight } from 'lucide-react';

export default function AgencySalesFunnel() {
  const router = useRouter();
  const [loadingTier, setLoadingTier] = useState<string | null>(null);

  const handleCheckout = async (amount: number, tierName: string) => {
    setLoadingTier(tierName);
    try {
      // We doen een call naar onze Mollie checkout
      const response = await fetch('/api/payments/mollie/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      });

      const data = await response.json();

      if (response.ok && data.checkoutUrl) {
        window.location.href = data.checkoutUrl; // Redirect naar Mollie
      } else if (response.status === 401) {
        // Gebruiker is nog niet ingelogd
        router.push(`/auth/register?returnUrl=/agency&intendedTier=${tierName}`);
      } else {
        alert(data.error || 'Er ging iets mis bij het starten van de betaling.');
        setLoadingTier(null);
      }
    } catch (err) {
      console.error(err);
      alert('Systeemfout. Probeer het later opnieuw.');
      setLoadingTier(null);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-cyan-500/30 overflow-x-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-1/2 h-1/2 bg-cyan-600 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-1/2 h-1/2 bg-indigo-600 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-10 mix-blend-overlay" />
      </div>

      <main className="relative z-10 max-w-6xl mx-auto px-6 py-20">
        {/* Header / Hook */}
        <div className="text-center mb-16 space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/50 border border-cyan-800/50 text-cyan-400 text-sm font-medium tracking-wide">
            <Zap className="w-4 h-4" />
            <span>The Sovereign Grid is Online</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-500 drop-shadow-sm">
            Ontsnap aan de Matrix.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500">
              Rebuild Your Life.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto font-light">
            Krijg toegang tot de 5 autonome motoren. Automatiseer je cashflow, delegeer aan AI-werknemers en bouw een onbreekbaar systeem rondom jouw leven.
          </p>
        </div>

        {/* VSL Video Placeholder */}
        <div className="relative w-full max-w-4xl mx-auto aspect-video bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 shadow-[0_0_50px_rgba(6,182,212,0.1)] group mb-24 flex items-center justify-center cursor-pointer">
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
          <PlayCircle className="w-20 h-20 text-white/50 group-hover:text-cyan-400 group-hover:scale-110 transition-all duration-300 z-20" />
          <p className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 text-sm font-medium text-gray-300 tracking-widest uppercase">
            Bekijk de Transmissie (12:45)
          </p>
        </div>

        {/* Pricing / Access Tiers */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* REGULAR Tier */}
          <div className="relative bg-gray-900/50 border border-gray-800 rounded-3xl p-8 backdrop-blur-md flex flex-col transition-all hover:border-gray-700">
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">Regular Access</h3>
              <p className="text-gray-400 text-sm h-10">
                Toegang tot de basis motoren en je eigen Personal OS. Bouw stap voor stap je fundament.
              </p>
            </div>
            <div className="mb-8 flex-grow">
              <div className="flex items-baseline mb-6">
                <span className="text-5xl font-bold text-white">€50</span>
                <span className="text-gray-500 ml-2">/ maand</span>
              </div>
              <ul className="space-y-4 text-sm text-gray-300">
                <li className="flex items-center"><ShieldCheck className="w-5 h-5 text-gray-500 mr-3" /> Dashboard Access</li>
                <li className="flex items-center"><ShieldCheck className="w-5 h-5 text-gray-500 mr-3" /> System & Life Motor</li>
                <li className="flex items-center"><ShieldCheck className="w-5 h-5 text-gray-500 mr-3" /> RYL Academy (Basic)</li>
                <li className="flex items-center"><ShieldCheck className="w-5 h-5 text-gray-500 mr-3" /> Syndicate Feed</li>
              </ul>
            </div>
            <button
              onClick={() => handleCheckout(50, 'REGULAR')}
              disabled={loadingTier !== null}
              className="w-full py-4 px-6 rounded-xl bg-white text-black font-semibold hover:bg-gray-200 transition-colors flex justify-center items-center group disabled:opacity-50"
            >
              {loadingTier === 'REGULAR' ? 'Initialising...' : 'Start het Systeem'}
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* ELITE Tier */}
          <div className="relative bg-cyan-950/20 border border-cyan-800/50 rounded-3xl p-8 backdrop-blur-md flex flex-col transition-all hover:border-cyan-700/50 shadow-[0_0_30px_rgba(6,182,212,0.1)]">
            <div className="absolute top-0 right-8 -translate-y-1/2 bg-cyan-500 text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              The God Mode
            </div>
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">Elite Protocol</h3>
              <p className="text-cyan-200/70 text-sm h-10">
                Voor de serieuze operators. Volledige toegang tot álle motoren, AI-werknemers en de C-Suite.
              </p>
            </div>
            <div className="mb-8 flex-grow">
              <div className="flex items-baseline mb-6">
                <span className="text-5xl font-bold text-white">€2000</span>
                <span className="text-cyan-500 ml-2"> eenmalig</span>
              </div>
              <ul className="space-y-4 text-sm text-cyan-100/80">
                <li className="flex items-center"><Cpu className="w-5 h-5 text-cyan-500 mr-3" /> Alles in Regular</li>
                <li className="flex items-center"><Cpu className="w-5 h-5 text-cyan-500 mr-3" /> Volledige AI Swarm Access (CEO, CFO, CRO)</li>
                <li className="flex items-center"><Cpu className="w-5 h-5 text-cyan-500 mr-3" /> Universal Forge & Tool Hub</li>
                <li className="flex items-center"><Cpu className="w-5 h-5 text-cyan-500 mr-3" /> Extreme Services & Automations</li>
                <li className="flex items-center"><Cpu className="w-5 h-5 text-cyan-500 mr-3" /> Private Shadow Syndicate Access</li>
              </ul>
            </div>
            <button
              onClick={() => handleCheckout(2000, 'ELITE')}
              disabled={loadingTier !== null}
              className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 text-white font-semibold hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all flex justify-center items-center group disabled:opacity-50"
            >
              {loadingTier === 'ELITE' ? 'Initialising Protocol...' : 'Activeer Elite'}
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
