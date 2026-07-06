'use server';

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY_1 || "",
});

export async function generateSocialPostAction(topic: string, platform: string) {
  try {
    const prompt = `Je bent de CMO (Chief Marketing Officer) agent van RYL OS.
    Schrijf een extreem virale, professionele social media post over: "${topic}".
    Platform: ${platform}.
    Houd rekening met de regels voor dit platform (bijv. LinkedIn = professioneel maar persoonlijk, Instagram = visueel en hashtags, Twitter = extreem kort).
    Zorg voor veel engagement.
    Geef ALleen de tekst terug, geen uitleg.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return { success: true, text: response.text?.trim() };
  } catch (error: any) {
    console.error("AI Generation Error:", error);
    return { success: false, error: error.message };
  }
}

export async function dispatchToMakeWebhookAction(payload: {
  text: string;
  platform: string;
  mediaUrl?: string;
}) {
  const webhookUrl = process.env.MAKE_WEBHOOK_URL;

  if (!webhookUrl) {
    return { success: false, error: "MAKE_WEBHOOK_URL is niet geconfigureerd in .env" };
  }

  try {
    // Stuur de data door naar Make.com
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        source: "ryl-os-agent",
        platform: payload.platform,
        content: payload.text,
        media_url: payload.mediaUrl || null,
        timestamp: new Date().toISOString()
      }),
    });

    if (!response.ok) {
      throw new Error(`Make.com Webhook Fout: ${response.status}`);
    }

    // Make.com antwoordt meestal met "Accepted"
    const resultText = await response.text();
    return { success: true, message: resultText };
  } catch (error: any) {
    console.error("Make.com Webhook Error:", error);
    return { success: false, error: error.message };
  }
}
