"use client";

import { useState, useEffect } from "react";
import { createDigitalProduct, getDigitalProducts, buyDigitalProduct } from "@/app/actions/store";

export default function StorePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [fileUrl, setFileUrl] = useState("");

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    setFetching(true);
    const res = await getDigitalProducts();
    if (res.success && res.products) {
      setProducts(res.products);
    }
    setFetching(false);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await createDigitalProduct({
      title,
      description,
      price: parseFloat(price) || 0,
      fileUrl,
    });
    setLoading(false);
    if (res.success) {
      setTitle("");
      setDescription("");
      setPrice("");
      setFileUrl("");
      loadProducts();
      alert("Product succesvol toegevoegd!");
    } else {
      alert("Fout bij aanmaken: " + res.error);
    }
  }

  async function handleSimulatePurchase(productId: string) {
    const buyerEmail = prompt("Voer test e-mailadres in van de koper:");
    if (!buyerEmail) return;

    const res = await buyDigitalProduct(productId, buyerEmail);
    if (res.success) {
      alert("Test aankoop geslaagd! De koper heeft toegang gekregen.");
    } else {
      alert("Test aankoop gefaald: " + res.error);
    }
  }

  return (
    <div className="space-y-8 p-8 max-w-7xl mx-auto min-h-screen text-white bg-black">
      <div>
        <h1 className="text-4xl font-black uppercase tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 drop-shadow-[0_0_15px_rgba(0,240,255,0.5)]">Digitaal Producten Winkel</h1>
        <p className="text-zinc-400 mt-2 text-lg font-light">
          Verkoop prompts, Notion templates, e-books of software en lever ze direct af na betaling.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-black/40 p-6 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none transition-colors"></div>
          
          <h2 className="text-xl font-black uppercase tracking-widest text-white mb-6 relative z-10">Nieuw Product Toevoegen</h2>
          <form onSubmit={handleCreate} className="space-y-4 relative z-10">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-500 mb-1.5">Titel</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-zinc-900/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all"
                placeholder="bijv. De Ultieme AI Prompts (PDF)"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-500 mb-1.5">Omschrijving</label>
              <textarea
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-zinc-900/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all resize-none custom-scrollbar"
                rows={3}
                placeholder="Beschrijf je product..."
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-500 mb-1.5">Prijs (€)</label>
              <input
                type="number"
                step="0.01"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-zinc-900/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all font-mono uppercase tracking-wider font-bold"
                placeholder="19.95"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-500 mb-1.5">Bestand URL (Wordt pas gedeeld na aankoop)</label>
              <input
                type="url"
                required
                value={fileUrl}
                onChange={(e) => setFileUrl(e.target.value)}
                className="w-full bg-zinc-900/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all font-mono text-sm"
                placeholder="https://jouw-bucket.s3.amazonaws.com/product.pdf"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-cyan-600 hover:bg-cyan-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-black font-black uppercase tracking-widest text-xs py-4 px-4 rounded-xl transition-all flex items-center justify-center mt-6 shadow-[0_0_20px_rgba(0,240,255,0.4)] disabled:shadow-none border border-transparent disabled:border-white/10"
            >
              {loading ? "Product Opslaan..." : "Maak Product Aan"}
            </button>
          </form>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/40 p-6 shadow-sm">
          <h2 className="text-xl font-black uppercase tracking-widest text-white mb-6">Jouw Assortiment</h2>
          {fetching ? (
            <p className="text-sm font-mono uppercase tracking-widest text-zinc-500 animate-pulse">Producten laden...</p>
          ) : products.length === 0 ? (
            <p className="text-sm font-mono uppercase tracking-widest text-zinc-500 text-center py-10 border-2 border-dashed border-white/10 rounded-xl">Je hebt nog geen producten toegevoegd.</p>
          ) : (
            <ul className="space-y-4">
              {products.map((p) => (
                <li key={p.id} className="rounded-2xl border border-white/10 p-5 bg-zinc-900/50 hover:border-cyan-500/30 transition-all group backdrop-blur-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold uppercase tracking-wider text-lg">{p.title}</h3>
                      <p className="text-sm text-zinc-500 line-clamp-2 mt-1">{p.description}</p>
                      <p className="mt-3 font-bold font-mono text-cyan-400 drop-shadow-[0_0_5px_rgba(0,240,255,0.5)]">€{p.price.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <p className="text-xs text-zinc-600 mb-3 font-mono break-all">{p.fileUrl}</p>
                    <button
                      onClick={() => handleSimulatePurchase(p.id)}
                      className="text-xs px-4 py-2 bg-purple-500/10 text-purple-400 rounded-lg hover:bg-purple-500/20 border border-purple-500/20 transition-colors uppercase tracking-widest font-bold w-full"
                    >
                      Simuleer Aankoop (Test)
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
