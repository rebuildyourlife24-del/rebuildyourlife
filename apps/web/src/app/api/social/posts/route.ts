import { NextResponse } from 'next/server';
import { prisma } from '@rebuildyourlife/database';
import { getSessionAction } from '@/app/actions/auth';

export async function POST(req: Request) {
  try {
    const session = await getSessionAction();
    if (!session.success || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { platform, content, publishAt } = await req.json();

    if (!platform || !content || !publishAt) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newPost = await prisma.socialMediaPost.create({
      data: {
        userId: session.user.id,
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
