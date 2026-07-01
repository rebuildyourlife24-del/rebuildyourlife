import { generateObject } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export async function POST(req: Request) {
  try {
    const { niche, pitch } = await req.json();

    if (!niche || !pitch) {
      return NextResponse.json({ error: 'Niche and Pitch are required' }, { status: 400 });
    }

    // Initialize Google provider using Gemini 1.5 Pro
    const google = createGoogleGenerativeAI({
      apiKey: process.env.GEMINI_API_KEY_1 || process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    });

    // We use AI to generate highly realistic, targeted leads for this niche
    // In a production environment, this would be replaced/augmented by Google Maps API or Apollo.io
    const result = await generateObject({
      model: google('models/gemini-1.5-pro-latest'),
      schema: z.object({
        leads: z.array(z.object({
          companyName: z.string(),
          contactName: z.string(),
          email: z.string(),
          personalizedPitch: z.string().describe('Een extreem gepersonaliseerde koude e-mail intro (max 3 zinnen) die de meegegeven pitch verbindt aan de specifieke bedrijfsnaam.')
        })).length(3).describe('Genereer exact 3 extreem realistische leads voor deze niche.'),
        analysis: z.string().describe('Een korte marktanalyse waarom deze leads geselecteerd zijn.')
      }),
      prompt: \`Je bent een AI Lead Generation expert. 
      De gebruiker wil de volgende dienst verkopen: "\${pitch}".
      De doelgroep is: "\${niche}".
      
      Zoek (of genereer extreem realistische) 3 bedrijven in deze niche. 
      Schrijf voor elk bedrijf een keiharde, conversie-gerichte, gepersonaliseerde e-mail introductie die de pitch verwerkt.\`,
    });

    // Stuur de gegenereerde e-mails daadwerkelijk via de bestaande Resend API sleutel uit de .env
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      for (const lead of result.object.leads) {
        try {
          await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Authorization': \`Bearer \${resendKey}\`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              from: 'Ryl System <onboarding@resend.dev>', // Gebruik test domein of geverifieerd domein
              to: 'hsemler50@gmail.com', // Voor de demo/veiligheid sturen we dit naar de eigenaar
              subject: \`Kans voor \${lead.companyName}\`,
              html: \`<p>Hallo \${lead.contactName},</p><p>\${lead.personalizedPitch}</p><br><p>Met vriendelijke groet,<br>Het AI Team</p>\`
            })
          });
        } catch (e) {
          console.error("Fout bij verzenden email naar", lead.email, e);
        }
      }
    }

    return NextResponse.json(result.object);
  } catch (error) {
    console.error('[COLD_EMAIL_API_ERROR]', error);
    return NextResponse.json({ error: 'Fout bij het scrapen van leads.' }, { status: 500 });
  }
}
