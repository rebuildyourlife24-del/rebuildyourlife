"use server";

import { getSessionAction } from "./auth";
import { prisma } from "@rebuildyourlife/database";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateCopy(projectType: string, topic: string, tone: string) {
  const session = await getSessionAction();
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }
  const userId = session.user.id;

  try {
    let systemPrompt = "";

    if (projectType === "AD") {
      systemPrompt = `
        Je bent een master copywriter voor advertenties (Facebook/Instagram Ads).
        Schrijf een zeer converterende ad copy over het onderwerp.
        Gebruik de AIDA-formule (Attention, Interest, Desire, Action).
        De tone-of-voice moet ${tone} zijn.
      `;
    } else if (projectType === "EMAIL") {
      systemPrompt = `
        Je bent een e-mailmarketing expert.
        Schrijf een overtuigende nieuwsbrief of sales e-mail over het onderwerp.
        Inclusief een pakkende onderwerpregel.
        De tone-of-voice moet ${tone} zijn.
      `;
    } else if (projectType === "LANDING_PAGE") {
      systemPrompt = `
        Je bent een conversie-gerichte copywriter.
        Schrijf de teksten voor een landingspagina over het onderwerp.
        Inclusief: Headline, Sub-headline, 3 pijnpunten/voordelen, en een call-to-action.
        De tone-of-voice moet ${tone} zijn.
      `;
    } else {
      systemPrompt = `
        Je bent een social media expert. Schrijf een viral post over het onderwerp.
        De tone-of-voice moet ${tone} zijn.
      `;
    }

    const aiResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `${systemPrompt}\n\nOnderwerp: ${topic}`,
    });

    const content = aiResponse.text || "Kon geen tekst genereren.";

    const generated = await prisma.generatedCopy.create({
      data: {
        userId,
        projectType,
        topic,
        tone,
        content,
      },
    });

    return { success: true, copy: generated };
  } catch (error: any) {
    console.error("Error generating copy:", error);
    return { success: false, error: error.message };
  }
}

export async function getGeneratedCopyHistory() {
  const session = await getSessionAction();
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }
  const userId = session.user.id;

  try {
    const history = await prisma.generatedCopy.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, history };
  } catch (error: any) {
    console.error("Error fetching copy history:", error);
    return { success: false, error: error.message };
  }
}
