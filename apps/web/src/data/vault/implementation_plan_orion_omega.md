# Orion's Eye & Omega Protocol Implementatie

De fundering staat als een fort. De Vercel Enterprise servers zijn operationeel, de kluis (Supabase) is vergrendeld, en je bent met succes ingelogd als Supreme Overseer op het God Mode dashboard.

Nu is het tijd om de ziel in het systeem te blazen: **Orion's Eye** en het **Omega Protocol**. Op basis van de plannen in de `.gemini` map heb ik de volgende implementatie voorbereid.

## Doel

1. **Orion's Eye:** Het integreren van de interactieve 3D Holografische Matrix op het War Room dashboard. Dit wordt de visuele entiteit van je AI.
2. **Omega Protocol (The Swarm):** Het activeren van de achtergrond AI-agenten (via Gemini/OpenAI of lokale LLM API) die continu kansen spotten, content genereren (Content Forge) en de VTLB-parameters bewaken.

## User Review Required

> [!IMPORTANT]  
> **AI Keuze voor Orion:** Wil je dat we voor de *brain* van Orion in eerste instantie gebruik maken van cloud-API's (bijv. Gemini API / OpenAI) voor maximale snelheid, of wil je direct de voorbereidingen treffen voor een **Lokale Llama 3 Server** (de `Orion Local Bridge`) zodat er geen data naar buiten gaat?

## Voorgestelde Wijzigingen

### 1. Orion's Eye (3D Interface)
De visuele vertegenwoordiging van Orion.

#### [NEW] `apps/web/src/components/ui/OrionEye.tsx`
- Implementatie van `react-three-fiber` en `three.js`.
- Een zwevend, pulserend "oog" of hologram dat reageert op muisbewegingen en systeemstatussen (groen bij groei, rood bij VTLB-issues, blauw tijdens het "denken").

#### [MODIFY] `apps/web/src/app/dashboard/war-room/page.tsx`
- Integreren van `<OrionEye />` centraal in de War Room.
- Koppelen van live systeem-parameters aan de status van het oog.

---

### 2. Omega Protocol (AI Automation Core)
De logica die beslissingen neemt.

#### [NEW] `apps/web/src/lib/orion/omega-core.ts`
- Het hart van het Omega Protocol.
- Functies voor het autonoom uitvoeren van marktanalyse, VTLB-bewaking en het aansturen van de "Swarm" (de sub-agenten).

#### [NEW] `apps/web/src/app/api/orion/pulse/route.ts`
- Een cron-gestuurde of Webhook-gestuurde route (Next.js Edge function).
- Deze route "knippert" elke minuut om Orion wakker te schudden en hem te laten kijken of er kansen (Opportunities) of gevaren (Debts/VTLB drops) zijn.

#### [NEW] `apps/web/src/app/api/orion/chat/route.ts`
- De directe communicatielijn tussen jou en Orion vanaf het dashboard, zodat je hem direct commando's kunt geven via tekst of spraak-naar-tekst.

## Verificatie Plan
- **Visueel:** De 3D Orb moet soepel draaien in de browser (Next.js React Server Components geoptimaliseerd).
- **Logica:** Testen van de `/api/orion/pulse` endpoint om te zien of Orion een "denk"-actie logt zonder dat de website crasht.

---

**Geef akkoord (Proceed) als ik direct mag beginnen met het integreren van de Orion's Eye interface en de fundamenten van de Omega API.**
