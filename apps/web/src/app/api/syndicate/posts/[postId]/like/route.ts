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

    const existingLike = await prisma.syndicateLike.findUnique({
      where: {
        postId_userId: {
          postId,
          userId: user.id
        }
      }
    });

    if (existingLike) {
      // Unlike
      await prisma.syndicateLike.delete({
        where: { id: existingLike.id }
      });
      return NextResponse.json({ success: true, action: 'unliked' });
    } else {
      // Like
      await prisma.syndicateLike.create({
        data: {
          postId,
          userId: user.id
        }
      });
      return NextResponse.json({ success: true, action: 'liked' });
    }
  } catch (error: any) {
    console.error('Error toggling like:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
