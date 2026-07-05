"use server";

import { getSessionAction } from "./auth";
import { prisma } from "@rebuildyourlife/database";
import { revalidatePath } from "next/cache";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
});

export async function createEmailCampaign(name: string, subject: string, context: string) {
  const session = await getSessionAction();
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  try {
    // Generate an initial HTML template using Gemini based on context
    const aiResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Schrijf een professionele B2B koude e-mail in HTML formaat. 
      Gebruik deze context: ${context}
      Het onderwerp van de mail is: ${subject}.
      Geef ALLEEN de rauwe HTML code terug, geen markdown blokken of uitleg. Zorg dat er placeholders inzitten zoals {{firstName}} of {{companyName}}.`,
    });

    let htmlContent = aiResponse.text || "";
    // Verwijder markdown blokken mochten ze er toch in zitten
    htmlContent = htmlContent.replace(/```html/g, "").replace(/```/g, "").trim();

    const campaign = await prisma.emailCampaign.create({
      data: {
        userId: session.user.id,
        name,
        subject,
        htmlContent,
        status: "DRAFT",
      },
    });

    revalidatePath("/dashboard/modules/cold-email");
    return { success: true, campaign };
  } catch (error: any) {
    console.error("Failed to create campaign:", error);
    return { success: false, error: error.message };
  }
}

export async function getUserCampaigns() {
  const session = await getSessionAction();
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  return await prisma.emailCampaign.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });
}

export async function addLead(email: string, firstName?: string, lastName?: string) {
  const session = await getSessionAction();
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  try {
    const subscriber = await prisma.subscriber.create({
      data: {
        userId: session.user.id,
        email,
        firstName,
        lastName,
        tags: "COLD_LEAD"
      }
    });
    
    revalidatePath("/dashboard/modules/cold-email");
    return { success: true, subscriber };
  } catch (error: any) {
    // Check if unique constraint failed
    if (error.code === 'P2002') {
      return { success: false, error: "Deze lead bestaat al in je systeem." };
    }
    return { success: false, error: error.message };
  }
}

export async function getLeads() {
  const session = await getSessionAction();
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  return await prisma.subscriber.findMany({
    where: { userId: session.user.id, tags: "COLD_LEAD" },
    orderBy: { createdAt: "desc" },
  });
}
