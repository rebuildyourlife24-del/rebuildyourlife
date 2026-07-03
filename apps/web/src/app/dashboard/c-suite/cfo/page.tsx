import { prisma } from '@rebuildyourlife/database';
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { AgentChatInterface } from "@/components/AgentChatInterface";
import { Briefcase } from "lucide-react";

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

export default async function CFOPage() {
  const userId = await getAuthenticatedUser();
  let contextData = "Geen financiële data gevonden.";

  if (userId) {
    // Haal financiële snapshots op
    const revenueStats = await prisma.revenueSnapshot.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 1
    });

    // Haal Treasury Vaults op (spaarrekeningen/reserves)
    const vaults = await prisma.treasuryVault.findMany({
      where: { userId }
    });

    const recentSnapshot = revenueStats[0];

    contextData = `
    LAATSTE FINANCIELE SNAPSHOT:
    ${recentSnapshot ? `Omzet: €${recentSnapshot.revenue}, Winst: €${recentSnapshot.profit}, ROAS: ${recentSnapshot.roas}x` : 'Geen omzetdata beschikbaar.'}
    
    TREASURY VAULTS (RESERVES):
    ${vaults.length > 0 ? vaults.map(v => `- ${v.name}: €${v.balance}`).join('\n') : 'Geen actieve vaults/reserves.'}
    `;
  }

  return (
    <AgentChatInterface
      agentId="CFO"
      agentName="CFO Agent"
      agentRole="Profit & Capital"
      agentDescription="Focus op marges, kostenreductie en cashflow optimalisatie."
      icon={<Briefcase className="w-5 h-5 text-white" />}
      suggestedPrompts={[
        { label: "Kostenbesparing", text: "Ik wil mijn vaste lasten verlagen. Analyseer de meest voorkomende onnodige kosten in e-commerce en waar ik direct op kan snijden." },
        { label: "Winstmarge Optimalisatie", text: "Hoe bereken en vergroot ik mijn netto winstmarge effectief op bestaande producten?" },
        { label: "Cashflow Prognose", text: "Help me een cashflow prognose opzetten voor de komende 6 maanden." },
        { label: "Investering Bepalen", text: "Hoeveel procent van mijn omzet moet ik herinvesteren in advertenties versus reserveren voor de belastingdienst?" },
        { label: "Prijzen Veranderen", text: "Wat is de beste strategie om mijn prijzen te verhogen zonder direct klanten te verliezen?" },
        { label: "Bedrijfsvorm (BV)", text: "Vanaf welke winst is het fiscaal aantrekkelijk om over te stappen van een eenmanszaak naar een BV structuur?" }
      ]}
      themeColor="text-emerald-400"
      contextData={contextData}
    />
  );
}
