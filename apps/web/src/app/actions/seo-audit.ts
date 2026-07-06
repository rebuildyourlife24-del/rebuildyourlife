"use server";

import { getSessionAction } from "./auth";
import { prisma } from "@rebuildyourlife/database";
import { revalidatePath } from "next/cache";
import FirecrawlApp from "@mendable/firecrawl-js";
import { GoogleGenAI } from "@google/genai";

// Firecrawl Initialization
const firecrawl = new FirecrawlApp({
  apiKey: process.env.FIRECRAWL_API_KEY || "",
});

// Gemini Initialization
const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY_1 || "",
});

import { inngest } from "../../inngest/client";

export async function createSeoAudit(url: string) {
  const session = await getSessionAction();
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  try {
    // 1. Create a pending audit record
    const auditRecord = await prisma.seoAuditJob.create({
      data: {
        userId: session.user.id,
        targetUrl: url,
        status: "PENDING",
      },
    });

    // 2. Dispatch to Inngest Background Queue
    await inngest.send({
      name: "seo/audit.run",
      data: {
        auditId: auditRecord.id,
        url: url,
      },
    });

    revalidatePath("/dashboard/modules/seo-audit");
    return { success: true, audit: auditRecord };
  } catch (error: any) {
    console.error("SEO Audit dispatch failed:", error);
    return { success: false, error: error.message };
  }
}

export async function getUserSeoAudits() {
  const session = await getSessionAction();
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  const audits = await prisma.seoAuditJob.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return audits;
}
