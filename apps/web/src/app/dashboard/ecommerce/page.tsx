import { prisma } from '@rebuildyourlife/database';
import { ShoppingCart, Package, ExternalLink, Activity } from 'lucide-react';
// I'll just fetch all `ShopifyStore` and `ShopifyProduct` records, as it's an admin dashboard.

export default async function EcommercePage() {
  const stores = await prisma.shopifyStore.findMany({
    include: {
      products: true
    }
  });

  const courses = await prisma.course.findMany({
    orderBy: { order: 'asc' }
  });

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto pb-20 font-sans h-full px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Widget */}
      <div className="relative overflow-hidden rounded-[2rem] border border-emerald-500/20 glass-cyber p-8 md:p-12 group">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-500/10 transition-colors duration-1000"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-flex items-center justify-center bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-widest rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)]">
                <ShoppingCart className="w-3 h-3 mr-2" />
                E-Commerce
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase leading-[0.9]">
              Store <span className="text-emerald-400 drop-shadow-[0_0_15px_rgba(16,185,129,0.8)]">Command</span>
            </h1>
            <p className="mt-4 text-lg text-zinc-400 max-w-2xl font-light">
              Beheer je gekoppelde Shopify winkels, fysieke producten en digitale aanbiedingen (LIVE DATA).
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {stores.length === 0 ? (
          <div className="border border-white/10 bg-black/40 p-8 rounded-xl text-center">
            <ShoppingCart className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white uppercase tracking-widest">Geen winkels gevonden</h3>
            <p className="text-zinc-500 mt-2">Koppel je eerste Shopify winkel via Instellingen.</p>
          </div>
        ) : (
          stores.map(store => (
            <div key={store.id} className="border border-white/10 bg-black/40 rounded-xl overflow-hidden">
              <div className="p-6 border-b border-white/10 bg-white/5 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">{store.shopUrl}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <div className={`w-2 h-2 rounded-full ${store.status === 'ACTIVE' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                    <span className="text-xs font-mono text-zinc-400 uppercase">{store.status}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-mono text-zinc-500 uppercase">Totale Omzet</p>
                  <p className="text-2xl font-bold text-green-400">€{store.totalRevenue.toFixed(2)}</p>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400 mb-4 flex items-center gap-2">
                  <Package className="w-4 h-4" /> Producten ({store.products.length})
                </h3>
                
                {store.products.length === 0 ? (
                  <p className="text-sm text-zinc-600">Geen producten gesynchroniseerd.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {store.products.map(product => (
                      <div key={product.id} className="border border-white/10 p-4 rounded-lg bg-black hover:border-cyan-500/50 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-zinc-200 truncate pr-2">{product.title}</h4>
                          <span className={`text-[10px] px-2 py-1 rounded-full uppercase font-mono ${product.status === 'ACTIVE' ? 'bg-green-500/10 text-green-400' : 'bg-zinc-800 text-zinc-400'}`}>
                            {product.status}
                          </span>
                        </div>
                        <div className="flex justify-between items-center mt-4">
                          <span className="text-lg font-bold text-white">€{product.price.toFixed(2)}</span>
                          <span className="text-xs font-mono text-cyan-400 flex items-center gap-1">
                            Marge: {product.margin ? `${product.margin}%` : 'Onbekend'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Digital Products Section */}
      <div className="border border-white/10 bg-black/40 p-6 rounded-xl mt-8">
        <h3 className="text-xl font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
          <Activity className="w-6 h-6 text-fuchsia-500" /> Digital Product Store (Courses/E-books)
        </h3>
        
        {courses.length === 0 ? (
           <p className="text-zinc-500 text-sm">Geen digitale producten of courses gevonden.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map(course => (
              <div key={course.id} className="border border-white/10 rounded-xl bg-black overflow-hidden hover:border-fuchsia-500/50 transition-all flex flex-col h-full">
                {course.thumbnail ? (
                  <div className="h-32 bg-zinc-900 overflow-hidden">
                    <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="h-32 bg-zinc-900 border-b border-white/10 flex items-center justify-center">
                    <Package className="w-10 h-10 text-zinc-700" />
                  </div>
                )}
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-white leading-tight">{course.title}</h4>
                    <span className="text-[10px] px-2 py-1 rounded-full uppercase font-mono bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20">
                      {course.tierAccess}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 line-clamp-3 mb-4">{course.description}</p>
                  
                  <div className="mt-auto pt-4 border-t border-white/5 flex gap-2">
                    <a href={`/dashboard/academy/${course.id}`} className="flex-1 text-center py-2 bg-white/5 hover:bg-white/10 text-white text-xs font-bold uppercase tracking-widest rounded transition-colors">
                      Bekijk
                    </a>
                    <button className="flex-1 py-2 bg-fuchsia-600/20 hover:bg-fuchsia-600 text-fuchsia-400 hover:text-white border border-fuchsia-500/30 text-xs font-bold uppercase tracking-widest rounded transition-colors">
                      Promo Link
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
