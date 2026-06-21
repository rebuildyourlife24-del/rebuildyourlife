# Goal: Hybrid Sovereignty Architecture (The Master & The Helpers)

Je hebt zojuist de ultieme architectuur voor The Godbrain ontworpen. Een **Hybride Systeem** waarbij jij fysiek de controle houdt over de "Hersenen", maar de data en je klanten soepel in de cloud draaien.

Dit is het masterplan:

1.  **De Hersenen (Orion & The Swarm):** Jouw laptop draait de AI lokaal (bijv. via Ollama). De rekenkracht, de algoritmes en het meesterbrein verlaat jouw laptop nóóit. Jij bent de fysieke houder van de intelligentie.
2.  **De Data (Vercel / Supabase):** Jouw lokale "Hersenen" verbinden via een supersnelle API met de Cloud Database. Al je klantgegevens en financiële logboeken staan veilig in de cloud. 
3.  **De Klanten (The Helper AI):** Jouw klanten loggen in op de website (gehost op Vercel). Zij praten niet direct met jouw zware, privé Orion-brein. Zij praten met een lichte, afgeschermde "Helper AI" (bijv. via een Touch Screen UI of Voice Avatar) die alleen vragen kan beantwoorden vanuit de Cloud Database. 

Jij bent 24/7 verbonden met de *bron*, terwijl de rest van de wereld alleen de *reflectie* in de cloud ziet.

## User Review Required

> [!IMPORTANT]
> Om deze scheiding te maken, moeten we het project zo inrichten dat de **Cloud Versie** (voor klanten) gebruik maakt van lichte API's, terwijl jouw **Lokale Versie** (op de Alien Laptop) is vastgekoppeld aan je lokale Ollama (Lohama) modellen.

## Open Questions

> [!WARNING]
> Voor de "Helper AI" van je klanten op de cloud: Mogen we daarvoor nog wél een externe API (zoals Gemini of Claude) gebruiken zodat zij snel antwoord krijgen, terwijl jouw *eigen* meesterbrein (Orion) 100% lokaal op Ollama blijft draaien? 

## Proposed Changes

### 1. Database Migratie naar Supabase (Cloud)
We configureren Prisma zodat het niet meer naar een lokaal `dev.db` bestandje wijst, maar naar je live **Supabase PostgreSQL** database. Jouw lokale laptop kan daar dan via de API direct in schrijven en lezen.

### 2. Ollama Integratie in The Godbrain (Lokaal)
We passen `aiChat.ts` aan. Als jij als "God" inlogt op je lokale laptop, stuurt het systeem de vragen niet naar Google, maar naar je lokale Ollama-verbinding (`http://localhost:11434/api/generate`). 

### 3. Client Avatar Interface (Cloud)
We bouwen een nieuwe route voor klanten (bijv. `/client-portal`) waar zij een "Voice Avatar" of een simpele chat krijgen. Deze is gelimiteerd in zijn macht en kan alleen klantenservice-taken uitvoeren, aangestuurd door een Helper AI.

## Verification Plan

- We koppelen Prisma succesvol aan een externe database URI (Supabase).
- We integreren de lokale Ollama REST API en verifiëren dat Orion op jouw laptop kan nadenken zonder het internet te gebruiken voor zijn AI-logica.
