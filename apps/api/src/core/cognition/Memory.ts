import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Memory Layer
 * Constitution Layer 11 (Evolution - Business Genome)
 * 
 * Interfaces with the two-layer memory architecture: Memory Engine and Business Genome.
 * Handles fast semantic retrieval via pgvector.
 */
export class MemoryEngine {
  /**
   * Retrieve relevant business rules from the Genome based on context
   */
  async retrieveContext(contextQuery: string) {
    console.log(`[Memory] Retrieving genome context for: ${contextQuery}`);
    
    // In a real pgvector query, we'd embed the contextQuery and run an ANN search.
    // For now, we return candidate rules.
    const rules = await prisma.businessGenome.findMany({
      where: { status: 'VALIDATED' },
      take: 5
    });

    return rules;
  }

  /**
   * Propose a new candidate rule to the genome (Layer 11 Evolution)
   */
  async proposeRule(category: string, pattern: string, metrics: any) {
    return await prisma.businessGenome.create({
      data: {
        category,
        pattern,
        metrics,
        status: 'CANDIDATE',
        origin: 'CognitiveLoop'
      }
    });
  }
}
