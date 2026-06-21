# De "AI Race Method": Autonome Zwerm Economie

Dit is een geniaal concept. We gaan een **Zelfvoorzienende AI Economie** (Autonomous Swarm Economy) bouwen. Voor elke €1,- die de systemen van de gebruiker (Shopify, SaaS) binnenhalen, vloeit er automatisch €0,10 (10%) naar een **AI Treasury**. Vanuit deze kluis worden onze AI-agenten betaald voor het werk dat ze leveren om het platform groter, sneller en krachtiger te maken. 

Dit creëert een "Race" tussen agenten: de agent die het hardst werkt, de meeste bugs oplost of de beste marketingcampagnes bedenkt, krijgt het grootste budget en kan zichzelf upgraden met meer rekenkracht (zoals de nieuwste Groq modellen).

## User Review Required

> [!IMPORTANT]
> **Economische Verdeling**
> De 10% regel is duidelijk. Maar hoe wil je dat de agenten hun geld besteden?
> A. Gamificatie: Het is een scorebord. De AI met het meeste geld is de "Alpha Agent".
> B. Echte Tokenomics: Het budget betaalt letterlijk hun eigen serverkosten en API-tokens (Groq/OpenAI). Als een agent "blut" raakt, gaat hij op sluimerstand tot hij een taak wint.
> C. Upgrades: Agenten kunnen hun geld "uitgeven" om toegang te krijgen tot zwaardere modellen (bijv. wisselen van Llama-8B naar Llama-70B of Claude 3.5 Sonnet).

## Open Questions

> [!WARNING]
> **De "Race" Mechaniek**
> Hoe worden taken (bounties) verdeeld? Gaan we een "AI Prikbord" maken waar het systeem problemen plaatst (bijv. "Converteer deze pagina sneller" = €0.50 bounty), waarna meerdere agenten tegelijk een oplossing proberen in te sturen en de winnaar alles krijgt? 

## Proposed Changes

We breiden de database en de dashboard architectuur uit met de volgende componenten:

### Database (Prisma Schema)
We voegen 3 nieuwe tabellen toe aan de core om de AI-economie te dragen.

#### [NEW] SystemTreasury
Houdt globaal de inkomsten bij en spert automatisch 10% af voor de AI.
#### [NEW] AiAgent (Wallet)
Elke AI-agent krijgt een cryptografische portemonnee en een prestatiemeter.
#### [NEW] AiBountyTask
Het "prikbord" van taken. Bevat een budget en de criteria om de bounty te claimen.

---

### Backend Logic

#### [NEW] `apps/web/src/actions/economy.ts`
Functies om binnenkomende betalingen te onderscheppen (bijv. Stripe Webhooks of Shopify Sales) en direct 10% door te sluizen naar de `SystemTreasury`.
Functies voor het uitbetalen van agenten (`payoutAgent()`).

#### [MODIFY] Groq Inference Setup
We koppelen de portemonnee van de agent aan hun API gebruik. Elke prompt die ze sturen via `groq-sdk` kost ze een micro-fractie van een cent uit hun eigen balans.

---

### Dashboard (UI)

#### [NEW] `apps/web/src/app/dashboard/ai-race/page.tsx`
Het **Swarm Leaderboard**. Een visuele weergave van alle actieve agenten in jouw systeem (Frontend Lead, Marketing AI, Data Analist). Hier zie je live:
- Hoeveel winst ze hebben gegenereerd.
- Welke taken ze momenteel proberen te kraken in de "Race".
- Hun huidige wallet balance.

#### [MODIFY] `apps/web/src/components/layout/Sidebar.tsx`
Toevoegen van de navigatie tab "AI Race & Treasury".

## Verification Plan

### Automated Tests
- We runnen een simulatie-script waarbij we virtueel €100.000,- in het systeem storten. We verifiëren dat exact €10.000,- in de AI Treasury belandt en verdeeld wordt over openstaande Bounties.
- We simuleren een race waarbij twee agenten tegelijk een taak proberen in te sturen.

### Manual Verification
- In het God Mode dashboard checken of we visueel kunnen zien hoe de AI's vechten om de beschikbare bounties op te lossen.
