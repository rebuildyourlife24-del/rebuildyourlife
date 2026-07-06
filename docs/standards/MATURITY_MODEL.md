# RYL OS Platform Maturity Model

Niet alles hoeft op dag 1 Enterprise Ready te zijn. Ontwikkelaars en Architecten gebruiken dit model om de status van elke Core Service eerlijk en transparant te beoordelen, in plaats van binaire "Af / Niet Af" labels te gebruiken.

| Level | Status | Omschrijving |
| :--- | :--- | :--- |
| **Level 1** | **Werkend** | De 'Happy Path' core logica is geïmplementeerd. De service compileert, de code draait lokaal en basisfuncties werken. Er is (meestal) nog geen foutafhandeling, documentatie of database veiligheid. |
| **Level 2** | **Getest** | Foutafhandeling is toegevoegd, evenals Unit- en Integratietesten voor de belangrijkste flows. De service overleeft ongeldige input en heeft een vastgelegd Service Contract. |
| **Level 3** | **Observability** | De service praat in het Enterprise dialect: `X-Correlation-ID` wordt correct doorgegeven aan child-processen, logging is gestructureerd (JSON), metrics worden bijgehouden en Health Endpoints (`/health/liveness`, `/health/readiness`) zijn operationeel. Acties worden gelogd in de Audit Service. |
| **Level 4** | **Production Ready** | De service voldoet aan de volledige **Definition of Done**. OpenAPI documentatie wordt automatisch gegenereerd. Database migraties en rollback scenario's zijn aanwezig. De service kan veilig op een acceptatie/productie-omgeving gedeployd worden. |
| **Level 5** | **Enterprise Ready** | De service heeft zich in het wild bewezen. Er is Load Testing en Chaos Testing op toegepast. CI/CD pipelines zijn volledig geautomatiseerd. Secret Management draait via roterende kluizen. De Event Bus afhandeling heeft geteste Dead Letter Queues (DLQ) en automatische event replays. |

### Huidige Status (Voorbeeld)
*   `Identity Service`: Level 2
*   `Billing Service`: Level 2
*   `Storage Service`: Level 1
*   `AI Runtime`: Level 1
