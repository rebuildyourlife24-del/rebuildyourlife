import { prisma } from "@rebuildyourlife/database";
import { TaskStatus, TaskPriority, AgentType } from "@rebuildyourlife/shared";
import { NotFoundError, ForbiddenError } from "../middleware/errorHandler.js";

export interface CreateTaskInput {
  title: string;
  description?: string;
  priority?: TaskPriority;
  dueDate?: string;
  goalId?: string;
  assignedAgentType?: AgentType;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string | null;
  assignedAgentType?: AgentType | null;
}

export interface TaskFilters {
  status?: TaskStatus;
  priority?: TaskPriority;
  goalId?: string;
  assignedAgentType?: AgentType;
  page?: number;
  pageSize?: number;
}

export async function createTask(userId: string, input: CreateTaskInput) {
  if (input.goalId) {
    const goal = await prisma.goal.findUnique({ where: { id: input.goalId } });
    if (!goal || goal.userId !== userId) {
      throw new NotFoundError("Doel");
    }
  }

  const task = await prisma.task.create({
    data: {
      userId,
      title: input.title,
      description: input.description,
      priority: input.priority ?? "MEDIUM",
      dueDate: input.dueDate ? new Date(input.dueDate) : null,
      goalId: input.goalId ?? null,
      assignedAgentType: input.assignedAgentType ?? null,
    },
  });

  return formatTask(task);
}

export async function getTasks(userId: string, filters: TaskFilters) {
  const page = filters.page ?? 1;
  const pageSize = Math.min(filters.pageSize ?? 20, 100);
  const skip = (page - 1) * pageSize;

  const where: Record<string, unknown> = { userId };
  if (filters.status) where.status = filters.status;
  if (filters.priority) where.priority = filters.priority;
  if (filters.goalId) where.goalId = filters.goalId;
  if (filters.assignedAgentType) where.assignedAgentType = filters.assignedAgentType;

  const [tasks, total] = await Promise.all([
    prisma.task.findMany({
      where,
      orderBy: [{ priority: "desc" }, { dueDate: "asc" }, { createdAt: "desc" }],
      skip,
      take: pageSize,
    }),
    prisma.task.count({ where }),
  ]);

  return {
    data: tasks.map(formatTask),
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function getTaskById(userId: string, taskId: string) {
  const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (!task) throw new NotFoundError("Taak");
  if (task.userId !== userId) throw new ForbiddenError();

  return formatTask(task);
}

export async function updateTask(
  userId: string,
  taskId: string,
  input: UpdateTaskInput,
) {
  const existing = await prisma.task.findUnique({ where: { id: taskId } });
  if (!existing) throw new NotFoundError("Taak");
  if (existing.userId !== userId) throw new ForbiddenError();

  const isCompleting =
    input.status === "COMPLETED" && existing.status !== "COMPLETED";

  const task = await prisma.task.update({
    where: { id: taskId },
    data: {
      ...(input.title !== undefined && { title: input.title }),
      ...(input.description !== undefined && { description: input.description }),
      ...(input.status !== undefined && { status: input.status }),
      ...(input.priority !== undefined && { priority: input.priority }),
      ...(input.dueDate !== undefined && {
        dueDate: input.dueDate ? new Date(input.dueDate) : null,
      }),
      ...(input.assignedAgentType !== undefined && {
        assignedAgentType: input.assignedAgentType,
      }),
      ...(isCompleting && { completedAt: new Date() }),
    },
  });

  return formatTask(task);
}

export async function deleteTask(userId: string, taskId: string) {
  const existing = await prisma.task.findUnique({ where: { id: taskId } });
  if (!existing) throw new NotFoundError("Taak");
  if (existing.userId !== userId) throw new ForbiddenError();

  await prisma.task.delete({ where: { id: taskId } });
}

export async function assignToAgent(
  userId: string,
  taskId: string,
  agentType: AgentType,
) {
  const existing = await prisma.task.findUnique({ where: { id: taskId } });
  if (!existing) throw new NotFoundError("Taak");
  if (existing.userId !== userId) throw new ForbiddenError();

  const task = await prisma.task.update({
    where: { id: taskId },
    data: { assignedAgentType: agentType },
  });

  return formatTask(task);
}

export async function getTasksByGoal(userId: string, goalId: string) {
  const goal = await prisma.goal.findUnique({ where: { id: goalId } });
  if (!goal) throw new NotFoundError("Doel");
  if (goal.userId !== userId) throw new ForbiddenError();

  const tasks = await prisma.task.findMany({
    where: { goalId, userId },
    orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
  });

  return tasks.map(formatTask);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function formatTask(task: any) {
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    dueDate: task.dueDate?.toISOString() ?? null,
    completedAt: task.completedAt?.toISOString() ?? null,
    goalId: task.goalId,
    assignedAgentType: task.assignedAgentType,
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString(),
  };
}
