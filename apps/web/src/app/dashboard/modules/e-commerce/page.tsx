import { ShoppingCart, LayoutTemplate, PlusCircle, ExternalLink, RefreshCw } from 'lucide-react';
import { getProducts } from '@/lib/shopify';
import Link from 'next/link';

export default async function ECommerceDashboard() {
  const products = await getProducts();

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto">
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-widest flex items-center gap-3">
            <ShoppingCart className="w-8 h-8 text-rose-500" />
            E-Commerce Command Center
          </h1>
          <p className="text-zinc-400 mt-2 font-mono text-sm">
            Shopify Headless Integratie. Genereer bliksemsnelle funnels en landingspagina's voor je producten.
          </p>
        </div>
        <div className="flex gap-4">
           <button className="bg-black border border-zinc-800 text-zinc-400 hover:text-white px-4 py-2 rounded-lg font-mono text-xs uppercase flex items-center gap-2 transition-colors">
              <RefreshCw className="w-4 h-4" /> Sync Shopify
           </button>
           <button className="bg-rose-600 hover:bg-rose-500 text-white font-bold uppercase tracking-wider px-6 py-2 rounded-lg flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(225,29,72,0.3)]">
             <PlusCircle className="w-4 h-4" /> Nieuw Product
           </button>
        </div>
      </div>

      {!process.env.SHOPIFY_STORE_DOMAIN || !process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN ? (
        <div className="bg-rose-950/20 border border-rose-500/30 rounded-2xl p-10 text-center flex flex-col items-center justify-center">
          <ShoppingCart className="w-16 h-16 text-rose-500/50 mb-4" />
          <h2 className="text-xl font-bold text-white mb-2 uppercase tracking-widest">Koppel je Shopify Store</h2>
          <p className="text-zinc-400 max-w-lg mb-6">
            Sovereign OS e-commerce werkt via de Shopify Storefront API. Je moet je Store Domain en Access Token instellen in de Environment Variables (Vercel) om je live producten in te laden.
          </p>
          <div className="bg-black/50 border border-white/10 rounded-lg p-4 font-mono text-xs text-zinc-500 text-left w-full max-w-md">
            <p>SHOPIFY_STORE_DOMAIN="jouw-winkel.myshopify.com"</p>
            <p className="mt-2">SHOPIFY_STOREFRONT_ACCESS_TOKEN="xxxxxxxxxxxxxx"</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.length === 0 ? (
            <div className="col-span-full py-12 text-center text-zinc-500 border border-dashed border-white/10 rounded-2xl">
              Geen producten gevonden in Shopify, of check je API sleutels.
            </div>
          ) : (
            products.map((product: any) => {
              const image = product.images.edges[0]?.node?.url;
              const price = product.priceRange.minVariantPrice.amount;
              const currency = product.priceRange.minVariantPrice.currencyCode;

              return (
                <div key={product.id} className="bg-black/40 border border-white/10 rounded-xl overflow-hidden hover:border-rose-500/30 transition-all group">
                  <div className="h-48 bg-zinc-900 relative overflow-hidden flex items-center justify-center border-b border-white/5">
                    {image ? (
                      <img src={image} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <ShoppingCart className="w-10 h-10 text-zinc-700" />
                    )}
                    <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-white font-mono text-xs font-bold">
                      {currency} {parseFloat(price).toFixed(2)}
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-white font-bold text-lg mb-1 truncate">{product.title}</h3>
                    <p className="text-zinc-500 text-xs line-clamp-2 mb-4">{product.description}</p>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <Link 
                        href={`/dashboard/modules/funnel-builder?product=${product.handle}`}
                        className="bg-black border border-white/10 hover:border-rose-500/50 text-white text-xs font-bold uppercase tracking-wider py-2.5 rounded-lg flex justify-center items-center gap-2 transition-colors"
                      >
                        <LayoutTemplate className="w-4 h-4 text-rose-500" />
                        AI Funnel
                      </Link>
                      <button className="bg-zinc-900 border border-white/5 text-zinc-400 hover:text-white text-xs font-bold uppercase tracking-wider py-2.5 rounded-lg flex justify-center items-center gap-2 transition-colors">
                        <ExternalLink className="w-4 h-4" />
                        Beheer
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
