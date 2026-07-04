import { NextResponse } from 'next/server';
import { prisma } from '@rebuildyourlife/database';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET(req: Request) {
  try {
    const posts: any[] = [];
    return NextResponse.json({ success: true, posts });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("ryl_session")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const userId = decoded.userId;

    const { content, category } = await req.json();

    const post = {
      content,
      category: category || "GENERAL",
      authorId: userId,
      author: { firstName: 'Mock', lastName: 'User' },
      _count: { comments: 0 }
    };

    // Gamification: Award 10 XP for posting
    await prisma.user.update({
      where: { id: userId },
      data: { experiencePoints: { increment: 10 } }
    });

    return NextResponse.json({ success: true, post });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
