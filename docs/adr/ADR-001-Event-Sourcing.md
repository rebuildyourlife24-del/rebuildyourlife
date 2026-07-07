# ADR-001: Event Sourcing for the Enterprise Digital Twin

## Status
Accepted

## Context
In ARGENTIC V5.1, the `RealityGateway` and `PerceptionEngine` updated states directly. This meant historical states were lost, making it impossible to answer questions like "What was the exact state of our inventory when we made the decision to halt Facebook Ads last month?". 

## Decision
We adopt an **Event Sourcing** pattern. The Core will not mutate reality state directly. Instead, all changes are recorded as immutable `EnterpriseEvent` records in an Event Store. The `DigitalTwin` is a derived read-model continuously rebuilt from this event stream.

## Consequences
- **Pros**: 100% auditability. Enables the "Enterprise Time Machine" to replay events for simulation and debugging. Perfect explainability.
- **Cons**: Increased storage requirements. Eventual consistency challenges in the Read Models. Requires strict schema versioning for events.
