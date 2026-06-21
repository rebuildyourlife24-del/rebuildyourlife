# Volledige Infrastructuur & CI/CD Lus (Vercel + Render + Supabase)

Dit plan beschrijft de oplossing voor het "zwarte gat" waarin live-updates momenteel verdwijnen. Door een gesloten feedback-lus ("complete loop") te bouwen, voorkomen we dat fouten ongezien op de servers crashen en zorgen we dat GitHub, Vercel, Render en Supabase naadloos met elkaar communiceren.

> [!WARNING]
> **Huidige Foutanalyse (Root Cause):** 
> Vercel weigert momenteel de updates omdat het project als een 'monorepo' is opgezet, maar Vercel op de hoofdmap (`/`) probeert te bouwen in plaats van de specifieke frontend mappen (`apps/web`). Vandaar dat de oude kapotte code live bleef staan. We gaan dit nu structureel oplossen.

## De "Volledige Lus" Architectuur

We gaan de volgende systemen onbreekbaar aan elkaar knopen:

1. **De Controle-lus (GitHub Actions CI)**
   We bouwen een robot die *elke* codewijziging eerst virtueel test (bouwen & checken op fouten). Als er een fout is (zoals het ongebruikte `Clock` icoontje), blokkeert de lus de upload en waarschuwt hij ons direct. Pas als het 100% groen is, mag het naar de servers.
2. **De Frontend-lus (Vercel)**
   We configureren Vercel correct voor de Turborepo. We splitsen de Vercel-configuratie op in twee heldere instructies: één voor de Klantenwebsite (`apps/web`) en één voor Orion (`apps/command-center`).
3. **De Backend-lus (Render)**
   De API (Express) wordt gekoppeld via `render.yaml`. GitHub stuurt een seintje naar Render bij elke groene update, waarna Render de API herstart met de nieuwe code.
4. **De Database-lus (Supabase)**
   Render en Vercel worden via beveiligde `.env` variabelen verbonden met Supabase (via Prisma). Migraties (database wijzigingen) worden automatisch of veilig handmatig doorgevoerd.

## Proposed Changes

### CI/CD Pipeline (GitHub Actions)

#### [NEW] .github/workflows/ci.yml
We maken een automatische pipeline aan die op elke `push` naar `main` de volgende checks uitvoert:
- Linting en Type-checking van alle code.
- `npx turbo run build` om te garanderen dat álle apps compileren.

### Vercel Configuratie (Frontend)

We dwingen Vercel om de juiste mappen te bouwen via configuratiebestanden, in plaats van te gokken.

#### [NEW] apps/web/vercel.json
Configuratie specifiek voor de klantenwebsite.
#### [NEW] apps/command-center/vercel.json
Configuratie specifiek voor de Orion login.

### Render Configuratie (Backend)

#### [MODIFY] render.yaml
We optimaliseren de Render Blueprint zodat de API robuust wordt gebouwd en opgestart vanuit de monorepo, met een directe lijn naar Supabase.

## User Review Required

> [!IMPORTANT]
> **Vercel Dashboard Instelling**
> Omdat we met een monorepo (Turborepo) werken, is er één handeling die jij eenmalig in je Vercel Dashboard moet doen, omdat ik daar niet via code bij kan:
> 1. Ga naar je project in Vercel -> Settings -> General.
> 2. Bij **Root Directory**, pas dit aan naar `apps/web`.
> 
> *Of, als we de automatische lus bouwen, moet je de `VERCEL_TOKEN`, `VERCEL_ORG_ID`, en `VERCEL_PROJECT_ID` aan mij (of aan GitHub Secrets) geven.*

## Verification Plan

- [ ] Vercel deployt succesvol de nieuwe `apps/web` (de rustige Navy/Goud landingspagina verschijnt direct op `rebuildyourlife.eu`).
- [ ] Vercel deployt succesvol de Orion pagina (`ai-henksemler.nl`).
- [ ] Render API is live en verbonden met Supabase.
- [ ] Bij een bewuste code-fout blokkeert GitHub Actions de boel.

Ben je akkoord met deze professionele en waterdichte aanpak om de infrastructuur voor eens en voor altijd veilig te stellen?
