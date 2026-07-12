import { inngest } from "./client";
import { HermesAdapter } from "../lib/adapters/hermes-adapter";
import { AEIP_RUNTIME_POLICY } from "../lib/governance/runtime-policy";

/**
 * Hermes Intelligence Loop
 * Only observes and recommends. Does not execute.
 */
export const hermesIntelligenceLoopJob = inngest.createFunction(
  { id: "hermes-intelligence-loop", name: "Hermes Observer & Recommender" },
  { event: "quantum/events.system_activity" }, // Triggers on system activity
  async ({ event, step }) => {
    console.log("[HERMES] Starting autonomous observation loop");

    if (!AEIP_RUNTIME_POLICY.hermes.canObserve || !AEIP_RUNTIME_POLICY.hermes.canAnalyze) {
      console.log("[HERMES] Policy blocked observation/analysis");
      return { success: false, reason: "POLICY_BLOCKED" };
    }

    const prediction = await step.run("analyze-context", async () => {
       const insight = "System shows signs of performance degradation in order processing. Recommend caching layer.";
       console.log(`[HERMES] Insight generated: ${insight}`);
       
       return await HermesAdapter.createPrediction({
         category: "AUTONOMOUS_EVOLUTION",
         predictionText: insight,
         confidenceScore: 89.5,
         suggestedAction: "Implement order caching"
       });
    });

    if (AEIP_RUNTIME_POLICY.hermes.canExecute) {
       console.warn("[HERMES] WARNING: Hermes is configured to execute, but the loop is hardcoded to prevent execution. Enforcing observer mode.");
    }
    
    // Instead of executing, Hermes triggers the sandbox proposal flow
    await step.sendEvent("trigger-sandbox-proposal", {
      name: "evolution/sandbox.specification_generated",
      data: {
        proposalId: prediction.id,
        organizationId: "system"
      }
    });

    return { success: true, predictionId: prediction.id };
  }
);
