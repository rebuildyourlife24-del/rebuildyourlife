import { NextResponse } from 'next/server';
import { prisma } from '@rebuildyourlife/database';
import { getSession } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { platform, content, publishAt } = await req.json();

    if (!platform || !content || !publishAt) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newPost = await prisma.socialMediaPost.create({
      data: {
        userId: session.userId,
        platform,
        content,
        publishAt: new Date(publishAt),
        status: 'SCHEDULED',
      },
    });

    return NextResponse.json({ success: true, post: newPost });
  } catch (error) {
    console.error('Social Post Error:', error);
    return NextResponse.json({ error: 'Failed to schedule post' }, { status: 500 });
  }
}
