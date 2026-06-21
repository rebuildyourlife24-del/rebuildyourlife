# Command Center UI Redesign & AI Brain Interface

Dit implementatieplan beschrijft de volledige grafische en functionele transformatie van het Command Center, precies volgens jouw visie.

> [!IMPORTANT]
> **Subagent Geactiveerd**
> Ik heb op de achtergrond succesvol een subagent (een virtuele collega) gestart! Deze agent is nu asynchroon in de achtergrond bezig met het testen en repareren van het inloggen, de database en de betalingssystemen (`apps/web` en `apps/api`), precies zoals je vroeg. Terwijl hij dat doet, gaan wij ons focussen op het nieuwe uiterlijk.

## User Review Required & Open Questions

> [!WARNING]
> **Denzel Washington Stem (ElevenLabs)**
> Standaard webbrowsers hebben alleen generieke, robotachtige computerstemmen beschikbaar. Om de stem van Orion EXACT te laten klinken als Denzel Washington (maar dan vloeiend in het Nederlands), hebben we zogenaamde "Voice Cloning" nodig. Hiervoor moeten we gebruik maken van een externe dienst zoals **ElevenLabs**. 
> *Vraag aan jou:* ElevenLabs is een betaalde dienst waarvoor je een eigen account en API-key nodig hebt. Wil je dat ik de code zo bouw dat je later een ElevenLabs API-sleutel kunt toevoegen voor de Denzel-stem, en we voor nu de best mogelijke standaard Nederlandse mannenstem gebruiken?

## Proposed Changes

We gaan de volledige `apps/command-center` frontend ombouwen naar de nieuwe hyper-realistische ervaring.

---

### 1. Visuele Interface & Achtergrond
- **Deep Space Background:** We integreren een hyper-realistische, geanimeerde 'deep space' achtergrond (met sterren, nevels en subtiele beweging) over het volledige scherm.
- **De AI Brain Hologram:** In het midden van het scherm implementeren we de interactieve 'Transparent Human Head'. Binnenin het hoofd zweven gekleurde lichtpulsen (particles/nodes). Elke kleur/puls representeert een specifieke actieve Agent.

### 2. Communicatie & Orion
- **Orion als Hoofd-Aanspreekpunt:** Onderin (of centraal) komt een hoofd-invoerbalk voor Orion, inclusief een geanimeerde microfoon-knop voor spraak én een tekstinvoerveld. Zowel inkomend als uitgaand via spraak en tekst is mogelijk.
- **Specifieke Agent Vensters:** Aan de randen van het scherm bouwen we opvouwbare "HUD" (Heads Up Display) vensters voor elke agent. Je kunt deze in- en uitklappen.
- **Directe Agent Communicatie:** Elk agent-venster krijgt zijn eigen mini-invoerbalk, zodat je direct tegen de "Scraper Agent" of "SEO Agent" kunt praten zonder dat Orion er tussen zit.

### 3. Systeem Menu & Instellingen
- **Settings Bar:** Een strakke, transparante navigatiebalk bovenaan met een uitklapmenu.
- **Beheer:** Hierin komen de knoppen om Plugins toe te voegen, AI-talen te wijzigen, en de stemvoorkeuren in te stellen.

---

### Componenten Overzicht

#### [MODIFY] `apps/command-center/src/app/hq/page.tsx`
- Volledige herbouw van de layout.
- Integratie van de Deep Space achtergrond.
- Integratie van het Canvas/SVG Brain Effect.
- Toevoegen van de Collapsible Agent Windows.

#### [NEW] `apps/command-center/src/components/AIBrain.tsx`
- Een nieuw React component specifiek voor de transparante menselijke schedel met de pulserende agent-nodes.

#### [NEW] `apps/command-center/src/components/AgentWindow.tsx`
- Component voor het uitklapbare venster per agent, inclusief individuele chat/spraak input.

#### [NEW] `apps/command-center/src/components/SettingsMenu.tsx`
- Het dropdown menu voor instellingen, talen en plugins.

## Verification Plan
1. Ik zal het Brain-effect en de Space-achtergrond lokaal genereren en optimaliseren voor mobiel én desktop zodat het niet hapert.
2. Ik test de spraakherkenning voor de individuele agent-vensters.
3. Zodra jij goedkeuring geeft op het plan (en met name de vraag over ElevenLabs / de Denzel Washington stem beantwoordt), begin ik met het bouwen van de code!
