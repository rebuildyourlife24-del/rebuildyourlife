"use client";

import { useState } from "react";
import { saveShopifyCredentials } from "@/actions/integrations";

export default function IntegrationsPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setSuccess("");
    setError("");

    const result = await saveShopifyCredentials(formData);

    if (result.error) {
      setError(result.error);
    } else if (result.success) {
      setSuccess(result.success);
    }

    setLoading(false);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white">Integraties</h2>
        <p className="text-muted-foreground">Beheer de verbindingen tussen de Godbrain en externe platformen.</p>
      </div>

      <div className="grid gap-6">
        {/* Shopify Integration Card */}
        <div className="rounded-xl border border-white/10 bg-black/50 p-6 backdrop-blur-md">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#96bf48]/20">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6 text-[#96bf48]">
                <path d="M4 7l16 0" />
                <path d="M10 11l0 6" />
                <path d="M14 11l0 6" />
                <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-medium text-white">Shopify API Koppeling</h3>
              <p className="text-sm text-white/60">Koppel je webshop via een Aangepaste App (Custom App) token.</p>
            </div>
          </div>

          <form action={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="shopUrl" className="text-sm font-medium text-white/80">
                Winkel URL
              </label>
              <input
                id="shopUrl"
                name="shopUrl"
                type="text"
                placeholder="bijv. jouw-winkel.myshopify.com"
                required
                className="flex h-10 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#96bf48]"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="accessToken" className="text-sm font-medium text-white/80">
                Admin API Access Token
              </label>
              <input
                id="accessToken"
                name="accessToken"
                type="password"
                placeholder="shpat_..."
                required
                className="flex h-10 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#96bf48]"
              />
              <p className="text-xs text-white/50">
                Maak een app in je winkel via Instellingen &rarr; Apps &rarr; Ontwikkeling van aangepaste apps. Geef Orders en Producten rechten.
              </p>
            </div>

            {error && (
              <div className="rounded-md bg-red-500/10 p-3 text-sm text-red-400 border border-red-500/20">
                {error}
              </div>
            )}

            {success && (
              <div className="rounded-md bg-green-500/10 p-3 text-sm text-green-400 border border-green-500/20">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex h-10 w-full items-center justify-center rounded-md bg-[#96bf48] px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-[#85a940] focus:outline-none disabled:opacity-50"
            >
              {loading ? "Bezig met verifiëren..." : "Koppel Winkel"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
