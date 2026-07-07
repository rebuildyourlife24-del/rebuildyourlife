import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Perception Layer
 * Constitution Layer 3 & 4 (Objectives & Constraints)
 * 
 * Collects signals from the enterprise, filtering them against active Objectives
 * and Hard Constraints before they enter the Reasoning phase.
 */
export class PerceptionEngine {
  /**
   * Observe the environment and fetch a signal.
   * Filters out noise based on objectives.
   */
  async observe(signalData: any) {
    console.log('[Perception] Observing incoming signal...', signalData);

    // 1. Fetch active constraints
    const constraints = await prisma.constraint.findMany({
      where: { status: 'ACTIVE' }
    });

    // 2. Fetch active objectives
    const objectives = await prisma.objective.findMany({
      where: { status: 'ACTIVE' }
    });

    // Determine if signal is actionable based on constraints
    const isActionable = this.evaluateConstraints(signalData, constraints);
    if (!isActionable) {
      console.warn('[Perception] Signal dropped due to hard constraint violation.');
      return null;
    }

    return {
      rawSignal: signalData,
      relevantObjectives: objectives,
      timestamp: new Date().toISOString()
    };
  }

  private evaluateConstraints(signal: any, constraints: any[]): boolean {
    // In a real system, we parse the constraint logic.
    // E.g., if constraint is "cash_runway > 180" and signal implies dropping cash runway.
    return true; // Scaffolded pass
  }
}
