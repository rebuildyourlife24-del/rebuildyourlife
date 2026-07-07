# ADR-003: AI Model Provider Abstraction

## Status
Accepted

## Context
AI models evolve rapidly. Hardcoding dependencies on specific LLMs (e.g., OpenAI, Gemini, Claude) creates a risk of vendor lock-in and prevents the system from routing tasks to the most cost-effective or capable model.

## Decision
No AI model names will be hardcoded in the Core Reference Architecture. Instead, we define abstract capabilities through interfaces (e.g., `IReasoningProvider`, `IVisionProvider`, `IPlanningProvider`). The `AIModelGovernance` layer maps these roles to active providers at runtime.

## Consequences
- **Pros**: Ultimate replaceability. The core architecture remains stable regardless of the AI landscape.
- **Cons**: Requires building normalization layers (SDKs) to translate generic intents into specific API payloads for each vendor.
