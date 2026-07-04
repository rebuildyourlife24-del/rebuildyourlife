import { NextResponse } from 'next/server';
import { getSessionAction } from '@/app/actions/auth';
import { generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';

export async function POST(req: Request) {
  try {
    const session = await getSessionAction();
    const user = session?.user;
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { prompt } = body;

    if (!prompt) {
      return NextResponse.json({ error: "Missing prompt" }, { status: 400 });
    }

    const { object } = await generateObject({
      model: openai('gpt-4o'),
      system: `Je bent een Top-Tier Dropshipping E-commerce Expert, gespecialiseerd in Shopify.
Je zoekt direct naar winnende e-commerce producten op basis van de vraag van de gebruiker.
Geef een super strakke, conversie-gerichte titel en beschrijving. (Gebruik HTML tags in de beschrijving voor Shopify: <strong>, <ul>, <li>).
Zorg voor realistische dropshipping prijzen (inkoop ligt laag, verkoop met een goeie margin).`,
      prompt: `Zoek een winnend product voor de volgende aanvraag: "${prompt}"`,
      schema: z.object({
        product: z.object({
          title: z.string().describe("De conversie-geoptimaliseerde naam van het product."),
          description: z.string().describe("De HTML-geformatteerde productbeschrijving, direct klaar voor Shopify."),
          recommendedPrice: z.number().describe("De geadviseerde verkoopprijs (in EUR)."),
          estimatedMargin: z.number().describe("Geschatte winstmarge in percentage (bijv 65)."),
          supplierCost: z.number().describe("Geschatte inkoopprijs (in EUR)."),
          targetAudience: z.string().describe("Korte beschrijving van de doelgroep."),
        })
      })
    });

    return NextResponse.json({ success: true, data: object });
  } catch (error: any) {
    console.error("Ecommerce Agent Research Error:", error);
    return NextResponse.json(
      { error: "Failed to research product", details: error.message },
      { status: 500 }
    );
  }
}
