'use server';

import { prisma } from '@rebuildyourlife/database';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import OpenAI from 'openai';

const JWT_SECRET = process.env.JWT_SECRET! || 'secret';
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function getUserId() {
  const cookieStore = await cookies();
  const token = cookieStore.get("ryl_session")?.value;
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return decoded.userId;
  } catch {
    return null;
  }
}

export async function generateOpportunityReport(niche: string) {
  try {
    const userId = await getUserId();
    
    // For development, fallback to the first user if no session (as per previous mock logic)
    let finalUserId = userId;
    if (!finalUserId) {
       const user = await prisma.user.findFirst();
       if (!user) {
         throw new Error('Geen gebruiker gevonden om de rapportage aan te koppelen.');
       }
       finalUserId = user.id;
    }

    const prompt = `
      Je bent de Hermes Scout Agent, een elite e-commerce en investerings-scraper. 
      Zoek (of simuleer een high-level zoektocht) naar de nieuwste 'Winning Products' binnen de niche: "${niche}".
      Retourneer de data ALTIJD in strikt JSON formaat zonder markdown blokken eromheen.
      
      Het JSON object moet de volgende structuur hebben:
      {
        "title": "Naam van het winnende product",
        "niche": "${niche}",
        "summary": "Waarom dit product gaat verkopen (trends, pain points, doelgroep)",
        "goodROI": 200,
        "betterROI": 450,
        "bestROI": 1200
      }
      
      Verzin realistische getallen voor ROI (Return On Investment percentages).
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a specialized JSON-only output agent. Do not output anything except valid JSON." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });

    const responseContent = completion.choices[0].message.content;
    if (!responseContent) throw new Error("Lege respons van Hermes AI");

    const parsedData = JSON.parse(responseContent);

    // Save to Database
    const report = await prisma.opportunityReport.create({
      data: {
        userId: finalUserId,
        title: parsedData.title || "Onbekend Product",
        niche: parsedData.niche || niche,
        summary: parsedData.summary || "Geen samenvatting gegenereerd.",
        goodROI: Number(parsedData.goodROI) || 150,
        betterROI: Number(parsedData.betterROI) || 300,
        bestROI: Number(parsedData.bestROI) || 800,
        status: "REVIEW"
      }
    });

    // Log the Agent's action in The Infinite Dossier
    await prisma.agentDossier.create({
      data: {
        agentType: "HERMES_SCOUT",
        action: "GENERATED_OPPORTUNITY_REPORT",
        target: parsedData.title,
        details: `Hermes heeft een marktonderzoek uitgevoerd in de niche ${niche} met een geschatte best ROI van ${parsedData.bestROI}%.`,
        userId: finalUserId
      }
    });

    revalidatePath('/dashboard/radar');
    return { success: true, report };

  } catch (error: any) {
    console.error('Hermes Scout Error:', error);
    return { success: false, error: error.message };
  }
}

export async function fetchOpportunityReports() {
  const userId = await getUserId();
  let finalUserId = userId;
  if (!finalUserId) {
    const user = await prisma.user.findFirst();
    if (!user) return [];
    finalUserId = user.id;
  }

  return await prisma.opportunityReport.findMany({
    where: { userId: finalUserId },
    orderBy: { createdAt: 'desc' }
  });
}
