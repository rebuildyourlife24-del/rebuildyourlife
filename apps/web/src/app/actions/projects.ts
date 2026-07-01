"use server";

import { prisma } from "@rebuildyourlife/database";
import { getSessionAction } from "./auth";

async function getAuthenticatedUserId(): Promise<string | null> {
  try {
    const session = await getSessionAction();
    if (session.success && session.user) {
      return session.user.id;
    }
    return null;
  } catch {
    return null;
  }
}

export async function getUserProjectsAction() {
  const userId = await getAuthenticatedUserId();
  if (!userId) return { success: false, projects: [] };

  try {
    const projects = await prisma.project.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' }
    });

    return { success: true, projects };
  } catch (error) {
    console.error("getUserProjectsAction error:", error);
    return { success: false, projects: [] };
  }
}

export async function createProjectAction(name: string, industry: string, isHolding: boolean = false) {
  const userId = await getAuthenticatedUserId();
  if (!userId) return { success: false, error: "Niet ingelogd" };

  try {
    const project = await prisma.project.create({
      data: {
        userId,
        name,
        industry,
        isHolding
      }
    });

    return { success: true, project };
  } catch (error) {
    console.error("createProjectAction error:", error);
    return { success: false, error: "Kon project niet aanmaken" };
  }
}
