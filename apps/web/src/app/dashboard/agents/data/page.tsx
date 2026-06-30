"use client";
import { AgentChatInterface } from "@/components/AgentChatInterface";
import { Activity } from "lucide-react";

export default function DataPage() {
  return (
    <AgentChatInterface
      agentId="HERMES"
      agentName="Data & Analytics Agent"
      agentRole="Number Cruncher & Pattern Finder"
      agentDescription="Kijkt naar de harde cijfers, ziet patronen en vertelt je precies waar de gaten in je omzet zitten."
      icon={<Activity className="w-5 h-5 text-white" />}
      suggestedPrompts={[
        { label: "Churn Rate Verlagen", text: "Mijn SaaS heeft 10% churn per maand. Wat zijn statistisch gezien de beste manieren om dit te verlagen?" },
        { label: "LTV Berekenen", text: "Help me mijn Customer Lifetime Value (LTV) accuraat berekenen inclusief upsells." },
        { label: "Analytics Setup", text: "Welke custom events in GA4 zijn absoluut noodzakelijk om een e-com funnel goed te meten?" },
        { label: "Cohort Analyse", text: "Hoe bouw en lees ik een cohort analyse om te zien wanneer klanten afhaken?" },
        { label: "KPI Dashboarding", text: "Welke 5 Key Performance Indicators (KPI's) moet ik als oprichter dagelijks monitoren?" },
        { label: "Data Opschonen", text: "Mijn data is vervuild met bots en interne IP's, hoe filter ik dit voor een accuraat beeld?" }
      ]}
      themeColor="text-violet-400"
    />
  );
}
