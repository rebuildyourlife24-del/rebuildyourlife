"use server";

import { db } from "@/lib/db";
import { getSessionAction } from "./auth";
import { revalidatePath } from "next/cache";

export interface LogInput {
  action: string;
  category: "TECH" | "SEO" | "CEO" | "MARKETING" | "TRADING" | string;
  status: "SUCCESS" | "FAILED" | "RUNNING";
  executionTime?: number;
  metadata?: any;
  errorMessage?: string;
}

export async function createSystemActivityLogAction(input: LogInput) {
  try {
    const session = await getSessionAction();
    if (!session.success || !session.user) {
      return { success: false, error: "Niet geauthenticeerd" };
    }

    const log = await db.systemActivityLog.create({
      data: {
        userId: session.user.id,
        action: input.action,
        category: input.category,
        status: input.status,
        executionTime: input.executionTime || null,
        metadata: input.metadata ? JSON.stringify(input.metadata) : null,
        errorMessage: input.errorMessage || null,
      },
    });

    revalidatePath("/dashboard/war-room");
    return { success: true, log };
  } catch (err: any) {
    console.error("Failed to create activity log:", err);
    return { success: false, error: err.message };
  }
}

export async function getSystemActivityLogsAction(limit: number = 50) {
  try {
    const session = await getSessionAction();
    if (!session.success || !session.user) {
      return { success: false, error: "Niet geauthenticeerd" };
    }

    // Check if the user is an admin or Henk Semler
    const isAdmin = session.user.role === "ADMIN" || session.user.email === "hsemler50@gmail.com";

    const logs = await db.systemActivityLog.findMany({
      where: {
        // Admins can see all logs, regular users only their own
        ...(!isAdmin ? { userId: session.user.id } : {}),
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    // Parse metadata back to object for UI ease
    const parsedLogs = logs.map(log => ({
      ...log,
      metadata: log.metadata ? JSON.parse(log.metadata) : null
    }));

    return { success: true, logs: parsedLogs };
  } catch (err: any) {
    console.error("Failed to get activity logs:", err);
    return { success: false, error: err.message };
  }
}
