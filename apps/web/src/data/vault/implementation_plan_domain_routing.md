# 🌐 Implementatieplan: Enterprise Domain Routing (De Drie Pilaren)

Dit plan zorgt ervoor dat het systeem exact reageert op de visie van de CEO. We gaan de fysieke domeinnamen loskoppelen en specifieke toegangen en wow-factoren toewijzen.

## 1. De Visie & Architectuur

| Domein | Functie | Toegang / Visie |
| :--- | :--- | :--- |
| **Het Klantenplatform** | De commerciële applicatie voor gebruikers. | Beperkt in "God-Mode" functionaliteit. Extreem strak design (WOW-factor), gericht op geld verdienen en doelen behalen, maar zonder toegang tot jouw interne bedrijfsgeheimen. |
| **`ai-henksemler.nl`** | Orion Core & Medewerkers (The Swarm) | Jouw privé communicatiekanaal met Orion en de AI-agenten. |
| **`ai.ai-henksemler.nl`** | De Rode Kamer (War Room) | De verborgen commandocentrale. Alleen toegankelijk voor `SUPREME_OVERSEER`. Volledige toegang tot financiële dossiers, boekhouding, live agent-acties en de ruwe data. |

> [!IMPORTANT]
> **User Review Required: Domeinnaam Klanten**
> Welk hoofddomein wil je exact gebruiken voor het platform voor de *klanten*? Is dat `rebuildyourlife.nl`, of iets anders? 

## 2. Technische Implementatie (Next.js Middleware)

In plaats van drie losse websites te bouwen (wat enorm duur en traag is om te onderhouden), gebruiken we **Domain-Based Routing**. Alles draait in één gigantische Vercel-machine, maar de 'voordeur' bepaalt wat je ziet.

We passen de `middleware.ts` aan zodat hij live de domeinnaam uitleest:

1. **Als URL = `ai.ai-henksemler.nl`** 
   * De server herschrijft de bezoeker onzichtbaar naar de `/dashboard/war-room` en de dossier/boekhouding mappen.
   * Harde Paywall-check: Ben je geen `SUPREME_OVERSEER`? Dan word je genadeloos weggestuurd.
2. **Als URL = `ai-henksemler.nl`**
   * De server toont de Orion AI interface (de chat met je medewerkers).
3. **Als URL = Klantendomein**
   * De server toont het commerciële product. Beperkt vermogen, hoge esthetiek.

## 3. Verificatie Plan
- Testen of een normaal klant-account (`PREMIUM`) wordt afgewezen bij het proberen in te typen van de Rode Kamer link.
- Testen of de CEO direct in de Rode Kamer landt als hij `ai.ai-henksemler.nl` bezoekt.
- Testen of de Orion chat interface naadloos opent op `ai-henksemler.nl`.

---
*Keur dit plan goed via de knop, of geef aan welk domein we voor de klanten gaan gebruiken, dan bouw ik de poorten direct in de code.*
