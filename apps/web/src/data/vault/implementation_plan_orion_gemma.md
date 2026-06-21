# Implementatieplan: Orion Ultimate Lokaal (LM Studio + Lokale Database)

Mijn research-agent heeft de volledige `rebuildyourlife` broncode geanalyseerd. Hier is het plan om de exacte Orion backend (inclusief het geheugen en de complexe raad van agents) 100% lokaal op je laptop te laten draaien, afgesloten van het internet.

## User Review Required
> [!IMPORTANT]
> **Keuzemoment voor de Database (Supabase lokaal namaken):**
> De huidige code gebruikt zware Postgres-queries (met `$1`, `$2`, `NOW()`). Om dit lokaal te maken hebben we twee opties. **Welke wil je?**
> 
> **Optie A (De SQLite methode - Geen extra programma's nodig):**
> Ik herschrijf de Prisma schema's én alle interne SQL-queries in je code naar SQLite. Alles draait dan direct vanuit een lokaal bestandje (`dev.db`). Perfect voor offline, maar vereist wel dat ik diep in de database-code moet knippen en plakken.
> 
> **Optie B (De Postgres Docker methode - Code blijft 100% origineel):**
> Je installeert Postgres (of Docker) op je Windows laptop. Ik hoef de code dan *absoluut niet* aan te raken. We veranderen alleen de `.env` link naar `localhost:5432` en de code "denkt" dat hij nog met Supabase praat, maar het blijft allemaal strak op jouw laptop.

## Proposed Changes

Onafhankelijk van je database-keuze, moeten we de AI losknippen van de cloud en direct aan jouw LM Studio koppelen.

### 1. AI-Cloud losknippen (`apps/api/src/ai`)
We forceren de code om LM Studio te gebruiken voor Gemma-3 in plaats van Groq, Ollama of OpenAI.

#### [MODIFY] provider.ts
We leiden de officiële OpenAI connector om naar de LM Studio Local Server.
- `baseURL` instellen op `'http://localhost:1234/v1'`
- `apiKey` instellen op `'lm-studio'`

#### [MODIFY] orion.ts
- De variabele `FORCE_OFFLINE_AI` aanzetten in de logica.
- Zorgen dat de "auto" fallback direct naar de (nu omgeleide) OpenAI provider springt.

### 2. Environment Variabelen (`apps/api/.env`)
#### [MODIFY] .env
- We wissen de Supabase URL's en vervangen ze door de lokale database.
- We stellen `OPENAI_MODEL` in op `gemma-3-4b-it`.

## Verification Plan
1. We starten **LM Studio** met Gemma-3-4b.
2. We (her)genereren de database lokaal (via SQLite of Postgres).
3. We starten de API server.
4. We sturen een test-chat via de interface en controleren in de terminal of hij inderdaad lokaal reageert én de data netjes lokaal opslaat.
