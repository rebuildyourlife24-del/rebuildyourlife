import { prisma } from '@rebuildyourlife/database';
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { AgentChatInterface } from "@/components/AgentChatInterface";
import { Brain } from "lucide-react";

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

export default async function CEOPage() {
  const userId = await getAuthenticatedUser();
  let contextData = "Geen bedrijfsdoelen of systeem logs gevonden.";

  if (userId) {
    // Haal actieve bedrijfsdoelen op
    const goals = await prisma.goal.findMany({
      where: { userId, status: { not: 'COMPLETED' } },
      take: 5
    });

    // Haal systeem errors of waarschuwingen op (COO / System overview)
    const systemLogs = await prisma.systemHealthLog.findMany({
      where: { status: { not: 'HEALTHY' } },
      orderBy: { createdAt: 'desc' },
      take: 3
    });

    contextData = `
    Huidige Actieve Doelen:
    ${goals.length > 0 ? goals.map(g => `- ${g.title} (Status: ${g.status}, Progress: ${g.progress}%)`).join('\n') : 'Geen actieve doelen.'}
    
    Recente Systeem Waarschuwingen:
    ${systemLogs.length > 0 ? systemLogs.map(l => `- ${l.component}: ${l.status} (${l.errorLog || 'Geen details'})`).join('\n') : 'Alle systemen functioneren optimaal.'}
    `;
  }

  return (
    <AgentChatInterface
      agentId="CEO"
      agentName="CEO Agent"
      agentRole="Growth & Strategy"
      agentDescription="Sparringpartner voor de grote lijnen, schaalbaarheid en bedrijfsstructuur."
      icon={<Brain className="w-5 h-5 text-white" />}
      suggestedPrompts={[
        { label: "Analyseer Business Model", text: "Bekijk mijn huidige diensten. Hoe kan ik dit model schaalbaarder maken zonder mijn eigen uren te vergroten?" },
        { label: "Nieuwe Markten", text: "Welke nieuwe software of dienst niches groeien momenteel het hardst waar we kunnen instappen?" },
        { label: "Kwartaal Strategie", text: "Help me een strategisch plan opstellen voor het komende kwartaal om 20% groei te realiseren." },
        { label: "Risico Analyse", text: "Wat zijn momenteel de grootste bedrijfsrisico's in mijn branche en hoe dekken we die af?" },
        { label: "Overnames & Exit", text: "Welke stappen moet ik zetten om mijn bedrijf over 3 jaar verkoopklaar te maken (Exit-strategie)?" },
        { label: "Team Expansie", text: "Op welk moment moet ik een manager of extra personeel aannemen om de dagelijkse brandjes te blussen?" }
      ]}
      themeColor="text-indigo-400"
      contextData={contextData}
    />
  );
}
