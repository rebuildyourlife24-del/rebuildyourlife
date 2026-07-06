# Definition of Done (DoD) voor Core Services

Een API module of Core Service in de RYL OS Modular Monolith mag pas naar **Maturity Level 4 (Production Ready)** gepromoveerd worden (en ge-merged worden naar `main`) wanneer aan **alle** onderstaande eisen is voldaan.

## 1. Documentatie & Architectuur
- [ ] Er is een volledig en actueel Service Contract (gebaseerd op het `SERVICE_CONTRACT_TEMPLATE`) in `/docs/core`.
- [ ] Bij aanzienlijke architectonische wijzigingen is er een Architecture Decision Record (ADR) geschreven of bijgewerkt in `/docs/adr`.

## 2. API & Interfaces
- [ ] OpenAPI specificatie (Swagger) is gegenereerd vanuit de code en is 100% up-to-date.
- [ ] De API route maakt gebruik van API-versionering (bijv. `/api/v1/...`).
- [ ] Zowel succes- als foutreacties volgen de RYL OS Standard Error Contract structuur (`code`, `message`, `correlationId`, `retryable`).

## 3. Veiligheid & Isolatie
- [ ] De service dwingt RBAC (Role-Based Access Control) regels af.
- [ ] De service dwingt Tenant Isolation (via `workspaceId`) strikt af. Een gebruiker kan nooit data uit een ander workspace opvragen.
- [ ] Secrets (API keys, wachtwoorden) zijn veilig weggeschreven en staan nergens in plain-text logs.

## 4. Datalaag & Migraties
- [ ] Prisma schema is up-to-date en `npx prisma generate` is gelukt.
- [ ] Database migraties voor de benodigde modellen zijn gegenereerd en gereviewd.
- [ ] Rollback-scenario's voor corrupte migraties zijn nagedacht (non-destructive wijzigingen).

## 5. Observability
- [ ] Elke request, log en audit-trace is voorzien van de actieve `correlationId`.
- [ ] Er worden gestructureerde (JSON) logboek-entries weggeschreven.
- [ ] Cruciale handelingen worden onwijzigbaar gelogd via de `AuditService`.
- [ ] Health Check endpoints (`/health/liveness`, `/health/readiness`) zijn aangesloten op de betreffende modules, inclusief eventuele databanks verbindingen.

## 6. Events & Integraties
- [ ] Asynchrone events gebruiken exact de Naming Standard: `entity.action.state` (bijv. `billing.invoice.paid`).
- [ ] Failures tijdens het publiceren of consumeren van events belanden netjes in de gereserveerde Dead Letter Queue (DLQ).

## 7. Testing
- [ ] Alle kernfunctionaliteiten zijn afgedekt met **Unit Tests**.
- [ ] De API-endpoints en database-connecties zijn gedekt met **Integratietests**.
- [ ] Contract/Pact testing (of e2e tests) valideren dat de consumenten van de service niet omvallen bij updates.
