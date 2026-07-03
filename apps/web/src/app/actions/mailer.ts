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

export async function getEmailCampaigns() {
  const userId = await getAuthenticatedUser();
  if (!userId) return { success: false, error: "Not authenticated" };

  try {
    const campaigns = await prisma.emailCampaign.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
    
    const subsCount = await prisma.subscriber.count({
      where: { userId, status: "SUBSCRIBED" }
    });

    return { success: true, campaigns, subsCount };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createEmailCampaign(name: string, subject: string) {
  const userId = await getAuthenticatedUser();
  if (!userId) return { success: false, error: "Not authenticated" };

  try {
    const campaign = await prisma.emailCampaign.create({
      data: {
        userId,
        name,
        subject,
        htmlContent: "<h1>Nieuwe Campagne</h1><p>Typ hier je mail...</p>",
        status: "DRAFT"
      }
    });

    return { success: true, campaign };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
