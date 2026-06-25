'use server';

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { getSessionAction } from '@/app/actions/auth';

export async function registerShopifyApi(formData: FormData) {
  const session = await getSessionAction();
  if (!session.success || !session.user) {
    throw new Error('Niet geauthenticeerd. Log opnieuw in.');
  }

  let userId = session.user.id;
  if (userId === "dev-local-admin-id") {
    const adminUser = await db.user.findUnique({
      where: { email: "hsemler50@gmail.com" }
    });
    if (adminUser) {
      userId = adminUser.id;
    }
  }

  const shopUrl = formData.get('shopUrl') as string;
  const accessToken = formData.get('accessToken') as string;

  if (!shopUrl || !accessToken) {
    throw new Error('Beide velden zijn verplicht.');
  }

  // Clean URL
  const cleanUrl = shopUrl.replace('https://', '').replace('http://', '').replace(/\/$/, '');

  // Create or Update Shopify Store
  await db.shopifyStore.upsert({
    where: {
      userId_shopUrl: {
        userId: userId,
        shopUrl: cleanUrl,
      }
    },
    update: {
      accessToken: accessToken,
    },
    create: {
      userId: userId,
      shopUrl: cleanUrl,
      accessToken: accessToken,
    }
  });

  // Log in Dossier
  await db.agentDossier.create({
    data: {
      agentType: "SYSTEM",
      action: "SHOPIFY_API_ASSIMILATION",
      target: cleanUrl,
      userId: userId,
      details: "Shopify API token succesvol verbonden met de Godbrain. Start data-extractie."
    }
  });

  revalidatePath('/dashboard/wealth');
  revalidatePath('/dashboard/war-room');
}

