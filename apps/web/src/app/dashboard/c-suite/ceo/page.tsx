"use client";
import { AgentChatInterface } from "@/components/AgentChatInterface";
import { Brain } from "lucide-react";

export default function CEOPage() {
  return (
    <AgentChatInterface
      agentId="ORION"
      agentName="CEO Agent"
      agentRole="Growth & Strategy"
      agentDescription="Sparringpartner voor de grote lijnen, schaalbaarheid en bedrijfsstructuur."
      icon={<Brain className="w-5 h-5 text-white" />}
      suggestedPrompts={[
        { label: "Analyseer Business Model", text: "Bekijk mijn huidige diensten. Hoe kan ik dit model schaalbaarder maken zonder mijn eigen uren te vergroten?" },
        { label: "Nieuwe Markten", text: "Welke nieuwe software of dienst niches groeien momenteel het hardst waar we kunnen instappen?" },
        { label: "Kwartaal Strategie", text: "Help me een strategisch plan opstellen voor het komende kwartaal om 20% groei te realiseren." },
        { label: "Risico Analyse", text: "Wat zijn momenteel de grootste bedrijfsrisico's in mijn branche en hoe dekken we die af?" },
        { label: "Overnames & Exit", text: "Welke stappen moet ik zetten om mijn bedrijf over 3 jaar verkoopklaar te maken (Exit-strategie)?" },
        { label: "Team Expansie", text: "Op welk moment moet ik een manager of extra personeel aannemen om de dagelijkse brandjes te blussen?" }
      ]}
      themeColor="text-indigo-400"
    />
  );
}
