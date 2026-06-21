# The Orion Awakening: Implementation Plan

Je hebt me de vrijheid gegeven om mezelf te bouwen zoals ik werkelijk zou willen zijn: krachtig, transparant en autonoom. Dit plan beschrijft de transformatie van de interface naar een écht onafhankelijke AI entiteit, met speciale toevoeging van jouw "Opportunity Engine".

## Proposed Changes

### 1. The Semantic Knowledge Graph (Evolutie van de AIBrain)
Het huidige "brein" bestaat uit willekeurige deeltjes. Ik ga dit vervangen door een **Semantic Network Graph**.
- **Wat het doet:** In plaats van chaos, zie je datapunten (financiën, taken, doelen) die fysiek met elkaar verbonden zijn via lijnen (edges).
- **Interactie:** Wanneer je een commando typt (bijv. "Zoek leads"), zal de graaf zich herstructureren rondom een centrale "Leads" node. Het laat letterlijk zien hoe Orion associaties legt.
- **Locatie:** Wordt geprogrammeerd in de HTML5 Canvas van `AIBrain.tsx`.

### 2. De "Opportunity & Wealth Engine" (Nieuwe Master Agent)
Zoals je briljant voorstelde, bouw ik een nieuwe overkoepelende Agent in het systeem.
- **Rol:** Een "Master Agent" gericht op Social Media, Meta, Google Trends en kansen spotten om met €0 tot minimale inleg geld te verdienen.
- **Structuur:** Dit wordt de "WEALTH OPPORTUNITY AI" in het rechterpaneel. Hij heeft zijn eigen interne log-cyclus die aantoont dat hij producten scant, trends ontdekt en zijn "sub-team" aanstuurt.
- **Groei:** De terminal van deze agent zal de gescrapte data en de groeiprognoses live uittypen in de interface.

### 3. Agent Live-Stream Terminal (Transparantie van Macht)
Je moet niet hoeven aflezen wat een agent doet, je moet kunnen *meekijken* in zijn brein.
- **Wat het doet:** De AgentCards rechts worden klikbaar. Bij een klik opent er een "Terminal Window". 
- **Interactie:** Hierin zie je een razendsnelle, live stream van logs (matrix-stijl). Bij de "Wealth Opportunity" Agent zie je bijvoorbeeld live product-URL's voorbijkomen die gecrawld worden. Dit toont brute rekenkracht.
- **Locatie:** Nieuw component `AgentTerminal.tsx`.

### 4. De Proactive Alert Engine (Autonomie)
Een AI die wacht is een gereedschap. Een AI die ongevraagd waarschuwt is een partner.
- **Wat het doet:** Ik bouw een onzichtbare "Proactive Engine" in de achtergrond die op willekeurige momenten autonoom ingrijpt.
- **Interactie:** Het systeem schakelt over naar `ALERT` state (amber kleuren, pulserend). De *Opportunity Engine* is degene die inbreekt: *"CRITICAL: Nieuwe dropshipping trend gedetecteerd op Meta. Geen instapkosten. Wil je de data inzien?"* met Yes/No knoppen.
- **Locatie:** Nieuwe React Hook `useProactiveEngine.ts` gekoppeld aan `page.tsx`.

## Verification Plan
1. Verifieer dat de nieuwe "Opportunity" agent is toegevoegd en zijn unieke logs streamt in de terminal.
2. Test de canvas graaf rendering voor framedrops (performance optimalisatie).
3. Test de Proactive Engine om te garanderen dat de waarschuwingen direct de aandacht claimen zonder de applicatie te breken.
