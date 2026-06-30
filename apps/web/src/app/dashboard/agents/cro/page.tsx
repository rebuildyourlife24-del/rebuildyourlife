"use client";
import { AgentChatInterface } from "@/components/AgentChatInterface";
import { Map } from "lucide-react";

export default function CROPage() {
  return (
    <AgentChatInterface
      agentId="HERMES"
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
  );
}
