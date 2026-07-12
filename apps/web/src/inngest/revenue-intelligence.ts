import { inngest } from "./client";
import { AEIP_RUNTIME_POLICY } from "../lib/governance/runtime-policy";

/**
 * RIE Observation Adapter
 * Luistert naar de zuivere ObservationEvents van de ABEE Observer.
 * Routeert passief financiële events naar RIE infrastructuur.
 */
export const rieObservationAdapterJob = inngest.createFunction(
  { id: "rie-observation-adapter", name: "RIE Passive Analyst" },
  { event: "system/observation.event" },
  async ({ event, step }) => {
    const { observationType, payload, source, confidence, timestamp } = event.data;

    if (!AEIP_RUNTIME_POLICY.rie.canCalculateRevenue) {
       return { success: false, reason: "Revenue calculation disabled by policy" };
    }

    if (observationType.includes("order") || observationType.includes("revenue")) {
      const memoryId = (payload as any)?.memoryId;
      if (!memoryId) {
        await step.sendEvent("emit-missing-memory-dependency", {
          name: "system/dependency.missing",
          data: {
            id: `err_${Date.now()}`,
            timestamp: new Date(),
            missingDependency: "memoryId",
            targetComponent: "AttributionEngine",
            contextPayload: payload,
            severity: "HIGH"
          }
        });
        
        await step.sendEvent("emit-rie-signal-for-twin", {
          name: "rie/observation.signal",
          data: {
            source: "rie-observation-adapter",
            timestamp: new Date(timestamp),
            entityType: "ORDER",
            metricType: "REVENUE",
            observedValue: (payload as any)?.total_price || 0,
            confidence: confidence,
            correlationId: event.data.id
          }
        });
        
        return { success: false, reason: "AttributionEngine blocked (Missing memoryId). DigitalTwin signal sent." };
      }
    }

    await step.sendEvent("emit-rie-signal-generic", {
      name: "rie/observation.signal",
      data: {
        source: "rie-observation-adapter",
        timestamp: new Date(timestamp),
        entityType: observationType,
        metricType: "ACTIVITY",
        observedValue: 1,
        confidence: confidence,
        correlationId: event.data.id
      }
    });

    return { success: true };
  }
);
