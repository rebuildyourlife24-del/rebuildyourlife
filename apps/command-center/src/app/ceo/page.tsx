"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, TrendingUp, ShieldAlert, Cpu } from 'lucide-react';
import Link from 'next/link';

import CompanySelector from '@/components/ceo/CompanySelector';
import BusinessMetrics from '@/components/ceo/BusinessMetrics';
import FinancialHub from '@/components/ceo/FinancialHub';
import AILearningPanel from '@/components/ceo/AILearningPanel';

export default function CEODashboard() {
  const [selectedCompany, setSelectedCompany] = useState("RebuildYourLife OS");
  const [learningTopic, setLearningTopic] = useState<{title: string, content: string} | null>(null);

  const openLearning = (title: string, content: string) => {
    setLearningTopic({ title, content });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-cyan-500/30">
      
      {/* Background gradients for premium feel */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-1/2 h-96 bg-cyan-900/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-1/3 h-96 bg-amber-900/10 blur-[120px] rounded-full" />
      </div>

      {/* Top Navigation */}
      <header className="relative z-20 border-b border-white/5 bg-slate-950/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/hq" className="p-2 hover:bg-white/5 rounded-lg transition-colors group">
              <ArrowLeft className="w-5 h-5 text-slate-400 group-hover:text-cyan-400 transition-colors" />
            </Link>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                <Cpu className="w-5 h-5 text-cyan-400" />
                GOD-VIEW OVERSEER
              </h1>
              <p className="text-xs text-slate-500 font-mono">SUPREME COMMAND DASHBOARD</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <CompanySelector selected={selectedCompany} onChange={setSelectedCompany} />
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center border border-cyan-400/30 shadow-[0_0_15px_rgba(0,255,255,0.2)]">
              <span className="font-bold text-white text-sm">CEO</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Dashboard Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8 flex flex-col gap-8">
        
        {/* KPI Overview Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6 backdrop-blur-md">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-sm font-medium text-slate-400">Total Net Worth</h3>
              <span className="px-2 py-1 bg-green-500/10 text-green-400 text-xs rounded-full flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> +14.2%
              </span>
            </div>
            <p className="text-3xl font-bold text-white">€ 142.850</p>
            <button 
              onClick={() => openLearning("Total Net Worth", "Orion berekent Total Net Worth door alle liquide middelen, bedrijfswaarderingen (gebaseerd op 3x EBITDA) en uitstaande facturen samen te voegen. De stijging van 14.2% is primair gedreven door een daling in marketingkosten.")}
              className="mt-4 text-xs text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1"
            >
              [AI Uitleg: Hoe bereken ik dit?]
            </button>
          </div>

          <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6 backdrop-blur-md">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-sm font-medium text-slate-400">Active AI Workers</h3>
              <span className="px-2 py-1 bg-blue-500/10 text-blue-400 text-xs rounded-full">14 DEPLOYED</span>
            </div>
            <p className="text-3xl font-bold text-white">100% Efficiency</p>
            <p className="mt-4 text-xs text-slate-500">14 agents vervangen momenteel 3.2 FTE</p>
          </div>

          <div className="bg-amber-950/20 border border-amber-500/20 rounded-2xl p-6 backdrop-blur-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl" />
            <div className="flex justify-between items-start mb-4 relative z-10">
              <h3 className="text-sm font-medium text-amber-400">Risk & Safety Net</h3>
              <ShieldAlert className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-xl font-bold text-amber-100 relative z-10">1 Legal Review Needed</p>
            <button 
              onClick={() => openLearning("Legal Risk: GDPR", "De Scraper Agent heeft 200 koude leads verzameld. Voordat de Marketing Agent e-mails verstuurt, heb ik dit gepauzeerd. Volgens EU-GDPR wetgeving hebben we geen expliciete opt-in. Advies: Stuur in plaats daarvan een LinkedIn Connectie verzoek.")}
              className="mt-4 text-xs text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1 relative z-10"
            >
              [Bekijk Advies van Orion]
            </button>
          </div>
        </div>

        {/* Two-column layout for deep dives */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 flex flex-col gap-8">
            {/* Financial Hub */}
            <section className="bg-slate-900/40 border border-white/5 rounded-3xl p-6 lg:p-8 backdrop-blur-md">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Ironclad Financial Hub</h2>
                <button 
                  onClick={() => openLearning("Safety-Net Split", "Als CEO hoef jij je geen zorgen te maken over belastingen. Ik heb een API-koppeling met de bank ingesteld: van elke binnengekomen euro stuur ik direct 21% naar een BTW potje en 15% naar een investeringsbuffer. Jij ziet hier alleen échte, netto winst.")}
                  className="text-xs text-cyan-400 border border-cyan-500/30 px-3 py-1.5 rounded-full hover:bg-cyan-500/10 transition-colors"
                >
                  Hoe werkt dit vangnet?
                </button>
              </div>
              <FinancialHub />
            </section>

            {/* Business Metrics */}
            <section className="bg-slate-900/40 border border-white/5 rounded-3xl p-6 lg:p-8 backdrop-blur-md">
              <h2 className="text-xl font-bold text-white mb-6">Growth & Traffic Analytics</h2>
              <BusinessMetrics />
            </section>
          </div>

          {/* Right sidebar: AI Opportunities & Approvals */}
          <div className="flex flex-col gap-6">
            <div className="bg-slate-900/80 border border-cyan-500/20 rounded-2xl p-6 shadow-[0_0_30px_rgba(0,240,255,0.05)] sticky top-24">
              <h3 className="text-sm font-bold text-cyan-400 tracking-wider mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                PENDING DECISIONS
              </h3>
              
              <div className="space-y-4">
                <div className="p-4 bg-black/40 border border-white/5 rounded-xl hover:border-cyan-500/30 transition-colors">
                  <h4 className="text-white font-medium text-sm mb-2">Lanceer Meta Ads (Dropship)</h4>
                  <p className="text-xs text-slate-400 mb-4">Winstmarge: 62%. Legal goedgekeurd. Budget vereist: €50.</p>
                  <div className="flex gap-2">
                    <button className="flex-1 py-2 bg-cyan-500 text-slate-950 font-bold text-xs rounded-lg hover:bg-cyan-400 transition-colors">AUTHORIZE</button>
                    <button className="px-3 py-2 bg-white/5 text-slate-400 text-xs rounded-lg hover:bg-white/10">DENY</button>
                  </div>
                </div>

                <div className="p-4 bg-black/40 border border-white/5 rounded-xl hover:border-cyan-500/30 transition-colors">
                  <h4 className="text-white font-medium text-sm mb-2">Herinvesteer Buffer (€4k)</h4>
                  <p className="text-xs text-slate-400 mb-4">Treasury Management stelt voor: 70% S&P500, 30% Cash reserves.</p>
                  <div className="flex gap-2">
                    <button className="flex-1 py-2 bg-cyan-500 text-slate-950 font-bold text-xs rounded-lg hover:bg-cyan-400 transition-colors">AUTHORIZE</button>
                    <button className="px-3 py-2 bg-white/5 text-slate-400 text-xs rounded-lg hover:bg-white/10">DENY</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* AI Learning Slide-out Panel */}
      <AnimatePresence>
        {learningTopic && (
          <AILearningPanel 
            title={learningTopic.title} 
            content={learningTopic.content} 
            onClose={() => setLearningTopic(null)} 
          />
        )}
      </AnimatePresence>

    </div>
  );
}
