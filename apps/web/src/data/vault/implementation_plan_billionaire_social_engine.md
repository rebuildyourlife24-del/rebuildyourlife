# Implementatieplan: The Billionaire Social Engine

Je antwoord was *"Ja, alles"*. Dat betekent dat we de komende fase de God-Mode volledig aanzetten. Daarnaast voeg je een keiharde nieuwe eis toe: **Een ultracapabele Social Media & Advertising Hub** voor Instagram, TikTok, Facebook en LinkedIn. Geen simpele "postplanner", maar een miljardairs-niveau machine die organische posts, blogs én miljoenen-ads aanstuurt.

## User Review Required

> [!IMPORTANT]  
> Dit plan beschrijft de architectuur voor het automatiseren van je complete externe communicatie via de Social Hub. Check de integraties en geef je akkoord voor deze kolossale uitbreiding!

## 1. De "Billionaire" Social Hub
We gaan in het Command Center (binnen de `/seo` of `/hq` route) de knoppen en API's toevoegen voor de allergrootste netwerken ter wereld.
*   **De Platforms:** TikTok (Organisch + Ads), Meta (Instagram, Facebook Reels, Facebook Ads), LinkedIn (B2B Authority + Ads), en je eigen Blog (WordPress/Ghost integratie).
*   **Hoe het werkt:** 
    1. Agent 2 (De Hyper-Realistic Content Agent) genereert een meesterlijke productvideo.
    2. Agent 3 (Ads Agent) analyseert de video, berekent het ideale TikTok en Meta budget, en zet dit als een `PENDING` actie in je Red Black Box.
    3. Jij klikt op `[ APPROVE ]`.
    4. De Social Hub vuurt de video direct af naar alle platforms, start de advertentiecampagnes, en trekt real-time de RoAS (Return on Ad Spend) data terug in je radar.

## 2. De "Alles op Ultra-Top Niveau" Agenda (Fase 3)
Omdat je groen licht gaf voor álle openstaande punten, ziet de executie van de komende fase er als volgt uit:

1.  **Stap 1: De Social Hub UI & Database:** Ik ga de API-modellen toevoegen voor TikTok/Meta integraties in je Prisma database, en de "Knoppen" voor deze netwerken inbouwen in je dashboard.
2.  **Stap 2: De Content Agent (Micro-App):** Ik schrijf de code voor de lokale image/video generatie engine (zodat we zonder abonnementen de content voor deze socials kunnen maken).
3.  **Stap 3: Local Orion Setup:** We leggen de brug klaar voor jouw lokale Llama 3 server.
4.  **Stap 4: Orion Mobile App:** We genereren de React Native codebase, zodat je de Ads via je telefoon kunt goedkeuren.

## Proposed Changes

### [NEW] `packages/database/prisma/schema.prisma` (Update)
We voegen een model toe genaamd `SocialPlatformIntegration`. Dit bewaart veilig (encrypted) de API-keys (Access Tokens) voor jouw TikTok, Meta en LinkedIn business accounts.
We breiden het `AgentAction` model uit zodat acties specifiek gekoppeld kunnen worden aan een sociaal platform.

### [MODIFY] `apps/command-center/src/app/seo/page.tsx`
We voegen aan de Red Black Box een nieuwe widget toe: De **"Global Broadcasting Radar"**. Hier zie je live knoppen en verbindingstatussen van al je social media kanalen.

---

> [!TIP]  
> Als je dit "Billionaire Niveau" vindt, klik dan op goedkeuren ("Start"). Dan ram ik de Social Media Database modellen en de Social Hub User Interface direct je code in!
