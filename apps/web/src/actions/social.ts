'use server';

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

// Haal social media posts op
export async function getSocialPosts() {
  try {
    const user = await db.user.findFirst();
    if (!user) return [];

    const posts = await db.socialMediaPost.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }
    });

    return posts;
  } catch (error) {
    console.error('Failed to get social posts:', error);
    return [];
  }
}

// Update post status
export async function updateSocialPostStatus(id: string, status: string) {
  try {
    const post = await db.socialMediaPost.update({
      where: { id },
      data: { status }
    });

    revalidatePath('/dashboard/social');
    return post;
  } catch (error) {
    console.error('Failed to update social post status:', error);
    throw new Error('Failed to update status');
  }
}

// Maak een nieuwe post (simulatie van campaign launch)
export async function createSocialPost(title: string, platform: string, budget: number) {
  try {
    const user = await db.user.findFirst();
    if (!user) throw new Error("Unauthorized");

    // Simulatie: we gebruiken 'views' en 'engagement' voor budget en spent omdat er geen aparte tabel is
    const post = await db.socialMediaPost.create({
      data: {
        userId: user.id,
        platform,
        content: title,
        status: 'PENDING_APPROVAL',
        publishAt: new Date(),
        views: budget,
        engagement: 0,
      }
    });

    revalidatePath('/dashboard/social');
    return post;
  } catch (error) {
    console.error('Failed to create social post:', error);
    throw new Error('Failed to create post');
  }
}

