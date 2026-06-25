"use server";

import { getSessionAction } from "@/app/actions/auth";
import { db } from "@/lib/db";
import { B2BLeadScraperService, ScrapedLead } from "@/lib/services/scraper.service";
import { B2BPitchService, PitchConfig } from "@/lib/services/pitch.service";
import { VideoGeneratorService, VideoConfig } from "@/lib/services/video.service";
import { revalidatePath } from "next/cache";

/**
 * Action to get all B2B clients for the current user
 */
export async function getBusinessClientsAction() {
  try {
    const session = await getSessionAction();
    if (!session.success || !session.user) {
      throw new Error("Niet geauthenticeerd");
    }

    const clients = await db.businessClient.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" }
    });

    return { success: true, clients };
  } catch (err: any) {
    console.error("Failed to get business clients:", err);
    return { success: false, error: err.message || "Could not retrieve leads." };
  }
}

/**
 * Action to scrape leads and save them to the database
 */
export async function scrapeLeadsAction(location: string, category: string, limit: number = 10) {
  try {
    const session = await getSessionAction();
    if (!session.success || !session.user) {
      throw new Error("Niet geauthenticeerd");
    }

    const leads = await B2BLeadScraperService.scrapeLeads(location, category, limit);
    const savedCount = await B2BLeadScraperService.saveLeadsToDb(session.user.id, leads);

    revalidatePath("/dashboard/factory");
    return { success: true, leads, savedCount };
  } catch (err: any) {
    console.error("Scraping action failed:", err);
    return { success: false, error: err.message || "Failed to scrape leads." };
  }
}

/**
 * Action to send a B2B sales email pitch
 */
export async function sendPitchAction(
  clientId: string,
  email: string,
  subject: string,
  bodyHtml: string,
  config: PitchConfig
) {
  try {
    const session = await getSessionAction();
    if (!session.success || !session.user) {
      throw new Error("Niet geauthenticeerd");
    }

    const result = await B2BPitchService.sendPitch(clientId, email, subject, bodyHtml, config);
    revalidatePath("/dashboard/factory");
    return result;
  } catch (err: any) {
    console.error("Pitch sending action failed:", err);
    return { success: false, error: err.message || "Failed to send pitch." };
  }
}

/**
 * Action to generate/render an MP4 video
 */
export async function renderVideoAction(config: VideoConfig) {
  try {
    const session = await getSessionAction();
    if (!session.success || !session.user) {
      throw new Error("Niet geauthenticeerd");
    }

    const result = await VideoGeneratorService.renderVideo(config);
    return { success: true, ...result };
  } catch (err: any) {
    console.error("Video rendering action failed:", err);
    return { success: false, error: err.message || "Failed to render video." };
  }
}
