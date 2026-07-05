'use server'

import { createShopifyProduct } from '@/lib/shopify';

const FIRECRAWL_API_URL = "https://api.firecrawl.dev/v1/scrape";

export async function huntProductFromUrl(url: string) {
  try {
    const firecrawlKey = process.env.FIRECRAWL_API_KEY;
    if (!firecrawlKey) throw new Error("Missing FIRECRAWL_API_KEY");

    // 1. Scrape with Firecrawl
    console.log("Scraping URL:", url);
    const crawlRes = await fetch(FIRECRAWL_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${firecrawlKey}`
      },
      body: JSON.stringify({
        url: url,
        formats: ["markdown"]
      })
    });
    
    if (!crawlRes.ok) {
      const err = await crawlRes.text();
      console.error("Firecrawl error:", err);
      throw new Error(`Scrape failed: ${crawlRes.statusText}`);
    }

    const crawlData = await crawlRes.json();
    const markdownContent = crawlData.data?.markdown || crawlData.markdown || "";

    if (!markdownContent || markdownContent.length < 50) {
      throw new Error("Geen bruikbare content gevonden op de pagina.");
    }

    // 2. Process with Gemini to extract product
    const geminiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY_1;
    if (!geminiKey) throw new Error("Missing Gemini API Key");

    const prompt = `
      Je bent een expert in e-commerce en dropshipping. 
      Lees de onderstaande markdown-content van een geschraapte website.
      Identificeer het 'winnende' hoofdproduct op de pagina en converteer dit naar een commerciële JSON output.

      Vereisten:
      - title: Een pakkende commerciële titel (max 5 woorden)
      - body_html: Een converterende HTML beschrijving (gebruik <b>, <br>, <ul>). Minimaal 2 zinnen, wervende tekst.
      - price: Een realistische maar winstgevende verkoopprijs (bijv "29.95"). Alleen cijfers en punt.
      - tags: 3 komma-gescheiden tags
      - imageUrl: Zoek in de markdown naar de meest logische afbeeldings-URL (begint vaak met http, eindigt op jpg/png/webp) die het product toont. Als je er geen kan vinden, laat leeg of gebruik een placeholder.

      GEEF ALLEEN RAW JSON TERUG (geen \`\`\`json etc).
      Structuur:
      {
        "title": "...",
        "body_html": "...",
        "price": "...",
        "tags": "...",
        "imageUrl": "..."
      }

      Content:
      ${markdownContent.substring(0, 15000)}
    `;

    console.log("Analyzing with AI...");
    const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7 }
      })
    });

    if (!geminiRes.ok) throw new Error("AI Processing failed");

    const geminiData = await geminiRes.json();
    const responseText = geminiData.candidates[0].content.parts[0].text;
    
    // Clean up response text to parse JSON
    const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    const productJson = JSON.parse(cleanJson);

    return {
      success: true,
      product: productJson
    };
  } catch (error: any) {
    console.error("Hunt failed:", error);
    return { success: false, error: error.message };
  }
}

export async function injectProductToShopify(productJson: any) {
  try {
    const shopifyProduct = await createShopifyProduct(productJson);
    return { success: true, shopifyProduct };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
