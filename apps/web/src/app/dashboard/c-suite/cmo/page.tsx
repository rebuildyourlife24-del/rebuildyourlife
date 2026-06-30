"use client";
import { AgentChatInterface } from "@/components/AgentChatInterface";
import { Activity } from "lucide-react";

export default function CMOPage() {
  return (
    <AgentChatInterface
      agentId="HERMES"
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
    />
  );
}
