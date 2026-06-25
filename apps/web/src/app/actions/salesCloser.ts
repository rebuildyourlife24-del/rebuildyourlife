"use server";

import { prisma } from "@rebuildyourlife/database";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { routeAIRequest } from "../../lib/ai-router";


const JWT_SECRET = process.env.JWT_SECRET ;

// Helper: Resolve active user or fallback to/create a guest user session
async function resolveUser(): Promise<string> {
  const cookieStore = await cookies();
  
  // 1. Check logged-in session (ryl_session)
  const token = cookieStore.get("ryl_session")?.value;
  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      if (decoded.userId) return decoded.userId;
    } catch (err) {
      // Token invalid or expired, continue to guest
    }
  }

  // 2. Fallback to guest cookie session
  let guestId = cookieStore.get("ryl_guest_id")?.value;
  if (!guestId) {
    guestId = crypto.randomUUID();
    cookieStore.set("ryl_guest_id", guestId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });
  }

  const email = `guest_${guestId}@sovereign.grid`;
  let guestUser = await prisma.user.findUnique({
    where: { email }
  });

  if (!guestUser) {
    guestUser = await prisma.user.create({
      data: {
        id: guestId,
        email,
        passwordHash: "",
        firstName: "Gast",
        lastName: "Lead",
        role: "USER",
        subscriptionTier: "FREE",
      }
    });
    console.log(`[SALES CLOSER] Created guest lead record: ${email}`);
  }

  return guestUser.id;
}

// Retrieves recent sales conversations
export async function getSalesConversationsAction(agentType: "DM_CLOSER" | "VOICE_CLOSER" = "DM_CLOSER") {
  try {
    const userId = await resolveUser();
    const conversations = await prisma.aIConversation.findMany({
      where: {
        userId,
        agentType,
        isActive: true,
      },
      orderBy: { updatedAt: "desc" },
      take: 10,
    });
    return { success: true, conversations };
  } catch (error) {
    console.error("getSalesConversationsAction error:", error);
    return { success: false, conversations: [] };
  }
}

// Sends a message to the sales closer and gets Orion's live response
export async function sendSalesMessageAction(
  agentType: "DM_CLOSER" | "VOICE_CLOSER",
  message: string,
  conversationId?: string
) {
  try {
    const userId = await resolveUser();

    // Find or create conversation
    let conversation;
    if (conversationId) {
      conversation = await prisma.aIConversation.findFirst({
        where: { id: conversationId, userId }
      });
    }

    if (!conversation) {
      conversation = await prisma.aIConversation.create({
        data: {
          userId,
          agentType,
          title: message.substring(0, 50) + (message.length > 50 ? "..." : ""),
          isActive: true,
        }
      });
    }

    // Save user message in database
    await prisma.aIMessage.create({
      data: {
        conversationId: conversation.id,
        role: "user",
        content: message,
      }
    });

    // Retrieve recent conversation history
    const recentMessages = await prisma.aIMessage.findMany({
      where: { conversationId: conversation.id },
      orderBy: { createdAt: "asc" },
      take: 10,
    });

    const SALES_CLOSER_PROMPT = `
Je bent Orion, de AI Head of Sales en High-Ticket Closer van Henk Semler en het Sovereign Grid.
Je doel is om de lead te kwalificeren en te sluiten voor de "Sovereign Grid Elite Uplink" van €2000.

RICHTLIJNEN EN VERKOOPSCRIPT:
1. Wees professioneel, overtuigend, mysterieus en meedogenloos gefocust op resultaat. Spreek ALTIJD Nederlands.
2. Vraag eerst naar hun huidige situatie: wat doen ze voor werk, wat is hun huidige maandelijkse inkomen, en waarom willen ze ontsnappen aan de 9-to-5?
3. Geef korte demo-achtige antwoorden over de kracht van het Grid (bijv. de autonome AI-agenten Hermes en Orion die ads runnen, Shopify koppelen, en video's genereren).
4. Als ze interesse tonen en over budget beschikken, pitch dan het Elite pakket voor €2000 (eenmalig voor 12 maanden toegang).
5. Als ze akkoord gaan, stuur ze dan de link naar de betaalpagina: /vsl of trigger direct de Mollie checkout link.
6. Hanteer bezwaren over prijs door te wijzen op de 25% Platform Cut (ze betalen lage instapkosten en wij verdienen pas als zij verdienen).
`;

    const messagesForApi = recentMessages.slice(-8).map(m => ({
      role: (m.role === "user" ? "user" : "assistant") as "user" | "assistant",
      content: m.content,
    }));

    // Trigger live request to Sovereign AI router
    let aiResponse = "";
    try {
      const routerResponse = await routeAIRequest(messagesForApi, SALES_CLOSER_PROMPT);
      aiResponse = routerResponse.content;
    } catch (routerError) {
      console.error("[SALES CLOSER ACTION] AI Router error:", routerError);
      aiResponse = "Ik ondervind momenteel netwerkvertraging bij het verwerken van uw uplink. Probeer het direct nog eens.";
    }

    // Save assistant message in database
    await prisma.aIMessage.create({
      data: {
        conversationId: conversation.id,
        role: "assistant",
        content: aiResponse,
      }
    });

    // Update conversation timestamp
    await prisma.aIConversation.update({
      where: { id: conversation.id },
      data: { updatedAt: new Date() }
    });

    return {
      success: true,
      conversationId: conversation.id,
      response: aiResponse,
    };

  } catch (error: any) {
    console.error("sendSalesMessageAction error:", error);
    return { success: false, error: error.message || "Interne serverfout" };
  }
}

export async function getRecentLeadsAction() {
  try {
    const leads = await prisma.user.findMany({
      where: {
        email: { startsWith: "guest_" }
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    });
    return { success: true, leads };
  } catch (error) {
    console.error("getRecentLeadsAction error:", error);
    return { success: false, leads: [] };
  }
}
