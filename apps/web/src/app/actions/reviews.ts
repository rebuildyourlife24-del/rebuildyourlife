"use server";

import { prisma } from "@rebuildyourlife/database";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Mock function to fetch reviews (since we don't have a real Google Places API key setup yet)
export async function syncGoogleReviews(userId: string, placeId: string) {
  try {
    // In a real app we'd call Google My Business API or Outscraper
    const mockReviews = [
      { authorName: "Jan de Vries", rating: 5, text: "Fantastische service, heel erg geholpen met mijn probleem!" },
      { authorName: "Klaas V.", rating: 3, text: "Het was oké, maar de wachttijd was wel wat lang." },
      { authorName: "Anoniem", rating: 1, text: "Slechte ervaring, ik kom hier nooit meer terug." },
    ];

    for (const review of mockReviews) {
      await prisma.businessReview.create({
        data: {
          userId,
          platform: "GOOGLE",
          authorName: review.authorName,
          rating: review.rating,
          text: review.text,
        },
      });
    }

    return { success: true, message: "Reviews gesynchroniseerd!" };
  } catch (error: any) {
    console.error("Error syncing reviews:", error);
    return { success: false, error: error.message };
  }
}

export async function getBusinessReviews(userId: string) {
  try {
    const reviews = await prisma.businessReview.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, reviews };
  } catch (error: any) {
    console.error("Error fetching reviews:", error);
    return { success: false, error: error.message };
  }
}

export async function generateAiReply(reviewId: string, customInstruction?: string) {
  try {
    const review = await prisma.businessReview.findUnique({ where: { id: reviewId } });
    if (!review) throw new Error("Review niet gevonden");

    const prompt = `
      Je bent de klantenservice manager van een lokaal bedrijf.
      Schrijf een professioneel, vriendelijk en oplossingsgericht antwoord op de volgende Google Review.
      
      Reviewer: ${review.authorName}
      Sterren: ${review.rating}/5
      Review tekst: "${review.text}"
      
      Extra instructie van de eigenaar: ${customInstruction || "Geen extra instructie."}
      
      Geef alleen de uiteindelijke antwoordtekst terug. Hou het kort (max 3 zinnen).
    `;

    const aiResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const reply = aiResponse.text || "Kon geen AI antwoord genereren.";

    const updated = await prisma.businessReview.update({
      where: { id: reviewId },
      data: { aiReply: reply },
    });

    return { success: true, review: updated };
  } catch (error: any) {
    console.error("Error generating AI reply:", error);
    return { success: false, error: error.message };
  }
}
