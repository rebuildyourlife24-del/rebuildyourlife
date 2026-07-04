'use server';

import { prisma } from '@rebuildyourlife/database';
import { revalidatePath } from 'next/cache';
import { getSessionAction } from './auth';

function generateRandomCode(length: number) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function createAffiliateProfileAction() {
  try {
    const session = await getSessionAction();
    if (!session?.success || !session?.user?.id) {
      throw new Error("Niet ingelogd");
    }
    const userId = session.user.id;

    const existing = await prisma.affiliateProfile.findUnique({ where: { userId } });
    if (existing) {
      return { success: true, profile: existing };
    }

    let affiliateCode = (session.user.firstName || 'PARTNER').substring(0, 4).toUpperCase() + '-' + generateRandomCode(5);
    
    let isUnique = false;
    while (!isUnique) {
      const check = await prisma.affiliateProfile.findUnique({ where: { affiliateCode } });
      if (!check) {
        isUnique = true;
      } else {
        affiliateCode = 'PARTNER-' + generateRandomCode(6);
      }
    }

    const profile = await prisma.affiliateProfile.create({
      data: {
        userId,
        affiliateCode,
        status: "ACTIVE",
        commissionRate: 30.0
      }
    });
    
    revalidatePath('/dashboard/affiliate');
    return { success: true, profile };
  } catch (error: any) {
    console.error("Create affiliate error:", error);
    return { success: false, error: error.message };
  }
}
