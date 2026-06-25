import { db } from '@/lib/db';
import { Lock, ShieldAlert, TrendingUp, Zap } from 'lucide-react';
import Link from 'next/link';

export default async function OpportunitiesPage() {
  // Simuleer auth - we pakken de eerste gebruiker in de DB (of pas dit aan naar next-auth logic)
  const currentUser = await db.user.findFirst();

  if (!currentUser) {
    return <div className="p-10 text-white">Geen gebruiker gevonden. Log in.</div>;
  }

  // ELITE CHECK
  // Alleen toegankelijk voor "ELITE" tier of hoger (bijv. clearanceLevel >= 5)
  const isElite = currentUser.subscriptionTier === 'ELITE' || currentUser.clearanceLevel >= 5;

  if (!isElite) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <div className="max-w-2xl w-full bg-zinc-950 border border-gold/30 rounded-2xl p-10 text-center relative overflow-hidden">
          {/* Scanline Effect */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,0,0,0.05)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none opacity-50"></div>
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-red-950 border border-gold/50 flex items-center justify-center mb-6 animate-pulse">
              <ShieldAlert className="w-12 h-12 text-gold" />
            </div>
            
            <h1 className="text-3xl font-black text-white tracking-wider uppercase mb-2">
              Toegang Geweigerd
            </h1>
            <p className="text-goldLight font-mono text-sm tracking-widest uppercase mb-8">
              Clearance Level: INSUFFICIENT
            </p>
            
            <p className="text-zinc-400 text-lg leading-relaxed mb-8 max-w-lg">
              De Sovereign Wealth Generator en autonome verdienmodellen zijn exclusief geclassificeerd voor het <strong className="text-white">Elite Team</strong>. Je huidige abonnement ({currentUser.subscriptionTier}) geeft geen toegang tot deze Hermes-modules.
            </p>

            <Link 
              href="/vsl"
              className="bg-gold hover:bg-gold text-white px-8 py-4 rounded-xl font-bold tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(220,38,38,0.4)] flex items-center gap-3"
            >
              <Lock className="w-5 h-5" />
              Upgrade naar Elite Status
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ALS ELITE: Haal de opportunities op
  const opportunities = await db.opportunityReport.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10
  });

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-12 border-b border-cyan-500/20 pb-6">
          <div>
            <h1 className="text-4xl font-black tracking-wider uppercase flex items-center gap-4">
              <Zap className="w-8 h-8 text-cyan-400" />
              Sovereign Wealth Radar
            </h1>
            <p className="text-cyan-400/60 font-mono mt-2 uppercase tracking-widest text-sm">
              Elite Clearance Accepted. Live Hermes Feed.
            </p>
          </div>
          <div className="px-4 py-2 bg-cyan-950/50 border border-cyan-500/30 rounded-lg text-cyan-400 font-mono text-xs uppercase tracking-widest flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            Hermes Analytics Active
          </div>
        </div>

        {opportunities.length === 0 ? (
          <div className="text-center py-20 border border-zinc-800 border-dashed rounded-2xl">
            <p className="text-zinc-500 font-mono">Geen signalen gedetecteerd. Wachten op de volgende cyclus...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {opportunities.map((opp) => (
              <div key={opp.id} className="bg-zinc-900 border border-zinc-800 hover:border-cyan-500/50 rounded-2xl p-6 transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest px-2 py-1 bg-cyan-950 rounded mb-2 inline-block">
                      {opp.niche}
                    </span>
                    <h3 className="text-xl font-bold">{opp.title}</h3>
                  </div>
                  <TrendingUp className="w-6 h-6 text-zinc-600 group-hover:text-cyan-400 transition-colors" />
                </div>
                
                <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                  {opp.summary}
                </p>

                <div className="grid grid-cols-3 gap-4 border-t border-zinc-800 pt-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-1">Base ROI</p>
                    <p className="text-white font-mono">{opp.goodROI}%</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-1">Target</p>
                    <p className="text-cyan-400 font-mono">{opp.betterROI}%</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-1">Max Potential</p>
                    <p className="text-green-400 font-mono">{opp.bestROI}%</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
