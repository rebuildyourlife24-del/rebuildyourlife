"use client";
import { AgentChatInterface } from "@/components/AgentChatInterface";
import { Briefcase } from "lucide-react";

export default function CFOPage() {
  return (
    <AgentChatInterface
      agentId="ORION"
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
    />
  );
}
