'use server';

import { prisma } from '@rebuildyourlife/database';
import { revalidatePath } from 'next/cache';
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET! || "fallback";

async function getAuthenticatedUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("ryl_session")?.value;
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return decoded.userId;
  } catch {
    return null;
  }
}

export async function publishPostAction(postId: string) {
  const userId = await getAuthenticatedUser();
  if (!userId) return { success: false, error: 'Not authenticated' };

  try {
    const post = await prisma.socialMediaPost.findUnique({
      where: { id: postId }
    });

    if (!post || post.userId !== userId) {
      return { success: false, error: 'Post not found or unauthorized' };
    }

    // Check if the user has an active integration for this platform
    const integration = await prisma.socialPlatformIntegration.findUnique({
      where: {
        userId_platform: {
          userId: userId,
          platform: post.platform
        }
      }
    });

    // If there is no real token or integration, we simulate the post (Mock mode)
    if (!integration || !integration.accessToken) {
      console.log(`[SOCIAL POST] No API keys found for ${post.platform}. Simulating post.`);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      await prisma.socialMediaPost.update({
        where: { id: postId },
        data: { status: 'PUBLISHED' }
      });
      
      revalidatePath('/dashboard/social');
      return { success: true, simulated: true };
    }

    // --- REAL API LOGIC ---
    let apiSuccess = false;
    
    if (post.platform === 'LINKEDIN') {
      const response = await fetch('https://api.linkedin.com/v2/ugcPosts', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${integration.accessToken}`,
          'Content-Type': 'application/json',
          'X-Restli-Protocol-Version': '2.0.0'
        },
        body: JSON.stringify({
          author: `urn:li:person:${integration.accountId}`, // URN obtained during OAuth
          lifecycleState: 'PUBLISHED',
          specificContent: {
            'com.linkedin.ugc.ShareContent': {
              shareCommentary: {
                text: post.content
              },
              shareMediaCategory: 'NONE'
            }
          },
          visibility: {
            'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`LinkedIn API Error: ${JSON.stringify(errorData)}`);
      }
      apiSuccess = true;
    } else if (post.platform === 'TWITTER') {
      // Basic Twitter V2 Tweet creation via fetch
      const response = await fetch('https://api.twitter.com/2/tweets', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${integration.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: post.content
        })
      });

      if (!response.ok) {
        throw new Error('Twitter API Error');
      }
      apiSuccess = true;
    } else {
      throw new Error(`Platform ${post.platform} is not supported for auto-posting yet.`);
    }

    if (apiSuccess) {
      await prisma.socialMediaPost.update({
        where: { id: postId },
        data: { status: 'PUBLISHED' }
      });
    }

    revalidatePath('/dashboard/social');
    return { success: true, simulated: false };

  } catch (error: any) {
    console.error('Publish Action Error:', error);
    return { success: false, error: error.message };
  }
}
