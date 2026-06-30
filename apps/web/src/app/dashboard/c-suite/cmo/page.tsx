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
        { label: "Campagne Ideeën", text: "Bedenk 3 disruptieve marketingcampagnes voor organische groei op TikTok en Instagram." },
        { label: "Doelgroep Analyse", text: "Wie is de ideale doelgroep voor high-ticket B2B software en hoe bereik ik ze het best?" },
        { label: "Merk Identiteit", text: "Hoe positioneer ik mijn merk als een premium aanbieder in plaats van een budget optie?" }
      ]}
      themeColor="text-rose-400"
    />
  );
}
