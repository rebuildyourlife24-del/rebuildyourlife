'use server';

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function getFranchises() {
  try {
    const stores = await db.shopifyStore.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return stores;
  } catch (error) {
    console.error('Failed to get franchises:', error);
    return [];
  }
}

export async function createFranchise(niche: string) {
  try {
    // We just find the first user for demo purposes to avoid schema validation errors
    const user = await db.user.findFirst();
    
    if (!user) {
      throw new Error("No users exist in DB");
    }

    const store = await db.shopifyStore.create({
      data: {
        shopUrl: `${niche.toLowerCase().replace(/\s+/g, '-')}.myshopify.com`,
        status: 'ACTIVE',
        accessToken: 'PENDING',
        userId: user.id
      }
    });
    revalidatePath('/dashboard/franchises');
    return store;
  } catch (error) {
    console.error('Failed to create franchise:', error);
    throw new Error('Failed to create franchise');
  }
}
