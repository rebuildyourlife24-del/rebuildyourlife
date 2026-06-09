import { prisma } from "@rebuildyourlife/database";
import { GoalStatus, GoalTimeframe } from "@rebuildyourlife/shared";
import { NotFoundError, ForbiddenError } from "../middleware/errorHandler.js";

export interface CreateGoalInput {
  title: string;
  description?: string;
  timeframe: GoalTimeframe;
  targetDate?: string;
  lifeAreaId?: string;
  parentGoalId?: string;
}

export interface UpdateGoalInput {
  title?: string;
  description?: string;
  status?: GoalStatus;
  timeframe?: GoalTimeframe;
  progress?: number;
  targetDate?: string | null;
  lifeAreaId?: string | null;
  parentGoalId?: string | null;
}

export interface GoalFilters {
  status?: GoalStatus;
  timeframe?: GoalTimeframe;
  lifeAreaId?: string;
  page?: number;
  pageSize?: number;
}

export async function createGoal(userId: string, input: CreateGoalInput) {
  if (input.parentGoalId) {
    const parent = await prisma.goal.findUnique({
      where: { id: input.parentGoalId },
    });
    if (!parent || parent.userId !== userId) {
      throw new NotFoundError("Bovenliggend doel");
    }
  }

  if (input.lifeAreaId) {
    const area = await prisma.lifeArea.findUnique({
      where: { id: input.lifeAreaId },
    });
    if (!area || area.userId !== userId) {
      throw new NotFoundError("Levensgebied");
    }
  }

  const goal = await prisma.goal.create({
    data: {
      userId,
      title: input.title,
      description: input.description,
      timeframe: input.timeframe,
      targetDate: input.targetDate ? new Date(input.targetDate) : null,
      lifeAreaId: input.lifeAreaId ?? null,
      parentGoalId: input.parentGoalId ?? null,
    },
    include: { subGoals: true },
  });

  return formatGoal(goal);
}

export async function getGoals(userId: string, filters: GoalFilters) {
  const page = filters.page ?? 1;
  const pageSize = Math.min(filters.pageSize ?? 20, 100);
  const skip = (page - 1) * pageSize;

  const where: Record<string, unknown> = { userId };
  if (filters.status) where.status = filters.status;
  if (filters.timeframe) where.timeframe = filters.timeframe;
  if (filters.lifeAreaId) where.lifeAreaId = filters.lifeAreaId;

  const [goals, total] = await Promise.all([
    prisma.goal.findMany({
      where,
      include: { subGoals: true },
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    }),
    prisma.goal.count({ where }),
  ]);

  return {
    data: goals.map(formatGoal),
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function getGoalById(userId: string, goalId: string) {
  const goal = await prisma.goal.findUnique({
    where: { id: goalId },
    include: { subGoals: true, tasks: true },
  });

  if (!goal) throw new NotFoundError("Doel");
  if (goal.userId !== userId) throw new ForbiddenError();

  return formatGoal(goal);
}

export async function updateGoal(
  userId: string,
  goalId: string,
  input: UpdateGoalInput,
) {
  const existing = await prisma.goal.findUnique({ where: { id: goalId } });
  if (!existing) throw new NotFoundError("Doel");
  if (existing.userId !== userId) throw new ForbiddenError();

  if (input.parentGoalId !== undefined && input.parentGoalId !== null) {
    if (input.parentGoalId === goalId) {
      throw new ForbiddenError("Een doel kan niet zijn eigen bovenliggend doel zijn.");
    }
    const parent = await prisma.goal.findUnique({
      where: { id: input.parentGoalId },
    });
    if (!parent || parent.userId !== userId) {
      throw new NotFoundError("Bovenliggend doel");
    }
  }

  const goal = await prisma.goal.update({
    where: { id: goalId },
    data: {
      ...(input.title !== undefined && { title: input.title }),
      ...(input.description !== undefined && { description: input.description }),
      ...(input.status !== undefined && { status: input.status }),
      ...(input.timeframe !== undefined && { timeframe: input.timeframe }),
      ...(input.progress !== undefined && { progress: input.progress }),
      ...(input.targetDate !== undefined && {
        targetDate: input.targetDate ? new Date(input.targetDate) : null,
      }),
      ...(input.lifeAreaId !== undefined && { lifeAreaId: input.lifeAreaId }),
      ...(input.parentGoalId !== undefined && {
        parentGoalId: input.parentGoalId,
      }),
    },
    include: { subGoals: true },
  });

  return formatGoal(goal);
}

export async function deleteGoal(userId: string, goalId: string) {
  const existing = await prisma.goal.findUnique({ where: { id: goalId } });
  if (!existing) throw new NotFoundError("Doel");
  if (existing.userId !== userId) throw new ForbiddenError();

  await prisma.goal.delete({ where: { id: goalId } });
}

export async function getGoalTree(userId: string) {
  const goals = await prisma.goal.findMany({
    where: { userId, parentGoalId: null },
    include: {
      subGoals: {
        include: {
          subGoals: {
            include: {
              subGoals: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return goals.map(formatGoalTree);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function formatGoal(goal: any) {
  return {
    id: goal.id,
    title: goal.title,
    description: goal.description,
    timeframe: goal.timeframe,
    status: goal.status,
    progress: goal.progress,
    targetDate: goal.targetDate?.toISOString() ?? null,
    lifeAreaId: goal.lifeAreaId,
    parentGoalId: goal.parentGoalId,
    childGoals: goal.subGoals?.map(formatGoal) ?? [],
    createdAt: goal.createdAt.toISOString(),
    updatedAt: goal.updatedAt.toISOString(),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function formatGoalTree(goal: any): any {
  return {
    id: goal.id,
    title: goal.title,
    description: goal.description,
    timeframe: goal.timeframe,
    status: goal.status,
    progress: goal.progress,
    targetDate: goal.targetDate?.toISOString() ?? null,
    lifeAreaId: goal.lifeAreaId,
    parentGoalId: goal.parentGoalId,
    children: goal.subGoals?.map(formatGoalTree) ?? [],
    createdAt: goal.createdAt.toISOString(),
    updatedAt: goal.updatedAt.toISOString(),
  };
}
