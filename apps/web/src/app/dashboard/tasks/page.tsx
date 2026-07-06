import TasksClient from "./TasksClient";
import { prisma } from "@rebuildyourlife/database";

export const dynamic = "force-dynamic";

export default async function TasksPage() {
  // Fetch real agent tasks from the database
  const aiTasks = await prisma.aiBountyTask.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10,
    include: {
      winnerAgent: true
    }
  });

  const formattedTasks = aiTasks.map(task => ({
    id: task.id,
    title: task.title,
    assignee: task.winnerAgent?.name || "Open (Bounty: $" + task.bountyAmount + ")",
    status: task.status, // e.g. "OPEN", "IN_PROGRESS", "COMPLETED"
    progress: task.status === 'COMPLETED' ? 100 : task.status === 'IN_PROGRESS' ? 50 : 0
  }));

  return <TasksClient activeTasks={formattedTasks} />;
}
