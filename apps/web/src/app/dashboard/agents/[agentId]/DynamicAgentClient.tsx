"use client";

import { AgentChatInterface } from "@/components/AgentChatInterface";
import { Target, Megaphone, PenTool, Bot, Briefcase, FileLineChart } from "lucide-react";
import { notFound } from "next/navigation";

export function DynamicAgentClient({ agentIdRaw }: { agentIdRaw: string }) {
  const agentId = agentIdRaw.toUpperCase() as "HERMES" | "CEO" | "CFO" | "CMO" | "ADS" | "COPY" | "DATA";

  const AGENTS_METADATA: Record<string, any> = {
    HERMES: {
      name: "Hermes",
      role: "Persoonlijk Assistent",
      description: "Jouw superslimme rechterhand in het Rebuild Your Life OS. Kan content zoeken, systeem navigatie uitleggen en simpele taken uitvoeren.",
      themeColor: "text-emerald-500",
      icon: <Bot className="w-8 h-8 text-emerald-500" />,
      suggestedPrompts: [
        { label: "Platform Navigatie", text: "Waar kan ik mijn Shopify winkel koppelen?" },
        { label: "Content Zoeken", text: "Welke module legt dropshipping product research uit?" },
        { label: "Mijn Voortgang", text: "Wat was ik de vorige keer aan het leren in de Academy?" }
      ]
    },
    CMO: {
      name: "CMO Agent",
      role: "Chief Marketing Officer",
      description: "Analyseert je markt, schrijft virale copy, en bouwt converterende funnels.",
      themeColor: "text-purple-500",
      icon: <Target className="w-8 h-8 text-purple-500" />,
      suggestedPrompts: [
        { label: "Nieuwe Marketing Strategie", text: "Maak een agressieve go-to-market strategie voor een nieuw product." },
        { label: "Doelgroep Analyse", text: "Wie is de perfecte avatar voor mijn high-ticket aanbod en waar vind ik ze?" },
        { label: "Viral Hook Formules", text: "Geef me 5 onweerstaanbare hooks voor TikTok/Reels." }
      ]
    },
    ADS: {
      name: "Ads Agent",
      role: "Performance Marketer",
      description: "Beheert je ROAS, schrijft winnende ad-creatives en schaalt je campagnes.",
      themeColor: "text-orange-500",
      icon: <Megaphone className="w-8 h-8 text-orange-500" />,
      suggestedPrompts: [
        { label: "Meta Ads Structuur", text: "Hoe moet ik mijn Facebook CBO campagne structureren voor een dropship winkel?" },
        { label: "Ad Copy Schrijven", text: "Schrijf 3 varianten ad-copy (kort, medium, lang) voor een pijnpunt-gedreven product." },
        { label: "ROAS Optimalisatie", text: "Mijn ads hebben een CTR van 1% maar geen conversies. Wat moet ik aanpassen?" }
      ]
    },
    CEO: {
      name: "CEO Agent",
      role: "Chief Executive Officer",
      description: "Overziet je hele business, forceert harde beslissingen en optimaliseert winstgevendheid.",
      themeColor: "text-[#d4af37]", 
      icon: <Briefcase className="w-8 h-8 text-[#d4af37]" />,
      suggestedPrompts: [
        { label: "Q3 Roadmap", text: "Maak een roadmap om in 90 dagen van €0 naar €10k/mnd te gaan." },
        { label: "Business Audit", text: "Stel me 5 harde vragen om mijn huidige knelpunten te identificeren." }
      ]
    },
    CFO: {
      name: "CFO Agent",
      role: "Chief Financial Officer",
      description: "Beheert cashflow, budgetten en financiële prognoses. Zorgt dat je nooit failliet gaat.",
      themeColor: "text-green-500",
      icon: <FileLineChart className="w-8 h-8 text-green-500" />,
      suggestedPrompts: [
        { label: "Cashflow Prognose", text: "Ik investeer €1000 in ads met een 2x ROAS. Wat is mijn netto cashflow over 30 dagen na kosten?" },
        { label: "Prijsstrategie", text: "Hoe verhoog ik de prijzen van mijn abonnement zonder bestaande klanten boos te maken?" }
      ]
    },
    COPY: {
      name: "Copywriter Agent",
      role: "Direct Response Copywriter",
      description: "Schrijft e-mails, salespages en VSL scripts die hypnotiseren en converteren.",
      themeColor: "text-rose-500",
      icon: <PenTool className="w-8 h-8 text-rose-500" />,
      suggestedPrompts: [
        { label: "Salespage Copy", text: "Schrijf een 4-delige AIDA structuur voor mijn landingspagina." },
        { label: "Koude E-mail", text: "Schrijf een koude e-mail voor B2B leads met een 80% open-rate potentiëel." }
      ]
    }
  };

  const metadata = AGENTS_METADATA[agentId];

  if (!metadata) {
    notFound();
  }

  return (
    <AgentChatInterface 
      agentId={agentId}
      agentName={metadata.name}
      agentRole={metadata.role}
      agentDescription={metadata.description}
      themeColor={metadata.themeColor}
      icon={metadata.icon}
      suggestedPrompts={metadata.suggestedPrompts}
    />
  );
}
