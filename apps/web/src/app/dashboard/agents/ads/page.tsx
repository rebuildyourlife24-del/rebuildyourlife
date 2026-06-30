"use client";
import { AgentChatInterface } from "@/components/AgentChatInterface";
import { Tv } from "lucide-react";

export default function AdsPage() {
  return (
    <AgentChatInterface
      agentId="HERMES"
      agentName="Ads & Media Agent"
      agentRole="ROAS & Paid Traffic Optimizer"
      agentDescription="Analyseert ROAS en optimaliseert je betaalde campagnes op FB, Google, TikTok."
      icon={<Tv className="w-5 h-5 text-white" />}
      suggestedPrompts={[
        { label: "Ad Budget Verdeling", text: "Hoe verdeel ik €1000/maand budget tussen prospecting en retargeting voor het beste resultaat?" },
        { label: "Fix Slechte ROAS", text: "Mijn CTR is hoog (2%), maar conversie is laag en ROAS is onder de 1. Waar zit de fout?" },
        { label: "TikTok Ads Strategie", text: "Wat is de huidige meta voor TikTok ads en hoe structureer ik een User Generated Content (UGC) ad?" },
        { label: "Retargeting Funnel", text: "Hoe bouw ik een effectieve 3-stappen retargeting funnel op Facebook en Instagram?" },
        { label: "Google Search Ads", text: "Welke keyword match types moet ik uitsluiten om geen budget te verspillen op Google Ads?" },
        { label: "Creatives Analyseren", text: "Hoe test ik systematisch nieuwe ad creatives zonder direct honderden euro's weg te gooien?" }
      ]}
      themeColor="text-pink-400"
    />
  );
}
