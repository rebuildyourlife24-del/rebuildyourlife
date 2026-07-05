"use server";

import { prisma } from "@rebuildyourlife/database";
import { getSessionAction } from "./auth";
import { revalidatePath } from "next/cache";

export async function getLeadsAction() {
  try {
    const session = await getSessionAction();
    if (!session?.success || !session?.user?.id) {
      throw new Error("Niet ingelogd");
    }

    const leads = await prisma.crmLead.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });
    
    return { success: true, leads };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createLeadAction(data: { name: string; email?: string; company?: string; value?: number; notes?: string; stage?: string }) {
  try {
    const session = await getSessionAction();
    if (!session?.success || !session?.user?.id) {
      throw new Error("Niet ingelogd");
    }

    const lead = await prisma.crmLead.create({
      data: {
        userId: session.user.id,
        name: data.name,
        email: data.email,
        company: data.company,
        value: data.value,
        notes: data.notes,
        stage: data.stage || "NEW",
      },
    });

    revalidatePath('/dashboard/modules/crm');
    return { success: true, lead };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateLeadStageAction(leadId: string, newStage: string) {
  try {
    const session = await getSessionAction();
    if (!session?.success || !session?.user?.id) {
      throw new Error("Niet ingelogd");
    }

    // Controleer of de lead van de huidige gebruiker is
    const existing = await prisma.crmLead.findUnique({ where: { id: leadId } });
    if (!existing || existing.userId !== session.user.id) {
      throw new Error("Niet geautoriseerd");
    }

    const updated = await prisma.crmLead.update({
      where: { id: leadId },
      data: { stage: newStage },
    });

    revalidatePath('/dashboard/modules/crm');
    return { success: true, lead: updated };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteLeadAction(leadId: string) {
  try {
    const session = await getSessionAction();
    if (!session?.success || !session?.user?.id) {
      throw new Error("Niet ingelogd");
    }

    const existing = await prisma.crmLead.findUnique({ where: { id: leadId } });
    if (!existing || existing.userId !== session.user.id) {
      throw new Error("Niet geautoriseerd");
    }

    await prisma.crmLead.delete({ where: { id: leadId } });

    revalidatePath('/dashboard/modules/crm');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
