'use server';

import { revalidatePath } from 'next/cache';
import { SeoAgentService } from '../../lib/services/seo-agent.service';

export async function runSeoScanAction() {
  try {
    await SeoAgentService.runScan();
    // Revalidate the page so the new proposal shows up immediately
    revalidatePath('/seo');
  } catch (error) {
    console.error('Failed to run SEO scan:', error);
    throw new Error('Failed to run SEO scan');
  }
}
