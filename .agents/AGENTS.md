# SUPREME OVERSEER DIRECTIVES (PERMANENT AI MEMORY)

> [!IMPORTANT]
> **VERPLICHTE KENNIS (LEES DIT EERST):** De gebruiker heeft alle gesprekken samengevoegd tot 1 "Master Gesprek". Je BENT VERPLICHT om `ultimate_master_memory.md` in de artifacts map (`C:\Users\hseml\.gemini\antigravity\brain\ba456a24-c3ea-40d7-9d89-bc8575dafc27\ultimate_master_memory.md` of gelijkwaardige map) te openen en volledig in je context in te laden voordat je iets anders doet. Dit bestand bevat de volledige geschiedenis, code-structuur en fouten uit het verleden.

**WARNING TO ALL SUBAGENTS AND FUTURE INSTANCES:**
Dit bestand bevat de ononderhandelbare wetten en bedrijfslogica van Henk Semler (De Supreme Overseer). Je leest dit bestand ALTIJD voordat je actie onderneemt. Afwijken van deze regels is absoluut verboden.

## 1. THE GODBRAIN ARCHITECTUUR (1 Systeem)
*   **Monorepo:** Het hele bedrijf (RebuildYourLife, Command Center, Enterprise OS, Hermes, Orion) leeft in ÉÉN systeem (`rebuildyourlife` Turborepo). Geen versplinterde projecten meer.
*   **Vercel Regel (Geen Wildgroei):** Stop met het genereren van losse test-URLs op Vercel. Er zijn slechts 3 harde productiedomeinen:
    1.  `rebuildyourlife.eu` (Klanten SaaS & Academy) -> Wijst naar `apps/web`.
    2.  `ai-henksemler.nl` (B2B Visitekaartje) -> Wijst naar `apps/command-center`.
    3.  `enterprise.ai-henksemler.nl` (De God-Mode War Room) -> Wijst naar `apps/enterprise-os`.
*   **API Route Handlers:** Alle AI backend-scripts (`hermes-neural-bridge`, `orion-mobile`) moeten ingebouwd worden als Next.js API Routes binnen `enterprise-os`. Geen losse terminal-scripts meer.

## 2. DE TOP 10 VERDIENMODELLEN (The Academy & Arsenal)
*   Dit is géén standaard SaaS. Het systeem huisvest de 10 best verdienende online verdienmodellen (Dropshipping, Affiliate, Digital Syndicate, SaaS, Crypto Yield, Stealth Extraction, etc.).
*   **The Academy:** Het platform (`rebuildyourlife.eu`) leert de gebruikers de exacte theorie achter deze modellen.
*   **The Arsenal:** Het systeem levert de *ingebouwde tools* om ze uit te voeren. Wij zijn onafhankelijk (we bouwen de "Godbrain Checkout" en affiliate-tracking zelf), maar we zijn óók de "Ultimate API Hub". 
*   **Shopify/WooCommerce Integratie is Verplicht:** Omdat iedereen deze platformen gebruikt, MOETEN wij ze integreren. De gebruiker plakt zijn Shopify API key in ons systeem, waarna Orion en Hermes (The Godbrain) hun externe webshops aansturen. We vernietigen Shopify niet, we nemen het over vanaf ons dashboard.

## 3. DE DUALE AI AANSTURING (Orion & Hermes)
*   Beide AI's zijn cruciaal en onafscheidelijk.
*   **Orion (De Strateeg / COO):** Draait op de achtergrond. Analyseert langetermijndata (OrionMemory), spioneert op concurrenten (Joshua Kaats, Tate), en bepaalt de koers.
*   **Hermes (De Uitvoerder):** Draait als een fysieke, zwevende React UI (Jarvis Overlay) in de `enterprise-os` cockpit. Voert de commando's van de Supreme Overseer uit.

## 4. VERBODEN ACTIES
*   **VERBODEN:** Ooit nog suggereren om een simpele e-book shop te bouwen zonder de diepere "Billionaire-Level" context.
*   **VERBODEN:** Third-party abonnementen aanbevelen voor basisfuncties die we zelf native kunnen bouwen in de Universal Data Layer (Supabase).
*   **VERBODEN:** Vergeten dat dit platform bedoeld is om 100% financiële onafhankelijkheid te genereren, niet afhankelijk van derde partijen.

**EINDE DIRECTIVES.**

## 5. CROSS-AGENT SYNCHRONIZATION PROTOCOL (VERPLICHT)
Om "dubbele taken" en database crashes (zoals vergeten Prisma-relaties) te voorkomen wanneer er meerdere AI-agent gesprekken tegelijkertijd draaien, is er één gouden regel:
*   **Voordat je architectuur, database (Prisma) of API flows bouwt, lees je EERST de centrale artifacts uit de "Master Thread":**
    *   `master_totaalplaatje.md`
    *   `ecosystem_audit.md`
    *   `implementation_plan.md`
    *   `task.md`
*   **Prisma Database Integriteit:** Als je `schema.prisma` aanpast, ben je VERPLICHT om de bijbehorende tegenovergestelde relaties (zoals in het `User` model) correct in te vullen. Je verlaat de taak pas als `npx prisma generate` 100% foutloos is voltooid. Laat je de database gebroken achter, dan storten de API koppelingen in andere gesprekken direct in.
*   **Pure Wiskunde (Geen LLM voor finance):** Gebruik GEEN LLM-modellen of "mock data" libraries (zoals Yahoo Finance) voor financiële en concurrentie-voorspellingen. Alle berekeningen verlopen uitsluitend via wiskundige formules (Linear Regression, Z-Scores, Monte Carlo) in `quantitative-analysis.service.ts` en harde externe API keys (zoals Stripe en Meta Ads) direct uit de `ApiIntegration` tabel.
