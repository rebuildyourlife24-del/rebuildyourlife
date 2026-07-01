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

export async function POST(request: Request, context: any) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { postId } = await context.params;
    const body = await request.json();
    const { content } = body;

    if (!content || content.trim().length === 0) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    const comment = await prisma.syndicateComment.create({
      data: {
        postId,
        authorId: user.id,
        content: content.trim(),
      },
      include: {
        author: {
          select: { id: true, firstName: true, lastName: true, role: true, experiencePoints: true, avatarUrl: true }
        }
      }
    });

    // Award 2 XP for commenting
    await prisma.user.update({
      where: { id: user.id },
      data: { experiencePoints: { increment: 2 } }
    });

    return NextResponse.json({ success: true, comment });
  } catch (error: any) {
    console.error('Error creating comment:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
