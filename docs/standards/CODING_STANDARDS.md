# Coding & Naming Standards

Deze repository bevat de platform-engineering code voor RYL OS. Zonder harde, dwingende conventies verandert de codebase snel in chaos. Elke Pull Request wordt getoetst aan de volgende regels.

## 1. Naming Conventions

### 1.1 Events (Cruciaal)
Event namen MOETEN de structuur `<entity>.<action>.<state>` volgen. Geen camelCase, geen snake_case. Strikte punten.
*   ✅ Goed: `customer.created`
*   ✅ Goed: `billing.invoice.paid`
*   ✅ Goed: `agent.execution.completed`
*   ❌ Fout: `CustomerCreated`
*   ❌ Fout: `invoicePaid`
*   ❌ Fout: `billing-paid`

### 1.2 Mappen en Bestanden
*   **Modules:** Kebab-case voor mapnamen in de backend: `apps/api/src/modules/event-bus`.
*   **Bestanden:** Kebab-case, gegroepeerd op type: `billing.service.ts`, `billing.controller.ts`.

## 2. TypeScript (Strict Mode)
*   `tsconfig.json` moet ingesteld staan op `"strict": true`.
*   Geen gebruik van `any` tenzij absoluut onvermijdelijk (bijv. in heel abstracte generic mapping of bij falende externe library types, met verplichte ESLint disable comments die de reden uitleggen).
*   Interfaces worden geprefereerd boven Type aliases (behalve voor union types of specifieke utility types).

## 3. Code Formatter & Linter
*   **ESLint:** Afgedwongen in de CI/CD pipeline.
*   **Prettier:** Iedere commit of file-save wordt geformatteerd via Prettier. Debatten over whitespace zijn verleden tijd.

## 4. Git & Commits
We gebruiken **Conventional Commits** om automatisch changelogs en semantic versioning (SemVer) te genereren.

*   `feat: add stripe webhook endpoint`
*   `fix(billing): correct token deduction precision`
*   `docs(adr): add ADR-006 workspace isolation`
*   `chore(deps): bump prisma to latest`

## 5. Security Practices (OWASP)
*   **Tenant Isolation First:** Elke read of write naar de database MOET, expliciet, de `workspaceId` als filter of relation constraint meesturen (RBAC/Isolation).
*   **Secrets:** API keys, AWS credentials of JWT Secrets worden *nooit* direct in code gezet. Altijd via `process.env.VAR_NAME` opgehaald en getypecast in een centrale `config` directory.
*   **Zero Trust:** Externe inputs (API payloads, Webhooks) worden niet zomaar aangenomen. Volledige payload validatie via schema's (bijv. Zod) is verplicht in de Controller voordat het de Service layer raakt.
