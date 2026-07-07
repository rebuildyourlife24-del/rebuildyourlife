import { inngest } from "./client";
import { prisma } from "@rebuildyourlife/database";

/**
 * De Slaapcyclus (Memory Consolidation)
 * Draait elke nacht om 02:00. Verplaatst belangrijke lessen van korte naar lange termijn geheugen.
 */
export const councilSleepCycleJob = inngest.createFunction(
  { id: "council-sleep-cycle", name: "Council Memory Consolidation (REM Sleep)" },
  { cron: "TZ=Europe/Amsterdam 0 2 * * *" }, // Elke nacht om 02:00
  async ({ step }) => {
    console.log("[SLEEP CYCLE] Waking up the Wisdom Triad (Aurelius, Munger, Watts)...");

    // 1. Fetch short-term events and actions from the last 24 hours
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    const recentActions = await step.run("fetch-daily-actions", async () => {
      return prisma.agentAction.findMany({
        where: {
          createdAt: { gte: yesterday },
          status: { in: ["COMPLETED", "FAILED"] }
        }
      });
    });

    // 2. Consolidation process
    if (recentActions.length > 0) {
      await step.run("evaluate-and-consolidate", async () => {
        console.log(`[WISDOM TRIAD] Analyzing ${recentActions.length} actions from the past 24 hours.`);
        
        for (const action of recentActions) {
          // If an action FAILED or generated significant profit/loss, it's a core memory.
          if (action.status === "FAILED" || action.netProfitImpact > 50 || action.netProfitImpact < -50) {
            
            // Promote to OrionMemory (Long Term)
            await prisma.orionMemory.create({
              data: {
                userId: action.userId,
                memoryType: "LONG_TERM_LESSON",
                trigger: `AgentAction: ${action.title}`,
                content: `Geleerde les uit actie ${action.id}: ${action.description}. Resultaat: ${action.status}. Impact: €${action.netProfitImpact}`,
                emotionalTone: action.status === "FAILED" ? "CAUTIOUS" : "CONFIDENT",
                intensity: Math.abs(action.netProfitImpact) > 100 ? 9 : 6,
                wasEffective: action.status === "COMPLETED",
                tags: "daily_consolidation, wisdom_triad"
              }
            });
            console.log(`[ORION MEMORY] Lesson learned and stored permanently for action ${action.id}`);
          }
        }
      });
    }

    // 3. Pruning: Cleanup old short-term memories
    await step.run("prune-short-term-memory", async () => {
      const deleted = await prisma.aIMemory.deleteMany({
        where: {
          expiresAt: { lt: new Date() }
        }
      });
      console.log(`[PRUNING] Cleared ${deleted.count} expired short-term memories.`);
    });

    return { success: true, processedActions: recentActions.length };
  }
);
