import { NextResponse } from 'next/server';
import { prisma } from '@rebuildyourlife/database';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { uploadBase64ImageToSupabase } from '@/lib/services/upload.service';

const JWT_SECRET = process.env.JWT_SECRET! || 'secret';

async function getAuthenticatedUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("ryl_session")?.value;
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return await prisma.user.findUnique({ where: { id: decoded.userId } });
  } catch {
    return null;
  }
}

export async function GET() {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const posts = await prisma.syndicatePost.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: {
        author: {
          select: { id: true, firstName: true, lastName: true, role: true, experiencePoints: true, avatarUrl: true }
        },
        likes: {
          select: { userId: true }
        },
        comments: {
          orderBy: { createdAt: 'asc' },
          include: {
            author: {
              select: { id: true, firstName: true, lastName: true, role: true, experiencePoints: true, avatarUrl: true }
            }
          }
        }
      }
    });

    return NextResponse.json({ success: true, posts });
  } catch (error: any) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { content, imageBase64 } = await request.json();

    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    let finalImageUrl = null;
    if (imageBase64) {
      try {
        const filename = `syndicate_${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`;
        finalImageUrl = await uploadBase64ImageToSupabase(imageBase64, filename, 'syndicate');
      } catch (uploadError: any) {
        console.error("Image upload failed:", uploadError);
        // Continue creating post even if image fails, or return error? Let's just log and continue without image
      }
    }

    const post = await prisma.syndicatePost.create({
      data: {
        content,
        imageUrl: finalImageUrl,
        authorId: user.id
      },
      include: {
        author: {
          select: { id: true, firstName: true, lastName: true, role: true, experiencePoints: true, avatarUrl: true }
        },
        likes: {
          select: { userId: true }
        },
        comments: {
          include: {
            author: {
              select: { id: true, firstName: true, lastName: true, role: true, experiencePoints: true, avatarUrl: true }
            }
          }
        }
      }
    });

    // Reward active behavior
    await prisma.user.update({
      where: { id: user.id },
      data: { experiencePoints: { increment: 10 } }
    });

    return NextResponse.json({ success: true, post });
  } catch (error: any) {
    console.error('Error creating post:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
