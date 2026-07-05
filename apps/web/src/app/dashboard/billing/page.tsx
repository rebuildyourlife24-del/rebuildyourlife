import { CreditCard, Zap, Shield, Crown, CheckCircle2, TrendingUp } from 'lucide-react';
import { createServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma'; // Assuming standard prisma client

export default async function BillingPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth');
  }

  // Check if admin/owner
  const isAdmin = user.email === 'hsemler50@gmail.com' || user.email === 'rebuildyourlife24@gmail.com';
  
  // Later we can fetch actual subscription status from Prisma/Mollie
  const currentPlan = isAdmin ? "OWNER" : "GEEN";

  return (
    <div className="p-6 lg:p-10 space-y-10 max-w-7xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black uppercase tracking-widest text-white flex items-center gap-3">
          <CreditCard className="w-8 h-8 text-emerald-500" />
          Subscription & Billing
        </h1>
        <p className="text-zinc-400 font-mono text-sm">Beheer je Sovereign OS licentie, betalingen en affiliate High-Ticket sales.</p>
      </div>

      {/* Current Status */}
      <div className="bg-black/40 border border-white/10 rounded-2xl p-6 lg:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Shield className="w-48 h-48" />
        </div>
        <div className="relative z-10 flex justify-between items-center">
          <div>
            <h2 className="text-zinc-400 font-mono text-sm uppercase tracking-widest mb-1">Huidig Pakket</h2>
            <div className="text-3xl font-black text-white uppercase tracking-wider">{currentPlan}</div>
            {isAdmin ? (
              <p className="text-emerald-400 text-sm mt-2 font-bold flex items-center gap-2">
                <Crown className="w-4 h-4" /> Lifetime Eigenaar Licentie
              </p>
            ) : (
              <p className="text-rose-400 text-sm mt-2 font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Geen actief abonnement
              </p>
            )}
          </div>
          <div className="text-right">
            <h2 className="text-zinc-400 font-mono text-sm uppercase tracking-widest mb-1">Volgende Factuur</h2>
            <div className="text-2xl font-black text-white">{isAdmin ? "€0,00" : "-"}</div>
            <p className="text-zinc-500 text-sm mt-2">{isAdmin ? "N.v.t." : "Kies een pakket"}</p>
          </div>
        </div>
      </div>

      {/* Upgrade Tiers - Echte Business Blueprint prijzen */}
      <div>
        <h2 className="text-xl font-bold text-white uppercase tracking-widest mb-6">Upgrade je Licentie</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
          
          {/* SUBSCRIPTION */}
          <div className="bg-black border border-cyan-500/30 rounded-2xl p-8 relative group hover:border-cyan-500 transition-all shadow-[0_0_30px_rgba(6,182,212,0.1)]">
            <div className="mb-6">
              <h3 className="text-xl font-black text-cyan-400 uppercase tracking-widest flex items-center gap-2">
                <Zap className="w-6 h-6" /> Sovereign OS
              </h3>
              <div className="text-4xl font-black text-white mt-4">€50<span className="text-lg text-zinc-500 font-normal">/mnd</span></div>
              <p className="text-zinc-400 font-mono text-xs mt-2">Maandelijks opzegbaar</p>
            </div>
            <ul className="space-y-4 mb-8 text-sm text-zinc-300">
              <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0"/> Toegang tot het SaaS Dashboard</li>
              <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0"/> AI Tools (Product Hunter, Funnels)</li>
              <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0"/> CRM & Facturatie Module</li>
              <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0"/> Basis Affiliate Rechten</li>
            </ul>
            <a href="/api/mollie/checkout?type=subscription" className="block text-center w-full py-4 bg-cyan-500/10 border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500 hover:text-black font-black uppercase tracking-widest rounded-xl transition-all">
              Start Abonnement
            </a>
          </div>

          {/* HIGH TICKET */}
          <div className="bg-[#0a0a0a] border border-[#d4af37]/50 rounded-2xl p-8 relative group hover:border-[#d4af37] transition-all shadow-[0_0_40px_rgba(212,175,55,0.15)]">
            <div className="absolute top-0 right-0 bg-[#d4af37] text-black text-xs font-black uppercase tracking-widest px-4 py-2 rounded-bl-xl rounded-tr-xl">
              High-Ticket
            </div>
            <div className="mb-6">
              <h3 className="text-xl font-black text-[#d4af37] uppercase tracking-widest flex items-center gap-2">
                <Crown className="w-6 h-6" /> Elite Pakket
              </h3>
              <div className="text-4xl font-black text-white mt-4">€2000<span className="text-lg text-zinc-500 font-normal"> eenmalig</span></div>
              <p className="text-[#d4af37]/80 font-mono text-xs mt-2 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> Inclusief High-Ticket Affiliate Rechten
              </p>
            </div>
            <ul className="space-y-4 mb-8 text-sm text-zinc-300">
              <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-[#d4af37] shrink-0"/> Alles uit het €50/mnd pakket</li>
              <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-[#d4af37] shrink-0"/> Exclusieve Boardroom & 1-op-1</li>
              <li className="flex items-start gap-3 bg-[#d4af37]/10 p-3 rounded-lg border border-[#d4af37]/20">
                <span className="font-bold text-[#d4af37]">High-Ticket Reseller:</span> Verkoop dit pakket door en ontvang direct €500,- commissie per sale!
              </li>
            </ul>
            <a href="/api/mollie/checkout?type=highticket" className="block text-center w-full py-4 bg-[#d4af37]/10 border border-[#d4af37]/50 text-[#d4af37] hover:bg-[#d4af37] hover:text-black font-black uppercase tracking-widest rounded-xl transition-all">
              Koop High-Ticket
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}
