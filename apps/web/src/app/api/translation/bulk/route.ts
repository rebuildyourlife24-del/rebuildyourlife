import { NextResponse } from 'next/server';

// ============================================================================
// VERDIENMODEL 9: AI VERTALINGEN (BULK TRANSLATION)
// ============================================================================

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { clientId, sourceText, targetLanguage = "NL" } = body;

    if (!clientId || !sourceText) {
      return NextResponse.json({ success: false, error: 'Klant ID of brontekst ontbreekt' }, { status: 400 });
    }

    console.log(`[TRANSLATION API] Vertaling aangevraagd door ${clientId} naar ${targetLanguage}. Lengte: ${sourceText.length} tekens.`);

    const apiKey = process.env.GROQ_API_KEY_1 || process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error("GROQ API Key ontbreekt in .env");
    }

    const prompt = `Je bent een Master Translator. Vertaal de volgende tekst naar het ${targetLanguage}.
    Behoud exact dezelfde tone-of-voice, HTML/Markdown formatting en intentie.
    
    Brontekst:
    ${sourceText}
    
    Geef je antwoord exact terug in dit JSON formaat:
    {
      "translatedText": "De volledige vertaalde tekst"
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
        temperature: 0.1 // Lage temperature voor accurate vertalingen
      })
    });

    if (!response.ok) {
      throw new Error(`Groq API Error: ${response.statusText}`);
    }

    const aiData = await response.json();
    const translationData = JSON.parse(aiData.choices[0].message.content);

    // LOG NAAR ENTERPRISE ADMINISTRATIE
    console.log(`[🏛️ ENTERPRISE LOG] Bulk Vertaling (Naar ${targetLanguage}) voltooid voor klant ${clientId}. Geleaste tokens gefactureerd.`);

    return NextResponse.json({
      success: true,
      data: {
        status: "TRANSLATION_COMPLETE",
        targetLanguage,
        translatedContent: translationData.translatedText
      }
    });

  } catch (error: any) {
    console.error("[Translation API] Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || 'Interne Server Fout' },
      { status: 500 }
    );
  }
}
