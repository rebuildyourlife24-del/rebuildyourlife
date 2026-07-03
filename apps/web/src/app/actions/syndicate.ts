'use server';

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function getSyndicatePosts() {
  try {
    const posts = await db.syndicatePost.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true,
            avatarUrl: true,
          }
        },
        likes: {
          select: {
            userId: true,
          }
        },
        comments: {
          orderBy: { createdAt: 'asc' },
          include: {
            author: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                role: true,
                avatarUrl: true,
              }
            }
          }
        }
      }
    });

    return { success: true, posts };
  } catch (error) {
    console.error('Error fetching syndicate posts:', error);
    return { success: false, posts: [] };
  }
}

export async function createSyndicatePost(content: string, imageBase64: string | null, authorId: string) {
  try {
    if (!authorId) {
       return { success: false, error: 'Unauthorized' };
    }

    const post = await db.syndicatePost.create({
      data: {
        content,
        authorId,
      },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true,
            avatarUrl: true,
          }
        },
        likes: {
          select: {
            userId: true,
          }
        },
        comments: {
          orderBy: { createdAt: 'asc' },
          include: {
            author: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                role: true,
                avatarUrl: true,
              }
            }
          }
        }
      }
    });
    
    // Add XP for creating a post
    await db.user.update({
      where: { id: authorId },
      data: { experiencePoints: { increment: 10 } }
    });

    revalidatePath('/'); // assuming feed is somewhere that needs revalidation
    return { success: true, post };
  } catch (error) {
    console.error('Error creating syndicate post:', error);
    return { success: false, error: 'Failed to create post' };
  }
}

export async function toggleSyndicateLike(postId: string, userId: string) {
  try {
    const existingLike = await db.syndicateLike.findUnique({
      where: {
        postId_userId: {
          postId,
          userId,
        }
      }
    });

    if (existingLike) {
      await db.syndicateLike.delete({
        where: { id: existingLike.id }
      });
      return { success: true, action: 'unliked' };
    } else {
      await db.syndicateLike.create({
        data: {
          postId,
          userId,
        }
      });
      // Add XP for engaging
      await db.user.update({
        where: { id: userId },
        data: { experiencePoints: { increment: 1 } }
      });
      return { success: true, action: 'liked' };
    }
  } catch (error) {
    console.error('Error toggling like:', error);
    return { success: false, error: 'Failed to toggle like' };
  }
}

export async function createSyndicateComment(postId: string, content: string, authorId: string) {
  try {
    const comment = await db.syndicateComment.create({
      data: {
        content,
        postId,
        authorId,
      },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true,
            avatarUrl: true,
          }
        }
      }
    });
    
    // Add XP for commenting
    await db.user.update({
      where: { id: authorId },
      data: { experiencePoints: { increment: 5 } }
    });

    return { success: true, comment };
  } catch (error) {
    console.error('Error creating comment:', error);
    return { success: false, error: 'Failed to create comment' };
  }
}

export async function getTopSyndicateUsers(limit: number = 10) {
  try {
    const users = await db.user.findMany({
      orderBy: { experiencePoints: 'desc' },
      take: limit,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        experiencePoints: true,
        avatarUrl: true,
        role: true,
      }
    });
    return { success: true, leaderboard: users };
  } catch (error) {
    console.error('Error fetching top users:', error);
    return { success: false, leaderboard: [] };
  }
}
