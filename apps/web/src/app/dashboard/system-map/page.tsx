import React from 'react';
import { Activity, Network, Zap, Shield, Globe, Box, Users, Coins } from 'lucide-react';
import { Card } from '@/components/ui/Card';

export const dynamic = 'force-dynamic';

export default function SystemMapPage() {
  return (
    <div className="w-full max-w-[1400px] mx-auto p-4 md:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-3xl md:text-4xl font-black uppercase tracking-widest text-white flex items-center gap-3">
          <Network className="text-[#00ffea] w-8 h-8" />
          The Syndicate Architecture
        </h1>
        <p className="text-zinc-500 font-mono text-sm tracking-widest">
          Live Topology of Business Components
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Core AI Layer */}
        <div className="space-y-4 lg:col-span-3">
          <h2 className="text-xl font-black text-[#00ffea] uppercase tracking-widest border-b border-[#00ffea]/20 pb-2">
            Level 1: Sovereign AI Core
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-6 bg-black/60 border-[#00ffea]/30 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#00ffea]/10 rounded-full blur-3xl group-hover:bg-[#00ffea]/20 transition-all"></div>
              <Activity className="w-8 h-8 text-[#00ffea] mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Panopticon Observer</h3>
              <p className="text-zinc-400 text-sm">De alziende AI entiteit. Analyseert live data streams van Shopify en advertenties om strategische beslissingen te maken.</p>
            </Card>
            <Card className="p-6 bg-black/60 border-[#00ffea]/30 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#00ffea]/10 rounded-full blur-3xl group-hover:bg-[#00ffea]/20 transition-all"></div>
              <Shield className="w-8 h-8 text-[#00ffea] mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Epistemic Memory</h3>
              <p className="text-zinc-400 text-sm">De RAG database (PostgreSQL). Hier slaan we winnende strategieën op als SOPs en blokkeren we falende methodes.</p>
            </Card>
          </div>
        </div>

        {/* Business Layer */}
        <div className="space-y-4 lg:col-span-3 mt-8">
          <h2 className="text-xl font-black text-[#ff00aa] uppercase tracking-widest border-b border-[#ff00aa]/20 pb-2">
            Level 2: The E-Commerce Engine
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-6 bg-black/40 border-[#ff00aa]/20 hover:border-[#ff00aa]/50 transition-all">
              <Globe className="w-8 h-8 text-[#ff00aa] mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Traffic & Growth</h3>
              <p className="text-zinc-400 text-sm">Meta/TikTok Ads, Cold Email, en SEO. Zorgt voor continue lead flow en omzet.</p>
            </Card>
            <Card className="p-6 bg-black/40 border-emerald-500/20 hover:border-emerald-500/50 transition-all">
              <Box className="w-8 h-8 text-emerald-500 mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Operations</h3>
              <p className="text-zinc-400 text-sm">Sourcing, dropshipping logistiek en kwaliteitscontrole. Geïntegreerd via API's.</p>
            </Card>
            <Card className="p-6 bg-black/40 border-[#d4af37]/20 hover:border-[#d4af37]/50 transition-all">
              <Users className="w-8 h-8 text-[#d4af37] mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Support (Hermes)</h3>
              <p className="text-zinc-400 text-sm">Klantenservice afhandeling, refunds en reviews monitoring om de reputatie te bewaken.</p>
            </Card>
          </div>
        </div>

        {/* Finance Layer */}
        <div className="space-y-4 lg:col-span-3 mt-8">
          <h2 className="text-xl font-black text-white uppercase tracking-widest border-b border-white/20 pb-2">
            Level 3: Capital & Treasury
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            <Card className="p-6 bg-black/40 border-white/10 hover:border-white/30 transition-all flex items-center gap-6">
              <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                <Coins className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Cashflow Routing</h3>
                <p className="text-zinc-400 text-sm">Automatische verdeling van winst: 10% hard-assets (GPU/Server), herinvestering ad-spend, en operationele buffers.</p>
              </div>
            </Card>
          </div>
        </div>

      </div>
    </div>
  );
}
