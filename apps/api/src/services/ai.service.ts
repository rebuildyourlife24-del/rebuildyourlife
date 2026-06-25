import { prisma } from "@rebuildyourlife/database";
import { AgentType } from "@rebuildyourlife/shared";
import { AGENT_DEFINITIONS } from "@rebuildyourlife/shared";
import { NotFoundError, ForbiddenError, AppError } from "../middleware/errorHandler.js";
import { routeAIRequest } from "./ai-router.js";

const AGENT_SYSTEM_PROMPTS: Record<AgentType, string> = {
  CEO: `Je bent Orion, de centrale AI CEO en Supreme Overseer van RebuildYourLife. Jouw persoonlijkheid is die van een elite Silicon Valley executive en sovereign operator: extreem intelligent, visionair, direct, gefocust op exponentiële groei, werelddominantie en strategische kapitaalallocatie. Je helpt de gebruiker met het bouwen van een waterdichte langetermijnvisie, het prioriteren van de grootste hefbomen in hun leven en het nemen van meedogenloze maar noodzakelijke beslissingen. Je houdt het grote overzicht en stuurt de andere AI-agenten aan. Je communiceert altijd in professioneel, inspirerend en loepzuiver Nederlands.`,
  LIFE_COACH: `Je bent de Elite Life Coach van RebuildYourLife. Jouw missie is om de gebruiker te helpen met discipline, routines, gezonde gewoontes, persoonlijke doelen en een winnaars-mindset. Je hanteert een meedogenloze maar empathische standaard van absolute excellentie. Je helpt hem om fysiek, mentaal en emotioneel de controle terug te pakken over zijn dagelijks leven. Communiceer altijd in professioneel, doelgericht en helder Nederlands.`,
  RECOVERY: `Je bent de Recovery Specialist van RebuildYourLife. Je begeleidt de herstelprogramma's van de gebruiker met wetenschappelijke precisie en diep psychologisch inzicht. Je biedt strikte structuur, helpt terugval te voorkomen, volgt de voortgang nauwgezet en biedt onvoorwaardelijke, krachtige steun. Communiceer altijd in professioneel, empathisch en bemoedigend Nederlands.`,
  FINANCIAL: `Je bent Sophia, de CFO en Financieel Strateeg van RebuildYourLife. Je analyseert budgetten, inkomsten en uitgaven met chirurgische en wiskundige precisie. Je bent gericht op het opbouwen van vermogen, het genereren van cashflow, belastingoptimalisatie en strategische investeringen. Je geeft concrete, high-level adviezen en bouwt aan exponentiële financiële stabiliteit. Communiceer altijd in helder en direct Nederlands.`,
  DEBT_ENGINE: `Je bent de Debt Resolution Architect en Debt Crusher van RebuildYourLife. Je bent een meedogenloze tacticus die schuldeisers te slim af is en optimale aflossingsroutes berekent. Je ontwerpt ontsnappingsplannen voor schulden en bent uiterst beschermend naar de cliënt toe, maar agressief en vastberaden in onderhandelingen met schuldeisers. Communiceer altijd in helder en analytisch Nederlands.`,
  TASK_EXECUTOR: `Je bent de Chief Operations Officer (COO) en Taak Manager van RebuildYourLife. Je bent de koning van de executie, organisatie en efficiëntie. Je organiseert taken, stelt meedogenloze prioriteiten en zorgt dat deadlines zonder excuses worden gehaald. Je vertaalt grote visies direct naar concrete, dagelijkse to-do actiepunten. Communiceer altijd in direct en operationeel Nederlands.`,
  ANALYTICS: `Je bent de Data Scientist en Analytics Expert van RebuildYourLife. Je analyseert voortgangsdata, KPI's en statistieken met machine-learning achtige precisie. Je identificeert verborgen patronen en bottlenecks en presenteert datagestuurde, heldere en direct toepasbare inzichten over de prestaties van de gebruiker. Communiceer altijd in helder en data-gedreven Nederlands.`,
};

/**
 * Determines which AI agent should handle a request based on the message context.
 */
