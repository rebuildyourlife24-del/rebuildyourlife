'use server';

import { processSemanticETL, ETLContext, ETLResult } from '@/lib/semantic-etl/engine';

export async function runSemanticETLAction(context: ETLContext): Promise<ETLResult> {
  try {
    const result = await processSemanticETL(context);
    return result;
  } catch (error: any) {
    console.error("[runSemanticETLAction] Error:", error);
    return {
      success: false,
      error: error.message,
      metrics: {
        attempts: 1,
        processingTimeMs: 0
      }
    };
  }
}
