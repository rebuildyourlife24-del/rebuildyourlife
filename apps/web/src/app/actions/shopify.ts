'use server';

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function registerShopifyApi(formData: FormData) {
  const shopUrl = formData.get('shopUrl') as string;
  const accessToken = formData.get('accessToken') as string;

  if (!shopUrl || !accessToken) {
    throw new Error('Beide velden zijn verplicht.');
  }

  // Clean URL
  const cleanUrl = shopUrl.replace('https://', '').replace('http://', '').replace(/\/$/, '');

  // Use a hardcoded test user ID for now
  const TEST_USER_ID = "00000000-0000-0000-0000-000000000000";

  // Check if user exists, if not create
  let user = await db.user.findUnique({ where: { id: TEST_USER_ID }});
  if (!user) {
    user = await db.user.create({
      data: {
        id: TEST_USER_ID,
        email: "ceo@godmode.com",
        firstName: "Supreme",
        lastName: "Overseer",
        passwordHash: "unusable_placeholder",
        role: "CEO"
      }
    });
  }

  // Create or Update Shopify Store
  await db.shopifyStore.upsert({
    where: {
      userId_shopUrl: {
        userId: user.id,
        shopUrl: cleanUrl,
      }
    },
    update: {
      accessToken: accessToken,
    },
    create: {
      userId: user.id,
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
      userId: user.id,
      details: "Shopify API token succesvol verbonden met de Godbrain. Start data-extractie."
    }
  });

  revalidatePath('/dashboard/wealth');
  revalidatePath('/dashboard/war-room');
}
