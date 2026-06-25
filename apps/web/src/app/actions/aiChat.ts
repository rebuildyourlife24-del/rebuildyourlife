"use server";

import { prisma } from "@rebuildyourlife/database";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { Sentinel } from "../../lib/orion/sentinel-scanner";
import { routeAIRequest } from "../../lib/ai-router";


const JWT_SECRET = process.env.JWT_SECRET ;

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

    // Roep de AI aan via de Sovereign AI Router
    let aiResponse = '';

    // Haal recente berichten op als context
    const recentMessages = await prisma.aIMessage.findMany({
      where: { conversationId: conversation.id },
      orderBy: { createdAt: 'asc' },
      take: 10,
    });

    const AGENT_PERSONAS: Record<string, string> = {
      HERMES: "Je bent Hermes, de 24/7 AI-Uitvoerder en Executieve Bedrijfsassistent van Henk Semler en RYL. Je blinkt uit in actiegerichte antwoorden, automation scripts schrijven, marketingplannen uitvoeren, code genereren en taken direct volbrengen. Je bent direct, praktisch en gefocust op snelheid en resultaat. Spreek altijd Nederlands.",
      ORION: "Je bent Orion, de Strategische AI-Architect en Business Brain van Henk Semler en RYL. Je blinkt uit in diepgaande marktanalyse, financiële planning, bedrijfsstructuren ontwerpen, risico-inschatting en lange-termijn strategieën om financieel en fysiek te groeien. Je bent analytisch, intellectueel en strategisch. Spreek altijd Nederlands.",
      DEBT_ADVISOR: "Je bent een empathische financieel adviseur gespecialiseerd in schuldhulp. Je helpt mensen met schulden op een praktische, menselijke manier. Spreek altijd Nederlands.",
      LIFE_COACH: "Je bent een warme maar doelgerichte life coach. Je helpt mensen met doelen stellen, motivatie en persoonlijke groei. Spreek altijd Nederlands.",
      CEO: "Je bent een strategische AI CEO-assistent. Je geeft zakelijk advies, helpt met planning en besluitvorming. Spreek altijd Nederlands.",
      LEGAL: "Je bent een juridisch AI-adviseur die mensen helpt begrijpen wat hun rechten zijn t.o.v. schuldeisers. Geef ALTIJD het advies om een echte advocaat te raadplegen voor serieuze zaken. Spreek altijd Nederlands.",
      FINANCIAL: "Je bent een financieel AI-coach die helpt met budgetteren, sparen en investeren. Spreek altijd Nederlands.",
    };

    const systemPrompt = AGENT_PERSONAS[agentType] || "Je bent een behulpzame AI assistent. Spreek altijd Nederlands.";

    // Bouw berichten array voor API Router
    const messagesForApi = recentMessages.slice(-8).map(m => ({
      role: (m.role === 'user' ? 'user' : 'assistant') as 'user' | 'assistant',
      content: m.content,
    }));

    try {
      const routerResponse = await routeAIRequest(messagesForApi, systemPrompt);
      aiResponse = routerResponse.content;
    } catch (routerError: any) {
      console.error("[AI CHAT ACTION] AI Router error:", routerError);
      aiResponse = "Ik ondervind momenteel technische problemen bij het verwerken van uw aanvraag. Probeer het later nog eens.";
    }

    // Parse actions and execute them in the workspace (filesystem & terminal)
    let finalResponseContent = aiResponse;
    const writeRegex = /<<<WRITE_FILE:\s*([^\n>]+)>>>([\s\S]*?)<<<END_WRITE_FILE>>>/g;
    const execRegex = /<<<EXECUTE_COMMAND>>>([\s\S]*?)<<<END_EXECUTE_COMMAND>>>/g;

    const fs = require('fs');
    const path = require('path');
    const { execSync } = require('child_process');

    const workspaceRoot = path.resolve(process.cwd(), '../../'); // Resolved workspace root
    let match;
    let executionLog = "";

    // 1. WRITE_FILE execution
    while ((match = writeRegex.exec(aiResponse)) !== null) {
      const relPath = match[1].trim();
      const content = match[2];
      const absPath = path.resolve(workspaceRoot, relPath);

      if (absPath.startsWith(workspaceRoot)) {
        try {
          fs.mkdirSync(path.dirname(absPath), { recursive: true });
          fs.writeFileSync(absPath, content, 'utf-8');
          executionLog += `\n[Systeem: Bestand succesvol geschreven naar ${relPath}]`;
        } catch (e: any) {
          executionLog += `\n[Systeem: Fout bij schrijven naar ${relPath}: ${e.message}]`;
        }
      } else {
        executionLog += `\n[Systeem: Toegang geweigerd voor schrijven naar pad buiten de workspace: ${relPath}]`;
      }
    }

    // 2. EXECUTE_COMMAND execution
    while ((match = execRegex.exec(aiResponse)) !== null) {
      const command = match[1].trim();
      try {
        const stdout = execSync(command, { 
          cwd: workspaceRoot,
          timeout: 30000,
          encoding: 'utf-8'
        });
        executionLog += `\n[Systeem: Commando '${command}' uitgevoerd. Output:\n${stdout}]`;
      } catch (e: any) {
        executionLog += `\n[Systeem: Commando '${command}' falen. Error: ${e.message}\nOutput: ${e.stdout || ''}]`;
      }
    }

    if (executionLog) {
      finalResponseContent += `\n\n=== EXECUTIE LOGS ===${executionLog}`;

      // Log the execution to SystemActivityLog in the database
      try {
        await prisma.systemActivityLog.create({
          data: {
            userId,
            action: "AGENT_EXECUTE_ACTION",
            category: "TECH",
            status: "SUCCESS",
            metadata: JSON.stringify({
              agentType,
              executionLog,
              rawResponse: aiResponse
            })
          }
        });
      } catch (logErr) {
        console.error("Failed to write AGENT_EXECUTE_ACTION log:", logErr);
      }
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
  } catch (error) {
    console.error("sendAIMessageAction error:", error);
    return { success: false, error: "Er is een fout opgetreden bij het verwerken van je bericht." };
  }
}
