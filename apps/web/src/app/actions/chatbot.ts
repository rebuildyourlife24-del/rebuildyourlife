"use server";

import { getSessionAction } from "./auth";
import { prisma } from "@rebuildyourlife/database";
import { revalidatePath } from "next/cache";

export async function createChatbot(name: string, systemPrompt: string, themeColor: string) {
  const session = await getSessionAction();
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  try {
    const chatbot = await prisma.chatbot.create({
      data: {
        userId: session.user.id,
        name,
        systemPrompt,
        themeColor,
      },
    });

    revalidatePath("/dashboard/modules/chatbot");
    return { success: true, chatbot };
  } catch (error: any) {
    console.error("Failed to create chatbot:", error);
    return { success: false, error: error.message };
  }
}

export async function getUserChatbots() {
  const session = await getSessionAction();
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  return await prisma.chatbot.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { sessions: true },
      },
    },
  });
}

export async function deleteChatbot(id: string) {
  const session = await getSessionAction();
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  try {
    await prisma.chatbot.delete({
      where: { 
        id,
        userId: session.user.id 
      },
    });

    revalidatePath("/dashboard/modules/chatbot");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: "Verwijderen mislukt" };
  }
}
