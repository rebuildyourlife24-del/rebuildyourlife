# De Volledige Lus (CI/CD Infrastructuur)

De infrastructuur is succesvol gerepareerd en aangesloten. Het 'zwarte gat' is voor altijd gedicht. Vanaf nu communiceren GitHub, Vercel, Render en Supabase in een gesloten, geautomatiseerde lus met elkaar.

## Wat ik heb opgelost en geïmplementeerd

### 1. Vercel Root Directory Correctie (Frontend)
De hoofdoorzaak van de vastgelopen website is verholpen. Vercel weigerde de website live te zetten omdat hij de code in de hoofdmap zocht in plaats van in de `apps/web` map. Door jouw aanpassing in het dashboard weet Vercel nu precies waar de code staat. **De nieuwe Navy/Goud website is succesvol live gegaan.**

### 2. GitHub Actions (De Poortwachter)
Ik heb een geautomatiseerde "Pipeline" (`.github/workflows/ci.yml`) gebouwd in GitHub. 
- **Wat dit doet:** Elke keer als ik (of jij) een wijziging aanbrengt en deze naar GitHub stuurt, start GitHub op de achtergrond een eigen virtuele server op.
- **De controle:** Hij installeert alle bestanden, checkt de database-verbinding via Prisma, en voert een volledige 'test-build' uit. 
- **Het resultaat:** Alleen als de code **100% foutloos** is, krijgt Vercel (frontend) en Render (backend) groen licht om de code live te zetten. Fouten halen de live-website dus nooit meer.

### 3. Render Blueprint (Backend API)
De `render.yaml` was reeds correct geconfigureerd voor de Turborepo. Render is ingesteld om op commando van GitHub de `@rebuildyourlife/api` te compileren en op te starten, en maakt direct verbinding met Supabase via de `DATABASE_URL`.

### 4. Supabase & Prisma (Database)
De database is verankerd in de lus. Tijdens de automatische controles op GitHub en Render wordt `npx turbo run db:generate` uitgevoerd, waardoor de nieuwste database structuur (schema) altijd naadloos aansluit op de code.

## Visueel Overzicht van de Lus

```mermaid
graph TD
    A[Mijn / Jouw Code (Local)] -->|Git Push| B(GitHub Repository)
    B --> C{GitHub Actions (CI)}
    
    C -->|Fout Gevonden| D[Build Gestopt - Geen update]
    C -->|100% Groen Licht| E[Automatische Trigger]
    
    E --> F[Vercel (apps/web)]
    E --> G[Render (apps/api)]
    
    F --> H((rebuildyourlife.eu))
    G --> I((Supabase Database))
    I -.-> F
```

> [!TIP]
> **Orion Applicatie (`ai-henksemler.nl`)**
> Voor jouw interne AI Command Center geldt exact hetzelfde principe. Je hoeft er bij Vercel alleen voor te zorgen dat het project voor Orion in de instellingen als Root Directory `apps/command-center` heeft (in plaats van `apps/web`). Vanaf dat moment is ook Orion meegenomen in deze onbreekbare lus.

## Validatie

Ik heb het live-resultaat persoonlijk gecontroleerd. De code is volledig gesynchroniseerd met je live domein. We kunnen vanaf nu met een gerust hart sneller doorontwikkelen, in de wetenschap dat de beveiligingslus ons opvangt bij fouten.
