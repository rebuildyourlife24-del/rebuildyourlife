"use client";

import { AgentChatInterface } from "@/components/AgentChatInterface";
import { 
  Target, Megaphone, PenTool, Bot, Briefcase, FileLineChart, 
  Package, DollarSign, CreditCard, ShieldAlert, Truck, Globe, ShoppingBag, Eye 
} from "lucide-react";
import { notFound } from "next/navigation";

export function DynamicAgentClient({ agentIdRaw }: { agentIdRaw: string }) {
  const agentId = agentIdRaw.toUpperCase();

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
    },
    ECOM_CATALOG: {
      name: "Catalog & Sourcing Agent",
      role: "E-Commerce Catalogus Beheer",
      description: "Beheert product SKU's, updates, sourcing via dropshipping leveranciers en trendanalyses.",
      themeColor: "text-cyan-500",
      icon: <Package className="w-8 h-8 text-cyan-500" />,
      suggestedPrompts: [
        { label: "Product Sourcing", text: "Welke leveranciers zijn momenteel betrouwbaar voor elektronica niches?" },
        { label: "SKU Synchronisatie", text: "Hoe synchroniseer ik product SKU data met mijn Shopify catalogus?" }
      ]
    },
    ECOM_PRICING: {
      name: "Pricing & Promotions Agent",
      role: "Prijs & Marge Optimalisatie",
      description: "Berekent dynamische winstmarges, verkoopelasticiteit en automatische kortingscampagnes.",
      themeColor: "text-amber-500",
      icon: <DollarSign className="w-8 h-8 text-amber-500" />,
      suggestedPrompts: [
        { label: "Winstmarge Berekenen", text: "Bereken de winstgevendheid van een product met €12 inkoop en €39 verkoopprijs." },
        { label: "Kortingscampagne", text: "Wat is een optimale kortingsstrategie voor Black Friday?" }
      ]
    },
    ECOM_CHECKOUT: {
      name: "Agentic Checkout Agent",
      role: "Conversie & Checkout Optimalisatie",
      description: "Verwerkt checkout flows, mollie betalingen en vermindert verlaten winkelwagens.",
      themeColor: "text-emerald-500",
      icon: <CreditCard className="w-8 h-8 text-emerald-500" />,
      suggestedPrompts: [
        { label: "Winkelwagen Verlating", text: "Geef me 3 e-mail templates om verlaten winkelwagens te herstellen." }
      ]
    },
    ECOM_CUSTOMER_SERVICE: {
      name: "CS Automator Agent",
      role: "Klantenservice Closer",
      description: "Beantwoordt automatisch klantvragen, verwerkt retouren en volgt bestellingen op.",
      themeColor: "text-blue-500",
      icon: <ShieldAlert className="w-8 h-8 text-blue-500" />,
      suggestedPrompts: [
        { label: "Retourbeleid", text: "Schrijf een vriendelijke reactie naar een klant die zijn product wil retourneren." }
      ]
    },
    ECOM_SUPPLY_CHAIN: {
      name: "Supply Chain Agent",
      role: "Logistiek Coördinator",
      description: "Monitoort verzendtijden, levertijden en automatische bestellingen bij leveranciers.",
      themeColor: "text-indigo-500",
      icon: <Truck className="w-8 h-8 text-indigo-500" />,
      suggestedPrompts: [
        { label: "Verzendtijd Optimalisatie", text: "Hoe verkort ik mijn dropshipping levertijd vanuit China naar Europa?" }
      ]
    },
    ECOM_SEO: {
      name: "Shop SEO Auditor",
      role: "Search & GEO Optimalisatie",
      description: "Optimaliseert producttitels, metabeschrijvingen en structured data voor zoekmachines.",
      themeColor: "text-violet-500",
      icon: <Globe className="w-8 h-8 text-violet-500" />,
      suggestedPrompts: [
        { label: "Product SEO", text: "Optimaliseer de producttitel en beschrijving van een anti-aging crème voor SEO." }
      ]
    },
    ECOM_MERCHANDISING: {
      name: "Merchandising & Content Agent",
      role: "Visual & Content Coordinator",
      description: "Maakt aantrekkelijke productbundels, up-sells en visuele presentatie-aanbevelingen.",
      themeColor: "text-fuchsia-500",
      icon: <ShoppingBag className="w-8 h-8 text-fuchsia-500" />,
      suggestedPrompts: [
        { label: "Upsell Strategie", text: "Welke complementaire producten kan ik bundelen met een fitness elastiek?" }
      ]
    },
    ECOM_OPERATIONS: {
      name: "Operations Agent",
      role: "Operations & Analytics Auditor",
      description: "Monitoort webshop operaties, server uptime en synchronisatie statistieken.",
      themeColor: "text-rose-500",
      icon: <Eye className="w-8 h-8 text-rose-500" />,
      suggestedPrompts: [
        { label: "Uptime Monitor", text: "Hoe controleer ik of mijn Shopify webhooks correct binnenkomen?" }
      ]
    }
  };

  const metadata = AGENTS_METADATA[agentId];

  if (!metadata) {
    notFound();
  }

  return (
    <AgentChatInterface 
      agentId={agentId as any}
      agentName={metadata.name}
      agentRole={metadata.role}
      agentDescription={metadata.description}
      themeColor={metadata.themeColor}
      icon={metadata.icon}
      suggestedPrompts={metadata.suggestedPrompts}
    />
  );
}
