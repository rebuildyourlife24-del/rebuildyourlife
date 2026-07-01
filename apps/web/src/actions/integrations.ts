"use server";

import { getSessionAction } from '@/app/actions/auth';
import { prisma } from '@rebuildyourlife/database';
import { revalidatePath } from 'next/cache';

export async function saveIntegration(provider: string, apiKey: string, apiSecret?: string) {
  const session = await getSessionAction(); const user = session?.user;
  if (!user) throw new Error('Niet geauthenticeerd');

  await prisma.apiIntegration.upsert({
    where: {
      userId_provider: {
        userId: user.id,
        provider: provider,
      }
    },
    update: {
      apiKey: apiKey,
      apiSecret: apiSecret || null,
      status: 'ACTIVE',
    },
    create: {
      userId: user.id,
      provider: provider,
      apiKey: apiKey,
      apiSecret: apiSecret || null,
      status: 'ACTIVE',
    }
  });

  revalidatePath('/dashboard/settings/integrations');
  return { success: true };
}

export async function getIntegrations() {
  const session = await getSessionAction(); const user = session?.user;
  if (!user) throw new Error('Niet geauthenticeerd');

  const integrations = await prisma.apiIntegration.findMany({
    where: { userId: user.id }
  });

  return integrations;
}
