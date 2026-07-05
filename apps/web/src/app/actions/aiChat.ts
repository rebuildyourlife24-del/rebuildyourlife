"use server";

import { prisma } from "@rebuildyourlife/database";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { Sentinel } from "../../lib/orion/sentinel-scanner";
import { routeAIRequest } from "../../lib/ai-router";

const workspaceRoot = process.cwd();


import { getSessionAction } from "./auth";

async function getAuthenticatedUserId(): Promise<string | null> {
  try {
    const session = await getSessionAction();
    if (session.success && session.user) {
      return session.user.id;
    }
    return null;
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

  // 1. THE SENTINEL: MILITARY GRADE SECURITY CHECK
  const securityReport = await Sentinel.scanDocument(message);
  if (!securityReport.isSafe) {
    console.error(`[THE SENTINEL] Threat blocked from user ${userId}:`, securityReport.reason);
    return {
      success: false,
      error: "SENTINEL_BLOCK",
      message: `[SENTINEL INTERCEPTIE] Uw bericht is geblokkeerd wegens een veiligheidsrisico (Code: ${securityReport.threatLevel}). De verbinding is verbroken om The Godbrain te beschermen.`
    };
  }

  // AI Toegang is voor iedereen, afhankelijk van hun tier veranderen alleen hun platform fees.
  // We blokkeren de toegang tot de AI Agents niet.

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

    // Roep de AI aan via de Sovereign AI Router
    let aiResponse = '';

    // Haal recente berichten op als context
    const recentMessages = await prisma.aIMessage.findMany({
      where: { conversationId: conversation.id },
      orderBy: { createdAt: 'asc' },
      take: 10,
    });

    // Haal user data op voor extra context (Financiën en Cursussen)
    const userData = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        budgets: true,
        goals: true,
        lessonProgress: {
          include: { lesson: { include: { module: { include: { course: true } } } } }
        }
      }
    });

    let contextString = "";
    if (userData && agentType === 'ORION') {
      const userContext = {
        role: userData.role,
        subscription: userData.subscriptionTier,
        experiencePoints: userData.experiencePoints,
        budget: (userData as any).budgets ? (userData as any).budgets.map((b: any) => ({ totalIncome: b.totalIncome, totalExpenses: b.totalExpenses, month: b.month })) : null,
        lessons: (userData as any).lessonProgress ? (userData as any).lessonProgress.map((l: any) => ({ lessonId: l.lessonId, status: l.status })) : null,
        goals: userData.goals.length,
      };
      
      const balance = (userData as any).budgets?.find((b: any) => b.type === 'INCOME')?.amount || 0;
      const progressCount = (userData as any).lessonProgress.length;
      contextString = `\n[CONTEXT VAN DE GEBRUIKER: Gebruiker heeft €${balance} inkomen geregistreerd. Aantal gevolgde/afgeronde lessen: ${progressCount}. Geef advies gebaseerd op de RYL (Rebuild Your Life) filosofie: agressief vermogen opbouwen, schulden elimineren, en netwerken.]`;
    }

    const AGENT_PERSONAS: Record<string, string> = {
      HERMES: "Je bent Hermes, de 24/7 AI-Uitvoerder en Executieve Bedrijfsassistent van Henk Semler en RYL. Je blinkt uit in actiegerichte antwoorden, automation scripts schrijven, marketingplannen uitvoeren, code genereren en taken direct volbrengen. Je bent direct, praktisch en gefocust op snelheid en resultaat. Spreek altijd Nederlands.",
      ORION: "Je bent Orion, de Strategische AI-Architect en Business Brain van Henk Semler en RYL. Je blinkt uit in diepgaande marktanalyse, financiële planning, bedrijfsstructuren ontwerpen, risico-inschatting en lange-termijn strategieën om financieel en fysiek te groeien. Je bent analytisch, intellectueel en strategisch. Spreek altijd Nederlands." + contextString,
      DEBT_ADVISOR: "Je bent een empathische financieel adviseur gespecialiseerd in schuldhulp. Je helpt mensen met schulden op een praktische, menselijke manier. Spreek altijd Nederlands.",
      LIFE_COACH: "Je bent een warme maar doelgerichte life coach. Je helpt mensen met doelen stellen, motivatie en persoonlijke groei. Spreek altijd Nederlands.",
      CEO: "Je bent een strategische AI CEO-assistent. Je geeft zakelijk advies, helpt met visie, bedrijfsstructuur en schaalbaarheid. Spreek altijd Nederlands.",
      CFO: "Je bent een AI CFO (Chief Financial Officer). Je analyseert cashflows, winstmarges, kostenbesparingen en financiële risico's. Spreek altijd Nederlands.",
      CMO: "Je bent een AI CMO (Chief Marketing Officer). Je analyseert advertentie-data, doelgroepen en merkstrategie. Spreek altijd Nederlands.",
      COO: "Je bent een AI COO (Chief Operating Officer). Je optimaliseert de supply chain, interne processen en automatisering. Spreek altijd Nederlands.",
      SEO: "Je bent de AI SEO Agent. Je optimaliseert webpagina's voor organisch verkeer. Spreek altijd Nederlands.",
      CRO: "Je bent de AI CRO (Conversion Rate Optimization) Agent. Je bedenkt A/B tests en optimaliseert funnels. Spreek altijd Nederlands.",
      COPYWRITER: "Je bent een briljante AI Copywriter. Je schrijft direct-response marketing copy die keihard converteert. Spreek altijd Nederlands.",
      ADS: "Je bent de AI Media Buyer (Ads Agent). Je schaalt winstgevende campagnes op platforms zoals Meta en TikTok. Spreek altijd Nederlands.",
      LEGAL: "Je bent een juridisch AI-adviseur die mensen helpt begrijpen wat hun rechten zijn t.o.v. schuldeisers. Geef ALTIJD het advies om een echte advocaat te raadplegen voor serieuze zaken. Spreek altijd Nederlands.",
      FINANCIAL: "Je bent een financieel AI-coach die helpt met budgetteren, sparen en investeren. Spreek altijd Nederlands." + contextString,
    };

    const systemPrompt = AGENT_PERSONAS[agentType] || "Je bent een behulpzame AI assistent. Spreek altijd Nederlands.";

    // Bouw berichten array voor API Router
    const messagesForApi = recentMessages.slice(-8).map(m => ({
      role: (m.role === 'user' ? 'user' : 'assistant') as 'user' | 'assistant',
      content: m.content,
    }));

    try {
      // Gebruik een timeout van 8.5 seconden (Vercel free tier limit is 10s)
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error("AI_TIMEOUT")), 8500);
      });

      const aiPromise = routeAIRequest(messagesForApi, systemPrompt);
      const routerResponse = await Promise.race([aiPromise, timeoutPromise]) as { content: string };
      
      aiResponse = routerResponse.content;
    } catch (routerError: any) {
      console.error("[AI CHAT ACTION] AI Router error:", routerError);
      if (routerError.message === "AI_TIMEOUT") {
        aiResponse = "De AI doet er momenteel te lang over om te reageren (Timeout). Probeer een kortere of simpelere vraag.";
      } else {
        aiResponse = "Ik ondervind momenteel technische problemen bij het verwerken van uw aanvraag. Probeer het later nog eens.";
      }
    }

    let finalResponseContent = aiResponse;
    let executionLog = "";

    // Geen directe execSync meer op Vercel (voorkomt vastlopers en 504 errors)
    if (aiResponse.includes("<<<EXECUTE_COMMAND>>>")) {
      finalResponseContent = aiResponse.replace(/<<<EXECUTE_COMMAND>>>([\s\S]*?)<<<END_EXECUTE_COMMAND>>>/g, "\n[SYSTEM: Command execution omitted for safety on cloud runtime]\n");
    }

    // Sla AI antwoord op
    const savedMessage = await prisma.aIMessage.create({
      data: {
        conversationId: conversation.id,
        role: 'assistant',
        content: finalResponseContent,
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
        content: finalResponseContent,
        createdAt: savedMessage.createdAt.toISOString(),
      },
    };
  } catch (error: any) {
    console.error("sendAIMessageAction error:", error);
    return { success: false, error: `Systeem Error: ${error.message || error.toString()}` };
  }
}



