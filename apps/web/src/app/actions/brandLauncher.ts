'use server';

import { getSessionAction } from '@/app/actions/auth';
import { inngest } from '@/inngest/client';
import { prisma } from '@rebuildyourlife/database';

export async function generateBrandKitAction(domain: string, industry: string = 'Tech & E-commerce') {
  try {
    const session = await getSessionAction();
    if (!session || !session.user) {
      return { success: false, error: 'Unauthorized' };
    }

    // 1. Create Job in Database
    const jobRecord = await prisma.brandLauncherJob.create({
      data: {
        userId: session.user.id,
        domain,
        industry,
        status: "PENDING"
      }
    });

    // 2. Dispatch to Inngest Background Queue
    await inngest.send({
      name: "brand/launcher.run",
      data: {
        jobId: jobRecord.id,
        domain,
        industry
      },
    });

    return { success: true, jobId: jobRecord.id };
  } catch (error: any) {
    console.error('Brand Kit Error:', error);
    return { success: false, error: error.message || 'Fout bij het genereren van de kit.' };
  }
}

export async function getBrandLauncherJob(jobId: string) {
  try {
    const job = await prisma.brandLauncherJob.findUnique({
      where: { id: jobId }
    });
    return { success: true, job };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
