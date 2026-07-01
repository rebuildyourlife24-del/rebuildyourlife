import { NextResponse } from 'next/server';
import { prisma } from '@rebuildyourlife/database';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

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

    const body = await request.json();
    const { content } = body;

    if (!content || content.trim().length === 0) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    const post = await prisma.syndicatePost.create({
      data: {
        authorId: user.id,
        content: content.trim(),
      },
      include: {
        author: {
          select: { id: true, firstName: true, lastName: true, role: true, experiencePoints: true, avatarUrl: true }
        },
        likes: true,
        comments: true,
      }
    });

    // Optioneel: Geef de gebruiker 10 XP voor het maken van een post (max 1x per dag bv, we houden het simpel nu)
    await prisma.user.update({
      where: { id: user.id },
      data: { experiencePoints: { increment: 10 } }
    });

    return NextResponse.json({ success: true, post, xpAwarded: 10 });
  } catch (error: any) {
    console.error('Error creating post:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
