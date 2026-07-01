"use server";

import { prisma } from '@rebuildyourlife/database';
import { revalidatePath } from 'next/cache';

export async function getTimelineData(userId: string) {
  try {
    // 1. Fetch AI Actions requiring approval (Spontaneous tasks)
    const pendingActions = await prisma.agentAction.findMany({
      where: { userId, status: 'PENDING' },
      orderBy: { createdAt: 'desc' }
    });

    // 2. Fetch standard Tasks (Fixed tasks)
    const upcomingTasks = await prisma.task.findMany({
      where: { userId, status: { not: 'COMPLETED' } },
      orderBy: { dueDate: 'asc' },
      take: 20
    });

    // 3. Fetch recent high-priority notifications ("alles en nog wat")
    const unreadNotifications = await prisma.notification.findMany({
      where: { userId, isRead: false },
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    return {
      success: true,
      pendingActions,
      upcomingTasks,
      unreadNotifications
    };
  } catch (error: any) {
    console.error("Failed to fetch timeline data:", error);
    return { success: false, error: error.message };
  }
}

export async function reviewAgentAction(actionId: string, approved: boolean) {
  try {
    const status = approved ? 'APPROVED' : 'DENIED';
    
    await prisma.agentAction.update({
      where: { id: actionId },
      data: { 
        status, 
        reviewedAt: new Date()
      }
    });

    // Create a notification for the system/user that it was handled
    const action = await prisma.agentAction.findUnique({ where: { id: actionId } });
    if (action) {
      await prisma.notification.create({
        data: {
          userId: action.userId,
          title: `AI Actie ${approved ? 'Goedgekeurd' : 'Afgewezen'}`,
          message: `De taak "${action.title}" is succesvol verwerkt.`,
          isRead: false
        }
      });
    }

    revalidatePath('/klanten/kalender');
    return { success: true, status };
  } catch (error: any) {
    console.error("Failed to review action:", error);
    return { success: false, error: error.message };
  }
}
