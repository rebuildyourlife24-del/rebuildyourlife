import { prisma } from '@rebuildyourlife/database';
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { AgentChatInterface } from "@/components/AgentChatInterface";
import { Network } from "lucide-react";

const JWT_SECRET = process.env.JWT_SECRET! || "fallback";

async function getAuthenticatedUser() {
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

export default async function COOPage() {
  const userId = await getAuthenticatedUser();
  let contextData = "Geen operationele data gevonden.";

  if (userId) {
    // Haal recente agent acties op (operaties)
    const recentActions = await prisma.agentAction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    const systemLogs = await prisma.systemHealthLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    contextData = `
    RECENTE OPERATIONELE ACTIES (AUTOMATISERING):
    ${recentActions.length > 0 ? recentActions.map(a => `- ${a.agentType}: ${a.actionType} | Status: ${a.status} | Details: ${a.resultData}`).join('\n') : 'Geen recente automatiseringsacties gedetecteerd.'}
    
    [AUTO-HEAL DIAGNOSTICS]:
    ${systemLogs.length > 0 ? systemLogs.map(l => `[${l.status}] Component: ${l.component} - ${l.errorLog}`).join('\n') : 'Systeem functioneert 100%. Geen losse eindjes.'}
    `;
  }

  return (
    <AgentChatInterface
      agentId="COO"
      agentName="COO Agent"
      agentRole="Systems & Operations"
      agentDescription="Optimaliseert interne processen en koppelt tools aan elkaar om tijd te besparen."
      icon={<Network className="w-5 h-5 text-white" />}
      suggestedPrompts={[
        { label: "Automatiseer Onboarding", text: "Maak een Zapier/Make workflow om nieuwe klanten automatisch in ons CRM te zetten en een welkomstmail te sturen." },
        { label: "Proces Optimalisatie", text: "Het afhandelen van support tickets kost te veel tijd. Hoe kan ik dit stroomlijnen met AI tools?" },
        { label: "Tech Stack Review", text: "Review mijn tech stack (Shopify, Klaviyo, Zendesk) en vertel me of er goedkopere/betere alternatieven zijn." },
        { label: "Voorraadbeheer", text: "Hoe optimaliseer ik mijn voorraadbeheer zodat ik nooit out-of-stock ben zonder te veel werkkapitaal vast te zetten?" },
        { label: "SOPs Schrijven", text: "Schrijf een Standard Operating Procedure (SOP) voor het inhuren en trainen van een nieuwe klantenservice medewerker." },
        { label: "Knelpunten Detecteren", text: "Waar liggen volgens jou de grootste operationele knelpunten bij een bedrijf dat snel van 10k naar 50k p/m schaalt?" }
      ]}
      themeColor="text-amber-400"
      contextData={contextData}
    />
  );
}
