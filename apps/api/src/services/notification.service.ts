import { prisma } from "@rebuildyourlife/database";

export async function getUserNotifications(userId: string) {
  return await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 20
  });
}

export async function getUnreadCount(userId: string) {
  return await prisma.notification.count({
    where: { userId, isRead: false }
  });
}

export async function markAsRead(userId: string, notificationId: string) {
  return await prisma.notification.update({
    where: { id: notificationId, userId },
    data: { isRead: true }
  });
}

export async function markAllAsRead(userId: string) {
  return await prisma.notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true }
  });
}

// Internal helper for system to push notifications
export async function createNotification(userId: string, title: string, message: string, actionUrl?: string) {
  return await prisma.notification.create({
    data: {
      userId,
      title,
      message,
      actionUrl
    }
  });
}
