# ADR-001: Modular Monolith Architectuur

## Status
Geaccepteerd

## Context
De backend moet schaalbaar zijn naar tientallen services (Identity, Billing, AI Runtime, etc.). Direct starten met microservices introduceert echter massale "DevOps Hell", netwerk-complexiteit en trage ontwikkelingscycli voor een klein team of solo-ontwikkelaar.

## Beslissing
We hanteren een **Modular Monolith** architectuur.
*   De code is fysiek gescheiden in strikte domeinen (`apps/api/src/modules/*`).
*   Domeinen communiceren met elkaar via interne functie-aanroepen of de asynchrone Event Bus, niet via HTTP over het netwerk.
*   Alles draait op één database (maar in logische silo's).
*   De volledige applicatie wordt gedeployd als één enkele container/unit.

## Consequenties
**Positief:**
*   Snelheid van ontwikkeling blijft hoog (geen complexe CI/CD per service).
*   Geen netwerk-latency of gedistribueerde tracing-hell tijdens Fase C.
*   Refactoring over de grens van services heen is eenvoudiger.
*   Migratie naar fysieke microservices is in de toekomst triviaal, omdat de domeinen al modulair gescheiden zijn met eigen contracten.

**Negatief:**
*   Vereist ijzeren discipline (zoals vastgelegd in de Service Contracts) om te voorkomen dat ontwikkelaars de grenzen van de modules doorbreken (de 'spaghetti' monolieth).
