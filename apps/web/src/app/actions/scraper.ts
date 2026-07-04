'use server';

export async function firecrawlSearchAction(query: string, limit: number = 3) {
  const apiKey = process.env.FIRECRAWL_API_KEY;

  if (!apiKey || apiKey === "") {
    console.warn("[FIRECRAWL] Geen API key gevonden. Simulatie-modus geactiveerd.");
    // Terugvallen op mock data als er geen key is
    return {
      success: true,
      data: [
        { url: "https://example.com/company-1", title: "Test Bedrijf 1", description: "B2B Automatisering" },
        { url: "https://example.com/company-2", title: "Test Bedrijf 2", description: "Software Oplossingen" }
      ]
    };
  }

  try {
    // Firecrawl /v1/search endpoint
    const response = await fetch("https://api.firecrawl.dev/v1/search", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        query: query,
        limit: limit,
        scrapeOptions: { formats: ["markdown"] }
      })
    });

    if (!response.ok) {
      throw new Error(`Firecrawl API fout: ${response.status}`);
    }

    const json = await response.json();
    return { success: true, data: json.data };
  } catch (error: any) {
    console.error("Firecrawl Error:", error);
    return { success: false, error: error.message };
  }
}

export async function firecrawlScrapeUrlAction(url: string) {
  const apiKey = process.env.FIRECRAWL_API_KEY;

  if (!apiKey || apiKey === "") {
    return { success: true, data: { markdown: `Mock inhoud voor ${url} (Geen API Key ingesteld)` } };
  }

  try {
    const response = await fetch("https://api.firecrawl.dev/v1/scrape", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        url: url,
        formats: ["markdown"]
      })
    });

    if (!response.ok) {
      throw new Error(`Firecrawl API fout: ${response.status}`);
    }

    const json = await response.json();
    return { success: true, data: json.data };
  } catch (error: any) {
    console.error("Firecrawl Scrape Error:", error);
    return { success: false, error: error.message };
  }
}
