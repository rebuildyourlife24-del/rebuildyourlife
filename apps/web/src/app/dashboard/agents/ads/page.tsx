import { prisma } from '@rebuildyourlife/database';
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { AgentChatInterface } from "@/components/AgentChatInterface";
import { Tv } from "lucide-react";

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

export default async function AdsPage() {
  const userId = await getAuthenticatedUser();
  let contextData = "Geen Ads of campagnes gevonden.";

  if (userId) {
    const campaigns = await prisma.socialCampaign.findMany({
      where: { userId, status: 'ACTIVE' },
      take: 5
    });

    const recentActions = await prisma.agentAction.findMany({
      where: { userId, agentType: 'ADS' },
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    contextData = `
    ACTIEVE CAMPAGNES:
    ${campaigns.length > 0 ? campaigns.map(c => `- ${c.platform} (Budget: €${c.budget}, Spend: €${c.spend})`).join('\n') : 'Geen actieve campagnes.'}
    
    RECENTE ADS ACTIES:
    ${recentActions.length > 0 ? recentActions.map(a => `- ${a.actionType} | Status: ${a.status} | Details: ${a.resultData}`).join('\n') : 'Geen recente ads acties in de database.'}
    `;
  }

  return (
    <AgentChatInterface
      agentId="ADS"
      agentName="Ads & Media Agent"
      agentRole="ROAS & Paid Traffic Optimizer"
      agentDescription="Analyseert ROAS en optimaliseert je betaalde campagnes op FB, Google, TikTok."
      icon={<Tv className="w-5 h-5 text-white" />}
      suggestedPrompts={[
        { label: "Ad Budget Verdeling", text: "Hoe verdeel ik €1000/maand budget tussen prospecting en retargeting voor het beste resultaat?" },
        { label: "Fix Slechte ROAS", text: "Mijn CTR is hoog (2%), maar conversie is laag en ROAS is onder de 1. Waar zit de fout?" },
        { label: "TikTok Ads Strategie", text: "Wat is de huidige meta voor TikTok ads en hoe structureer ik een User Generated Content (UGC) ad?" },
        { label: "Retargeting Funnel", text: "Hoe bouw ik een effectieve 3-stappen retargeting funnel op Facebook en Instagram?" },
        { label: "Google Search Ads", text: "Welke keyword match types moet ik uitsluiten om geen budget te verspillen op Google Ads?" },
        { label: "Creatives Analyseren", text: "Hoe test ik systematisch nieuwe ad creatives zonder direct honderden euro's weg te gooien?" }
      ]}
      themeColor="text-pink-400"
      contextData={contextData}
    />
  );
}
