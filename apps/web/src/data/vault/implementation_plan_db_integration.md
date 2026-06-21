# Implementation Plan: Database Connectie & Opperbaas Profiel

Fantastisch dat de API-sleutels (`GOOGLE_GENERATIVE_AI_API_KEY` en `DATABASE_URL`) al in Vercel en je lokale omgeving staan! Dit betekent dat de weg helemaal vrij is om het systeem aan te sluiten op de realiteit.

We gaan nu de mock-data (nepcijfers) vervangen door de echte data uit de Postgres database.

## User Review Required

> [!IMPORTANT]
> **Data Migratie & Opperbaas Profiel:** Als ik de database activeer, zal deze in eerste instantie leeg zijn. Ik stel voor dat ik een script schrijf (`seed.ts`) dat automatisch jouw **"Supreme Overseer"** (Opperbaas) profiel aanmaakt in de database, compleet met je naam, het God-Mode rol-niveau en de eerste bedrijfsstatistieken. Ga je hiermee akkoord?

## Proposed Changes

We gaan de backend (`@rebuildyourlife/database`) koppelen aan het Command Center.

### 1. Database Seed & Migratie
#### [MODIFY] [packages/database/package.json](file:///C:/Users/hseml/.gemini/antigravity/scratch/rebuildyourlife/packages/database/package.json)
- Ik zal ervoor zorgen dat het seed script wordt uitgevoerd na de database push. Dit script maakt jouw profiel aan.
- Commando: `npx prisma db push` en `npm run seed` om de database-tabellen (zoals `User`, `Goal`, `Task`, `Debt`) aan te maken op jouw Supabase.

### 2. API Routes voor het CEO Dashboard
#### [NEW] [apps/command-center/src/app/api/ceo/metrics/route.ts](file:///C:/Users/hseml/.gemini/antigravity/scratch/rebuildyourlife/apps/command-center/src/app/api/ceo/metrics/route.ts)
- Een beveiligde API-route die de echte statistieken (inkomsten, uitgaven, voltooide AI-taken) ophaalt uit de Postgres database via Prisma.

### 3. Frontend Koppeling
#### [MODIFY] [apps/command-center/src/components/ceo/FinancialHub.tsx](file:///C:/Users/hseml/.gemini/antigravity/scratch/rebuildyourlife/apps/command-center/src/components/ceo/FinancialHub.tsx)
- Vervangen van de hard-coded "€19.375" en "64% netto winst" door de live data die via de nieuwe API wordt opgehaald.
- Tonen van waarschuwingen (Safety Net) uitsluitend als dit in de database staat.

#### [MODIFY] [apps/command-center/src/components/SettingsMenu.tsx](file:///C:/Users/hseml/.gemini/antigravity/scratch/rebuildyourlife/apps/command-center/src/components/SettingsMenu.tsx)
- In plaats van de statische tekst "CEO: HENK SEMLER", haalt dit de naam (en eventuele Avatar) op van de ingelogde Supreme Overseer uit de database.

## Verification Plan

### Manual Verification
1. Zodra de code geschreven is, voer ik lokaal het migratie-commando uit om de tabellen te maken.
2. Ik verifieer dat het Opperbaas-profiel in jouw database is aangemaakt.
3. We navigeren naar het CEO Dashboard en bevestigen dat de getallen nu direct vanuit de database worden geladen.
