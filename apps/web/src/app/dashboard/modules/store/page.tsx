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

  const userId = "temp-user-id"; // TODO: Replace with auth hook

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    setFetching(true);
    const res = await getDigitalProducts(userId);
    if (res.success && res.products) {
      setProducts(res.products);
    }
    setFetching(false);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await createDigitalProduct({
      userId,
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
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Digitaal Producten Winkel</h1>
        <p className="text-muted-foreground">
          Verkoop prompts, Notion templates, e-books of software en lever ze direct af na betaling.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Nieuw Product Toevoegen</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Titel</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full mt-1 rounded-md border p-2"
                placeholder="bijv. De Ultieme AI Prompts (PDF)"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Omschrijving</label>
              <textarea
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full mt-1 rounded-md border p-2"
                rows={3}
                placeholder="Beschrijf je product..."
              />
            </div>
            <div>
              <label className="text-sm font-medium">Prijs (€)</label>
              <input
                type="number"
                step="0.01"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full mt-1 rounded-md border p-2"
                placeholder="19.95"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Bestand URL (Wordt pas gedeeld na aankoop)</label>
              <input
                type="url"
                required
                value={fileUrl}
                onChange={(e) => setFileUrl(e.target.value)}
                className="w-full mt-1 rounded-md border p-2"
                placeholder="https://jouw-bucket.s3.amazonaws.com/product.pdf"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Product Opslaan..." : "Maak Product Aan"}
            </button>
          </form>
        </div>

        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Jouw Assortiment</h2>
          {fetching ? (
            <p className="text-sm text-gray-500">Producten laden...</p>
          ) : products.length === 0 ? (
            <p className="text-sm text-gray-500">Je hebt nog geen producten toegevoegd.</p>
          ) : (
            <ul className="space-y-4">
              {products.map((p) => (
                <li key={p.id} className="rounded-lg border p-4 bg-gray-50/50">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-lg">{p.title}</h3>
                      <p className="text-sm text-gray-500 line-clamp-2">{p.description}</p>
                      <p className="mt-2 font-bold text-blue-600">€{p.price.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-400 mb-2 font-mono break-all">{p.fileUrl}</p>
                    <button
                      onClick={() => handleSimulatePurchase(p.id)}
                      className="text-sm px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                    >
                      Simuleer Aankoop (Test Checkout)
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
