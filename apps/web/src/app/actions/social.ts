"use server";

import { getSessionAction } from "./auth";
import { prisma } from "@rebuildyourlife/database";
import { revalidatePath } from "next/cache";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
});

export async function generateSocialCalendar(brandVoice: string, topic: string, days: number = 7) {
  const session = await getSessionAction();
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  try {
    const aiResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Jij bent een Social Media Manager. Genereer ${days} LinkedIn/Twitter posts over het onderwerp: "${topic}".
      De brand voice (tone of voice) is: "${brandVoice}".
      
      Geef de output exact terug in dit JSON formaat:
      [
        {
          "platform": "LinkedIn",
          "content": "De post tekst hier...",
          "dayOffset": 1
        },
        ...
      ]
      Geef alleen de rauwe JSON terug zonder markdown blokken.`,
    });

    let jsonString = aiResponse.text || "[]";
    jsonString = jsonString.replace(/```json/g, "").replace(/```/g, "").trim();
    
    const postsData = JSON.parse(jsonString);
    const now = new Date();

    const createdPosts = [];

    for (const p of postsData) {
      const publishDate = new Date(now);
      publishDate.setDate(now.getDate() + p.dayOffset);

      const post = await prisma.socialMediaPost.create({
        data: {
          userId: session.user.id,
          platform: p.platform || "LinkedIn",
          content: p.content,
          publishAt: publishDate,
          status: "SCHEDULED",
        },
      });
      createdPosts.push(post);
    }

    revalidatePath("/dashboard/modules/social-media");
    return { success: true, count: createdPosts.length };
  } catch (error: any) {
    console.error("Failed to generate social calendar:", error);
    return { success: false, error: error.message };
  }
}

export async function getUserSocialPosts() {
  const session = await getSessionAction();
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  return await prisma.socialMediaPost.findMany({
    where: { userId: session.user.id },
    orderBy: { publishAt: "asc" },
  });
}

export async function deleteSocialPost(id: string) {
  const session = await getSessionAction();
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  try {
    await prisma.socialMediaPost.delete({
      where: { 
        id,
        userId: session.user.id 
      },
    });

    revalidatePath("/dashboard/modules/social-media");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: "Verwijderen mislukt" };
  }
}
