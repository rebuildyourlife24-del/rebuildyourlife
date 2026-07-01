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

    const course = lesson.module.course;
    const userTier = user.subscriptionTier;
    const isPremiumUser = userTier !== 'FREE' && userTier !== 'STARTER';
    const isLocked = course.tierAccess === 'PREMIUM' && !isPremiumUser;

    if (isLocked) {
      return NextResponse.json({ error: 'Access denied. Premium tier required.' }, { status: 403 });
    }

    const existingProgress = await prisma.userLessonProgress.findUnique({
      where: {
        userId_lessonId: { userId: user.id, lessonId: lessonId }
      }
    });

    const isFirstTimeCompletion = completed === true && (!existingProgress || !existingProgress.completed);

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

    if (isFirstTimeCompletion) {
      await prisma.user.update({
        where: { id: user.id },
        data: { experiencePoints: { increment: 50 } }
      });
    }

    return NextResponse.json({ success: true, progress, xpAwarded: isFirstTimeCompletion ? 50 : 0 });
  } catch (error: any) {
    console.error('Error saving progress:', error);
    return NextResponse.json({ error: 'Internal Server Error: ' + error.message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const user = await getAuthenticatedUser();
    
    const courses = await prisma.course.findMany({
      include: {
        modules: {
          include: {
            lessons: true
          }
        }
      }
    });

    if (courses.length === 0) {
      return NextResponse.json({ success: true, data: [] });
    }

    const categories = courses.map(course => {
      const videos: any[] = [];
      course.modules.forEach(m => {
        m.lessons.forEach(l => {
          videos.push({
            id: l.id,
            title: l.title,
            thumbnail: course.thumbnail || "",
            duration: l.duration + ":00",
          });
        });
      });
      return {
        title: course.title,
        videos
      };
    }).filter(c => c.videos.length > 0);

    let featuredVideo = null;
    if (categories.length > 0 && categories[0].videos.length > 0) {
      const firstCourse = courses[0];
      const firstLesson = firstCourse.modules[0]?.lessons[0];
      if (firstLesson) {
        featuredVideo = {
          id: firstLesson.id,
          title: firstLesson.title,
          description: firstLesson.content.substring(0, 100),
          thumbnail: firstCourse.thumbnail || "",
          category: firstCourse.title,
          duration: firstLesson.duration + ":00"
        };
      }
    }

    return NextResponse.json({ 
      success: true, 
      data: {
        categories,
        featuredVideo
      }
    });
  } catch (error: any) {
    console.error("Error fetching academy:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
