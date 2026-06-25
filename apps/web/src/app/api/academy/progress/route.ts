import { NextResponse } from 'next/server';
import { prisma } from '@rebuildyourlife/database';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-jwt-key-2026-rebuild";

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

export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { lessonId, completed } = body;

    if (!lessonId) {
      return NextResponse.json({ error: 'Lesson ID is required' }, { status: 400 });
    }

    // Controleer of de les bestaat
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        module: {
          include: {
            course: true
          }
        }
      }
    });

    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }

    // Controleer of de gebruiker toegang heeft tot de cursus
    const course = lesson.module.course;
    const userTier = user.subscriptionTier;
    const isPremiumUser = userTier !== 'FREE' && userTier !== 'STARTER';
    const isLocked = course.tierAccess === 'PREMIUM' && !isPremiumUser;

    if (isLocked) {
      return NextResponse.json({ error: 'Access denied. Premium tier required.' }, { status: 403 });
    }

    // Upsert de voortgang
    const progress = await prisma.userLessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId: user.id,
          lessonId: lessonId,
        }
      },
      update: {
        completed: completed === true,
        completedAt: completed === true ? new Date() : null,
      },
      create: {
        userId: user.id,
        lessonId: lessonId,
        completed: completed === true,
        completedAt: completed === true ? new Date() : null,
      }
    });

    return NextResponse.json({ success: true, progress });
  } catch (error: any) {
    console.error('Error saving progress:', error);
    return NextResponse.json({ error: 'Internal Server Error: ' + error.message }, { status: 500 });
  }
}
