'use client';

import { useState, useEffect } from 'react';
import { Lock, Shield, DollarSign, Activity } from 'lucide-react';
import { getCFOData } from '@/app/actions/cfo';

function formatEur(n: number) {
  return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR', maximumFractionDigits: 2 }).format(n);
}

export default function WealthDashboard() {
  const [cfoData, setCfoData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const res = await getCFOData();
      if (res.success) {
        setCfoData(res.data);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gold-500"></div>
      </div>
    );
  }

  const balance = cfoData?.vault?.balance || 0;
  const maxRisk = balance * 0.02; // 2% Rule
  const totalTaxShield = cfoData?.totalTaxShield || 0;
  const totalNetWorth = balance + totalTaxShield;

  return (
    <div className="p-6 md:p-8 lg:p-10 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-white tracking-tight">The God Mode</h1>
            <span className="px-3 py-1 text-[10px] font-bold tracking-widest text-gold-400 bg-gold-400/10 rounded-full border border-gold-400/20 uppercase">CFO & Tax Engine Online</span>
          </div>
          <p className="text-zinc-400">Jouw financiële vesting. Volledig geautomatiseerd kapitaalbehoud en fiscale optimalisatie.</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-zinc-500 uppercase tracking-wider font-semibold mb-1">Total Net Worth</p>
          <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
            {formatEur(totalNetWorth)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* The Treasury Vault */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-2xl bg-[#0e0e11] border border-zinc-800/60 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Lock className="w-48 h-48" />
            </div>
            
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-emerald-500/10 rounded-xl">
                <DollarSign className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Treasury Vault</h2>
                <p className="text-sm text-zinc-400">Vrij opneembaar en liquide kapitaal.</p>
              </div>
            </div>

            <div className="text-5xl font-bold text-white mb-2">
              {formatEur(balance)}
            </div>
            <p className="text-sm text-emerald-400/80 font-mono mb-8">Ready for deployment.</p>

            {/* Risk Protocol */}
            <div className="p-5 rounded-xl border border-red-500/20 bg-red-500/5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-red-400" />
                  <h3 className="font-semibold text-red-100">Orion 2% Risk Protocol</h3>
                </div>
                <span className="text-xs font-mono text-red-400/60">Strict Enforcement</span>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs text-red-200/60 mb-1">Maximaal test-budget (Opportunity Engine)</p>
                  <p className="text-2xl font-bold text-red-400">{formatEur(maxRisk)}</p>
                </div>
                <div className="w-1/2 h-2 bg-black/40 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-500 via-amber-500 to-red-500 w-[2%]" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* The Tax Shield */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#0e0e11] border border-cyan-500/20 shadow-[0_0_30px_-15px_rgba(6,182,212,0.3)] h-full">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-cyan-500/10 rounded-xl">
                <Shield className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">The Tax Shield</h2>
                <p className="text-sm text-zinc-400">Veiliggesteld voor de fiscus.</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-end pb-4 border-b border-zinc-800/60">
                <span className="text-zinc-400">Totaal Afgeschermd</span>
                <span className="text-xl font-bold text-cyan-400">{formatEur(totalTaxShield)}</span>
              </div>

              {cfoData?.taxStrategies?.length > 0 ? (
                cfoData.taxStrategies.map((tax: any) => (
                  <div key={tax.id} className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/40">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-semibold text-zinc-200">{tax.potName}</span>
                      <span className="text-sm font-mono text-white">{formatEur(tax.allocatedAmount)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-zinc-500">Geschat belastingvoordeel</span>
                      <span className="text-emerald-400">+{formatEur(tax.taxAdvantage)}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Shield className="w-12 h-12 text-zinc-800 mx-auto mb-3" />
                  <p className="text-sm text-zinc-500">Nog geen fiscale vluchtroutes geactiveerd. Orion optimaliseert automatisch bij de eerste winst.</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Luxury Receiver / Debt Negotiator Module */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-red-900/20 to-zinc-900/40 border border-red-500/20 mt-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-500/10 rounded-xl">
              <Shield className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Autonomous Debt Negotiator</h2>
              <p className="text-sm text-zinc-400">Military-Grade Encrypted Justice Ledger (AES-256-GCM)</p>
            </div>
          </div>
          <span className="px-3 py-1 text-xs font-bold text-red-400 bg-red-400/10 rounded-full border border-red-500/20">
            SYSTEM ACTIVE
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 rounded-xl bg-black/40 border border-zinc-800/50">
            <p className="text-sm text-zinc-500 mb-1">Onaantastbaar Leefgeld (VTLB)</p>
            <p className="text-2xl font-bold text-emerald-400">~ €5.000,-</p>
            <p className="text-xs text-emerald-500/60 mt-1">Gegarandeerd 2x Modaal ZZP</p>
          </div>
          
          <div className="p-4 rounded-xl bg-black/40 border border-zinc-800/50">
            <p className="text-sm text-zinc-500 mb-1">Actieve Dossiers</p>
            <p className="text-2xl font-bold text-white">0</p>
            <p className="text-xs text-zinc-600 mt-1">Orion scant momenteel je mailbox...</p>
          </div>

          <div className="p-4 rounded-xl bg-black/40 border border-zinc-800/50">
            <p className="text-sm text-zinc-500 mb-1">Lokale Juridische Engine</p>
            <p className="text-lg font-bold text-cyan-400">Verbonden</p>
            <p className="text-xs text-cyan-500/60 mt-1">Klaar om gemeentelijk beleid te handhaven.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
