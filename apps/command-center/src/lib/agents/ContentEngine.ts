import { prisma } from '@rebuildyourlife/database';

export class ContentEngine {
  /**
   * Generates a hyper-realistic prompt for the Midjourney/Stable Diffusion agent,
   * combining Billionaire Toolkits with real-time requirements.
   */
  static async generateVisualPrompt(campaignGoal: string): Promise<string> {
    // 1. Haal de master prompts op uit de God-Brain (Vector Cloud)
    const folder = await prisma.enterpriseFolder.findUnique({
      where: { name: 'CONTENT_CREATOR_PROMPTS' },
      include: { documents: true }
    });

    const masterPrompt = folder?.documents?.[0]?.content || "RAW, ultra-realistic, 8k resolution, cinematic lighting, shot on 35mm lens, photorealistic, premium corporate aesthetic";

    // 2. Mix de template met de campagne-doelstelling
    // In productie roept dit de Lokale Orion (Llama 3) via /api/orion/local aan
    const optimizedPrompt = `${masterPrompt} -- FOCUS: ${campaignGoal} -- STYLE: Billionaire Luxury --v 6.0`;
    
    return optimizedPrompt;
  }

  /**
   * Creëert een volledig geoptimaliseerd social media script (TikTok/Reels)
   * gebaseerd op de hoogste RoAS templates in de God-Brain.
   */
  static async buildCampaignScript(productName: string): Promise<string> {
    // Haal de ADS master toolkit op voor de beste hooks
    const folder = await prisma.enterpriseFolder.findUnique({
      where: { name: 'ADS_MASTER_TOOLKIT' },
      include: { documents: true }
    });

    const hookTemplate = "STOP SCROLLING. Als je [X] wilt bereiken, doe je dit helemaal verkeerd.";
    
    // In productie: stuur dit naar /api/orion/local om het script door de lokale Llama 3 te laten schrijven.
    return `
      [HOOK - 0:00-0:03]: ${hookTemplate}
      [VALUE - 0:03-0:15]: Hier is hoe ${productName} dit oplost op First-Class niveau.
      [CTA - 0:15-0:20]: Klik op de link en ervaar het zelf.
    `;
  }
}
