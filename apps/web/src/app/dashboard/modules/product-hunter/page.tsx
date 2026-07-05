'use client';

import { useState } from 'react';
import { Target, Search, ArrowRight, CheckCircle2, AlertCircle, ShoppingCart } from 'lucide-react';
import { huntProductFromUrl, injectProductToShopify } from '@/actions/ai-hunter';

export default function AIProductHunter() {
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState<'idle' | 'hunting' | 'found' | 'injecting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [scrapedProduct, setScrapedProduct] = useState<any>(null);

  const handleHunt = async () => {
    if (!url) return;
    setStatus('hunting');
    setErrorMsg('');
    setScrapedProduct(null);

    const res = await huntProductFromUrl(url);
    
    if (res.success && res.product) {
      setScrapedProduct(res.product);
      setStatus('found');
    } else {
      setErrorMsg(res.error || 'Er ging iets mis tijdens de hunt.');
      setStatus('error');
    }
  };

  const handleInject = async () => {
    if (!scrapedProduct) return;
    setStatus('injecting');
    
    const res = await injectProductToShopify(scrapedProduct);
    if (res.success) {
      setStatus('success');
    } else {
      setErrorMsg(res.error || 'Kon niet injecteren naar Shopify.');
      setStatus('error');
    }
  };

  return (
    <div className="p-6 lg:p-10 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white uppercase tracking-widest flex items-center gap-3">
          <Target className="w-8 h-8 text-rose-500" />
          AI Product Hunter
        </h1>
        <p className="text-zinc-400 mt-2 font-mono text-sm">
          Scrape elke e-commerce concurrent of dropship URL. Sovereign AI haalt het winnende product eruit, schrijft copy, en injecteert het direct in jouw Shopify.
        </p>
      </div>

      <div className="bg-black/40 border border-white/10 rounded-2xl p-6 lg:p-8 mb-8">
        <label className="block text-zinc-400 font-mono text-xs uppercase tracking-wider mb-3">
          Target URL (Concurrent, AliExpress, Amazon)
        </label>
        <div className="flex gap-4">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://competitor.com/products/winning-item"
            className="flex-1 bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rose-500 transition-colors"
          />
          <button
            onClick={handleHunt}
            disabled={status === 'hunting' || !url}
            className="bg-rose-600 hover:bg-rose-500 disabled:opacity-50 disabled:hover:bg-rose-600 text-white font-bold uppercase tracking-wider px-8 rounded-xl flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(225,29,72,0.3)]"
          >
            {status === 'hunting' ? (
              <span className="animate-pulse flex items-center gap-2"><Search className="w-4 h-4 animate-spin" /> Hunting...</span>
            ) : (
              <><Target className="w-4 h-4" /> Hunt Product</>
            )}
          </button>
        </div>
      </div>

      {status === 'error' && (
        <div className="bg-red-950/30 border border-red-500/50 rounded-xl p-4 flex items-center gap-3 text-red-400 font-mono text-sm mb-8">
          <AlertCircle className="w-5 h-5" />
          {errorMsg}
        </div>
      )}

      {scrapedProduct && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-zinc-950 border-b border-zinc-800 p-4 flex justify-between items-center">
            <h2 className="text-white font-bold uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              Target Acquired
            </h2>
            <div className="flex gap-2">
              {scrapedProduct.tags?.split(',').map((tag: string, i: number) => (
                <span key={i} className="bg-black border border-white/5 text-zinc-400 px-2 py-1 rounded text-xs font-mono">{tag.trim()}</span>
              ))}
            </div>
          </div>
          
          <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 border border-dashed border-white/10 rounded-xl bg-black/50 aspect-square flex items-center justify-center p-2">
              {scrapedProduct.imageUrl ? (
                <img src={scrapedProduct.imageUrl} alt={scrapedProduct.title} className="w-full h-full object-contain rounded-lg" />
              ) : (
                <span className="text-zinc-600 font-mono text-xs">Geen afbeelding</span>
              )}
            </div>
            
            <div className="lg:col-span-2 flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">{scrapedProduct.title}</h3>
                <p className="text-rose-500 font-mono text-xl mb-4 font-bold">€ {scrapedProduct.price}</p>
                <div 
                  className="prose prose-invert prose-sm text-zinc-400 max-w-none mb-6"
                  dangerouslySetInnerHTML={{ __html: scrapedProduct.body_html }}
                />
              </div>
              
              <div className="flex justify-end pt-4 border-t border-white/5">
                <button
                  onClick={handleInject}
                  disabled={status === 'injecting' || status === 'success'}
                  className="bg-white text-black hover:bg-zinc-200 disabled:opacity-50 font-bold uppercase tracking-wider px-6 py-3 rounded-xl flex items-center gap-2 transition-all"
                >
                  {status === 'injecting' ? (
                    <span className="flex items-center gap-2 animate-pulse"><ShoppingCart className="w-4 h-4" /> Injecting...</span>
                  ) : status === 'success' ? (
                    <span className="flex items-center gap-2 text-green-600"><CheckCircle2 className="w-4 h-4" /> Injected & Live</span>
                  ) : (
                    <><ArrowRight className="w-4 h-4" /> Inject into Shopify</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
