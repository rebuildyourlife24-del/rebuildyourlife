# Implementatieplan: The Live-In Handyman (QA & Self-Healing Agent)

Je eis is kraakhelder: *"Er mag niets zijn dat niet werkt."* Om dit te garanderen, moeten we een systeem bouwen dat zichzelf constant test en repareert, zonder dat jij er naar om hoeft te kijken.

We introduceren **Agent 15: De Handyman (QA & DevOps Sentinel)**.
Deze agent leeft letterlijk in je servers en loopt 24/7 een virtuele "ronde" door je bedrijf om te controleren of de Social Hub, het CEO-dashboard, en de Mobiele App perfect functioneren.

## User Review Required

> [!IMPORTANT]  
> Dit plan beschrijft de architectuur voor een agent die autonoom fouten oplost en systemen herstart. Lees de technische implementatie en klik op `Start` om The Handyman te integreren.

## 1. De "Handyman" Routine (24/7 Controles)
Deze agent voert elke 5 minuten de volgende checks uit:
*   **Platform Uptime:** Pinged de Command Center UI, de Orion API, en de Mobiele backend. Bij een 500-error (server plat), probeert hij autonoom de server-cache te clearen of een soft-reboot uit te voeren.
*   **API Health (The Social Hub):** Hij test of de "Billionaire Social Tokens" (TikTok, Facebook, LinkedIn) nog geldig zijn. Als een token bijna verloopt, ververst hij deze automatisch of zet hij een `URGENT` actie klaar in de Red Black Box.
*   **Database Latency:** Controleert of Supabase vertraging oploopt. Bij trage queries voert de agent `VACUUM` of index-optimalisaties uit.

## 2. Self-Healing Mechanismen
Als de Handyman iets vindt wat kapot is, repareert hij het:
*   Vercel Deployment fouten (zoals Lifecycle en Middleware errors) worden door hem geanalyseerd en hij stelt direct een patch voor.
*   Hij verwijdert verouderde log-bestanden die je servers zwaar maken.

## Proposed Changes

### [NEW] `apps/command-center/src/lib/agents/HandymanAgent.ts`
Een nieuw autonoom script dat via een Cron-job (of achtergrond-taak) elke 5 minuten wordt aangeroepen om het complete systeem te scannen.

### [NEW] `packages/database/prisma/schema.prisma` (Update)
We voegen een model toe: `SystemHealthLog`. Hierin noteert de Handyman alles wat hij checkt. Jij ziet dit terug in het War Room dashboard onder "Infrastructure Health".

---

> [!TIP]  
> Terwijl ik op de achtergrond jouw Vercel-bouwfouten aan het oplossen ben via de CI/CD pijplijn, kun jij dit plan goedkeuren. Geef me het **"Akkoord"** en ik bouw de Handyman direct je architectuur in!
