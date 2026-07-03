import { prisma } from '@rebuildyourlife/database';
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { AgentChatInterface } from "@/components/AgentChatInterface";
import { Search } from "lucide-react";

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

export default async function SEOPage() {
  const userId = await getAuthenticatedUser();
  let contextData = "Geen SEO acties gevonden.";

  if (userId) {
    const recentActions = await prisma.agentAction.findMany({
      where: { userId, agentType: 'SEO' },
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    contextData = `
    RECENTE SEO ACTIES:
    ${recentActions.length > 0 ? recentActions.map(a => `- ${a.actionType} | Status: ${a.status} | Details: ${a.resultData}`).join('\n') : 'Geen recente SEO acties in de database.'}
    `;
  }

  return (
    <AgentChatInterface
      agentId="SEO"
      agentName="SEO & Traffic Agent"
      agentRole="Organic Reach Specialist"
      agentDescription="Analyseert zoekwoorden, optimaliseert je websites voor organisch bereik en stuurt aan op gratis traffic."
      icon={<Search className="w-5 h-5 text-white" />}
      suggestedPrompts={[
        { label: "Keyword Research", text: "Vind de top 5 long-tail keywords voor mijn niche met een hoge zoekvolume en lage concurrentie." },
        { label: "On-Page SEO Check", text: "Hoe optimaliseer ik de H1, meta-tags en interne links van mijn landingspagina?" },
        { label: "Content Strategie", text: "Maak een contentkalender voor de komende maand gericht op organische SEO groei." },
        { label: "Backlink Strategie", text: "Wat is momenteel de beste manier om kwalitatieve backlinks te krijgen in 2024 zonder penalty's?" },
        { label: "Lokale SEO", text: "Hoe kom ik in de 'Google Local Pack' (map) bovenaan voor fysieke klanten in mijn regio?" },
        { label: "Tech SEO Audit", text: "Wat zijn de 5 meest gemaakte technische SEO fouten (zoals crawl budget, core web vitals)?" }
      ]}
      themeColor="text-teal-400"
      contextData={contextData}
    />
  );
}
