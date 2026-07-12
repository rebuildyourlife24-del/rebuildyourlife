import { inngest } from "./client";
import { QuantumAdapter } from "../lib/adapters/quantum-adapter";
import { AEIP_RUNTIME_POLICY } from "../lib/governance/runtime-policy";

/**
 * Quantum Guard Monitor
 * Luistert naar Soft Enforcement waarschuwingen (AgentActions zonder traceId).
 */
export const quantumGuardMonitorJob = inngest.createFunction(
  { id: "quantum-guard-monitor", name: "Quantum Guard Monitor" },
  { event: "quantum/guard.missing_trace" },
  async ({ event, step }) => {
    const { source, actionType, severity, remediation, payloadSnapshot } = event.data;

    if (!AEIP_RUNTIME_POLICY.quantum.canMonitor) {
       return { success: false, reason: "Monitoring disabled by policy" };
    }

    await step.run("log-to-audit-vault", async () => {
      await QuantumAdapter.logGuardAlert({
         source,
         actionType,
         severity,
         remediation,
         payloadSnapshot,
         createdAt: new Date()
      });
      
      console.warn(`[QUANTUM GUARD] ${severity}: Legacy action '${actionType}' by '${source}' executed without traceId.`);
    });

    return { success: true, recorded: true };
  }
);
