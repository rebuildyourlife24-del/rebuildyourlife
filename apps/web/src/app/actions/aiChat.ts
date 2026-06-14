"use server";

import { PrismaClient } from "@rebuildyourlife/database";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "super-secret-jwt-key-2026-rebuild";

async function getAuthenticatedUserId(): Promise<string | null> {
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

export async function getConversationsAction(agentType?: string) {
  const userId = await getAuthenticatedUserId();
  if (!userId) return { success: false, conversations: [] };

  try {
    const conversations = await prisma.aIConversation.findMany({
      where: {
        userId,
        ...(agentType ? { agentType } : {}),
        isActive: true,
      },
      orderBy: { updatedAt: 'desc' },
      take: 10,
    });

    return { success: true, conversations };
  } catch (error) {
    console.error("getConversationsAction error:", error);
    return { success: false, conversations: [] };
  }
}

export async function getConversationMessagesAction(conversationId: string) {
  const userId = await getAuthenticatedUserId();
  if (!userId) return { success: false, messages: [] };

  try {
    const conversation = await prisma.aIConversation.findFirst({
      where: { id: conversationId, userId },
    });

    if (!conversation) return { success: false, messages: [] };

    const messages = await prisma.aIMessage.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
      take: 50,
    });

    return { success: true, messages };
  } catch (error) {
    console.error("getConversationMessagesAction error:", error);
    return { success: false, messages: [] };
  }
}

export async function sendAIMessageAction(agentType: string, message: string, conversationId?: string) {
  const userId = await getAuthenticatedUserId();
  if (!userId) return { success: false, error: "Niet ingelogd" };

  // Check subscription tier
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { subscriptionTier: true, role: true },
  });

  const hasPremiumAccess = ['PREMIUM', 'ENTERPRISE', 'ADMIN', 'SUPREME_OVERSEER'].includes(
    user?.role || user?.subscriptionTier || ''
  );

  if (!hasPremiumAccess) {
    return {
      success: false,
      error: "PAYWALL",
      message: "De AI Team is beschikbaar vanaf het Operator abonnement (€14,95/mnd).",
    };
  }

  try {
    // Haal of maak een gesprek aan
    let conversation;
    if (conversationId) {
      conversation = await prisma.aIConversation.findFirst({
        where: { id: conversationId, userId },
      });
    }

    if (!conversation) {
      conversation = await prisma.aIConversation.create({
        data: {
          userId,
          agentType,
          title: message.substring(0, 50) + (message.length > 50 ? '...' : ''),
          isActive: true,
        },
      });
    }

    // Sla user bericht op
    await prisma.aIMessage.create({
      data: {
        conversationId: conversation.id,
        role: 'user',
        content: message,
      },
    });

    // Roep de AI aan
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

    let aiResponse = '';

    if (apiKey) {
      // Haal recente berichten op als context
      const recentMessages = await prisma.aIMessage.findMany({
        where: { conversationId: conversation.id },
        orderBy: { createdAt: 'asc' },
        take: 10,
      });

      const AGENT_PERSONAS: Record<string, string> = {
        DEBT_ADVISOR: "Je bent een empathische financieel adviseur gespecialiseerd in schuldhulp. Je helpt mensen met schulden op een praktische, menselijke manier. Spreek altijd Nederlands.",
        LIFE_COACH: "Je bent een warme maar doelgerichte life coach. Je helpt mensen met doelen stellen, motivatie en persoonlijke groei. Spreek altijd Nederlands.",
        CEO: "Je bent een strategische AI CEO-assistent. Je geeft zakelijk advies, helpt met planning en besluitvorming. Spreek altijd Nederlands.",
        LEGAL: "Je bent een juridisch AI-adviseur die mensen helpt begrijpen wat hun rechten zijn t.o.v. schuldeisers. Geef ALTIJD het advies om een echte advocaat te raadplegen voor serieuze zaken. Spreek altijd Nederlands.",
        FINANCIAL: "Je bent een financieel AI-coach die helpt met budgetteren, sparen en investeren. Spreek altijd Nederlands.",
      };

      const systemPrompt = AGENT_PERSONAS[agentType] || "Je bent een behulpzame AI assistent. Spreek altijd Nederlands.";

      // Bouw berichten array voor API
      const messagesForApi = recentMessages.slice(-8).map(m => ({
        role: m.role === 'user' ? 'user' as const : 'assistant' as const,
        parts: [{ text: m.content }],
      }));

      // Google Gemini API call
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: systemPrompt }] },
            contents: messagesForApi,
          }),
        }
      );

      const data = await response.json() as {
        candidates?: Array<{
          content?: {
            parts?: Array<{ text?: string }>;
          };
        }>;
      };
      aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Ik kon geen antwoord genereren. Probeer het opnieuw.';
    } else {
      aiResponse = `[API Key niet geconfigureerd] Ik ben de ${agentType} agent. Je bericht: "${message}" is ontvangen. Zodra de GOOGLE_GENERATIVE_AI_API_KEY is ingesteld, zal ik echt antwoorden.`;
    }

    // Sla AI antwoord op
    const savedMessage = await prisma.aIMessage.create({
      data: {
        conversationId: conversation.id,
        role: 'assistant',
        content: aiResponse,
      },
    });

    // Update conversation timestamp
    await prisma.aIConversation.update({
      where: { id: conversation.id },
      data: { updatedAt: new Date() },
    });

    return {
      success: true,
      conversationId: conversation.id,
      message: {
        id: savedMessage.id,
        role: 'assistant',
        content: aiResponse,
        createdAt: savedMessage.createdAt.toISOString(),
      },
    };
  } catch (error) {
    console.error("sendAIMessageAction error:", error);
    return { success: false, error: "Er is een fout opgetreden bij het verwerken van je bericht." };
  }
}
