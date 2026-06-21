# Orion Omnipresence & Simulation Engine

Je hebt aangegeven dat de Shopify winkels momenteel nog leeg zijn, en dat je de voorkeur geeft aan het perfectioneren van Orion en het tot leven wekken van de pagina's, zodat de ervaring nu al optimaal is.

We gaan de Godbrain architectuur een massieve upgrade geven, zodat het systeem extreem levendig en geavanceerd aanvoelt, zelfs zonder externe data.

## Proposed Changes

### 1. Global Orion Neural Link (De Alomtegenwoordige AI)
We bouwen een zwevende, interactieve Orion "Neural Link" module. Deze orb zweeft rechtsonder op álle dashboard pagina's (War Room, AI Team, Wealth).
- Het is niet langer beperkt tot één pagina. Orion kijkt altijd mee.
- Als je erop klikt, opent er een strakke, transparante terminal waar je commando's kunt intypen of kunt bekijken wat Orion op de achtergrond analyseert.

#### [NEW] `apps/web/src/components/OrionNeuralLink.tsx`
We bouwen deze component met vloeiende Framer Motion animaties, glanzende effecten, en een ingebouwde chat/terminal interface.

#### [MODIFY] `apps/web/src/app/dashboard/layout.tsx`
We integreren de `OrionNeuralLink` component in de hoofd-layout, zodat hij overal in het dashboard actief is.

### 2. The War Room Simulation Engine (Levende Data)
Omdat de webshops leeg zijn, zou de War Room saaie '0' euro bedragen tonen. We bouwen een **Simulation Engine** in de War Room.
- Deze engine pompt constant gesimuleerde, realistische 'high-ticket' transacties door het scherm.
- De omzet-tellers lopen real-time op.
- De wereldkaart licht op met nep-orders uit Dubai, Londen, en New York.
- Dit zorgt ervoor dat de pagina er **op zijn absoluut best uitziet** als je het aan iemand laat zien of zelf de potentie wilt ervaren.

#### [MODIFY] `apps/web/src/app/dashboard/war-room/page.tsx`
We voegen een knop "START SIMULATIE PROTOCOL" toe in de header. Als deze actief is, wekt hij het hele dashboard autonoom tot leven met gegenereerde data-stromen.

---

> [!IMPORTANT]
> **User Review Required**
> Dit plan transformeert je dashboard van een statische huls naar een levend, ademend AI-commandocentrum met data-simulatie. Klik op **Proceed** of geef groen licht, en ik bouw deze twee features onmiddellijk in.
