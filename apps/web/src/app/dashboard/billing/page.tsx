import { CreditCard, Zap, Shield, Crown, CheckCircle2 } from 'lucide-react';

export default function BillingPage() {
  // Dit is een demo state, in de praktijk haal je dit op via de API
  const currentPlan = "STARTER";

  return (
    <div className="p-6 lg:p-10 space-y-10 max-w-7xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black uppercase tracking-widest text-white flex items-center gap-3">
          <CreditCard className="w-8 h-8 text-emerald-500" />
          Subscription & Billing
        </h1>
        <p className="text-zinc-400 font-mono text-sm">Beheer je Sovereign OS licentie en facturen.</p>
      </div>

      {/* Current Status */}
      <div className="bg-black/40 border border-white/10 rounded-2xl p-6 lg:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Shield className="w-48 h-48" />
        </div>
        <div className="relative z-10 flex justify-between items-center">
          <div>
            <h2 className="text-zinc-400 font-mono text-sm uppercase tracking-widest mb-1">Huidig Pakket</h2>
            <div className="text-3xl font-black text-white uppercase tracking-wider">{currentPlan} OS</div>
            <p className="text-emerald-400 text-sm mt-2 font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Actief & Beveiligd
            </p>
          </div>
          <div className="text-right">
            <h2 className="text-zinc-400 font-mono text-sm uppercase tracking-widest mb-1">Volgende Factuur</h2>
            <div className="text-2xl font-black text-white">€0,00</div>
            <p className="text-zinc-500 text-sm mt-2">N.v.t.</p>
          </div>
        </div>
      </div>

      {/* Upgrade Tiers */}
      <div>
        <h2 className="text-xl font-bold text-white uppercase tracking-widest mb-6">Upgrade je Licentie</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* STARTER */}
          <div className="bg-black/60 border border-white/10 rounded-2xl p-6 relative group hover:border-zinc-500 transition-all">
            <div className="mb-6">
              <h3 className="text-lg font-black text-white uppercase tracking-widest">Starter</h3>
              <div className="text-3xl font-black text-white mt-2">Gratis</div>
            </div>
            <ul className="space-y-3 mb-8 text-sm text-zinc-400">
              <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5"/> Toegang tot CRM</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5"/> Beperkte AI prompts</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5"/> Community Toegang</li>
            </ul>
            <button disabled className="w-full py-3 bg-zinc-800 text-zinc-500 font-bold uppercase tracking-widest rounded-xl text-sm">
              Huidig Pakket
            </button>
          </div>

          {/* E-COMMERCE */}
          <div className="bg-black border border-cyan-500/30 rounded-2xl p-6 relative group hover:border-cyan-500 transition-all shadow-[0_0_30px_rgba(6,182,212,0.1)] hover:shadow-[0_0_30px_rgba(6,182,212,0.2)]">
            <div className="absolute top-0 right-0 bg-cyan-500 text-black text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-bl-xl rounded-tr-xl">
              Meest Gekozen
            </div>
            <div className="mb-6">
              <h3 className="text-lg font-black text-cyan-400 uppercase tracking-widest flex items-center gap-2">
                <Zap className="w-5 h-5" /> Business
              </h3>
              <div className="text-3xl font-black text-white mt-2">€97<span className="text-sm text-zinc-500 font-normal">/mnd</span></div>
            </div>
            <ul className="space-y-3 mb-8 text-sm text-zinc-300">
              <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5"/> Onbeperkte GodBrain AI</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5"/> AI Autopilot (E-mail & Socials)</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5"/> Funnel & Website Builder</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5"/> Telegram Bot Integratie</li>
            </ul>
            <a href="/api/mollie/upgrade?plan=business" className="block text-center w-full py-3 bg-cyan-500/10 border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500 hover:text-black font-bold uppercase tracking-widest rounded-xl text-sm transition-all">
              Upgrade Nu
            </a>
          </div>

          {/* ELITE */}
          <div className="bg-[#0a0a0a] border border-[#d4af37]/30 rounded-2xl p-6 relative group hover:border-[#d4af37] transition-all">
            <div className="mb-6">
              <h3 className="text-lg font-black text-[#d4af37] uppercase tracking-widest flex items-center gap-2">
                <Crown className="w-5 h-5" /> Elite Syndicate
              </h3>
              <div className="text-3xl font-black text-white mt-2">€297<span className="text-sm text-zinc-500 font-normal">/mnd</span></div>
            </div>
            <ul className="space-y-3 mb-8 text-sm text-zinc-300">
              <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5"/> Alles uit Business</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5"/> 1-op-1 Boardroom toegang</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5"/> Persoonlijke AI Agenten bouw</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5"/> Eigen Whitelabel Platform</li>
            </ul>
            <a href="/api/mollie/upgrade?plan=elite" className="block text-center w-full py-3 bg-[#d4af37]/10 border border-[#d4af37]/50 text-[#d4af37] hover:bg-[#d4af37] hover:text-black font-bold uppercase tracking-widest rounded-xl text-sm transition-all">
              Join Elite
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}