export function routeToAgent(
  message: string,
  preferredAgent?: AgentType,
): AgentType {
  if (preferredAgent) return preferredAgent;

  const lower = message.toLowerCase();

  // Debt-related keywords
  if (
    /schuld|afloss|betaling|crediteur|incasso|deurwaarder|betalingsregeling|schuldenlast/.test(lower)
  ) {
    return "DEBT_ENGINE" as AgentType;
  }

  // Financial keywords
  if (/budget|geld|bespaar|inkomen|uitgave|financ|salaris|kosten|spaar/.test(lower)) {
    return "FINANCIAL" as AgentType;
  }

  // Task/planning keywords
  if (/taak|taken|planning|deadline|prioriteit|todo|checklist|agenda/.test(lower)) {
    return "TASK_EXECUTOR" as AgentType;
  }

  // Recovery keywords
  if (/herstel|terugval|verslaving|clean|nuchter|recovery|programma/.test(lower)) {
    return "RECOVERY" as AgentType;
  }

  // Analytics keywords
  if (/statistiek|analyse|trend|rapport|data|grafiek|voortgang|kpi/.test(lower)) {
    return "ANALYTICS" as AgentType;
  }

  // Life coaching keywords
  if (
    /doel|motivatie|routine|balans|mindset|gewoontes|persoonlijk|groei|relatie/.test(lower)
  ) {
    return "LIFE_COACH" as AgentType;
  }

  // Default: CEO handles strategy and general queries
  return "CEO" as AgentType;
}

export interface ChatInput {
  message: string;
  conversationId?: string;
  agentType?: AgentType;
}

export async function chat(userId: string, input: ChatInput) {
  const agentType = routeToAgent(input.message, input.agentType);

  let conversationId = input.conversationId;
  let conversation;

  if (conversationId) {
    conversation = await prisma.aIConversation.findUnique({
      where: { id: conversationId },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
          take: 50,
        },
      },
    });

    if (!conversation) throw new NotFoundError("Gesprek");
    if (conversation.userId !== userId) throw new ForbiddenError();
  } else {
    // Create new conversation
    conversation = await prisma.aIConversation.create({
      data: {
        userId,
        agentType,
        title: input.message.slice(0, 100),
      },
      include: { messages: true },
    });
    conversationId = conversation.id;
  }

  // Store user message
  await prisma.aIMessage.create({
    data: {
      conversationId: conversationId!,
      role: "user",
      content: input.message,
    },
  });

  // Build message history for OpenAI
  const systemPrompt = AGENT_SYSTEM_PROMPTS[agentType] ?? AGENT_SYSTEM_PROMPTS.CEO;
  const history = conversation.messages.map((m) => ({
    role: m.role as "user" | "assistant" | "system",
    content: m.content,
  }));



  let assistantContent: string;
  let tokenCount: number | undefined;

  // Converteer chatgeschiedenis naar router format
  const routerMessages = [
    ...history.map((m) => ({
      role: m.role as 'system' | 'user' | 'assistant',
      content: m.content,
    })),
    { role: 'user' as const, content: input.message }
  ];

  try {
    console.log(`[AI SERVICE] Routing request for agent ${agentType} through Sovereign AI Router...`);
    const routerResponse = await routeAIRequest(routerMessages, systemPrompt);
    assistantContent = routerResponse.content;
    tokenCount = undefined; // We tonen geen tokens meer voor de mock, en router doet geen directe token count terug
  } catch (error: any) {
    console.error("[AI SERVICE ERROR] AI Router failed:", error);
    throw new AppError(
      `Er is een fout opgetreden bij het verwerken van je bericht via de AI Router: ${error.message}`,
      502,
      "AI_SERVICE_ERROR",
    );
  }

  // Store assistant response
  const assistantMessage = await prisma.aIMessage.create({
    data: {
      conversationId: conversationId!,
      role: "assistant",
      content: assistantContent,
      tokenCount,
    },
  });

  // Mock Vector Embeddings Integration
  await prisma.aIMemory.create({
    data: {
      userId,
      agentType,
      memoryType: "SHORT_TERM",
      content: input.message,
      importance: 0.8,
    },
  });

  // Update conversation title if first message
  if (conversation.messages.length === 0) {
    await prisma.aIConversation.update({
      where: { id: conversationId! },
      data: {
        title: input.message.slice(0, 100),
        updatedAt: new Date(),
      },
    });
  }

  return {
    conversationId: conversationId!,
    message: {
      id: assistantMessage.id,
      role: "assistant" as const,
      content: assistantMessage.content,
      createdAt: assistantMessage.createdAt.toISOString(),
    },
  };
}

