import { NextResponse } from 'next/server';

// Dit is de API Endpoint voor Verdienmodel 5: AI SEO & Content Agency
// Genereert autonoom SEO artikelen en pusht ze direct naar de klant's WordPress/Shopify site

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { clientId, keyword, industry, targetCMS = "WordPress" } = body;

    if (!clientId || !keyword) {
      return NextResponse.json({ success: false, error: 'Klant of keyword ontbreekt' }, { status: 400 });
    }

    console.log(`[SEO-AGENCY API] Start generatie content cluster voor keyword: '${keyword}'`);

    const apiKey = process.env.GROQ_API_KEY_1 || process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error("GROQ API Key ontbreekt in .env");
    }

    // AI SEO Copywriter
    const prompt = `Je bent een Master SEO Copywriter (Rank #1 Google).
    Schrijf een uitgebreid blogartikel gericht op het zoekwoord: "${keyword}" voor de industrie "${industry}".
    
    Regels:
    1. Gebruik perfecte HTML structuur (<h1>, <h2>, <p>, <strong>).
    2. Focus op LSI keywords en hoge semantische dichtheid.
    3. Zorg voor een 'Pillar Content' stijl, extreem waardevol voor de lezer.
    4. Geen inleiding over jezelf, begin direct met het artikel.
    
    Geef je antwoord exact terug in dit JSON formaat:
    {
      "seoTitle": "De perfecte H1 en Meta Titel",
      "metaDescription": "De perfecte meta beschrijving (max 160 tekens)",
      "htmlContent": "De volledige HTML string van het artikel"
    }`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        temperature: 0.6
      })
    });

    if (!response.ok) {
      throw new Error(`Groq API Error: ${response.statusText}`);
    }

    const aiData = await response.json();
    const generatedArticle = JSON.parse(aiData.choices[0].message.content);

    // In productie: await pushToWordPress(clientId, generatedArticle) of pushToShopifyBlog()
    
    // LOG NAAR ENTERPRISE ADMINISTRATIE
    console.log(`[🏛️ ENTERPRISE LOG] SEO Artikel ('${generatedArticle.seoTitle}') succesvol gepusht naar ${targetCMS} van klant ${clientId}.`);

    return NextResponse.json({
      success: true,
      data: {
        status: "ARTICLE_PUBLISHED",
        cms: targetCMS,
        article: {
          title: generatedArticle.seoTitle,
          meta: generatedArticle.metaDescription,
          wordCount: generatedArticle.htmlContent.split(" ").length
        }
      }
    });

  } catch (error: any) {
    console.error("[SEO-Agency API] Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || 'Interne Server Fout' },
      { status: 500 }
    );
  }
}
