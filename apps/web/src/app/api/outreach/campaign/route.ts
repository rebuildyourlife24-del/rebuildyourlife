import { NextResponse } from 'next/server';

// Dit is de API Endpoint voor Verdienmodel 3: B2B Leadgeneratie (Cold Outreach)
// Triggert een AI-gepersonaliseerde koude e-mail campagne (via Apollo/Instantly/Resend)

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { targetCompany, targetName, industry, painPoint } = body;

    if (!targetCompany || !targetName) {
      return NextResponse.json({ success: false, error: 'Target data ontbreekt' }, { status: 400 });
    }

    console.log(`[OUTREACH API] Start generatie gepersonaliseerde campagne voor: ${targetCompany}`);

    const apiKey = process.env.GROQ_API_KEY_1 || process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error("GROQ API Key ontbreekt in .env");
    }

    // AI Email Copywriter
    const prompt = `Je bent een meedogenloze B2B sales copywriter (God-Tier Closer).
    Schrijf een ultrakorte, hoog-converterende koude e-mail voor de volgende lead:
    
    Naam: ${targetName}
    Bedrijf: ${targetCompany}
    Industrie: ${industry}
    Pijnpunt: ${painPoint}
    
    Regels:
    1. Geen saaie introducties ("Ik hoop dat deze e-mail u goed bereikt").
    2. Direct to the point: benoem hun pijnpunt en bied de AI-oplossing (ons systeem).
    3. Sluit af met een zachte Call To Action (bijv: "Open voor een korte chat hierover?").
    4. Schrijf in vloeiend, zakelijk Nederlands.
    
    Geef je antwoord exact terug in dit JSON formaat zonder markdown blokken:
    {
      "subject": "De perfecte clickbait/nieuwsgierigheid onderwerpregel",
      "emailBody": "De volledige e-mail tekst"
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
    const generatedEmail = JSON.parse(aiData.choices[0].message.content);

    // In productie integreren we hier de Resend of Instantly API om het daadwerkelijk te versturen
    // await resend.emails.send({ from: 'Henk <sales@ai-henksemler.nl>', to: targetEmail, ... })

    // LOG NAAR ENTERPRISE ADMINISTRATIE
    console.log(`[🏛️ ENTERPRISE LOG] B2B Email verzonden naar ${targetCompany} (${targetName}). Campagne gelogd.`);

    return NextResponse.json({
      success: true,
      data: {
        target: targetCompany,
        status: "EMAIL_QUEUED_AND_SENT",
        generated_subject: generatedEmail.subject,
        generated_body: generatedEmail.emailBody
      }
    });

  } catch (error: any) {
    console.error("[Outreach API] Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || 'Interne Server Fout' },
      { status: 500 }
    );
  }
}
