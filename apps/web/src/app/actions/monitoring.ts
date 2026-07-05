"use server";

import { prisma } from "@rebuildyourlife/database";
import { getSessionAction } from "./auth";
import { revalidatePath } from "next/cache";

export async function getMonitorsAction() {
  try {
    const session = await getSessionAction();
    if (!session?.success || !session?.user?.id) {
      throw new Error("Niet ingelogd");
    }

    const monitors = await prisma.uptimeMonitor.findMany({
      where: { userId: session.user.id },
      include: {
        logs: {
          orderBy: { createdAt: "desc" },
          take: 5
        }
      },
      orderBy: { createdAt: "desc" },
    });
    
    return { success: true, monitors };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createMonitorAction(data: { name: string; url: string; interval?: number }) {
  try {
    const session = await getSessionAction();
    if (!session?.success || !session?.user?.id) {
      throw new Error("Niet ingelogd");
    }

    // Zorg ervoor dat de URL correct is geformatteerd
    let formattedUrl = data.url;
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = 'https://' + formattedUrl;
    }

    const monitor = await prisma.uptimeMonitor.create({
      data: {
        userId: session.user.id,
        name: data.name,
        url: formattedUrl,
        interval: data.interval || 5,
        status: "PENDING",
      },
    });

    revalidatePath('/dashboard/modules/monitoring');
    return { success: true, monitor };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteMonitorAction(monitorId: string) {
  try {
    const session = await getSessionAction();
    if (!session?.success || !session?.user?.id) {
      throw new Error("Niet ingelogd");
    }

    const existing = await prisma.uptimeMonitor.findUnique({ where: { id: monitorId } });
    if (!existing || existing.userId !== session.user.id) {
      throw new Error("Niet geautoriseerd");
    }

    await prisma.uptimeMonitor.delete({ where: { id: monitorId } });

    revalidatePath('/dashboard/modules/monitoring');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function checkMonitorAction(monitorId: string) {
  try {
    const session = await getSessionAction();
    if (!session?.success || !session?.user?.id) {
      throw new Error("Niet ingelogd");
    }

    const monitor = await prisma.uptimeMonitor.findUnique({ where: { id: monitorId } });
    if (!monitor || monitor.userId !== session.user.id) {
      throw new Error("Monitor niet gevonden");
    }

    const startTime = Date.now();
    let status = "DOWN";
    let statusCode = null;

    try {
      const response = await fetch(monitor.url, { 
        method: "GET",
        headers: { "User-Agent": "RYL-UptimeMonitor/1.0" },
        cache: "no-store",
      });
      statusCode = response.status;
      if (response.ok) {
        status = "UP";
      }
    } catch (e) {
      // Netwerkfout of ongeldige URL = DOWN
      statusCode = 0;
    }

    const responseTime = Date.now() - startTime;

    // Log de check in de database
    await prisma.uptimeLog.create({
      data: {
        monitorId: monitor.id,
        status,
        statusCode,
        responseTime,
      }
    });

    // Update the monitor's main status
    const updatedMonitor = await prisma.uptimeMonitor.update({
      where: { id: monitor.id },
      data: {
        status,
        lastCheck: new Date(),
      }
    });

    revalidatePath('/dashboard/modules/monitoring');
    return { success: true, status, statusCode, responseTime, monitor: updatedMonitor };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
