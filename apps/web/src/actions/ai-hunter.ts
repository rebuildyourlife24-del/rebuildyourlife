'use server'

import { createShopifyProduct } from '@/lib/shopify';

const FIRECRAWL_API_URL = "https://api.firecrawl.dev/v1/scrape";

import { inngest } from '../inngest/client';
import { prisma } from '@rebuildyourlife/database';
import { getSessionAction } from '../app/actions/auth';

export async function huntProductFromUrl(url: string) {
  try {
    const session = await getSessionAction();
    if (!session || !session.user) {
      throw new Error("Unauthorized");
    }

    // 1. Create Job in Database
    const jobRecord = await prisma.productHunterJob.create({
      data: {
        userId: session.user.id,
        niche: url, // storing URL in niche field for now
        status: "PENDING"
      }
    });

    // 2. Dispatch to Inngest Background Queue
    await inngest.send({
      name: "product/hunt.run",
      data: {
        jobId: jobRecord.id,
        url: url,
      },
    });

    return {
      success: true,
      jobId: jobRecord.id
    };
  } catch (error: any) {
    console.error("Hunt dispatch failed:", error);
    return { success: false, error: error.message };
  }
}

export async function getProductHuntJob(jobId: string) {
  try {
    const job = await prisma.productHunterJob.findUnique({
      where: { id: jobId }
    });
    return { success: true, job };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function injectProductToShopify(productJson: any) {
  try {
    const shopifyProduct = await createShopifyProduct(productJson);
    return { success: true, shopifyProduct };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
