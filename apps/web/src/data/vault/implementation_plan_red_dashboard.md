# Implementatieplan: The Red Black Box (Fase 2)

Je hebt de eerste look van het dashboard nu gezien in de UI, en we gaan het nu écht tot leven wekken. Je gaf groen licht voor **Punt 2 (Review Queue)** en **Punt 3 (Ruwe SEO Data)**.

## User Review Required

> [!IMPORTANT]  
> Bekijk dit plan om te zien hoe we de "Goedkeuren/Afwijzen" functionaliteit en de SEO-data gaan inbouwen. Als dit klopt, klik op de knop om te starten met de executie.

## 1. De Review Queue (Jij blijft de Baas)
Momenteel doen de agenten dingen op de achtergrond. We gaan een sectie in het dashboard bouwen waar acties "vastgehouden" worden tot jij ze goedkeurt.

**Hoe het werkt:**
- Agent 4 (Content) wil een nieuwe landingspagina publiceren.
- Hij publiceert het *niet*, maar plaatst een `PENDING` ticket in je database.
- Op jouw rode `/seo` dashboard verschijnt een waarschuwing: *"1 actie vereist goedkeuring"*.
- Je ziet de voorgestelde pagina, en je klikt op `[ APPROVE ]` (groen) of `[ REJECT ]` (rood).

## 2. Ruwe SEO Data & Concurrentie Radar
De financiële data die er nu staat gaan we vervangen (of aanvullen) met keiharde marketing metrics.

**Wat we gaan inbouwen in de UI:**
- **Positie Tracking:** Waar rankt jouw site op Google op dit moment?
- **Competitor Radar:** Een live-overzicht van wat je concurrenten doen (hun nieuwe keywords, hun backlink groei).
- **Traffic vs Conversie:** Een rode "Area Chart" die precies laat zien hoeveel organische traffic er is vs hoeveel er kopen.

## Proposed Changes

### [MODIFY] `packages/database/prisma/schema.prisma`
We voegen een nieuw model toe genaamd `AgentAction` met statussen zoals `PENDING`, `APPROVED`, `REJECTED`. Zo kunnen we exact bijhouden welke beslissingen wachten op jouw handtekening.

### [MODIFY] `apps/command-center/src/app/seo/page.tsx`
We bouwen de UI compleet om. We splitsen het scherm in tweeën:
- **Linkerhelft:** De *Review Queue* (een strakke, hacker-stijl lijst met acties).
- **Rechterhelft:** De *Ruwe SEO Radar* (grafieken met zoekwoorden en concurrentie-data).

### [NEW] `apps/command-center/src/app/api/actions/review/route.ts`
Een nieuwe API endpoint waarmee de knoppen in je dashboard praten met de database, zodat een goedkeuring direct wordt uitgevoerd.

---

> [!TIP]  
> Dit is het moment dat je dashboard transformeert van een "kijkdoos" naar een echte **Commandocentrale**. 
> Ga akkoord om dit direct in je code te bouwen!
