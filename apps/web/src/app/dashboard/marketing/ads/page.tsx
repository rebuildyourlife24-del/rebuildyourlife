"use client";

import { useState, useEffect } from "react";
import { getAdCampaigns } from "@/app/actions/adsmanager";
import { Target, Activity, Play, Pause, BarChart2, Plus, AlertTriangle } from "lucide-react";

export default function NativeAdsManagerPage() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [platforms, setPlatforms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const res = await getAdCampaigns();
    if (res.success) {
      setCampaigns(res.campaigns || []);
      setPlatforms(res.platforms || []);
    }
    setLoading(false);
  };

  const totalSpend = campaigns.reduce((acc, c) => acc + c.totalSpend, 0);
  const totalRevenue = campaigns.reduce((acc, c) => acc + (c.totalSpend * c.roas), 0);
  const avgRoas = totalSpend > 0 ? (totalRevenue / totalSpend).toFixed(2) : "0.00";

  return (
    <div className="max-w-7xl mx-auto p-6 lg:p-10 text-white min-h-[85vh]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-widest flex items-center gap-3">
            <Target className="w-8 h-8 text-rose-500" />
            RYL Native Ad-Manager
          </h1>
          <p className="text-zinc-400 font-mono text-sm mt-2 max-w-xl">
            Beheer Facebook, Google en TikTok Ads direct vanuit Godbrain. Omzeil de trage interfaces van Meta.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-rose-500/10 border border-rose-500/30 px-6 py-3 rounded-xl flex items-center gap-4">
            <div>
              <span className="block text-[10px] font-bold uppercase tracking-widest text-rose-500/70">Total Spend</span>
              <span className="block text-sm font-black">€{totalSpend.toFixed(2)}</span>
            </div>
            <div className="h-8 w-px bg-rose-500/30 mx-2"></div>
            <div>
              <span className="block text-[10px] font-bold uppercase tracking-widest text-emerald-500/70">Avg. ROAS</span>
              <span className="block text-sm font-black text-emerald-400">{avgRoas}x</span>
            </div>
          </div>
          <button className="bg-rose-600 hover:bg-rose-500 text-white px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" /> Nieuwe Campagne
          </button>
        </div>
      </div>

      {platforms.length === 0 ? (
        <div className="border border-white/10 bg-black/40 p-12 rounded-2xl text-center">
          <AlertTriangle className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
          <h3 className="text-xl font-bold uppercase tracking-widest mb-2">Geen Ad Accounts Gekoppeld</h3>
          <p className="text-zinc-500 mb-6">Koppel eerst je Facebook of Google Ads account in de instellingen.</p>
        </div>
      ) : loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-8 h-8 border-t-2 border-rose-500 border-solid rounded-full animate-spin"></div>
        </div>
      ) : campaigns.length === 0 ? (
        <div className="border border-white/10 bg-black/40 p-12 rounded-2xl text-center">
          <Activity className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
          <h3 className="text-xl font-bold uppercase tracking-widest mb-2">Geen Actieve Campagnes</h3>
          <p className="text-zinc-500 mb-6">Start een nieuwe ad campagne om data te zien.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {campaigns.map(camp => (
            <div key={camp.id} className="border border-white/10 bg-black/60 rounded-2xl overflow-hidden hover:border-rose-500/50 transition-colors">
              {/* Campaign Header */}
              <div className="p-6 flex flex-col md:flex-row justify-between items-center gap-6 border-b border-white/5 bg-zinc-900/30">
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <div className={`p-3 rounded-xl ${camp.platform.platform === 'FACEBOOK' ? 'bg-blue-600/20 text-blue-400' : 'bg-rose-600/20 text-rose-400'}`}>
                    <Target className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">{camp.campaignName}</h3>
                    <p className="text-xs font-mono text-zinc-500">
                      {camp.platform.platform} • {camp.campaignType}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                  <div className="text-right">
                    <span className="block text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-1">Dagbudget</span>
                    <span className="font-mono text-sm">€{camp.budgetDaily}</span>
                  </div>
                  <div className="text-right">
                    <span className="block text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-1">Spend</span>
                    <span className="font-mono text-sm">€{camp.totalSpend}</span>
                  </div>
                  <div className="text-right">
                    <span className="block text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-1">ROAS</span>
                    <span className={`font-mono text-sm font-bold ${camp.roas >= 2 ? 'text-emerald-400' : camp.roas >= 1 ? 'text-amber-400' : 'text-red-400'}`}>
                      {camp.roas.toFixed(2)}x
                    </span>
                  </div>
                  
                  <div className="pl-4 border-l border-white/10 flex gap-2">
                    {camp.status === 'ACTIVE' ? (
                      <button className="p-2 bg-amber-500/20 text-amber-400 rounded-lg hover:bg-amber-500/30 transition-colors">
                        <Pause className="w-4 h-4" />
                      </button>
                    ) : (
                      <button className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-colors">
                        <Play className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Ad Sets */}
              {camp.adSets && camp.adSets.length > 0 && (
                <div className="p-6 bg-black/40">
                  <h4 className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 mb-4 flex items-center gap-2">
                    <BarChart2 className="w-3 h-3" /> Ad Sets & Creatives
                  </h4>
                  <div className="space-y-3">
                    {camp.adSets.map((adSet: any) => (
                      <div key={adSet.id} className="flex justify-between items-center p-4 bg-zinc-900/50 border border-white/5 rounded-xl">
                        <div>
                          <span className="font-bold text-sm block">{adSet.name}</span>
                          <span className="text-[10px] text-zinc-500 uppercase font-mono mt-1 block">Audience: {adSet.targetAudience || 'Broad'}</span>
                        </div>
                        <div className="flex items-center gap-6 text-xs font-mono">
                          <span className="text-zinc-400">{adSet.creatives?.length || 0} Ads</span>
                          <span className={adSet.status === 'ACTIVE' ? 'text-emerald-400' : 'text-zinc-500'}>{adSet.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
