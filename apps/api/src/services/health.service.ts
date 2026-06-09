import { prisma } from "@rebuildyourlife/database";
import { NotFoundError, ForbiddenError } from "../middleware/errorHandler.js";

export interface LogHealthInput {
  date: string; // ISO date string e.g. "2026-06-09"
  steps?: number;
  sleepScore?: number; // 1-10
  weightKg?: number;
  waterMl?: number;
  workoutMinutes?: number;
  workoutType?: string;
  notes?: string;
}

export interface UpdateHealthInput {
  steps?: number;
  sleepScore?: number;
  weightKg?: number;
  waterMl?: number;
  workoutMinutes?: number;
  workoutType?: string;
  notes?: string;
}

/**
 * Upserts a HealthLog for a given date (one log per day per user).
 * If a log already exists for that day, it updates it; otherwise creates it.
 */
export async function logHealth(userId: string, input: LogHealthInput) {
  // Normalise date to midnight UTC so the unique constraint is date-only
  const dateParsed = new Date(input.date);
  const dateNormalised = new Date(
    Date.UTC(
      dateParsed.getUTCFullYear(),
      dateParsed.getUTCMonth(),
      dateParsed.getUTCDate(),
    ),
  );

  const log = await prisma.healthLog.upsert({
    where: {
      userId_date: {
        userId,
        date: dateNormalised,
      },
    },
    create: {
      userId,
      date: dateNormalised,
      steps: input.steps ?? null,
      sleepScore: input.sleepScore ?? null,
      weightKg: input.weightKg ?? null,
      waterMl: input.waterMl ?? null,
      workoutMinutes: input.workoutMinutes ?? null,
      workoutType: input.workoutType ?? null,
      notes: input.notes ?? null,
    },
    update: {
      ...(input.steps !== undefined && { steps: input.steps }),
      ...(input.sleepScore !== undefined && { sleepScore: input.sleepScore }),
      ...(input.weightKg !== undefined && { weightKg: input.weightKg }),
      ...(input.waterMl !== undefined && { waterMl: input.waterMl }),
      ...(input.workoutMinutes !== undefined && { workoutMinutes: input.workoutMinutes }),
      ...(input.workoutType !== undefined && { workoutType: input.workoutType }),
      ...(input.notes !== undefined && { notes: input.notes }),
    },
  });

  return formatHealthLog(log);
}

/**
 * Returns the last N days of health logs for a user, ordered newest-first.
 */
export async function getHealthLogs(userId: string, days: number) {
  const since = new Date();
  since.setUTCDate(since.getUTCDate() - days);
  since.setUTCHours(0, 0, 0, 0);

  const logs = await prisma.healthLog.findMany({
    where: {
      userId,
      date: { gte: since },
    },
    orderBy: { date: "desc" },
  });

  return logs.map(formatHealthLog);
}

/**
 * Returns averages for the last 30 days: avgSteps, avgSleep, avgWeight.
 * Only averages over entries that have a value for each field.
 */
export async function getHealthSummary(userId: string) {
  const since = new Date();
  since.setUTCDate(since.getUTCDate() - 30);
  since.setUTCHours(0, 0, 0, 0);

  const logs = await prisma.healthLog.findMany({
    where: {
      userId,
      date: { gte: since },
    },
  });

  const withSteps = logs.filter((l) => l.steps !== null);
  const withSleep = logs.filter((l) => l.sleepScore !== null);
  const withWeight = logs.filter((l) => l.weightKg !== null);
  const withWater = logs.filter((l) => l.waterMl !== null);
  const withWorkout = logs.filter((l) => l.workoutMinutes !== null);

  const avg = (arr: number[]) =>
    arr.length === 0 ? null : Math.round((arr.reduce((a, b) => a + b, 0) / arr.length) * 100) / 100;

  return {
    periodDays: 30,
    totalLogs: logs.length,
    avgSteps: avg(withSteps.map((l) => l.steps as number)),
    avgSleepScore: avg(withSleep.map((l) => l.sleepScore as number)),
    avgWeightKg: avg(withWeight.map((l) => l.weightKg as number)),
    avgWaterMl: avg(withWater.map((l) => l.waterMl as number)),
    avgWorkoutMinutes: avg(withWorkout.map((l) => l.workoutMinutes as number)),
  };
}

/**
 * Gets a single health log by ID, verifying ownership.
 */
export async function getHealthLogById(userId: string, logId: string) {
  const log = await prisma.healthLog.findUnique({ where: { id: logId } });
  if (!log) throw new NotFoundError("Gezondheidslog");
  if (log.userId !== userId) throw new ForbiddenError();
  return formatHealthLog(log);
}

/**
 * Deletes a health log, verifying ownership.
 */
export async function deleteHealthLog(userId: string, logId: string) {
  const log = await prisma.healthLog.findUnique({ where: { id: logId } });
  if (!log) throw new NotFoundError("Gezondheidslog");
  if (log.userId !== userId) throw new ForbiddenError();
  await prisma.healthLog.delete({ where: { id: logId } });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function formatHealthLog(log: any) {
  return {
    id: log.id,
    date: (log.date as Date).toISOString().slice(0, 10),
    steps: log.steps,
    sleepScore: log.sleepScore,
    weightKg: log.weightKg,
    waterMl: log.waterMl,
    workoutMinutes: log.workoutMinutes,
    workoutType: log.workoutType,
    notes: log.notes,
    createdAt: (log.createdAt as Date).toISOString(),
    updatedAt: (log.updatedAt as Date).toISOString(),
  };
}
