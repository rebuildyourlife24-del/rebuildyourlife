'use server';

import { prisma } from '@rebuildyourlife/database';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET! || 'secret';

async function getUserId() {
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

export async function addIntelligenceTarget(target: string, type: string) {
  const userId = await getUserId();
  if (!userId) throw new Error('Unauthorized');

  const newTarget = await prisma.intelligenceTarget.create({
    data: {
      userId,
      target,
      type
    }
  });

  revalidatePath('/dashboard/enterprise');
  return { success: true, target: newTarget };
}

export async function getIntelligenceTargets() {
  const userId = await getUserId();
  if (!userId) return [];

  return prisma.intelligenceTarget.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' }
  });
}
