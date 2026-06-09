import { prisma } from "@rebuildyourlife/database";

export async function getUserPrograms(userId: string) {
  return await prisma.rebuildProgram.findMany({
    where: { userId },
    include: {
      milestones: {
        orderBy: { orderIndex: 'asc' }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
}

export async function createProgram(userId: string, data: { name: string, description: string, endDate?: string }) {
  return await prisma.rebuildProgram.create({
    data: {
      userId,
      name: data.name,
      description: data.description,
      startDate: new Date(),
      endDate: data.endDate ? new Date(data.endDate) : null,
      isActive: true,
      progress: 0,
      milestones: {
        create: [
          { title: "Start Intake", description: "Voltooi je eerste sessie", orderIndex: 1 },
          { title: "Basisplan", description: "Stel een actieplan op", orderIndex: 2 },
        ]
      }
    },
    include: { milestones: true }
  });
}

export async function completeMilestone(userId: string, programId: string, milestoneId: string) {
  const program = await prisma.rebuildProgram.findFirst({
    where: { id: programId, userId },
    include: { milestones: true }
  });

  if (!program) throw new Error("Program not found");

  await prisma.programMilestone.update({
    where: { id: milestoneId },
    data: { isCompleted: true, completedAt: new Date() }
  });

  const updatedMilestones = await prisma.programMilestone.findMany({
    where: { programId }
  });

  const completed = updatedMilestones.filter(m => m.isCompleted).length;
  const progress = Math.round((completed / updatedMilestones.length) * 100);

  return await prisma.rebuildProgram.update({
    where: { id: programId },
    data: { progress },
    include: { milestones: true }
  });
}
