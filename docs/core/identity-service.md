# Service Contract: Identity Service

## 1. Naam
Identity Service

## 2. Doel
Authenticatie, Autorisatie, Tenant Isolation (Organizations & Workspaces) en Role-Based Access Control (RBAC) verzorgen voor RYL OS.

## 3. Verantwoordelijkheid
*   Beheren van de levenscyclus van Gebruikers, Workspaces en Organisaties.
*   Authenticatie van inkomende verzoeken (Sessie/JWT validatie).
*   Autorisatie (Mag Gebruiker X actie Y uitvoeren op resource Z binnen Workspace W?).
*   API Key beheer voor externe toegang.

## 4. Niet verantwoordelijk voor
*   Betalingen of opslag van creditcards voor deze gebruikers (zie Billing Service).
*   Notificaties of welkomst-emails sturen (zie Notification Service).
*   Profielplaatjes of avatar uploads (zie Storage/Media Service).

## 5. Database
*   **Schema:** `schema.prisma` (Identity Domain sectie).
*   **Tabellen:** `Organization`, `Workspace`, `User`, `OrganizationMember`, `WorkspaceMember`, `Role`, `Permission`, `RolePermission`.
*   **Migraties:** Geen breaking changes zonder versie-upgrade. Enkel additieve migraties.

## 6. API
**REST / Internal Interfaces (binnen Modular Monolith):**
*   `POST /v1/identity/users` (Create User)
*   `GET /v1/identity/auth/validate` (Validate JWT)
*   `GET /v1/identity/users/:id/workspaces` (Lijst workspaces)
*   `POST /v1/identity/workspaces/:id/members` (Nodig lid uit)
*   `Internal: IdentityService.checkPermission(userId, workspaceId, action)`

## 7. Events Published
Domeinen communiceren uitsluitend asynchroon met de rest van RYL OS.
*   `identity.user.created`
*   `identity.organization.created`
*   `identity.workspace.created`
*   `identity.workspace.member_added`
*   `identity.role.updated`

## 8. Events Consumed
*   `billing.subscription.cancelled` -> Gevolg: Downgrade workspace rechten naar Free tier.
*   `billing.subscription.upgraded` -> Gevolg: Ontgrendel premium features.

## 9. Dependencies
*   **Event Bus:** Voor het uitsturen van asynchrone notificaties naar de rest van het OS.
*   **Audit Service:** Elke kritieke rechten-wijziging MOET gelogd worden.

## 10. Security
*   **Auth:** JWT Tokens via HTTPOnly cookies voor frontend. Bearer tokens voor API/Agents.
*   **Tenant Isolation:** Elke query in Prisma MOET verplicht de `workspaceId` als filter hebben, tenzij het een global admin betreft.

## 11. Caching
*   **Redis:** Permissies per `(userId, workspaceId)` worden agressief gecached voor 5 minuten. Invalidate cache onmiddellijk op `identity.role.updated`.

## 12. Rate limits
*   Login pogingen: 5 per minuut per IP.
*   Internal permission checks: Ongelimiteerd (gecachet).

## 13. Performance
*   `checkPermission` call moet binnen < 5ms retourneren (Redis cache hit).
*   User data lookups (DB) binnen < 50ms (99th percentile).

## 14. Failure behaviour
*   Als database onbereikbaar is -> Fallback op stale Redis cache voor auth checks.
*   Als cache onbereikbaar is -> Directe DB hit (lagere performance, maar applicatie overleeft).

## 15. Retry policy
*   N.v.t. voor read queries.
*   Voor Event Publishing: 3 retries (Exponential Backoff) bij falen van Kafka/Upstash connectie.

## 16. Audit
Kritieke acties die onwijzigbaar naar de Audit Service gaan:
*   Inloggen (Succes/Faal).
*   Gebruiker toegevoegd of verwijderd uit Workspace.
*   Rol- of Permissiewijzigingen.

## 17. Metrics
*   `identity.auth.success` (Counter)
*   `identity.auth.failed` (Counter)
*   `identity.permission.check.latency` (Histogram)

## 18. Health checks
*   `GET /health/identity`
*   Controleert connectie met Postgres (enkel User tabel count=1) en Redis.

## 19. Versioning
*   Huidige API versie: `v1`.
*   Ondersteunt backwards compatibility tot minimaal N-1 (1 jaar support).

## 20. Future extensions
*   Ondersteuning voor SAML/SSO voor enterprise klanten.
*   Cross-Workspace federation (delen van data).
