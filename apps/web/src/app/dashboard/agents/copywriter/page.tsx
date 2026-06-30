"use client";
import { AgentChatInterface } from "@/components/AgentChatInterface";
import { Terminal } from "lucide-react";

export default function CopywriterPage() {
  return (
    <AgentChatInterface
      agentId="HERMES"
      agentName="Copywriter Agent"
      agentRole="Sales & Content Wordsmith"
      agentDescription="Schrijft verkoopteksten, advertentie-copy, en e-mail funnels die converteren."
      icon={<Terminal className="w-5 h-5 text-white" />}
      suggestedPrompts={[
        { label: "Sales Email Reeks", text: "Schrijf een 3-delige welkomst email reeks voor nieuwe abonnees om ze te converteren naar de betaalde versie." },
        { label: "Ad Copy", text: "Schrijf 3 verschillende Facebook ad teksten gericht op de pijnpunten van ondernemers zonder tijd." },
        { label: "Voordelen vs Features", text: "Hoe vertaal ik 'AI aangedreven dashboard' naar een emotioneel voordeel dat de klant écht raakt?" },
        { label: "Video Sales Letter", text: "Schrijf een script outline voor een 3-minuten Video Sales Letter (VSL) met een sterke hook." },
        { label: "SMS Marketing", text: "Schrijf 5 urgente maar niet-spammy SMS berichten voor een Black Friday campagne." },
        { label: "Overtuigen", text: "Wat is de 'PAS' (Problem-Agitate-Solve) formule en hoe pas ik die toe op mijn landingspagina?" }
      ]}
      themeColor="text-orange-400"
    />
  );
}
