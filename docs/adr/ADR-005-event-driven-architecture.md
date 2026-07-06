# ADR-005: Event Driven Architectuur

## Status
Geaccepteerd

## Context
In een Modular Monolith (en toekomstige microservices) mag Service A (bijv. Billing) niet wachten op Service B (bijv. Notifications) tijdens een request. Synchronous HTTP communicatie tussen services zorgt voor falende cascades en trage respons tijden.

## Beslissing
We hanteren een **Event-Driven Architectuur** via een centrale Event Bus.
*   Wanneer een domeinactie slaagt, zendt de service uitsluitend een Event uit (bijv. `billing.invoice.paid`).
*   Andere domeinen (zoals Notifications of Audit) luisteren (consumeren) dit event asynchroon via de bus (bijv. Inngest of Redis PubSub).

## Consequenties
**Positief:**
*   Hoge beschikbaarheid: als de Notificatie-service plat ligt, gaat facturatie gewoon door. De notificatie wordt verzonden zodra de service weer up is.
*   Losgekoppelde domeinen: Facturatie hoeft niets te weten van e-mail templates.

**Negatief:**
*   Vereist een robuuste Event Bus infrastructuur met Dead Letter Queues (DLQ) en Retry Policies, om te voorkomen dat events (en dus processen) stilzwijgend mislukken.
