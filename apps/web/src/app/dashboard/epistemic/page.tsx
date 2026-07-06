import React from 'react';
import { db } from '@/lib/db';
import { Brain, TrendingUp, TrendingDown, Target, Zap } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export const dynamic = 'force-dynamic'; // Altijd verse data ophalen

export default async function EpistemicGridPage() {
  const verifiedKnowledge = await db.agentKnowledgeBase.findMany({
    where: { type: 'VERIFIED' },
    orderBy: { updatedAt: 'desc' },
    include: { agent: true }
  });

  const failedKnowledge = await db.agentKnowledgeBase.findMany({
    where: { type: 'FAILURE' },
    orderBy: { updatedAt: 'desc' },
    include: { agent: true }
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
          <Brain className="h-8 w-8 text-[#00f0ff]" />
          De Epistemic Grid
        </h1>
        <p className="text-gray-400 mt-2">
          De hersens van RYL OS. Hier zie je welke hypotheses zijn gepromoveerd tot 
          <span className="text-[#d4af37] font-bold mx-1">Winstgevend (Verified)</span> 
          en welke genadeloos zijn afgeschoten om je budget te beschermen.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-black/40 border-[#00f0ff]/20 flex items-center gap-4">
          <div className="p-4 bg-green-500/10 rounded-full">
            <TrendingUp className="h-6 w-6 text-green-500" />
          </div>
          <div>
            <p className="text-sm text-gray-400 font-bold uppercase">Winnende Strategieën</p>
            <p className="text-3xl font-bold text-white">{verifiedKnowledge.length}</p>
          </div>
        </Card>
        <Card className="p-6 bg-black/40 border-[#00f0ff]/20 flex items-center gap-4">
          <div className="p-4 bg-red-500/10 rounded-full">
            <TrendingDown className="h-6 w-6 text-red-500" />
          </div>
          <div>
            <p className="text-sm text-gray-400 font-bold uppercase">Afgeschoten & Bewaard</p>
            <p className="text-3xl font-bold text-white">{failedKnowledge.length}</p>
          </div>
        </Card>
        <Card className="p-6 bg-black/40 border-[#00f0ff]/20 flex items-center gap-4">
          <div className="p-4 bg-[#00f0ff]/10 rounded-full">
            <Zap className="h-6 w-6 text-[#00f0ff]" />
          </div>
          <div>
            <p className="text-sm text-gray-400 font-bold uppercase">Self-Healing Status</p>
            <p className="text-xl font-bold text-[#00f0ff]">Actief (Nachtelijk)</p>
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Verified Column */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-[#d4af37] flex items-center gap-2 border-b border-[#d4af37]/20 pb-2">
            <Target className="h-5 w-5" /> Gepromoveerd (VERIFIED)
          </h2>
          {verifiedKnowledge.length === 0 ? (
            <div className="text-gray-500 text-sm">Nog geen bewezen strategieën.</div>
          ) : (
            verifiedKnowledge.map(k => (
              <Card key={k.id} className="p-5 bg-black/60 border border-[#d4af37]/40 hover:border-[#d4af37] transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold px-2 py-1 bg-[#d4af37]/20 text-[#d4af37] rounded">
                    {k.domain}
                  </span>
                  <span className="text-xs text-gray-500">{(k.confidence * 100).toFixed(0)}% Zekerheid</span>
                </div>
                <h3 className="text-white font-medium mb-2">{k.claim}</h3>
                <p className="text-sm text-gray-400 border-l-2 border-[#00f0ff]/30 pl-3">
                  {k.evidence || "Door de Cron-Job als winstgevend gemarkeerd op basis van positieve ROAS."}
                </p>
              </Card>
            ))
          )}
        </div>

        {/* Failed Column */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-red-500 flex items-center gap-2 border-b border-red-500/20 pb-2">
            <TrendingDown className="h-5 w-5" /> Afgeschoten (FAILED)
          </h2>
          {failedKnowledge.length === 0 ? (
            <div className="text-gray-500 text-sm">Nog geen strategieën afgeschoten.</div>
          ) : (
            failedKnowledge.map(k => (
              <Card key={k.id} className="p-5 bg-black/60 border border-red-500/20 hover:border-red-500/40 transition-colors opacity-75">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold px-2 py-1 bg-red-500/10 text-red-400 rounded">
                    {k.domain}
                  </span>
                  <span className="text-xs text-gray-500">Foutief model</span>
                </div>
                <h3 className="text-white font-medium mb-2 line-through decoration-red-500/50">{k.claim}</h3>
                <p className="text-sm text-gray-400 border-l-2 border-red-500/30 pl-3">
                  Verlieslatend bevonden. Data permanent opgeslagen in model-geheugen om herhaling te voorkomen.
                </p>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
