import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { ShoppingBag, Star, ShieldCheck, Zap, ArrowRight, Menu } from 'lucide-react';

interface SitePageProps {
  params: {
    domain: string;
  };
}

export default async function SitePage({ params }: SitePageProps) {
  const decodedDomain = decodeURIComponent(params.domain);
  const domain = decodedDomain.split(':')[0];

  const site = await db.shopifyStore.findFirst({
    where: {
      shopUrl: domain,
    },
  });

  if (!site) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
        <Zap className="w-16 h-16 text-red-500 mb-6 animate-pulse" />
        <h1 className="text-3xl font-bold uppercase tracking-widest mb-2">Domein Niet Gekoppeld</h1>
        <p className="text-zinc-400 font-mono text-center max-w-md">
          Het domein <span className="text-white font-bold">{domain}</span> is nog niet toegewezen aan een actieve Omega Webshop in het God Mode netwerk.
        </p>
      </div>
    );
  }

  // --- MOCKED PREMIUM PRODUCTS (Will be replaced by Shopify API in Phase 1.5) ---
  const products = [
    {
      id: 1,
      name: "TITANIUM SMART RING",
      price: 249.99,
      image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      badge: "BESTSELLER",
    },
    {
      id: 2,
      name: "NEURAL NOISE CANCELLING PODS",
      price: 189.00,
      image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 3,
      name: "OBSIDIAN MECHANICAL WATCH",
      price: 899.00,
      image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      badge: "LIMITED EDITION",
    },
    {
      id: 4,
      name: "CYBER-DESK MAT 2.0",
      price: 49.99,
      image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-gold selection:text-black">
      
      {/* 1. ANNOUNCEMENT BAR */}
      <div className="w-full bg-gold text-black text-center py-2 text-xs font-black uppercase tracking-[0.2em] animate-pulse">
        Gratis wereldwijde verzending op alle orders boven €100
      </div>

      {/* 2. GLASSMORPHISM NAVIGATION */}
      <nav className="sticky top-0 z-50 w-full backdrop-blur-xl bg-black/50 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Menu className="w-6 h-6 text-white cursor-pointer md:hidden" />
            <h1 className="text-xl md:text-3xl font-black tracking-tighter uppercase">{site.shopUrl}</h1>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-bold tracking-widest text-zinc-400 uppercase">
            <a href="#" className="hover:text-white transition-colors">Collectie</a>
            <a href="#" className="hover:text-white transition-colors">Over Ons</a>
            <a href="#" className="hover:text-white transition-colors">Support</a>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative group">
              <ShoppingBag className="w-6 h-6 text-white group-hover:text-gold transition-colors" />
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">0</span>
            </button>
          </div>
        </div>
      </nav>

      <main>
        {/* 3. HERO SECTION (Cinematic) */}
        <section className="relative w-full h-[80vh] flex items-center justify-center overflow-hidden">
          {/* Background Video/Image Mock */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-black/50 to-transparent z-10"></div>
          <img 
            src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
            alt="Hero Background" 
            className="absolute inset-0 w-full h-full object-cover opacity-60 scale-105"
          />
          
          <div className="relative z-20 text-center px-4 max-w-4xl mx-auto mt-20">
            <span className="text-gold uppercase tracking-[0.3em] text-sm font-bold mb-4 block">De Nieuwe Standaard</span>
            <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-6">
              Domineer Je <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-500 to-white">Levensstijl</span>
            </h2>
            <p className="text-xl text-zinc-400 mb-8 max-w-2xl mx-auto">{site.shopUrl} - High-End E-Commerce</p>
            <button className="bg-white text-black px-12 py-5 rounded-none font-black uppercase tracking-widest hover:bg-gold hover:text-black transition-all flex items-center gap-3 mx-auto">
              Ontdek Collectie <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </section>

        {/* 4. SOCIAL PROOF BANNER */}
        <div className="w-full bg-[#0a0a0a] border-y border-white/5 py-8 overflow-hidden flex whitespace-nowrap">
          <div className="flex animate-marquee gap-16 items-center text-zinc-500 font-black uppercase tracking-[0.2em]">
            <span className="flex items-center gap-2"><ShieldCheck className="text-gold w-5 h-5"/> 10.000+ Tevreden Klanten</span>
            <span className="flex items-center gap-2"><Star className="text-gold w-5 h-5"/> 4.9/5 Trustpilot Rating</span>
            <span className="flex items-center gap-2"><Zap className="text-gold w-5 h-5"/> Vandaag Besteld = Morgen In Huis</span>
            <span className="flex items-center gap-2"><ShieldCheck className="text-gold w-5 h-5"/> 10.000+ Tevreden Klanten</span>
            <span className="flex items-center gap-2"><Star className="text-gold w-5 h-5"/> 4.9/5 Trustpilot Rating</span>
          </div>
        </div>

        {/* 5. PRODUCT GRID (Premium Layout) */}
        <section className="py-32 px-6 max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-16">
            <div>
              <h3 className="text-4xl font-black uppercase tracking-tighter">Onze Bestsellers</h3>
              <p className="text-zinc-500 mt-2">Geëngineerd voor de elite.</p>
            </div>
            <button className="text-sm font-bold uppercase tracking-widest text-gold hover:text-white transition-colors">
              Bekijk Alles →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <div key={product.id} className="group cursor-pointer">
                <div className="relative aspect-[4/5] bg-[#111] overflow-hidden rounded-sm mb-4">
                  {product.badge && (
                    <div className="absolute top-4 left-4 z-10 bg-white text-black text-[10px] font-black uppercase tracking-widest px-3 py-1">
                      {product.badge}
                    </div>
                  )}
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 ease-out"
                  />
                  
                  {/* Hover Add to Cart Button */}
                  <div className="absolute bottom-0 left-0 w-full p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <button className="w-full bg-white text-black py-4 font-black uppercase tracking-widest text-xs hover:bg-gold transition-colors">
                      In Winkelwagen
                    </button>
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-sm tracking-widest uppercase mb-1">{product.name}</h4>
                  <p className="text-gold font-mono">€{product.price.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 6. BRAND STORY / IMAGE TEXT */}
        <section className="border-t border-white/5 grid grid-cols-1 md:grid-cols-2">
          <div className="p-16 md:p-32 flex flex-col justify-center bg-[#0a0a0a]">
            <h3 className="text-4xl font-black uppercase tracking-tighter mb-6">Ontworpen voor de top 1%.</h3>
            <p className="text-zinc-400 leading-relaxed mb-8">
              Wij geloven niet in compromissen. Elk product in onze collectie is grondig getest en gebouwd om te presteren onder de zwaarste omstandigheden. Geen excuses. Alleen resultaten.
            </p>
            <button className="w-fit border-b-2 border-gold pb-1 font-bold uppercase tracking-widest text-sm hover:text-gold transition-colors">
              Lees Ons Verhaal
            </button>
          </div>
          <div className="h-[500px] md:h-auto bg-[#111]">
            <img 
              src="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
              alt="Brand Story" 
              className="w-full h-full object-cover opacity-70 grayscale"
            />
          </div>
        </section>
      </main>

      {/* 7. FOOTER */}
      <footer className="bg-black border-t border-white/10 py-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <h1 className="text-3xl font-black tracking-tighter uppercase mb-6">{site.shopUrl}</h1>
            <p className="text-zinc-500 max-w-sm">
              Premium uitrusting. Gebouwd voor dominantie. Wereldwijde verzending.
            </p>
          </div>
          <div>
            <h4 className="font-bold uppercase tracking-widest mb-6 text-sm text-zinc-300">Klantenservice</h4>
            <ul className="space-y-4 text-sm text-zinc-500">
              <li><a href="#" className="hover:text-white transition-colors">Verzending & Retour</a></li>
              <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold uppercase tracking-widest mb-6 text-sm text-zinc-300">Juridisch</h4>
            <ul className="space-y-4 text-sm text-zinc-500">
              <li><a href="#" className="hover:text-white transition-colors">Privacybeleid</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Algemene Voorwaarden</a></li>
            </ul>
          </div>
        </div>
      </footer>

    </div>
  );
}
