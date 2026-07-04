"use server";

import { prisma } from '@rebuildyourlife/database';
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET! || "fallback";

async function getAuthenticatedUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("ryl_session")?.value;
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return decoded.userId;
  } catch {
    return null;
  }
}

export async function logSystemHealthAction(component: string, status: string, errorLog: string) {
  try {
    const userId = await getAuthenticatedUser();
    
    // Zelfs als er geen user is, loggen we het systeem issue, maar dan zonder userId
    await prisma.systemHealthLog.create({
      data: {
        component,
        status,
        errorLog
      }
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to log system health:", error);
    return { success: false };
  }
}
