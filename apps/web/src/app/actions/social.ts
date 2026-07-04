'use server';

import { prisma } from '@rebuildyourlife/database';
import { revalidatePath } from 'next/cache';

// Simuleer AI generatie van meerdere posts
export async function generateWeeklyContentAction(platform: string) {
  const userId = "dummy-user-id"; // In production, get from session

  // Mock generatie van 5 posts
  const newPosts = Array.from({ length: 5 }).map((_, i) => {
    const publishAt = new Date();
    publishAt.setDate(publishAt.getDate() + i + 1); // 1 per dag
    
    return {
      userId,
      platform,
      content: `🚀 AI Business Tip #${i+1}: Hoe The Sovereign Grid jouw e-commerce omzet kan verdubbelen zonder extra personeel. #Automation #RebuildYourLife`,
      status: 'DRAFT', // Menselijke goedkeuring vereist
      publishAt
    };
  });

  await prisma.socialMediaPost.createMany({
    data: newPosts
  });

  revalidatePath('/dashboard/social');
  return { success: true };
}

export async function approvePostAction(postId: string) {
  await prisma.socialMediaPost.update({
    where: { id: postId },
    data: { status: 'SCHEDULED' }
  });
  
  revalidatePath('/dashboard/social');
  return { success: true };
}

export async function publishPostSimulationAction(postId: string) {
  await prisma.socialMediaPost.update({
    where: { id: postId },
    data: { status: 'PUBLISHED' }
  });
  
  revalidatePath('/dashboard/social');
  return { success: true };
}
