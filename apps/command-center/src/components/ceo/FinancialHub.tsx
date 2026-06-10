"use client";

import { PiggyBank, Scale, AlertTriangle } from 'lucide-react';

export default function FinancialHub() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Income Split Visualization */}
        <div className="col-span-1 md:col-span-3 bg-black/40 border border-white/5 rounded-2xl p-6">
          <h3 className="text-sm font-medium text-slate-400 mb-6 flex items-center gap-2">
            <Scale className="w-4 h-4 text-cyan-400" />
            LIVE INCOME SPLIT (SAFETY NET)
          </h3>
          
          <div className="relative h-16 bg-slate-800 rounded-full overflow-hidden flex shadow-inner">
            {/* Net Profit */}
            <div className="h-full bg-green-500 w-[64%] flex items-center justify-center relative group">
              <span className="font-bold text-white text-sm z-10">64% NET WINST (€ 12.400)</span>
              <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors cursor-pointer" />
            </div>
            {/* Taxes */}
            <div className="h-full bg-amber-500 w-[21%] flex items-center justify-center relative group border-l border-black/20">
              <span className="font-bold text-amber-950 text-xs z-10">21% BTW</span>
            </div>
            {/* Investment Buffer */}
            <div className="h-full bg-cyan-500 w-[15%] flex items-center justify-center relative group border-l border-black/20">
              <span className="font-bold text-cyan-950 text-xs z-10">15% BUFFER</span>
            </div>
          </div>
          <div className="mt-4 flex justify-between text-xs font-mono text-slate-500">
            <span>Totaal Binnen: € 19.375</span>
            <span>Gegarandeerd Veilig</span>
          </div>
        </div>

        {/* Accounting Link */}
        <div className="bg-black/40 border border-white/5 rounded-2xl p-5 flex items-center gap-4 hover:border-cyan-500/30 transition-colors cursor-pointer">
          <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center">
            <PiggyBank className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Boekhouding API</h4>
            <p className="text-xs text-slate-400">Exact Online Gekoppeld</p>
          </div>
        </div>

        {/* Risk Monitor */}
        <div className="bg-amber-950/20 border border-amber-500/20 rounded-2xl p-5 md:col-span-2">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-amber-500/10 rounded-full flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-amber-400 mb-1">Risk Alert: Ad-Spend Divergence</h4>
              <p className="text-xs text-amber-100/70 mb-3">
                Je hebt deze week €400 meer uitgegeven aan Ads dan voorspeld door de AI groeimodellen. Wil je dat Orion de budgetten pauzeert tot de conversie aantrekt?
              </p>
              <div className="flex gap-3">
                <button className="text-xs font-bold text-slate-900 bg-amber-400 px-3 py-1.5 rounded hover:bg-amber-300 transition-colors">
                  PAUZEER ADS
                </button>
                <button className="text-xs text-amber-400 border border-amber-500/30 px-3 py-1.5 rounded hover:bg-amber-500/10 transition-colors">
                  NEGEER (IK NEEM HET RISICO)
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
