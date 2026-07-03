import { NextResponse } from 'next/server';

// Dit is de API Endpoint voor Verdienmodel 2: AutoDS Dropshipping Automatisering
// Wordt aangeroepen wanneer een nieuw product via AutoDS wordt geïmporteerd

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { productId, originalTitle, originalDescription, source } = body;

    if (!originalTitle || !originalDescription) {
      return NextResponse.json({ success: false, error: 'Product data ontbreekt' }, { status: 400 });
    }

    console.log(`[AUTODS API] Start SEO optimalisatie voor product: ${productId || 'ONBEKEND'}`);

    const apiKey = process.env.GROQ_API_KEY_1 || process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error("GROQ API Key ontbreekt in .env");
    }

    // Gebruik de snelle Groq API voor real-time E-commerce vertaling & SEO
    const prompt = `Je bent een expert in E-commerce SEO. Herschrijf de volgende AliExpress/AutoDS product data naar een extreem goed verkopende, hoog-converterende Nederlandse producttitel en beschrijving.
    
    Originele Titel: ${originalTitle}
    Originele Beschrijving: ${originalDescription}
    
    Geef je antwoord exact terug in dit JSON formaat:
    {
      "seoTitle": "Nieuwe pakkende titel (max 60 tekens)",
      "seoDescription": "Uitgebreide wervende tekst, opgedeeld in HTML paragrafen, gefocust op pijnpunten en emotie."
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
        temperature: 0.5
      })
    });

    if (!response.ok) {
      throw new Error(`Groq API Error: ${response.statusText}`);
    }

    const aiData = await response.json();
    const optimizedContent = JSON.parse(aiData.choices[0].message.content);

    // LOG NAAR ENTERPRISE ADMINISTRATIE
    console.log(`[🏛️ ENTERPRISE LOG] Product ${productId} geoptimaliseerd via Verdienmodel 2.`);

    // In productie: await pushToShopify(productId, optimizedContent);

    return NextResponse.json({
      success: true,
      data: {
        productId,
        status: "SEO_OPTIMIZED_AND_READY",
        optimized_title: optimizedContent.seoTitle,
        optimized_description: optimizedContent.seoDescription,
        pushed_to_store: false // Nog niet gepusht in deze test
      }
    });

  } catch (error: any) {
    console.error("[AutoDS API] Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || 'Interne Server Fout' },
      { status: 500 }
    );
  }
}
