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

export async function getAdCampaigns() {
  const userId = await getAuthenticatedUser();
  if (!userId) return { success: false, error: "Not authenticated" };

  try {
    const platformIntegrations = await prisma.socialPlatformIntegration.findMany({
      where: { userId }
    });
    
    const platformIds = platformIntegrations.map(p => p.id);

    const campaigns = await prisma.socialCampaign.findMany({
      where: { platformId: { in: platformIds } },
      include: {
        adSets: {
          include: {
            creatives: true
          }
        },
        platform: true
      },
      orderBy: { createdAt: 'desc' }
    });
    
    return { success: true, campaigns, platforms: platformIntegrations };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
