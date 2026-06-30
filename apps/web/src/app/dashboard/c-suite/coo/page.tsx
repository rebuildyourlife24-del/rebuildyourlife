"use client";
import { AgentChatInterface } from "@/components/AgentChatInterface";
import { Network } from "lucide-react";

export default function COOPage() {
  return (
    <AgentChatInterface
      agentId="HERMES"
      agentName="COO Agent"
      agentRole="Systems & Operations"
      agentDescription="Optimaliseert interne processen en koppelt tools aan elkaar om tijd te besparen."
      icon={<Network className="w-5 h-5 text-white" />}
      suggestedPrompts={[
        { label: "Automatiseer Onboarding", text: "Maak een Zapier/Make workflow om nieuwe klanten automatisch in ons CRM te zetten en een welkomstmail te sturen." },
        { label: "Proces Optimalisatie", text: "Het afhandelen van support tickets kost te veel tijd. Hoe kan ik dit stroomlijnen met AI tools?" },
        { label: "Tech Stack Review", text: "Review mijn tech stack (Shopify, Klaviyo, Zendesk) en vertel me of er goedkopere/betere alternatieven zijn." },
        { label: "Voorraadbeheer", text: "Hoe optimaliseer ik mijn voorraadbeheer zodat ik nooit out-of-stock ben zonder te veel werkkapitaal vast te zetten?" },
        { label: "SOPs Schrijven", text: "Schrijf een Standard Operating Procedure (SOP) voor het inhuren en trainen van een nieuwe klantenservice medewerker." },
        { label: "Knelpunten Detecteren", text: "Waar liggen volgens jou de grootste operationele knelpunten bij een bedrijf dat snel van 10k naar 50k p/m schaalt?" }
      ]}
      themeColor="text-amber-400"
    />
  );
}
