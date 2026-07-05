"use server";

import { getSessionAction } from "./auth";
import { prisma } from "@rebuildyourlife/database";
import { revalidatePath } from "next/cache";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
});

export async function createWebsite(name: string, prompt: string) {
  const session = await getSessionAction();
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  try {
    const aiResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Jij bent een Expert Frontend Ontwikkelaar en Webdesigner. Maak een prachtige, converterende B2B of B2C landingspagina voor deze opdracht: "${prompt}".
      
      Regels:
      1. Gebruik Vanilla HTML5 en Tailwind CSS via een CDN tag (<script src="https://cdn.tailwindcss.com"></script>).
      2. Voeg ook Font Awesome of vergelijkbare iconen toe als dat helpt, en gebruik Google Fonts (bijv. Inter of Roboto).
      3. Maak het extreem professioneel, modern en visueel indrukwekkend met hover effecten en gradiënten.
      4. Geef UITSLUITEND de rauwe HTML code terug, geen uitleg, geen markdown blokken (dus begin direct met <!DOCTYPE html>).`,
    });

    let htmlContent = aiResponse.text || "";
    htmlContent = htmlContent.replace(/```html/g, "").replace(/```/g, "").trim();

    // Generate unique domain slug
    const domain = name.toLowerCase().replace(/[^a-z0-9]/g, "-") + "-" + Math.random().toString(36).substring(2, 6);

    const website = await prisma.website.create({
      data: {
        userId: session.user.id,
        name,
        domain,
        htmlContent,
        status: "PUBLISHED",
      },
    });

    revalidatePath("/dashboard/modules/website-builder");
    return { success: true, website };
  } catch (error: any) {
    console.error("Failed to create website:", error);
    return { success: false, error: error.message };
  }
}

export async function getUserWebsites() {
  const session = await getSessionAction();
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  return await prisma.website.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });
}

export async function deleteWebsite(id: string) {
  const session = await getSessionAction();
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  try {
    await prisma.website.delete({
      where: { 
        id,
        userId: session.user.id 
      },
    });

    revalidatePath("/dashboard/modules/website-builder");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: "Verwijderen mislukt" };
  }
}
