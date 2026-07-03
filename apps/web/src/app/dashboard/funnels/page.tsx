"use client";

import { useState, useEffect } from "react";
import { getFunnels, createFunnel } from "@/app/actions/funnel";
import { Layers, Plus, ExternalLink, Settings, MousePointerClick, CreditCard, Play } from "lucide-react";

export default function FunnelsPage() {
  const [funnels, setFunnels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newFunnelName, setNewFunnelName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    loadFunnels();
  }, []);

  const loadFunnels = async () => {
    setLoading(true);
    const res = await getFunnels();
    if (res.success) {
      setFunnels(res.funnels);
    }
    setLoading(false);
  };

  const handleCreate = async () => {
    if (!newFunnelName.trim() || isCreating) return;
    setIsCreating(true);
    const res = await createFunnel(newFunnelName);
    if (res.success) {
      setNewFunnelName("");
      loadFunnels();
    }
    setIsCreating(false);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 lg:p-10 text-white min-h-[85vh]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-widest flex items-center gap-3">
            <Layers className="w-8 h-8 text-fuchsia-500" />
            RYL Funnel Builder
          </h1>
          <p className="text-zinc-400 font-mono text-sm mt-2 max-w-xl">
            Bouw en publiceer high-converting landingspagina's en checkouts direct in Godbrain. Je bent niet langer afhankelijk van ClickFunnels of Shopify.
          </p>
        </div>

        <div className="flex bg-black/40 border border-white/10 rounded-xl overflow-hidden p-1">
          <input 
            type="text"
            placeholder="Nieuwe Funnel Naam..."
            value={newFunnelName}
            onChange={e => setNewFunnelName(e.target.value)}
            className="bg-transparent px-4 py-2 text-sm outline-none w-48 focus:w-64 transition-all"
          />
          <button 
            onClick={handleCreate}
            disabled={isCreating || !newFunnelName.trim()}
            className="bg-fuchsia-600 hover:bg-fuchsia-500 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2"
          >
            {isCreating ? 'Bezig...' : <><Plus className="w-4 h-4" /> Maak Funnel</>}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-8 h-8 border-t-2 border-fuchsia-500 border-solid rounded-full animate-spin"></div>
        </div>
      ) : funnels.length === 0 ? (
        <div className="border border-white/10 bg-black/40 p-12 rounded-2xl text-center">
          <MousePointerClick className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
          <h3 className="text-xl font-bold uppercase tracking-widest mb-2">Geen Funnels Gevonden</h3>
          <p className="text-zinc-500 mb-6">Je hebt nog geen onafhankelijke funnels gebouwd.</p>
          <button onClick={() => document.querySelector('input')?.focus()} className="bg-white text-black px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-zinc-200 transition-colors">
            Start Je Eerste Funnel
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {funnels.map(funnel => (
            <div key={funnel.id} className="border border-white/10 bg-black/60 rounded-2xl p-6 hover:border-fuchsia-500/50 transition-colors group">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold">{funnel.name}</h3>
                  <span className={`inline-block mt-2 text-[10px] uppercase font-bold tracking-widest px-2 py-1 rounded ${funnel.status === 'PUBLISHED' ? 'bg-green-500/20 text-green-400' : 'bg-zinc-800 text-zinc-400'}`}>
                    {funnel.status}
                  </span>
                </div>
                <div className="p-2 bg-zinc-900 rounded-lg group-hover:bg-fuchsia-900/30 transition-colors">
                  <Layers className="w-5 h-5 text-zinc-500 group-hover:text-fuchsia-400" />
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center text-xs border-b border-white/5 pb-2">
                  <span className="text-zinc-500 uppercase tracking-widest font-bold">Aantal Pagina's</span>
                  <span className="font-mono text-fuchsia-400">{funnel.pages?.length || 0}</span>
                </div>
                <div className="flex justify-between items-center text-xs border-b border-white/5 pb-2">
                  <span className="text-zinc-500 uppercase tracking-widest font-bold">Checkouts / Verkopen</span>
                  <span className="font-mono text-emerald-400">{funnel.checkouts?.length || 0} sessies</span>
                </div>
                <div className="flex justify-between items-center text-xs pb-2">
                  <span className="text-zinc-500 uppercase tracking-widest font-bold">Eigen Domein</span>
                  <span className="font-mono">{funnel.domain || 'Geen gekoppeld'}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4">
                <button className="bg-zinc-900 hover:bg-zinc-800 border border-white/5 rounded-xl py-2.5 text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors">
                  <MousePointerClick className="w-3.5 h-3.5 text-fuchsia-500" /> Edit Pages
                </button>
                <button className="bg-zinc-900 hover:bg-zinc-800 border border-white/5 rounded-xl py-2.5 text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors">
                  <CreditCard className="w-3.5 h-3.5 text-emerald-500" /> Checkouts
                </button>
                <button className="col-span-2 bg-fuchsia-600/20 hover:bg-fuchsia-600/40 text-fuchsia-400 border border-fuchsia-500/30 rounded-xl py-2.5 text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors">
                  <Play className="w-3.5 h-3.5" /> Publiceer Live
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
