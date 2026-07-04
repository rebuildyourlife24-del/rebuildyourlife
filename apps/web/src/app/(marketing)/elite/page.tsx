'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Target, ShieldCheck, Zap, Bot, ArrowRight, CheckCircle2 } from 'lucide-react';
import { createEliteCheckoutAction } from '@/app/actions/checkout';
import { useState } from 'react';

function EliteContent() {
  const searchParams = useSearchParams();
  const affiliateCode = searchParams?.get('ref') || '';
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleCheckout = async () => {
    if (!email || !password) {
      setError('Vul je e-mailadres en een nieuw wachtwoord in om je account aan te maken.');
      return;
    }
    if (password.length < 6) {
      setError('Wachtwoord moet minimaal 6 karakters zijn.');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const res = await createEliteCheckoutAction(email, password, affiliateCode);
      if (res.success && res.checkoutUrl) {
        window.location.href = res.checkoutUrl;
      } else {
        setError(res.error || 'Er ging iets mis bij het aanmaken van de betaallink.');
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setError('Systeemfout. Probeer het later opnieuw.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020202] text-white selection:bg-cyan-500/30">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-black/40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="text-xl font-black uppercase tracking-widest flex items-center gap-2">
            <span className="text-cyan-400">R<span className="text-white">Y</span>L</span>
            <span className="text-sm text-zinc-500 border-l border-white/20 pl-2 ml-2">THE SOVEREIGN GRID</span>
          </div>
          <button onClick={handleCheckout} className="text-xs font-bold uppercase tracking-widest text-black bg-cyan-400 px-6 py-2 hover:bg-cyan-300 transition-colors">
            Toegang Krijgen
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 max-w-5xl mx-auto text-center">
        <div className="inline-block px-4 py-1.5 border border-cyan-400/30 bg-cyan-400/10 text-cyan-400 text-xs font-bold uppercase tracking-[0.2em] mb-8 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
          Elite Architectuur - Exclusieve Toegang
        </div>
        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9] mb-8">
          Ontsnap Aan De <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">Neppe Zichtbaarheid</span>
        </h1>
        <p className="text-lg md:text-xl text-zinc-400 max-w-3xl mx-auto font-light leading-relaxed mb-12">
          De meeste ondernemers bouwen bedrijven die afhankelijk zijn van hun eigen tijd. 
          The Sovereign Grid is het eerste operationele systeem dat AI-machines, geautomatiseerde sales funnels en 
          high-ticket acquisitie bundelt in één ondoordringbare command room.
        </p>

        {/* Video Placeholder (VSL) */}
        <div className="w-full max-w-4xl mx-auto aspect-video border border-white/10 bg-black/50 relative flex items-center justify-center group cursor-pointer mb-12 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10 pointer-events-none"></div>
          <div className="absolute w-20 h-20 bg-cyan-500/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform z-20">
            <div className="w-12 h-12 bg-cyan-400 flex items-center justify-center pl-1">
              <div className="w-0 h-0 border-t-8 border-t-transparent border-l-[12px] border-l-black border-b-8 border-b-transparent"></div>
            </div>
          </div>
          <p className="absolute bottom-6 left-6 z-20 text-sm font-mono tracking-widest uppercase text-white/50">Klik om Masterclass te bekijken</p>
        </div>

        <button 
          onClick={handleCheckout} 
          disabled={loading}
          className="group relative px-10 py-5 bg-cyan-500 hover:bg-cyan-400 text-black font-black uppercase tracking-widest text-lg transition-all shadow-[0_0_30px_rgba(6,182,212,0.3)] disabled:opacity-50"
        >
          {loading ? 'Systeem Laten Initialiseren...' : 'Krijg Direct Toegang Tot The Grid'}
          <ArrowRight className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-zinc-950 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 border border-white/5 bg-black hover:border-cyan-500/30 transition-colors">
            <Bot className="w-10 h-10 text-cyan-400 mb-6" />
            <h3 className="text-xl font-bold uppercase tracking-widest mb-4">Autonome AI Machines</h3>
            <p className="text-zinc-500 text-sm leading-relaxed">
              Laat the Sovereign AI Router (Llama-3, Gemini, Cerebras) je short-form content, cold-emails en SEO-rapporten genereren binnen 3 seconden.
            </p>
          </div>
          <div className="p-8 border border-white/5 bg-black hover:border-cyan-500/30 transition-colors">
            <ShieldCheck className="w-10 h-10 text-blue-500 mb-6" />
            <h3 className="text-xl font-bold uppercase tracking-widest mb-4">Financiële Vesting</h3>
            <p className="text-zinc-500 text-sm leading-relaxed">
              Geïntegreerde CRM, Facturatie via Mollie, en een ingebouwd Partner/Affiliate netwerk dat leads beloont om the Grid te verspreiden.
            </p>
          </div>
          <div className="p-8 border border-white/5 bg-black hover:border-cyan-500/30 transition-colors">
            <Zap className="w-10 h-10 text-[#C8A96B] mb-6" />
            <h3 className="text-xl font-bold uppercase tracking-widest mb-4">C-Suite Intelligence</h3>
            <p className="text-zinc-500 text-sm leading-relaxed">
              Krijg toegang tot virtuele CEO, CFO en CMO Boardroom agents die real-time je business metrics analyseren en beslissingen forceren.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing / CTA */}
      <section className="py-32 px-6 max-w-4xl mx-auto">
        <div className="border border-cyan-500/30 bg-black/60 p-8 md:p-12 relative overflow-hidden shadow-[0_0_50px_rgba(6,182,212,0.1)]">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-[100px] pointer-events-none"></div>
          
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black uppercase tracking-widest mb-4">The Elite Package</h2>
            <div className="text-5xl font-black text-white">€2.000 <span className="text-xl text-zinc-500 font-normal">eenmalig</span></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {[
              "Levenslange Toegang Tot The Sovereign Grid",
              "De C-Suite AI Agents (CEO, CFO, CMO)",
              "Viral Video Factory (Ongelimiteerde Scripts)",
              "SEO Audit Tool incl. Firecrawl Webscraping",
              "Cold Email B2B Autopilot",
              "Volledige CRM & Mollie Betaal Infrastructuur",
              "Toegang tot The Syndicate Community",
              "Affiliate Rechten (Verdien €500 per verkoop)"
            ].map((feature, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" />
                <span className="text-zinc-300 text-sm">{feature}</span>
              </div>
            ))}
          </div>

          <div className="mb-8 p-6 bg-zinc-900/50 border border-white/5 rounded-xl text-left">
            <h3 className="text-sm font-bold uppercase tracking-widest text-cyan-400 mb-4">Systeem Account Creatie</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-zinc-500 mb-1">E-mailadres</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  placeholder="jouw@email.com"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-zinc-500 mb-1">Kies Wachtwoord</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>
            {error && <p className="text-red-400 text-xs mt-4 bg-red-400/10 p-2 rounded">{error}</p>}
          </div>

          <button 
            onClick={handleCheckout} 
            disabled={loading}
            className="w-full py-6 bg-white hover:bg-zinc-200 text-black font-black uppercase tracking-widest text-xl transition-colors disabled:opacity-50"
          >
            {loading ? 'Verwerken...' : 'Activeer Mijn Systeem Nu'}
          </button>
          
          <p className="text-center mt-6 text-xs text-zinc-600 font-mono">
            Beveiligde betaling via Mollie. Toegang wordt direct geactiveerd.
          </p>
        </div>
      </section>
    </div>
  );
}

export default function EliteSalesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-cyan-400 font-mono">Initializing System...</div>}>
      <EliteContent />
    </Suspense>
  );
}
