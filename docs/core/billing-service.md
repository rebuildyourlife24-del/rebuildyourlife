# Service Contract: Billing Service

## 1. Naam
Billing Service

## 2. Doel
Financieel kloppend hart van RYL OS. Grootboek (Ledger), abonnementsbeheer, wallet saldi, en facturatie voor alle Workspaces en Agents in de Modular Monolith.

## 3. Verantwoordelijkheid
*   Integratie met payment providers (Stripe/Mollie).
*   Afrekenen van AI-agent kosten (LLM Token Billing).
*   Beheer van RYL OS Wallets (creditsysteem).
*   Genereren van formele Invoices (facturen).
*   Dunning management (herinneringen bij gefaalde incasso's).

## 4. Niet verantwoordelijk voor
*   RBAC of bepalen of iemand toegang heeft (zie Identity Service).
*   Email versturen met de factuur (zie Notification/Email Service).
*   SaaS features blokkeren (Identity Service doet dit op basis van events).

## 5. Database
*   **Schema:** `schema.prisma` (Billing Domain sectie).
*   **Tabellen:** `Wallet`, `LedgerEntry`, `Invoice`, `Subscription`, `PaymentMethod`.
*   **Migraties:** Onwijzigbaar Append-Only karakter voor financiële integriteit (LedgerEntries kunnen NOOIT gedelete of geüpdatet worden).

## 6. API
**REST / Internal Interfaces (binnen Modular Monolith):**
*   `POST /v1/billing/wallets/:id/credit` (Geld toevoegen)
*   `POST /v1/billing/wallets/:id/debit` (Geld afschrijven)
*   `GET /v1/billing/invoices`
*   `Internal: BillingService.deductTokens(workspaceId, tokenCount, model)`

## 7. Events Published
*   `billing.wallet.credited`
*   `billing.wallet.balance_low`
*   `billing.invoice.paid`
*   `billing.invoice.failed`
*   `billing.subscription.upgraded`
*   `billing.subscription.cancelled`

## 8. Events Consumed
*   `ai.agent.execution.completed` -> Gevolg: `deductTokens` wordt aangeroepen om LLM-kosten in real-time van de Wallet af te boeken.
*   `identity.workspace.created` -> Gevolg: Creëert een lege Wallet en start de 14-daagse trial in Stripe.

## 9. Dependencies
*   **Stripe / Mollie API:** Voor daadwerkelijke fiat-transacties.
*   **Event Bus:** Om de rest van het OS op de hoogte te stellen van betalingen.

## 10. Security
*   **Idempotency:** ELKE API aanroep die geld muteert (`credit`/`debit`) heeft een verplichte unieke Idempotency-Key nodig (bijv. correlationId) om dubbele afschrijvingen te voorkomen.
*   **PCI Compliance:** Wij slaan nergens ruwe creditcardgegevens op, enkel Tokens van Stripe.

## 11. Caching
*   Wallet balans: 1 minuut TTL in Redis.
*   Factuurlijsten: Geen caching, altijd real-time DB hit wegens compliance.

## 12. Rate limits
*   Idempotente charge endpoints: Max 10/minuut per workspace om spam te voorkomen.

## 13. Performance
*   Token deducties via Event Bus (Async) -> Hoge throughput, geen blokkerende delays voor de gebruiker.
*   Wallet afschrijvingen (< 100ms 99th percentile).

## 14. Failure behaviour
*   Indien Stripe API down is -> Webhooks failen veilig, worden door Stripe gerescheduled. Geen invloed op de Core UI.
*   Indien DB down is tijdens debit actie -> Taak in Kafka Queue blijft on-acknowledged en retried later.

## 15. Retry policy
*   Betalingen: 3 Stripe Webhook retries over 72 uur (Dunning).
*   Ledger writes: Infinite retries tot succes (Kafka / Inngest dead-letter queue).

## 16. Audit
*   Elke LedgerEntry schrijft automatisch een shadow-record naar de Audit Service.
*   Admin-overrides (handmatig balans verhogen wegens coulance) worden als harde audit gelogd.

## 17. Metrics
*   `billing.revenue.mrr` (Gauge)
*   `billing.wallet.balance_total` (Gauge)
*   `billing.stripe.latency` (Histogram)
*   `billing.ledger.mismatch` (Alert Counter)

## 18. Health checks
*   `GET /health/billing`
*   Checkt connectiviteit met Stripe API en checkt of the Ledger Checksum klopt.

## 19. Versioning
*   Standaard REST versie `v1`. Stripe webhook version pinning (`2024-04-10`).

## 20. Future extensions
*   Ondersteuning voor Crypto Wallets (USDC betalingen).
*   Complexe multi-tier affiliate splitsingen en payout logica.
