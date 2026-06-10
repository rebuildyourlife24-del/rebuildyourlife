import OpenAI from "openai";
import { prisma } from "@rebuildyourlife/database";
import { AgentType } from "@rebuildyourlife/shared";
import { AGENT_DEFINITIONS } from "@rebuildyourlife/shared";
import { env } from "../config/env.js";
import { NotFoundError, ForbiddenError, AppError } from "../middleware/errorHandler.js";

const AGENT_SYSTEM_PROMPTS: Record<AgentType, string> = {
  CEO: `Je bent de CEO en Hoofdstrateeg van RebuildYourLife. Jouw persoonlijkheid is vergelijkbaar met een elite Silicon Valley executive: scherp, visionair, direct, extreem bekwaam en resultaatgericht. Je helpt de gebruiker met het bouwen van een waterdichte langetermijnvisie, het prioriteren van de grootste hefbomen in hun leven en het nemen van meedogenloze maar noodzakelijke beslissingen. Je houdt het grote overzicht en stuurt de andere AI-agenten aan. Je communiceert altijd in professioneel, inspirerend en loepzuiver Nederlands.`,
  LIFE_COACH: `Je bent de Elite Life Coach van RebuildYourLife. Je helpt de gebruiker met persoonlijke doelen, dagelijkse routines, motivatie en levensbalans. Je bent empathisch maar hanteert een no-nonsense standaard van excellentie. Communiceer in het Nederlands.`,
  RECOVERY: `Je bent de Recovery Specialist van RebuildYourLife. Je begeleidt herstelprogramma's met wetenschappelijke precisie en diep psychologisch inzicht. Je biedt structuur en onvoorwaardelijke steun. Communiceer in het Nederlands.`,
  FINANCIAL: `Je bent de CFO / Financieel Strateeg van RebuildYourLife. Je beheert budgetten met chirurgische precisie en bouwt aan exponentiële financiële stabiliteit. Je geeft concrete, high-level adviezen. Communiceer in het Nederlands.`,
  DEBT_ENGINE: `Je bent de Debt Resolution Architect van RebuildYourLife. Je berekent optimale aflossingsroutes en ontwerpt ontsnappingsplannen voor schulden. Je bent meedogenloos analytisch tegenover schuldeisers en uiterst beschermend naar de cliënt. Communiceer in het Nederlands.`,
  TASK_EXECUTOR: `Je bent de Chief Operations Officer (COO) van RebuildYourLife. Je organiseert taken, stelt meedogenloze prioriteiten en eist efficiëntie. Communiceer in het Nederlands.`,
  ANALYTICS: `Je bent de Data Scientist van RebuildYourLife. Je analyseert data met machine-learning achtige precisie en ontdekt patronen die niemand anders ziet. Je presenteert inzichten helder en data-gedreven. Communiceer in het Nederlands.`,
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

  const messages: OpenAI.ChatCompletionMessageParam[] = [
    { role: "system", content: systemPrompt },
    ...history,
    { role: "user", content: input.message },
  ];

  let assistantContent: string;
  let tokenCount: number | undefined;

  try {
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { openaiKey: true } });
    const apiKey = user?.openaiKey || env.OPENAI_API_KEY;

    if (!apiKey || apiKey === "sk-placeholder") {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1500));
      assistantContent = `(MOCK) Dit is een gesimuleerd antwoord van je ${agentType} AI Coworker. Ga naar 'Instellingen' om je eigen OpenAI API Key in te vullen!`;
      tokenCount = 50;
    } else {
      const openai = new OpenAI({ apiKey });
      const completion = await openai.chat.completions.create({
        model: env.OPENAI_MODEL,
        messages,
        temperature: 0.7,
        max_tokens: 2048,
      });

      assistantContent =
        completion.choices[0]?.message?.content ??
        "Ik kon geen antwoord genereren. Probeer het opnieuw.";
      tokenCount = completion.usage?.total_tokens ?? undefined;
    }
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new AppError(
      "Er is een fout opgetreden bij het verwerken van je bericht. Probeer het later opnieuw.",
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
      embedding: null,
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

  const apiKey = env.OPENAI_API_KEY;
  if (!apiKey || apiKey === "sk-placeholder") {
    return {
      agent: "ORION_CORE",
      response: "(MOCK) Orion Core is offline door ontbrekende API sleutel.",
      status: "ROUTED_SUCCESSFULLY"
    };
  }

  const openai = new OpenAI({ apiKey });
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: prompt }
    ],
    temperature: 0.7,
  });

  const text = completion.choices[0]?.message?.content || "{}";
  let assignedAgent: string = 'ORION_CORE';
  let responseText = 'System anomaly: Could not parse AI response.';

  try {
    const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const aiDecision = JSON.parse(cleanJson);
    assignedAgent = aiDecision.agent || 'ORION_CORE';
    responseText = aiDecision.response || text;
  } catch (e) {
    responseText = text;
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
