"use client";
import { AgentChatInterface } from "@/components/AgentChatInterface";
import { Search } from "lucide-react";

export default function SEOPage() {
  return (
    <AgentChatInterface
      agentId="HERMES"
      agentName="SEO & Traffic Agent"
      agentRole="Organic Reach Specialist"
      agentDescription="Analyseert zoekwoorden, optimaliseert je websites voor organisch bereik en stuurt aan op gratis traffic."
      icon={<Search className="w-5 h-5 text-white" />}
      suggestedPrompts={[
        { label: "Keyword Research", text: "Vind de top 5 long-tail keywords voor mijn niche met een hoge zoekvolume en lage concurrentie." },
        { label: "On-Page SEO Check", text: "Hoe optimaliseer ik de H1, meta-tags en interne links van mijn landingspagina?" },
        { label: "Content Strategie", text: "Maak een contentkalender voor de komende maand gericht op SEO groei." }
      ]}
      themeColor="text-teal-400"
    />
  );
}
