# ADR-002: Decision Ledger for Auditability

## Status
Accepted

## Context
ARGENTIC is an enterprise intelligence system that makes critical economic and operational decisions. If an AI makes a wrong decision, the organization must be able to understand exactly *why* that decision was made.

## Decision
We introduce the `DecisionLedger` in the V6 Core. Every decision must pass through the `DecisionIntelligence` module, which records the entire decision lifecycle:
- `proposal`: The action being evaluated.
- `evidence`: The context and data used.
- `simulationId`: The simulation that predicted the outcome.
- `decision`: APPROVE, BLOCK, HUMAN_REVIEW.
- `outcomeObserved`: The actual economic outcome measured later.

## Consequences
- **Pros**: 100% Explainability. Allows the Meta Intelligence Layer to calculate the "Decision Quality Index" accurately.
- **Cons**: Adds latency to the execution path since a ledger entry must be verified before execution.
