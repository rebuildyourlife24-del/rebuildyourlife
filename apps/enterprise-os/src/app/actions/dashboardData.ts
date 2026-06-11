"use server";

import prisma from "@rebuildyourlife/database";

// Fetch AI task queue (actions that require human validation)
export async function getActionQueue() {
  try {
    const tasks = await prisma.task.findMany({
      where: {
        status: "PENDING",
      },
      orderBy: {
        createdAt: "desc"
      },
      take: 10
    });
    
    return { success: true, data: tasks };
  } catch (error) {
    console.error("Failed to fetch action queue:", error);
    return { success: false, data: [] };
  }
}

// Fetch Board of Directors active statuses
export async function getBoardStatus() {
  try {
    // In a real scenario, this would query active AI processes.
    // We'll mock it temporarily until the full AI orchestrator is linked,
    // but the connection to Prisma is verified here.
    const userCount = await prisma.user.count();
    
    return { 
      success: true, 
      status: "GREEN",
      metrics: {
        totalUsers: userCount
      }
    };
  } catch (error) {
    console.error("Failed to fetch board status:", error);
    return { success: false, status: "OFFLINE" };
  }
}

// Fetch financial snapshot
export async function getFinancialSnapshot() {
  try {
    // Assuming budget data exists. If not, return defaults.
    const budget = await prisma.budget.findFirst({
      orderBy: { month: "desc" }
    });

    return {
      success: true,
      data: {
        revenue: budget?.totalIncome || 0,
        expenses: budget?.totalExpenses || 0,
      }
    };
  } catch (error) {
    console.error("Failed to fetch finances:", error);
    return { success: false, data: { revenue: 0, expenses: 0 } };
  }
}
