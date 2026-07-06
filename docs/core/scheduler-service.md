# Service Contract Template v1.0

Dit is de Gouden Standaard voor elke Core Service in RYL OS. Geen enkele module wordt geprogrammeerd voordat dit contract 100% is ingevuld en goedgekeurd.

---

## 1. Naam
Scheduler Service

## 2. Doel
Cron-jobs en uitgestelde taakuitvoering.

## 3. Responsibilities (Single Responsibility)
*   [Wat doet deze service wél?]
*   [Wat beheert het?]

## 4. Non-Responsibilities
*   [Wat doet het expliciet NIET? Verwijs naar de service die dit wel doet.]

## 5. Bounded Context & Ownership
*   **Domain:** [Bijv. Identity Domain]
*   **Source of Truth:** [Welke data "bezit" deze service exclusief?]

## 6. Database
*   **Schema:** `schema.prisma` sectie
*   **Tabellen:** [Lijst van tabellen]

## 7. Data Classification
*   [Tabel A]: [Public / Internal / Confidential / Restricted / PII / Financial]
*   [Tabel B]: [Classificatie]

## 8. State Machine(s)
*   [Zijn er levenscycli? Bijv. Invoice: Draft -> Pending -> Paid -> Refunded -> Cancelled -> Archived]

## 9. Public API
*   [REST/GraphQL endpoints blootgesteld aan het web]

## 10. Internal API (Modular Monolith)
*   [Endpoints of methodes uitsluitend voor inter-service communicatie]

## 11. Commands
*   [Lijst van synchrone opdrachten die state wijzigen]

## 12. Queries
*   [Lijst van synchrone opdrachten die state lezen]

## 13. Events Published (Schema)
*   **Topic:** `domain.entity.action`
    *   `eventId` (uuid)
    *   `version` (int)
    *   `timestamp` (ISO)
    *   `correlationId` (uuid) - **Verplicht voor tracing**
    *   `organizationId` (uuid)
    *   `workspaceId` (uuid)
    *   [Custom payload fields]

## 14. Events Consumed
*   **Topic:** `otherdomain.entity.action` -> **Gevolg:** [Wat doet deze service als dit event binnenkomt?]

## 15. Dependencies
*   [Van welke services of externe API's is deze service afhankelijk?]

## 16. Security & Governance
*   **Authentication:** [Bijv. JWT, API Key]
*   **Authorization (RBAC/ABAC):** [Welke rollen/permissies zijn nodig?]
*   **Tenant Isolation:** [Hoe wordt data strikt gescheiden per Workspace?]
*   **Encryption / Secrets / Key Rotation:** [Beheer van gevoelige data]
*   **PII Handling:** [Hoe wordt privacygevoelige data verwerkt?]
*   **Input/Output Validation:** [Zod validation, sanitization]

## 17. Standard Error Contract
*   `code` (string, bijv. "validation_failed")
*   `message` (string)
*   `details` (object)
*   `correlationId` (string) - **Verplicht voor debugging**
*   `retryable` (boolean)
*   `documentationUrl` (string)

## 18. Caching
*   [Wat wordt gecached en hoe lang (TTL)?]

## 19. Performance
*   [Target latency 95th/99th percentile voor reads/writes]

## 20. Rate Limits
*   [Max verzoeken per minuut/seconde per IP of Workspace]

## 21. Failure Behaviour
*   [Wat als DB down is? Wat als Cache down is?]

## 22. Retry Policy
*   [Exponential backoff strategie voor inkomende/uitgaande events of requests]

## 23. Observability
*   **Correlation ID:** Iedere API call, event, log en audit **moet** `X-Correlation-ID` en `X-Request-ID` dragen.

## 24. Metrics
*   [Welke custom metrics sturen we naar Prometheus/Datadog?]

## 25. Health Checks
*   [Endpoints en checks voor Kubernetes readiness/liveness]

## 26. Audit
*   [Welke acties worden onwijzigbaar naar de Audit Service gestuurd?]

## 27. Versioning
*   [Backward compatibility policy voor API's en Events]

## 28. SLA
*   **Availability:** [bijv. 99.95%]
*   **RTO (Recovery Time Objective):** [bijv. 1 uur]
*   **RPO (Recovery Point Objective):** [bijv. 5 minuten]

## 29. OpenAPI
*   [Verwijzing naar de bijbehorende `domain.openapi.yaml` file]

## 30. Testing Matrix
*   [ ] Unit Tests
*   [ ] Integration Tests
*   [ ] Contract Tests
*   [ ] Load Tests
*   [ ] Chaos Tests
*   [ ] Security Tests
*   [ ] Regression Tests

## 31. Future Extensions
*   [Ideeën voor de roadmap]
