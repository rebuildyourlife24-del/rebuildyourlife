'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, TrendingUp, DollarSign, Target, ExternalLink, ChevronRight, Lock, ArrowRight, Flame, Brain, RefreshCw } from 'lucide-react';
import { getCommissionOpportunities, generateWealthPlan, findNicheOpportunities } from '@/app/actions/commissionAgent';

const PHASES = [
  { from: 100, to: 1000, label: 'Fase 1', color: 'emerald', time: '2-4 weken', method: 'Affiliate + Digitale Producten' },
  { from: 1000, to: 10000, label: 'Fase 2', color: 'cyan', time: '2-3 maanden', method: 'Bol.com + Niche Website' },
  { from: 10000, to: 100000, label: 'Fase 3', color: 'purple', time: '6-12 maanden', method: 'SaaS B2B + Schalen' },
  { from: 100000, to: 1000000, label: 'Fase 4', color: 'amber', time: '1-3 jaar', method: 'Investeren + Passief' },
];

function formatEur(n: number) {
  return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);
}

function PhaseCard({ phase, currentCapital }: { phase: typeof PHASES[0]; currentCapital: number }) {
  const isActive = currentCapital >= phase.from && currentCapital < phase.to;
  const isDone = currentCapital >= phase.to;
  const progress = isDone ? 100 : isActive ? Math.round(((currentCapital - phase.from) / (phase.to - phase.from)) * 100) : 0;
  const colors: Record<string, string> = {
    emerald: 'border-emerald-500/30 bg-emerald-500/5',
    cyan: 'border-cyan-500/30 bg-cyan-500/5',
    purple: 'border-purple-500/30 bg-purple-500/5',
    amber: 'border-amber-500/30 bg-amber-500/5',
  };
  const textColors: Record<string, string> = {
    emerald: 'text-emerald-400',
    cyan: 'text-cyan-400',
    purple: 'text-purple-400',
    amber: 'text-amber-400',
  };

  return (
    <div className={`p-5 rounded-xl border ${colors[phase.color]} ${isActive ? 'ring-1 ring-' + phase.color + '-500/40' : ''}`}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className={`text-[10px] font-mono font-bold tracking-widest ${textColors[phase.color]}`}>{phase.label}</span>
          {isActive && <span className="ml-2 text-[9px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-mono">ACTIEF</span>}
          {isDone && <span className="ml-2 text-[9px] bg-white/10 text-white/40 px-2 py-0.5 rounded-full font-mono">✓ KLAAR</span>}
        </div>
        <span className={`text-xs font-mono text-white/40`}>{phase.time}</span>
      </div>
      <div className="flex items-center gap-2 mb-3">
        <span className={`text-lg font-bold ${isDone ? 'text-white/40 line-through' : 'text-white'}`}>{formatEur(phase.from)}</span>
        <ArrowRight className="w-4 h-4 text-white/20" />
        <span className={`text-lg font-bold ${textColors[phase.color]}`}>{formatEur(phase.to)}</span>
      </div>
      <div className="text-xs text-white/40 mb-3">{phase.method}</div>
      {(isActive || isDone) && (
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] text-white/30">
            <span>Voortgang</span>
            <span>{progress}%</span>
          </div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className={`h-full rounded-full bg-${phase.color}-500`}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function OpportunityCard({ opp }: { opp: any }) {
  const typeColors: Record<string, string> = {
    AFFILIATE: 'text-cyan-400 bg-cyan-400/10',
    DROPSHIP: 'text-purple-400 bg-purple-400/10',
    REFERRAL: 'text-amber-400 bg-amber-400/10',
    WHITE_LABEL: 'text-pink-400 bg-pink-400/10',
    RESELLER: 'text-emerald-400 bg-emerald-400/10',
  };
  const diffColors: Record<string, string> = {
    LAAG: 'text-emerald-400 bg-emerald-400/10',
    MEDIUM: 'text-amber-400 bg-amber-400/10',
    HOOG: 'text-red-400 bg-red-400/10',
  };

  return (
    <div className="p-5 bg-[#0e0e11] border border-zinc-800/60 rounded-xl hover:border-zinc-700/60 transition-colors group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-zinc-100 text-sm group-hover:text-white transition-colors">{opp.name}</h3>
          <div className="flex items-center gap-2 mt-1.5">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${typeColors[opp.type] || 'text-zinc-400 bg-zinc-800'}`}>
              {opp.type}
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${diffColors[opp.difficulty]}`}>
              {opp.difficulty}
            </span>
          </div>
        </div>
        <a href={opp.url} target="_blank" rel="noopener noreferrer"
          className="p-1.5 text-zinc-600 hover:text-zinc-300 transition-colors opacity-0 group-hover:opacity-100"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      <p className="text-xs text-zinc-400 mb-4 leading-relaxed">{opp.description}</p>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="text-center p-2 bg-zinc-900/50 rounded-lg">
          <div className="text-[10px] text-zinc-600 mb-1">Commissie</div>
          <div className="text-xs font-bold text-emerald-400">{opp.commissionRate}</div>
        </div>
        <div className="text-center p-2 bg-zinc-900/50 rounded-lg">
          <div className="text-[10px] text-zinc-600 mb-1">Per Maand</div>
          <div className="text-xs font-bold text-cyan-400">{opp.estimatedMonthly}</div>
        </div>
        <div className="text-center p-2 bg-zinc-900/50 rounded-lg">
          <div className="text-[10px] text-zinc-600 mb-1">Startkosten</div>
          <div className="text-xs font-bold text-white">{opp.startCost}</div>
        </div>
      </div>

      {/* Quick Start stappen */}
      <details className="group/details">
        <summary className="text-[11px] font-mono text-zinc-500 hover:text-zinc-300 cursor-pointer list-none flex items-center gap-1.5">
          <ChevronRight className="w-3 h-3 transition-transform group-open/details:rotate-90" />
          Snelstart stappen
        </summary>
        <div className="mt-3 pl-4 border-l border-zinc-800">
          {opp.quickStart.split('\n').filter(Boolean).map((step: string, i: number) => (
            <p key={i} className="text-[11px] text-zinc-400 mb-1.5 leading-relaxed">{step.trim()}</p>
          ))}
        </div>
      </details>

      <div className="mt-3 flex items-center gap-1 text-[10px] text-emerald-500/60">
        <Lock className="w-3 h-3" />
        {opp.legalStatus.replace('_', ' ')}
      </div>
    </div>
  );
}

export default function WealthEnginePage() {
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [wealthPlan, setWealthPlan] = useState<string>('');
  const [niches, setNiches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [planLoading, setPlanLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>('ALL');
  const [currentCapital, setCurrentCapital] = useState(100);
  const [activeTab, setActiveTab] = useState<'kansen' | 'plan' | 'niches'>('kansen');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [opps, nicheData] = await Promise.all([
      getCommissionOpportunities({ startCost: 'LOW' }),
      findNicheOpportunities(currentCapital),
    ]);
    setOpportunities(opps);
    setNiches(nicheData.opportunities || []);
    setLoading(false);
  };

  const loadPlan = async () => {
    setPlanLoading(true);
    const result = await generateWealthPlan(currentCapital);
    setWealthPlan(result.plan || '');
    setPlanLoading(false);
    setActiveTab('plan');
  };

  const filtered = activeFilter === 'ALL' ? opportunities
    : opportunities.filter(o => o.type === activeFilter || o.difficulty === activeFilter || o.startCost === '€0');

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Zap className="w-6 h-6 text-amber-400" />
            Wealth Engine
          </h1>
          <p className="text-sm text-white/40 mt-1 font-mono">€100 → €1.000.000 — Jouw missie met Orion</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-xl px-4 py-2">
            <span className="text-xs text-white/40 font-mono">Startkapitaal:</span>
            <input
              type="number"
              value={currentCapital}
              onChange={e => setCurrentCapital(Number(e.target.value))}
              className="w-24 bg-transparent text-amber-400 font-mono font-bold text-sm outline-none"
              min={0}
            />
          </div>
          <button
            onClick={loadPlan}
            disabled={planLoading}
            className="flex items-center gap-2 px-4 py-2.5 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-xl text-sm font-bold hover:bg-amber-500/30 transition-colors disabled:opacity-50"
          >
            {planLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Brain className="w-4 h-4" />}
            AI Actieplan
          </button>
        </div>
      </div>

      {/* Voortgang fasen */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {PHASES.map(phase => (
          <PhaseCard key={phase.label} phase={phase} currentCapital={currentCapital} />
        ))}
      </div>

      {/* Missie stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-5 bg-[#0e0e11] border border-zinc-800/60 rounded-xl text-center">
          <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-2">Huidige Fase</div>
          <div className="text-2xl font-bold text-amber-400">
            {PHASES.find(p => currentCapital >= p.from && currentCapital < p.to)?.label || (currentCapital >= 1000000 ? '🏆 MILJOENAIR' : 'Fase 1')}
          </div>
        </div>
        <div className="p-5 bg-[#0e0e11] border border-zinc-800/60 rounded-xl text-center">
          <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-2">Doel</div>
          <div className="text-2xl font-bold text-emerald-400">{formatEur(1000000)}</div>
        </div>
        <div className="p-5 bg-[#0e0e11] border border-zinc-800/60 rounded-xl text-center">
          <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-2">Nog nodig</div>
          <div className="text-2xl font-bold text-cyan-400">{formatEur(Math.max(0, 1000000 - currentCapital))}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2">
        {[
          { id: 'kansen', label: `Kansen (${opportunities.length})`, icon: <TrendingUp className="w-4 h-4" /> },
          { id: 'plan', label: 'AI Actieplan', icon: <Brain className="w-4 h-4" /> },
          { id: 'niches', label: 'Niche Radar', icon: <Flame className="w-4 h-4" /> },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-zinc-800 text-zinc-100 border border-zinc-700'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {/* KANSEN TAB */}
        {activeTab === 'kansen' && (
          <motion.div key="kansen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* Filters */}
            <div className="flex items-center gap-2 mb-6 flex-wrap">
              {['ALL', 'GRATIS', 'AFFILIATE', 'DROPSHIP', 'LAAG', 'REFERRAL'].map(f => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold tracking-wide transition-all ${
                    activeFilter === f
                      ? 'bg-zinc-800 text-zinc-100 border border-zinc-700'
                      : 'text-zinc-600 hover:text-zinc-400'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1,2,3].map(i => <div key={i} className="h-64 bg-zinc-900/50 rounded-xl animate-pulse border border-zinc-800/50" />)}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((opp, i) => <OpportunityCard key={i} opp={opp} />)}
              </div>
            )}
          </motion.div>
        )}

        {/* ACTIEPLAN TAB */}
        {activeTab === 'plan' && (
          <motion.div key="plan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {planLoading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Brain className="w-12 h-12 text-amber-400 animate-pulse" />
                <p className="text-zinc-400 font-mono text-sm">Orion berekent jouw pad naar €1.000.000...</p>
              </div>
            ) : wealthPlan ? (
              <div className="bg-[#0e0e11] border border-zinc-800/60 rounded-xl p-6 lg:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Zap className="w-5 h-5 text-amber-400" />
                  <h2 className="text-sm font-bold text-zinc-100 uppercase tracking-widest">
                    Jouw Persoonlijk €{currentCapital} → €1.000.000 Plan
                  </h2>
                  <span className="text-[10px] bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-full font-mono border border-amber-500/20">
                    ORION GEGENEREERD
                  </span>
                </div>
                <div className="prose prose-invert prose-sm max-w-none">
                  {wealthPlan.split('\n').map((line, i) => {
                    if (line.startsWith('###')) return <h3 key={i} className="text-amber-400 font-bold mt-6 mb-2 text-sm">{line.replace(/#{2,3}/g, '').trim()}</h3>;
                    if (line.startsWith('##')) return <h2 key={i} className="text-cyan-400 font-bold mt-8 mb-3">{line.replace(/#{1,2}/g, '').trim()}</h2>;
                    if (line.startsWith('**')) return <p key={i} className="font-bold text-zinc-200 mt-3">{line.replace(/\*\*/g, '')}</p>;
                    if (line.match(/^\d+\./)) return <p key={i} className="text-zinc-300 ml-4 mb-1 text-sm">{line}</p>;
                    if (line.trim() === '') return <br key={i} />;
                    return <p key={i} className="text-zinc-400 text-sm leading-relaxed">{line}</p>;
                  })}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 gap-6 text-center">
                <Target className="w-16 h-16 text-amber-400/50" />
                <div>
                  <h3 className="text-lg font-bold text-zinc-300 mb-2">Klaar om te starten?</h3>
                  <p className="text-zinc-500 text-sm max-w-md">Orion genereert een persoonlijk actieplan gebaseerd op jouw startkapitaal van {formatEur(currentCapital)}.</p>
                </div>
                <button onClick={loadPlan} className="flex items-center gap-2 px-6 py-3 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-xl font-bold hover:bg-amber-500/30 transition-colors">
                  <Brain className="w-5 h-5" />
                  Genereer Mijn Plan
                </button>
              </div>
            )}
          </motion.div>
        )}

        {/* NICHE RADAR TAB */}
        {activeTab === 'niches' && (
          <motion.div key="niches" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {niches.map((niche, i) => (
                <div key={i} className="p-5 bg-[#0e0e11] border border-zinc-800/60 rounded-xl hover:border-zinc-700 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-zinc-100 text-sm">{niche.niche}</h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      niche.potential === 'HOOG' ? 'text-emerald-400 bg-emerald-400/10' : 'text-amber-400 bg-amber-400/10'
                    }`}>
                      {niche.potential}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">{niche.reason}</p>
                  <div className="mt-4 flex items-center gap-2">
                    <Flame className={`w-3.5 h-3.5 ${niche.potential === 'HOOG' ? 'text-emerald-400' : 'text-amber-400'}`} />
                    <span className="text-[10px] text-zinc-500 font-mono">Geschikt voor Hendrik's verhaal</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
