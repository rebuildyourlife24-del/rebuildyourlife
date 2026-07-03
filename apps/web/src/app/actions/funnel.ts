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

export async function getFunnels() {
  const userId = await getAuthenticatedUser();
  if (!userId) return { success: false, error: "Not authenticated" };

  try {
    const funnels = await prisma.funnel.findMany({
      where: { userId },
      include: {
        pages: true,
        checkouts: true
      },
      orderBy: { createdAt: 'desc' }
    });
    return { success: true, funnels };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createFunnel(name: string) {
  const userId = await getAuthenticatedUser();
  if (!userId) return { success: false, error: "Not authenticated" };

  try {
    const funnel = await prisma.funnel.create({
      data: {
        userId,
        name,
        status: "DRAFT"
      }
    });

    // Create a default opt-in page
    await prisma.funnelPage.create({
      data: {
        funnelId: funnel.id,
        slug: "optin",
        html: "<h1>Welkom bij " + name + "</h1><p>Vul je gegevens in.</p>"
      }
    });

    return { success: true, funnel };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
