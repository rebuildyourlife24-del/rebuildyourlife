import { prisma } from '@rebuildyourlife/database';
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { AgentChatInterface } from "@/components/AgentChatInterface";
import { Activity } from "lucide-react";

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

export default async function CMOPage() {
  const userId = await getAuthenticatedUser();
  let contextData = "Geen marketing campagnes gevonden.";

  if (userId) {
    // Haal actieve advertentiecampagnes op
    const campaigns = await prisma.socialCampaign.findMany({
      where: { userId, status: 'ACTIVE' },
      take: 5
    });

    contextData = `
    ACTIEVE MARKETING CAMPAGNES:
    ${campaigns.length > 0 ? campaigns.map(c => `- ${c.platform} | Doel: ${c.goal} | Budget: €${c.budget} | Besteed: €${c.spend}`).join('\n') : 'Er draaien momenteel geen actieve marketing campagnes.'}
    `;
  }

  return (
    <AgentChatInterface
      agentId="CMO"
      agentName="CMO Agent"
      agentRole="Marketing & Acquisition"
      agentDescription="Verantwoordelijk voor de gehele marketingstrategie en conversie."
      icon={<Activity className="w-5 h-5 text-white" />}
      suggestedPrompts={[
        { label: "Acquisitie Strategie", text: "Bedenk een agressieve, maar rendabele klantacquisitie strategie (CAC) voor high-ticket producten." },
        { label: "Merk Identiteit", text: "Hoe bouw ik een luxury brand-identiteit op die zich onderscheidt van dropshippers?" },
        { label: "Nieuwe Kanalen", text: "TikTok en Meta draaien goed, welk onontgonnen acquisitiekanaal moeten we nu gaan domineren?" },
        { label: "Viraliteit", text: "Wat is de exacte psychologie achter een virale marketingcampagne die we deze maand kunnen lanceren?" },
        { label: "Klantbehoud (LTV)", text: "Mijn Lifetime Value is te laag. Wat zijn de 3 beste email-marketing strategieën om bestaande klanten te laten terugkeren?" },
        { label: "Concurrentie Analyse", text: "Hoe ontleed ik de marketingfunnel van mijn grootste concurrent en pak ik hun blinde vlekken aan?" }
      ]}
      themeColor="text-rose-400"
      contextData={contextData}
    />
  );
}
