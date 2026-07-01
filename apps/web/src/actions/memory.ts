"use server";

import { prisma } from "@rebuildyourlife/database";

export async function shareMemory(sourceAgent: string, content: string, importance: number = 0.5, targetAgent?: string, tags?: string) {
  try {
    const memory = await prisma.agentSharedMemory.create({
      data: {
        sourceAgent,
        content,
        importance,
        targetAgent,
        tags
      }
    });
    return { success: true, memory };
  } catch (error) {
    console.error("Failed to share agent memory:", error);
    return { success: false, error: "Database error" };
  }
}

export async function getSharedMemories(agentName: string, limit: number = 50) {
  try {
    const memories = await prisma.agentSharedMemory.findMany({
      where: {
        OR: [
          { targetAgent: agentName },
          { targetAgent: null }
        ]
      },
      orderBy: [
        { importance: 'desc' },
        { createdAt: 'desc' }
      ],
      take: limit
    });
    return { success: true, memories };
  } catch (error) {
    console.error("Failed to fetch agent memories:", error);
    return { success: false, error: "Database error" };
  }
}

export async function markMemoryProcessed(memoryId: string) {
  try {
    await prisma.agentSharedMemory.update({
      where: { id: memoryId },
      data: { status: "PROCESSED" }
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: "Database error" };
  }
}
