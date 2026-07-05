'use server';

import { prisma } from '@rebuildyourlife/database';
import { getSessionAction } from '@/app/actions/auth';

/**
 * Haalt alle cursussen op, inclusief het aantal modules/lessen
 */
export async function getCoursesAction() {
  try {
    const session = await getSessionAction();
    const user = session.success ? session.user : null;
    if (!user) {
      return { success: false, error: 'Unauthorized' };
    }

    const courses = await prisma.course.findMany({
      include: {
        _count: {
          select: { modules: true }
        }
      },
      orderBy: {
        order: 'asc'
      }
    });

    return { success: true, courses };
  } catch (error: any) {
    console.error('Error fetching courses:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Haalt een specifieke cursus op inclusief alle lessen en de voortgang van de gebruiker
 */
export async function getCourseDetailsAction(courseId: string) {
  try {
    const session = await getSessionAction();
    const user = session.success ? session.user : null;
    if (!user) {
      return { success: false, error: 'Unauthorized' };
    }

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        modules: {
          orderBy: { order: 'asc' },
          include: {
            lessons: {
              orderBy: { order: 'asc' },
              include: {
                userProgress: {
                  where: { userId: user.id }
                }
              }
            }
          }
        }
      }
    });

    if (!course) {
      return { success: false, error: 'Course not found' };
    }

    return { success: true, course };
  } catch (error: any) {
    console.error('Error fetching course details:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Markeer een les als voltooid
 */
export async function completeLessonAction(lessonId: string) {
  try {
    const session = await getSessionAction();
    const user = session.success ? session.user : null;
    if (!user) {
      return { success: false, error: 'Unauthorized' };
    }

    const progress = await prisma.userLessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId: user.id,
          lessonId: lessonId
        }
      },
      update: {
        completed: true,
        completedAt: new Date(),
        updatedAt: new Date()
      },
      create: {
        userId: user.id,
        lessonId: lessonId,
        completed: true,
        completedAt: new Date()
      }
    });

    // TODO: Gamification XP update logic can go here

    return { success: true, progress };
  } catch (error: any) {
    console.error('Error completing lesson:', error);
    return { success: false, error: error.message };
  }
}
