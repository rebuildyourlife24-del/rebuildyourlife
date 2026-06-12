"use server";

import { PrismaClient } from "@rebuildyourlife/database";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "super-secret-jwt-key-2026-rebuild";

async function getAuthenticatedUserId(): Promise<string | null> {
  const token = (await cookies()).get("ryl_session")?.value;
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return decoded.userId;
  } catch {
    return null;
  }
}

export async function getNotificationsAction() {
  const userId = await getAuthenticatedUserId();
  if (!userId) return { success: false, notifications: [], unreadCount: 0 };

  try {
    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return {
      success: true,
      notifications: notifications.map(n => ({
        id: n.id,
        title: n.title,
        message: n.message,
        type: (n as any).type || 'INFO',
        isRead: n.isRead,
        createdAt: n.createdAt.toISOString(),
      })),
      unreadCount,
    };
  } catch (error) {
    console.error("getNotificationsAction error:", error);
    return { success: false, notifications: [], unreadCount: 0 };
  }
}

export async function markNotificationReadAction(notificationId: string) {
  const userId = await getAuthenticatedUserId();
  if (!userId) return { success: false };

  try {
    await prisma.notification.update({
      where: { id: notificationId, userId },
      data: { isRead: true },
    });
    return { success: true };
  } catch (error) {
    console.error("markNotificationReadAction error:", error);
    return { success: false };
  }
}

export async function markAllNotificationsReadAction() {
  const userId = await getAuthenticatedUserId();
  if (!userId) return { success: false };

  try {
    await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
    return { success: true };
  } catch (error) {
    console.error("markAllNotificationsReadAction error:", error);
    return { success: false };
  }
}

export async function getDashboardDataAction() {
  const userId = await getAuthenticatedUserId();
  if (!userId) return { success: false };

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        subscriptionTier: true,
        avatarUrl: true,
      },
    });

    if (!user) return { success: false };

    return { success: true, user };
  } catch (error) {
    console.error("getDashboardDataAction error:", error);
    return { success: false };
  }
}
