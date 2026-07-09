import { globalToolRegistry } from '../registry';

// Verplaats de Firecrawl webzoeker vanuit de Agent code naar de officiële Capability Registry
export const firecrawlSearchTool = {
  name: 'web_search',
  description: 'Voert een Firecrawl webzoekopdracht uit en retourneert geëxtraheerde markdown.',
  // AI Agent moet 'AGENT' of hoger zijn om het web te benaderen
  requiredRole: 'AGENT',
  execute: async (query: string): Promise<string> => {
    const apiKey = process.env.FIRECRAWL_API_KEY;
    if (!apiKey) {
      console.log("[Capability: web_search] Geen API key gevonden. Simulatiemodus gestart.");
      return JSON.stringify([
        { url: "https://example.com/b2b-coupon-stats", title: "B2B Coupon Conversion Benchmarks", description: "B2B platforms implementing dynamic checkout coupon models see a 23% average increase in customer checkout success." }
      ]);
    }

    try {
      const response = await fetch("https://api.firecrawl.dev/v1/search", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          query: query,
          limit: 2,
          scrapeOptions: { formats: ["markdown"] }
        })
      });

      if (!response.ok) {
        throw new Error(`Firecrawl API error: ${response.status}`);
      }

      const json: any = await response.json();
      return JSON.stringify(json.data || []);
    } catch (err) {
      console.warn("[Capability: web_search] Web search failed, returning mock:", err instanceof Error ? err.message : err);
      return "Mock search result: B2B conversion optimization strategies emphasize personalization and dynamic pricing.";
    }
  }
};

// Registreer standaard tools bij het laden van dit package
globalToolRegistry.registerTool(firecrawlSearchTool);
