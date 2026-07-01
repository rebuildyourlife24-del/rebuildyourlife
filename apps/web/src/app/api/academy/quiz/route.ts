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
    const { quizId, answers } = body; // answers is a record of { questionId: selectedAnswerId }

    if (!quizId || !answers) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        questions: {
          include: {
            answers: true
          }
        }
      }
    });

    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }

    let correctCount = 0;
    const totalQuestions = quiz.questions.length;

    quiz.questions.forEach((q) => {
      const selectedAnswerId = answers[q.id];
      const correctAnswer = q.answers.find(a => a.isCorrect);
      
      if (correctAnswer && correctAnswer.id === selectedAnswerId) {
        correctCount++;
      }
    });

    const score = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    const passed = score >= quiz.passingScore;

    // Check if the user already passed this quiz previously
    const existingResult = await prisma.userQuizResult.findFirst({
      where: { userId: user.id, quizId: quiz.id, passed: true }
    });

    const result = await prisma.userQuizResult.create({
      data: {
        userId: user.id,
        quizId: quiz.id,
        score,
        passed
      }
    });

    let xpAwarded = 0;
    // Award XP only if they passed and haven't passed before
    if (passed && !existingResult) {
      xpAwarded = 100; // 100 XP for passing a quiz
      await prisma.user.update({
        where: { id: user.id },
        data: { experiencePoints: { increment: xpAwarded } }
      });
    }

    return NextResponse.json({ 
      success: true, 
      score,
      passed,
      xpAwarded,
      message: passed ? 'Quiz succesvol gehaald!' : 'Helaas, je hebt de quiz niet gehaald.'
    });

  } catch (error: any) {
    console.error('Error grading quiz:', error);
    return NextResponse.json({ error: 'Internal Server Error: ' + error.message }, { status: 500 });
  }
}
