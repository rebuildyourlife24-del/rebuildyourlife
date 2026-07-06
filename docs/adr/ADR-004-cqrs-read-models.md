# ADR-004: CQRS & BFF Strikte Datastroom

## Status
Geaccepteerd

## Context
Wanneer UI-componenten direct praten met Core Services (zoals de Identity Service of Billing Service), ontstaat er na verloop van tijd een onbeheerbare wirwar (spaghetti) van afhankelijkheden. Dit maakt de frontend traag door over-fetching en ingewikkelde joins op de client.

## Beslissing
We voeren de **Gouden Architectuurregel** in: *Geen enkele UI-component praat ooit direct met een Core Service.*

We gebruiken Command Query Responsibility Segregation (CQRS) en een Backend For Frontend (BFF):
1.  **Lezen:** UI → BFF → Query Layer (REST Read Models) → Core Services / Database.
2.  **Schrijven:** UI → Command API (BFF) → Core Service → Event Bus → Read Models updaten → Query Layer → UI.

## Consequenties
**Positief:**
*   De UI is extreem snel omdat Read Models precies de data teruggeven die nodig is voor een specifieke widget, zonder joins te hoeven doen op het moment van ophalen.
*   Authenticatie, Caching, en Feature Flags kunnen centraal in de BFF worden afgehandeld.
*   Core Services blijven gefocust op hun domein-logica.

**Negatief:**
*   Meer initiële boilerplate (Command Service + Query Service per actie).
*   Eventual consistency: na een schrijf-actie via de Event Bus kan het milliseconden tot seconden duren voordat de Read Models up-to-date zijn.
