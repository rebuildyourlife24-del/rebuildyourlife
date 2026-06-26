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

// Seeder
export async function seedSocialPostsIfEmpty() {
  try {
    const count = await db.socialMediaPost.count();
    if (count > 0) return true;

    const user = await db.user.findFirst();
    if (!user) return false;

    const mockPosts = [
      {
        platform: 'TIKTOK',
        content: 'VTLB Hack Video',
        status: 'ACTIVE',
        publishAt: new Date(),
        views: 1000,
        engagement: 450,
      },
      {
        platform: 'META',
        content: 'Billionaire Mindset Ad',
        status: 'PENDING_APPROVAL',
        publishAt: new Date(),
        views: 2500,
        engagement: 0,
      }
    ];

    for (const p of mockPosts) {
      await db.socialMediaPost.create({
        data: {
          userId: user.id,
          platform: p.platform,
          content: p.content,
          status: p.status,
          publishAt: p.publishAt,
          views: p.views,
          engagement: p.engagement,
        }
      });
    }
    console.log("Mock social posts seeded successfully!");
    return true;
  } catch (error) {
    console.error("Failed to seed mock social posts:", error);
    return false;
  }
}
