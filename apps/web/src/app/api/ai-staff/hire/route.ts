import { NextResponse } from 'next/server';

// Dit is de API Endpoint voor Verdienmodel 4: AI Personeel (Recruitment)
// Klanten gebruiken deze API om met één klik een "AI Werknemer" aan te nemen.

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { clientId, companyName, roleRequested, salaryTier = 199 } = body;

    if (!clientId || !roleRequested) {
      return NextResponse.json({ success: false, error: 'Klant of rol ontbreekt' }, { status: 400 });
    }

    console.log(`[AI-STAFF API] Klant ${companyName} huurt een nieuwe ${roleRequested} in voor €${salaryTier}/mnd.`);

    const apiKey = process.env.GROQ_API_KEY_1 || process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error("GROQ API Key ontbreekt in .env");
    }

    // Genereer de unieke persoonlijkheid en de system-instructions voor deze specifieke digitale werknemer
    const prompt = `Je bent de architect van AI-personeel. Een nieuw bedrijf genaamd "${companyName}" heeft zojuist een virtuele werknemer ingehuurd voor de rol van: ${roleRequested}.
    
    Verzin een menselijke naam voor deze AI-medewerker en genereer een ijzersterke System Prompt (instructieset) waarmee deze AI direct aan de slag kan in dat specifieke bedrijf.
    
    Geef je antwoord exact terug in dit JSON formaat:
    {
      "employeeName": "Kies een professionele naam",
      "systemPrompt": "Je bent [Naam], de [Rol] voor [Bedrijf]. Jouw primaire taak is..."
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
    const provisionedEmployee = JSON.parse(aiData.choices[0].message.content);

    // In productie: await prisma.aiEmployee.create({ data: { ... } })

    // LOG NAAR ENTERPRISE ADMINISTRATIE
    console.log(`[🏛️ ENTERPRISE LOG] Abonnement gestart: AI-Personeel (${provisionedEmployee.employeeName}) ingehuurd door ${companyName}. Omzet: €${salaryTier}/mnd.`);

    return NextResponse.json({
      success: true,
      data: {
        status: "EMPLOYEE_PROVISIONED_AND_ACTIVE",
        employee_details: {
          name: provisionedEmployee.employeeName,
          role: roleRequested,
          company: companyName,
          brain_instructions: provisionedEmployee.systemPrompt
        },
        billing: {
          monthly_fee: salaryTier,
          status: "ACTIVE"
        }
      }
    });

  } catch (error: any) {
    console.error("[AI-Staff API] Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || 'Interne Server Fout' },
      { status: 500 }
    );
  }
}
