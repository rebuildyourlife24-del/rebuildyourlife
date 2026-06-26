'use server';

import { prisma } from '@rebuildyourlife/database';
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret_for_dev";

async function getAuthenticatedUserId(): Promise<string | null> {
  const token = (await cookies()).get("ryl_session")?.value;
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return decoded.userId;
  } catch {
    return null;
  }
}

export async function getShopifyConnectionsAction() {
  const userId = await getAuthenticatedUserId();
  if (!userId) return { success: false, error: 'Unauthorized' };

  try {
    const stores = await prisma.shopifyStore.findMany({
      where: { userId },
      select: {
        id: true,
        shopUrl: true,
        status: true,
        totalRevenue: true,
        createdAt: true
      }
    });
    return { success: true, data: stores };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function connectShopifyStoreAction(shopUrl: string, accessToken: string) {
  const userId = await getAuthenticatedUserId();
  if (!userId) return { success: false, error: 'Unauthorized' };

  try {
    // Basic validation
    if (!shopUrl || !shopUrl.includes('.myshopify.com')) {
      return { success: false, error: 'Ongeldige Shop URL. Gebruik de .myshopify.com structuur.' };
    }
    if (!accessToken || accessToken.length < 20) {
      return { success: false, error: 'Ongeldige Admin API Access Token.' };
    }

    // Insert into DB
    const store = await prisma.shopifyStore.upsert({
      where: {
        userId_shopUrl: {
          userId,
          shopUrl
        }
      },
      update: {
        accessToken,
        status: 'ACTIVE'
      },
      create: {
        userId,
        shopUrl,
        accessToken,
        status: 'ACTIVE',
        totalRevenue: 0
      }
    });

    return { success: true, message: 'Shopify Store succesvol gekoppeld.' };
  } catch (error: any) {
    console.error('connectShopifyStoreAction error:', error);
    return { success: false, error: 'Systeemfout bij het opslaan van Shopify gegevens.' };
  }
}

export async function removeShopifyConnectionAction(storeId: string) {
  const userId = await getAuthenticatedUserId();
  if (!userId) return { success: false, error: 'Unauthorized' };

  try {
    await prisma.shopifyStore.delete({
      where: { id: storeId, userId }
    });
    return { success: true, message: 'Shopify Store connectie verwijderd.' };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
