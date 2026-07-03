import { NextResponse } from 'next/server';

// Dit is de API Endpoint voor Verdienmodel 6: B2B E-books / PDF Cursussen
// Genereert een compleet e-book over een zakelijk onderwerp, klaar voor verkoop achter een Mollie betaalmuur.

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { topic, targetAudience, price = 47.00 } = body;

    if (!topic || !targetAudience) {
      return NextResponse.json({ success: false, error: 'Topic of Doelgroep ontbreekt' }, { status: 400 });
    }

    console.log(`[B2B EBOOK API] Start generatie van premium B2B E-book over: '${topic}'`);

    const apiKey = process.env.GROQ_API_KEY_1 || process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error("GROQ API Key ontbreekt in .env");
    }

    // AI E-Book Auteur
    const prompt = `Je bent een meesterlijke B2B auteur en industrie-expert.
    Schrijf de introductie en het eerste gigantisch waardevolle hoofdstuk voor een premium E-book (€${price}) over het onderwerp: "${topic}".
    Doelgroep: ${targetAudience}.
    
    Regels:
    1. Geef extreem waardevolle, direct toepasbare zakelijke adviezen. Geen fluff.
    2. Gebruik HTML opmaak (<h1> voor de boektitel, <h2> voor hoofdstukken, <ul> voor opsommingen).
    3. Zorg dat het leest als een dure mastermind cursus.
    
    Geef je antwoord exact terug in dit JSON formaat:
    {
      "bookTitle": "De meesterlijke boektitel",
      "htmlContent": "De volledige HTML string van de introductie en hoofdstuk 1"
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
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`Groq API Error: ${response.statusText}`);
    }

    const aiData = await response.json();
    const generatedBook = JSON.parse(aiData.choices[0].message.content);

    // In productie: await generatePDFFromHTML(generatedBook.htmlContent);
    // In productie: await createMolliePaymentLink(price);
    
    // LOG NAAR ENTERPRISE ADMINISTRATIE
    console.log(`[🏛️ ENTERPRISE LOG] Premium E-book ('${generatedBook.bookTitle}') gegenereerd. Klaar voor verkoop via Mollie link (€${price}).`);

    return NextResponse.json({
      success: true,
      data: {
        status: "EBOOK_READY_FOR_SALE",
        book_details: {
          title: generatedBook.bookTitle,
          audience: targetAudience,
          price: price,
          download_url: "https://enterprise.ai-henksemler.nl/downloads/mock-pdf-1923.pdf",
          payment_link: "https://useplink.com/payment/mock-link"
        },
        raw_html_preview: generatedBook.htmlContent
      }
    });

  } catch (error: any) {
    console.error("[B2B Ebook API] Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || 'Interne Server Fout' },
      { status: 500 }
    );
  }
}
