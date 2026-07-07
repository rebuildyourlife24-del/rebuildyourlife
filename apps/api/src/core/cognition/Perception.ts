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
    console.log('[Perception] Observing incoming signal...', JSON.stringify(signalData, null, 2));

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
    let isValid = true;
    for (const constraint of constraints) {
      if (!constraint.isHardLimit) continue; // Skip soft limits for now

      // Example evaluation logic based on metric name
      if (constraint.metric === 'cash_runway_days') {
        const currentRunway = signal.data?.revenue?.cashRunwayDays || 365; // Default safe value if missing
        if (constraint.operator === '>' && currentRunway <= constraint.thresholdValue) {
          console.warn(`[Perception] Broken Constraint: ${constraint.name} (Current: ${currentRunway})`);
          isValid = false;
        }
      }
      // Add logic for debt_ratio, refund_rate etc as needed.
    }
    return isValid;
  }
}