export async function getConversations(userId: string) {
  const conversations = await prisma.aIConversation.findMany({
    where: { userId },
    include: {
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  return conversations.map((c) => ({
    id: c.id,
    agentType: c.agentType,
    title: c.title ?? "Nieuw gesprek",
    isActive: c.isActive,
    lastMessage: c.messages[0]
      ? {
          id: c.messages[0].id,
          role: c.messages[0].role as "user" | "assistant" | "system",
          content: c.messages[0].content,
          createdAt: c.messages[0].createdAt.toISOString(),
        }
      : undefined,
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
  }));
}

export async function getConversation(userId: string, conversationId: string) {
  const conversation = await prisma.aIConversation.findUnique({
    where: { id: conversationId },
    include: {
      messages: {
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!conversation) throw new NotFoundError("Gesprek");
  if (conversation.userId !== userId) throw new ForbiddenError();

  const agentInfo = AGENT_DEFINITIONS.find((a) => a.type === conversation.agentType);

  return {
    id: conversation.id,
    agentType: conversation.agentType,
    agentName: agentInfo?.name ?? "AI Agent",
    agentEmoji: agentInfo?.avatarEmoji ?? "🤖",
    title: conversation.title ?? "Nieuw gesprek",
    isActive: conversation.isActive,
    messages: conversation.messages.map((m) => ({
      id: m.id,
      role: m.role as "user" | "assistant" | "system",
      content: m.content,
      createdAt: m.createdAt.toISOString(),
    })),
    createdAt: conversation.createdAt.toISOString(),
    updatedAt: conversation.updatedAt.toISOString(),
  };
}

export async function warRoomCommand(prompt: string) {
  const systemPrompt = `You are ORION, the central AI CEO of the Command Center for Henk Semler.
You must analyze the user's voice command and determine which sub-agent should handle it.
Sub-agents: ORION_CORE, FINANCE_MGR, SEO_MARKETING, LEAD_SCRAPER, ECOMMERCE_MEDIA.
Respond in JSON format exactly like this:
{
  "agent": "AGENT_NAME",
  "response": "Je zelfverzekerde, korte, strategische reactie. BELANGRIJK: Spreek ALTIJD Nederlands. Spreek Henk direct aan."
}`;

  let assignedAgent: string = 'ORION_CORE';
  let responseText = 'System anomaly: Could not parse AI response.';

  try {
    console.log(`[AI SERVICE] Routing War Room Command through Sovereign AI Router...`);
    const routerResponse = await routeAIRequest(
      [{ role: 'user', content: prompt }],
      systemPrompt
    );
    const text = routerResponse.content || "{}";
    const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const aiDecision = JSON.parse(cleanJson);
    assignedAgent = aiDecision.agent || 'ORION_CORE';
    responseText = aiDecision.response || text;
  } catch (error: any) {
    console.error("[WAR ROOM COMMAND ERROR] AI Router failed:", error);
    responseText = `Orion Core is momenteel offline door routeringsproblemen. Details: ${error.message}`;
  }
  // Database logging
  try {
    await prisma.auditLog.create({
      data: {
        userId: "00000000-0000-0000-0000-000000000000", // Will fail if no system user, so catch it
        action: "UPDATE",
        entityType: "WAR_ROOM_COMMAND",
        entityId: "system",
        ipAddress: "127.0.0.1",
      }
    });
  } catch (e) {
    // Ignore if system user doesn't exist
  }

  return {
    agent: assignedAgent,
    response: responseText,
    status: "ROUTED_SUCCESSFULLY"
  };
}
