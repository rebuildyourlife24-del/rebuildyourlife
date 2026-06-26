"use server";

import { prisma as db } from '@rebuildyourlife/database';
import { revalidatePath } from 'next/cache';

// Habits
export async function getHabits() {
  const user = await db.user.findFirst();
  if (!user) return [];
  return db.habit.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'asc' }
  });
}

export async function createHabit(data: { name: string, emoji: string, weeklyHoursGoal: number, color: string, glowColor: string }) {
  const user = await db.user.findFirst();
  if (!user) throw new Error("Unauthorized");
  
  await db.habit.create({
    data: {
      userId: user.id,
      ...data
    }
  });
  revalidatePath('/dashboard/growth');
}

export async function updateHabitHours(id: string, newHours: number) {
  const user = await db.user.findFirst();
  if (!user) throw new Error("Unauthorized");
  
  await db.habit.update({
    where: { id, userId: user.id },
    data: { weeklyHoursDone: newHours }
  });
  revalidatePath('/dashboard/growth');
}

// Books
export async function getBooks() {
  const user = await db.user.findFirst();
  if (!user) return [];
  return db.book.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'asc' }
  });
}

export async function createBook(title: string, author: string) {
  const user = await db.user.findFirst();
  if (!user) throw new Error("Unauthorized");
  
  await db.book.create({
    data: {
      userId: user.id,
      title,
      author
    }
  });
  revalidatePath('/dashboard/growth');
}

export async function toggleBookRead(id: string, read: boolean) {
  const user = await db.user.findFirst();
  if (!user) throw new Error("Unauthorized");
  
  await db.book.update({
    where: { id, userId: user.id },
    data: { read }
  });
  revalidatePath('/dashboard/growth');
}
