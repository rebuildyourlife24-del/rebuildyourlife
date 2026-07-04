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

export async function saveSocialIntegration(platform: string, accessToken: string, accountId?: string) {
  const session = await getSessionAction(); const user = session?.user;
  if (!user) throw new Error('Niet geauthenticeerd');

  await prisma.socialPlatformIntegration.upsert({
    where: {
      userId_platform: {
        userId: user.id,
        platform: platform,
      }
    },
    update: {
      accessToken: accessToken,
      accountId: accountId || null,
      status: 'ACTIVE',
    },
    create: {
      userId: user.id,
      platform: platform,
      accessToken: accessToken,
      accountId: accountId || null,
      status: 'ACTIVE',
    }
  });

  revalidatePath('/dashboard/settings/integrations');
  return { success: true };
}

export async function getSocialIntegrations() {
  const session = await getSessionAction(); const user = session?.user;
  if (!user) throw new Error('Niet geauthenticeerd');

  const integrations = await prisma.socialPlatformIntegration.findMany({
    where: { userId: user.id }
  });

  return integrations;
}
