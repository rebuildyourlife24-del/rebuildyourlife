# ADR-002: REST API's over GraphQL

## Status
Geaccepteerd

## Context
Voor de Mission Control Frontend en externe integraties is een robuuste API-laag vereist. GraphQL is populair voor frontends om overfetching te voorkomen, maar voegt aanzienlijke complexiteit toe voor caching, monitoring en externe SDK's.

## Beslissing
We gebruiken **REST in combinatie met specifieke CQRS Read Models**.
*   We bouwen geen generieke endpoints, maar specifieke widget-based endpoints in de Query Layer (bijv. `/api/query/dashboard/finance`).
*   We verwerpen GraphQL voor de publieke en interne API's.

## Consequenties
**Positief:**
*   Perfect te gebruiken door AI Agents, Plugins, CLI's, SDK's en Webhooks (die van nature beter werken met standaard REST/HTTP verzoeken).
*   Eenvoudiger te cachen via CDN en de BFF-laag (Backend For Frontend).
*   Sluit perfect aan bij de OpenAPI generatie (Swagger).

**Negatief:**
*   De frontend heeft minder flexibiliteit om zelf exact de datastructuur te bepalen; er moeten specifieke Read Models gebouwd worden aan de backend-kant per widget. Dit weegt echter niet op tegen de stabiliteit en voorspelbaarheid van REST voor Agents.
