import { NextResponse } from 'next/server';
import { prisma } from '@rebuildyourlife/database';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      include: {
        modules: {
          include: {
            lessons: true
          }
        }
      }
    });

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        subscriptionTier: true
      }
    });

    return NextResponse.json({
      success: true,
      coursesCount: courses.length,
      courses: courses.map(c => ({
        id: c.id,
        title: c.title,
        modulesCount: c.modules.length,
        modules: c.modules.map(m => ({
          id: m.id,
          title: m.title,
          lessonsCount: m.lessons.length,
          lessons: m.lessons.map(l => ({
            id: l.id,
            title: l.title
          }))
        }))
      })),
      usersCount: users.length,
      users
    });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: err.message,
      stack: err.stack
    }, { status: 500 });
  }
}
