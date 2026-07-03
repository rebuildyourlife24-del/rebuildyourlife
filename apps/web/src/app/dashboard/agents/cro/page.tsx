import { AgentChatInterface } from "@/components/AgentChatInterface";
import { Map } from "lucide-react";
import { VisionScanner } from "@/components/ui/VisionScanner";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@rebuildyourlife/database";

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

async function getAuthenticatedUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("ryl_session")?.value;
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return await prisma.user.findUnique({ where: { id: decoded.userId } });
  } catch {
    return null;
  }
}

export default async function CROPage() {
  const user = await getAuthenticatedUser();
  if (!user) redirect("/auth/login");

    const recentActions = await prisma.agentAction.findMany({
      where: { userId: user.id, agentType: 'CRO' },
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    const contextData = `
    RECENTE CRO ACTIES:
    ${recentActions.length > 0 ? recentActions.map(a => `- ${a.actionType} | Status: ${a.status} | Details: ${a.resultData}`).join('\n') : 'Geen recente CRO acties in de database.'}
    `;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-[calc(100vh-6rem)]">
      {/* Links: The Vision Scanner (Takes 1 column) */}
      <div className="xl:col-span-1 flex flex-col gap-6 overflow-y-auto custom-scrollbar pr-2">
        <VisionScanner userId={user.id} />
        
        {/* Additional CRO metrics could go here in the future */}
        <div className="bg-slate-900 border border-white/10 rounded-2xl p-6">
          <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4">Recente CRO Acties</h4>
          <ul className="text-sm text-slate-400 space-y-2">
            {recentActions.length === 0 && <li>Geen CRO acties in database.</li>}
            {recentActions.map(action => (
              <li key={action.id} className="border-b border-white/5 pb-2 last:border-0">
                <span className="text-white">{action.actionType}</span> ({action.status})<br/>
                <span className="text-xs text-slate-500 truncate block mt-1">{action.resultData}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Rechts: De Chat Interface (Takes 2 columns) */}
      <div className="xl:col-span-2 h-full">
        <AgentChatInterface
          agentId="CRO"
          contextData={contextData}
          agentName="CRO Agent"
          agentRole="Conversion Rate Optimizer"
          agentDescription="Geobsedeerd door het verhogen van het percentage bezoekers dat koper wordt (A/B testen, funnels, webdesign feedback)."
          icon={<Map className="w-5 h-5 text-white" />}
          suggestedPrompts={[
            { label: "Funnel Analyse", text: "Mijn check-out drop-off is 70%. Wat zijn de meest voorkomende redenen en hoe fix ik dit?" },
            { label: "A/B Test Ideeën", text: "Geef me 3 ideeën voor A/B testen op mijn hero sectie om meer clicks op de CTA te krijgen." },
            { label: "Landing Page Review", text: "Welke psychologische triggers ontbreken er op een standaard SaaS salespagina?" }
          ]}
          themeColor="text-fuchsia-400"
        />
      </div>
    </div>
  );
}
