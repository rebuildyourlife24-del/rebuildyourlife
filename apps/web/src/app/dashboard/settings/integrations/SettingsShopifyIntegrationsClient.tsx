'use client';

import { useState } from 'react';
import { Store, CheckCircle, Loader2 } from 'lucide-react';

export function SettingsShopifyIntegrationsClient({
  existingStores
}: {
  existingStores: { id: string; shopUrl: string; status: string }[];
}) {
  const [shopUrl, setShopUrl] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isConnected = existingStores.length > 0;

  const handleConnect = async () => {
    if (!shopUrl || !accessToken) {
      setError("Vul beide velden in");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/ecommerce/stores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shopUrl, accessToken }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Er ging iets mis');

      window.location.reload();
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-black/50 border border-white/10 rounded-xl p-6 backdrop-blur-md">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-white flex items-center gap-2">
            <Store className="w-5 h-5 text-cyan-400" />
            Shopify Integratie
          </h3>
          <p className="text-sm text-gray-400 mt-1">
            Koppel je Shopify winkel zodat de E-Commerce Agent direct producten kan publiceren.
          </p>
        </div>
        {isConnected && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
            <CheckCircle className="w-3.5 h-3.5" />
            Gekoppeld ({existingStores.length})
          </span>
        )}
      </div>

      <div className="space-y-4">
        {existingStores.map((store) => (
          <div key={store.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
            <span className="text-sm font-medium text-white">{store.shopUrl}</span>
            <span className="text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded">{store.status}</span>
          </div>
        ))}

        <div className="pt-4 border-t border-white/10 space-y-4">
          <p className="text-sm text-gray-300 font-medium">Nieuwe winkel toevoegen</p>
          
          {error && <p className="text-sm text-red-400">{error}</p>}
          
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Shopify Domein (bijv: jouw-winkel.myshopify.com)</label>
              <input
                type="text"
                value={shopUrl}
                onChange={(e) => setShopUrl(e.target.value)}
                placeholder="winkelnaam.myshopify.com"
                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Admin API Access Token (shpat_...)</label>
              <input
                type="password"
                value={accessToken}
                onChange={(e) => setAccessToken(e.target.value)}
                placeholder="shpat_xxxxxxxxxxxxxxxxx"
                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <button
            onClick={handleConnect}
            disabled={isLoading || !shopUrl || !accessToken}
            className="w-full mt-2 bg-white text-black hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium px-4 py-2 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {isLoading ? 'Verbinden...' : 'Winkel Koppelen'}
          </button>
        </div>
      </div>
    </div>
  );
}
