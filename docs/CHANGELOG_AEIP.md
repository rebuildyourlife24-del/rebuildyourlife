# AEIP Changelog

## v0.9.1 Hermes Runtime

**Added:**
- Hermes observation loop (\`hermes-loop.ts\`)
- Quantum guard monitor (\`quantum-monitor.ts\`)
- Evolution sandbox simulator (\`evolution-sandbox.ts\`)
- Revenue intelligence adapter (\`revenue-intelligence.ts\`)
- AEIP Domain Contracts layer (\`lib/contracts/\`)
- Storage Adapters (\`lib/adapters/\`)
- Runtime Governance Policy (\`lib/governance/runtime-policy.ts\`)

**Changed:**
- Inngest client and index updated to register AEIP runtime workers.

**Database:**
- No migrations.
- No schema changes.
- Prisma schema frozen.

**Deployment:**
- Verified compiler validation locally (TypeScript strict mode).
- Vercel preview verified.
