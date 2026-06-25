import { redirect } from 'next/navigation';
import { prisma } from '@rebuildyourlife/database';
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import CoursePlayer from './CoursePlayer';

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

interface PageProps {
  params: Promise<{
    courseId: string;
  }>;
}

export default async function CoursePage({ params }: PageProps) {
  const user = await getAuthenticatedUser();
  if (!user) redirect('/auth/login');

  const { courseId } = await params;

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

  if (!course) redirect('/dashboard/academy');

  // Toegangscontrole op basis van subscriptionTier
  const userTier = user.subscriptionTier;
  const isPremiumUser = userTier !== 'FREE' && userTier !== 'STARTER';
  const isLocked = course.tierAccess === 'PREMIUM' && !isPremiumUser;

  if (isLocked) {
    redirect('/dashboard/academy');
  }

  // Transformeer de data om te voldoen aan de interface van de client component
  const transformedCourse = {
    id: course.id,
    title: course.title,
    description: course.description,
    modules: course.modules.map(module => ({
      id: module.id,
      title: module.title,
      description: module.description,
      order: module.order,
      lessons: module.lessons.map(lesson => ({
        id: lesson.id,
        title: lesson.title,
        content: lesson.content,
        videoUrl: lesson.videoUrl,
        duration: lesson.duration,
        order: lesson.order,
        userProgress: lesson.userProgress.map(p => ({
          completed: p.completed
        }))
      }))
    }))
  };

  return (
    <CoursePlayer 
      course={transformedCourse} 
      userId={user.id} 
    />
  );
}
