"use client";

import { useState, useEffect } from 'react';
import { ShoppingCart, Send, Loader2, Search, ArrowRight, CheckCircle2, TrendingUp, AlertTriangle } from 'lucide-react';

export default function EcommerceAgentPage() {
  const [prompt, setPrompt] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<any>(null);
  
  const [stores, setStores] = useState<any[]>([]);
  const [selectedStore, setSelectedStore] = useState("");
  
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch available stores on mount
  useEffect(() => {
    async function fetchStores() {
      try {
        const res = await fetch('/api/ecommerce/stores'); // Re-using an existing or standard endpoint?
        // Let's assume we need to fetch from a generic system endpoint or we can add a specific one later.
        // For now, let's fetch it from a dedicated endpoint we'll create or just use the agent's context.
        // Actually, we don't have an endpoint for this yet in the frontend. We will fetch it from /api/ecommerce/stores 
        const storesData = await res.json();
        if (storesData && storesData.stores) {
          setStores(storesData.stores);
          if (storesData.stores.length > 0) {
            setSelectedStore(storesData.stores[0].id);
          }
        }
      } catch (err) {
        console.error("Failed to load stores");
      }
    }
    fetchStores();
  }, []);

  const handleResearch = async () => {
    if (!prompt.trim()) return;
    setIsSearching(true);
    setError(null);
    setResult(null);
    setPublishSuccess(false);

    try {
      const res = await fetch('/api/agents/ecommerce/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Fout bij het zoeken");
      
      setResult(data.data.product);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSearching(false);
    }
  };

  const handlePublish = async () => {
    if (!selectedStore) {
      setError("Selecteer eerst een Shopify winkel");
      return;
    }

    setIsPublishing(true);
    setError(null);

    try {
      const res = await fetch('/api/agents/ecommerce/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storeId: selectedStore,
          title: result.title,
          description: result.description,
          price: result.recommendedPrice,
          margin: result.estimatedMargin
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Fout bij het publiceren");
      
      setPublishSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="p-6 lg:p-10 space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black uppercase tracking-widest text-white flex items-center gap-3">
          <ShoppingCart className="w-8 h-8 text-cyan-500" />
          E-Commerce AI Agent
        </h1>
        <p className="text-zinc-400 font-mono text-sm">Automated Dropshipping & Shopify Product Sourcing.</p>
      </div>

      {/* Input Section */}
      <div className="border border-white/10 bg-black/40 p-6 rounded-xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="relative z-10 space-y-4">
          <label className="text-sm font-bold uppercase tracking-widest text-zinc-400">
            Wat voor product wil je verkopen?
          </label>
          <div className="flex gap-4">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Bijv: 'Een winnend product voor hondenbezitters' of 'Fitness apparatuur'"
              className="flex-1 bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 font-mono text-sm"
              onKeyDown={(e) => e.key === 'Enter' && handleResearch()}
            />
            <button 
              onClick={handleResearch}
              disabled={isSearching || !prompt.trim()}
              className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-black uppercase tracking-widest text-sm rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              Research
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* Results Section */}
      {result && (
        <div className="border border-cyan-500/30 bg-black/40 rounded-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4">
          <div className="p-6 border-b border-white/10 bg-gradient-to-r from-cyan-500/10 to-transparent">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold px-2 py-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded uppercase tracking-widest">
                    Winning Product
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-white">{result.title}</h2>
              </div>
              <div className="text-right">
                <p className="text-sm text-zinc-500 font-mono uppercase">Adviesprijs</p>
                <p className="text-3xl font-bold text-green-400">€{result.recommendedPrice.toFixed(2)}</p>
              </div>
            </div>
          </div>
          
          <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Product Beschrijving (Shopify HTML)</h3>
                <div className="bg-white/5 border border-white/10 rounded-lg p-4 font-mono text-sm text-zinc-300 max-h-64 overflow-y-auto"
                     dangerouslySetInnerHTML={{ __html: result.description }} />
              </div>
              <div>
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Doelgroep</h3>
                <p className="text-sm text-white bg-black border border-white/10 p-3 rounded">{result.targetAudience}</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-black border border-white/10 rounded-lg p-4 space-y-4">
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" /> Marges & Kosten
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Inkoop:</span>
                    <span className="text-white font-mono">€{result.supplierCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Verkoop:</span>
                    <span className="text-white font-mono">€{result.recommendedPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm pt-2 border-t border-white/10">
                    <span className="text-cyan-400 font-bold">Winstmarge:</span>
                    <span className="text-cyan-400 font-bold font-mono">{result.estimatedMargin}%</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-4">
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Publish to Shopify</h3>
                {stores.length > 0 ? (
                  <select 
                    className="w-full bg-black border border-white/10 rounded px-3 py-2 text-white font-mono text-sm focus:border-cyan-500 focus:outline-none"
                    value={selectedStore}
                    onChange={(e) => setSelectedStore(e.target.value)}
                  >
                    {stores.map(s => (
                      <option key={s.id} value={s.id}>{s.shopUrl}</option>
                    ))}
                  </select>
                ) : (
                  <p className="text-xs text-red-400">Geen Shopify winkels gekoppeld.</p>
                )}

                <button
                  onClick={handlePublish}
                  disabled={isPublishing || stores.length === 0 || publishSuccess}
                  className={`w-full py-3 rounded font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 transition-all ${
                    publishSuccess 
                      ? 'bg-green-500 text-black'
                      : 'bg-white text-black hover:bg-zinc-200'
                  } disabled:opacity-50`}
                >
                  {isPublishing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : publishSuccess ? (
                    <><CheckCircle2 className="w-4 h-4" /> Gepubliceerd</>
                  ) : (
                    <><Send className="w-4 h-4" /> Push naar live store</>
                  )}
                </button>
                {publishSuccess && (
                  <p className="text-xs text-center text-green-400 mt-2">
                    Product is als DRAFT naar Shopify gestuurd!
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
