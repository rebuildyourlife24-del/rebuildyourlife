import { prisma } from '@rebuildyourlife/database';
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { AgentChatInterface } from "@/components/AgentChatInterface";
import { Terminal } from "lucide-react";

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

export default async function CopywriterPage() {
  const userId = await getAuthenticatedUser();
  let contextData = "Geen copywriting acties gevonden.";

  if (userId) {
    const recentActions = await prisma.agentAction.findMany({
      where: { userId, agentType: 'COPYWRITER' },
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    contextData = `
    RECENTE COPYWRITING ACTIES:
    ${recentActions.length > 0 ? recentActions.map(a => `- ${a.actionType} | Status: ${a.status} | Details: ${a.resultData}`).join('\n') : 'Geen recente copy acties in de database.'}
    `;
  }

  return (
    <AgentChatInterface
      agentId="COPYWRITER"
      agentName="Copywriter Agent"
      agentRole="Sales & Content Wordsmith"
      agentDescription="Schrijft verkoopteksten, advertentie-copy, en e-mail funnels die converteren."
      icon={<Terminal className="w-5 h-5 text-white" />}
      suggestedPrompts={[
        { label: "Sales Email Reeks", text: "Schrijf een 3-delige welkomst email reeks voor nieuwe abonnees om ze te converteren naar de betaalde versie." },
        { label: "Ad Copy", text: "Schrijf 3 verschillende Facebook ad teksten gericht op de pijnpunten van ondernemers zonder tijd." },
        { label: "Voordelen vs Features", text: "Hoe vertaal ik 'AI aangedreven dashboard' naar een emotioneel voordeel dat de klant écht raakt?" },
        { label: "Video Sales Letter", text: "Schrijf een script outline voor een 3-minuten Video Sales Letter (VSL) met een sterke hook." },
        { label: "SMS Marketing", text: "Schrijf 5 urgente maar niet-spammy SMS berichten voor een Black Friday campagne." },
        { label: "Overtuigen", text: "Wat is de 'PAS' (Problem-Agitate-Solve) formule en hoe pas ik die toe op mijn landingspagina?" }
      ]}
      themeColor="text-orange-400"
      contextData={contextData}
    />
  );
}
