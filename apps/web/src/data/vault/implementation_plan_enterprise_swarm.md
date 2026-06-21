# Goal: Enterprise Swarm Architecture

Je wilt de AI agenten structureren als een volwaardig corporate kantoorsysteem, in plaats van alleen een groep "uitvoerders". Dit betekent de introductie van lagen (Supervisors, Researchers, Executors) en een centrale "Courier/Documentalist" agent die als brug fungeert tussen afdelingen om alles perfect te documenteren.

## User Review Required

> [!IMPORTANT]
> Dit is een grote architectonische upgrade van *The Swarm*. Neem het plan door en geef akkoord of stuur bij.

## Open Questions

> [!WARNING]
> 1. Hoe wil je dat de "Courier" communiceert? Moet hij de samenvattingen van afdelingsoverleggen rechtstreeks in je "Flip-Over" logboek plaatsen, of wil je een aparte "Brievenbus/Inbox" widget?
> 2. Mogen de "Advisors" zelfstandig beslissen dat een project wordt geannuleerd als hun onderzoek negatief is (isViable = false), of moet de "Supervisor" altijd de eindbeslissing nemen?

## Proposed Changes

We gaan `omega-core.ts` en `economy-loop.ts` ombouwen naar een gelaagd `Swarm Department` model.

### 1. Database Schema Updates (`schema.prisma`)

We moeten de `AgentType` en `AgentRole` lostrekken, en een nieuw model maken voor Inter-Agent Communicatie.

#### [MODIFY] packages/database/prisma/schema.prisma
We voegen toe:
- `AgentRole`: Enum (`SUPERVISOR`, `ADVISOR_RESEARCHER`, `EXECUTOR`, `COURIER`).
- `AgentDepartment`: Enum (`FINANCE`, `LEGAL`, `MARKETING`, `SALES`, `OPERATIONS`).
- `SwarmMemo`: Een nieuw model waarin de Courier agent de documentatie opslaat wanneer afdelingen met elkaar "overleggen".

### 2. The Agent Tiers (De AI Afdelingen)

We definiëren 4 klassen van Agenten in de codebase:

#### [MODIFY] apps/web/src/lib/orion/swarm-departments.ts (Nieuw bestand)
- **De Supervisors (Toezichthouders):** Nemen de eindbeslissing op basis van budget en risico (Godbrain CEO, Risk Manager).
- **De Advisors/Researchers (Onderzoek):** Voeren de deep-dives uit, maken het "Uitgebreid Onderzoek" rapport, checken de ROI (15% regel) en adviseren de uitvoerders.
- **De Executors (Uitvoerders):** De snipers. Doen de koude acquisitie, bouwen de websites, sturen de facturen.
- **De Courier (De Documentalist / Archivist):** De agent die "tussen elke laag heen en weer loopt". Hij luistert mee met de API-calls tussen de lagen, vat het samen, en archiveert het in de database.

### 3. De Kantoor-Workflow (The Node Logic)

#### [MODIFY] apps/web/src/lib/orion/economy-loop.ts
De logica wordt geüpdatet naar een corporate workflow:
1. **Intake:** Een Opportunity komt binnen.
2. **Research Fase:** De Courier pakt het op en brengt het naar de *Advisor/Researcher* van de juiste afdeling.
3. **Overleg:** De Researcher maakt een dossier en roept de *Supervisor* aan voor een "GO/NO-GO" beslissing.
4. **Documentatie:** De Courier logt dit hele overleg in het systeem.
5. **Uitvoering:** Bij een "GO" brengt de Courier het dossier naar de *Executor* met specifieke kaders. De Executor voert het uit.
6. **Archivering:** De Courier pakt het eindresultaat en logt dit in jouw "Flip-Over" Administratie Dashboard.

## Verification Plan

### Automated Tests
- Testen van de "Courier" logica: Controleren of een gesimuleerde Opportunity correct door de 4 lagen heen stroomt en in de database wordt gedocumenteerd.
- ROI checks: Controleren of Supervisors acties blokkeren als de Researcher een ROI onder de 15% berekent.

### Manual Verification
- We zullen een gesimuleerde "Kans" (bijv. "Lead Generatie voor E-commerce") door het systeem laten lopen.
- Jij kunt vervolgens in de **Flip-Over (Administratie Hub)** precies het dossier (Memo) van de Courier lezen waarin staat wat de Researcher adviseerde, wat de Supervisor besloot, en wat de Executor deed.
