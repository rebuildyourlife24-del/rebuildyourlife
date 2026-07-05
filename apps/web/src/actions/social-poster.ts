'use server';

import { prisma } from '@rebuildyourlife/database';
import { revalidatePath } from 'next/cache';
import { getSessionAction } from '@/app/actions/auth';

export async function publishSocialPost(
  platform: string, 
  content: string, 
  mediaUrl?: string
) {
  try {
    const session = await getSessionAction();
    if (!session?.success || !session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }
    const userId = session.user.id;
    const webhookUrl = process.env.MAKE_WEBHOOK_URL;
    
    // 1. Log het concept in de database als PENDING
    const post = await prisma.socialMediaPost.create({
      data: {
        userId,
        platform,
        content,
        mediaUrl,
        status: 'PENDING',
        publishAt: new Date()
      }
    });

    // 2. Als de webhook niet is ingesteld, fail gracefully (mock mode voor frontend)
    if (!webhookUrl || webhookUrl === 'your-make-webhook-url-here') {
      console.warn("MAKE_WEBHOOK_URL is not set. Updating status to FAILED.");
      await prisma.socialMediaPost.update({
        where: { id: post.id },
        data: { status: 'FAILED' }
      });
      return { success: false, error: 'Make.com Webhook is niet ingesteld in Vercel. Voeg MAKE_WEBHOOK_URL toe.' };
    }

    // 3. Vuur het pakketje af naar Make.com
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        postId: post.id,
        userId: userId,
        platform: platform,
        content: content,
        mediaUrl: mediaUrl || null,
        timestamp: new Date().toISOString()
      })
    });

    if (!response.ok) {
      throw new Error(`Webhook failed met status ${response.status}`);
    }

    // 4. Update status in database
    await prisma.socialMediaPost.update({
      where: { id: post.id },
      data: { status: 'PUBLISHED' }
    });

    revalidatePath('/dashboard/modules/brand-launcher');
    revalidatePath('/dashboard/modules/viral-factory');

    return { success: true };
  } catch (error: any) {
    console.error('Error publishing social post:', error);
    return { success: false, error: error.message };
  }
}

export async function getSocialPosts() {
  try {
    const session = await getSessionAction();
    if (!session?.success || !session?.user?.id) return [];
    
    return await prisma.socialMediaPost.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' }
    });
  } catch (error) {
    console.error('Error fetching social posts:', error);
    return [];
  }
}
