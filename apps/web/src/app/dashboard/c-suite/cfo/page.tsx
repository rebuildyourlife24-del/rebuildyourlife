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
        { label: "Kosten Analyse", text: "Ik wil mijn vaste lasten verlagen. Welke SaaS tools en onkosten kan ik vaak elimineren?" },
        { label: "Prijsstrategie", text: "Mijn conversie is goed maar de marge is laag. Hoe kan ik mijn prijzen verhogen zonder klanten te verliezen?" },
        { label: "Cashflow Projectie", text: "Bereken de benodigde cashflow om een nieuw product te lanceren in 3 maanden." }
      ]}
      themeColor="text-emerald-400"
    />
  );
}
