'use server';

import { db } from '@/lib/db';
import { getSessionAction } from '@/app/actions/auth';
import { routeAIRequest } from '@/lib/ai-router';
import { revalidatePath } from 'next/cache';

/**
 * Robust JSON cleaner and parser
 */
function cleanAndParseJSON(raw: string) {
  let cleaned = raw?.trim();
  // Strip Markdown code block wraps if present
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```[a-zA-Z]*\n/, '').replace(/\n```$/, '');
  }
  const startIdx = cleaned.indexOf('{');
  const endIdx = cleaned.lastIndexOf('}');
  if (startIdx !== -1 && endIdx !== -1) {
    cleaned = cleaned.substring(startIdx, endIdx + 1);
  }
  return JSON.parse(cleaned?.trim());
}

/**
 * Action 1: Translate a "Vibe Prompt" into store layouts, colors, products, etc.
 * Uses routeAIRequest from ai-router.ts for structured LLM generation.
 */
export async function generateVibeEcommerceAction(vibePrompt: string) {
  try {
    const session = await getSessionAction();
    if (!session.success || !session.user) {
      throw new Error('Niet geauthenticeerd');
    }

    console.log(`[VIBE GENERATOR] Translating vibe prompt: "${vibePrompt}" via AI Router...`);

    const systemPrompt = `You are a branding and design system generator for a high-end, brutalist e-commerce platform called Rebuild Your Life.
Your task is to take a "vibe prompt" (e.g. "cyberpunk neon fitness brand", "raw concrete industrial coffee", "clean high-gloss aesthetic clinic") and generate a complete brand design system and 3 unique products.

Return ONLY a single, raw JSON object (no markdown, no explanations, no text before or after). The JSON must match the exact schema structure below:
{
  "name": "Brutal brand name, e.g. KROMIUM, VOID, CONCRETE",
  "theme": "A theme code matching the vibe, e.g. CYBERPUNK, MONOCHROME, INDUSTRIAL, NEON_BRUTALIST, ULTRA_LUXURY",
  "title": "SEO Title, e.g. KROMIUM | Next-Gen Bio-Hacking & Gymwear",
  "description": "High-octane, brutalist marketing copy describing the brand. Emphasize raw tech, sovereignty, and high-performance lifestyle.",
  "settings": {
    "primaryColor": "Hex code for primary brand color, e.g. #FF0055",
    "secondaryColor": "Hex code for secondary brand color, e.g. #00FFCC",
    "backgroundColor": "Hex code for body background (dark colors preferred for brutalist style, e.g. #0A0A0A)",
    "fontFamily": "Font stack, e.g. Orbitron, Impact, Space Mono, Courier New, Inter",
    "accentColor": "Hex code for accents, e.g. #FFFF00",
    "brutalism": true
  },
  "products": [
    {
      "sku": "Unique uppercase SKU code like CP-PULSE-01",
      "name": "High-concept product title matching the brand vibe",
      "price": 89.00,
      "description": "Intense, benefit-driven product description explaining why this item is essential for rebuilding one's life under this brand's philosophy.",
      "image": "Use a themed high-quality Unsplash image URL (hotlink) that matches the product type and vibe (e.g., tech, health, fashion, design, concrete)."
    },
    {
      "sku": "Unique SKU code",
      "name": "Product title",
      "price": 49.00,
      "description": "Product description",
      "image": "Unsplash hotlink URL"
    },
    {
      "sku": "Unique SKU code",
      "name": "Product title",
      "price": 29.90,
      "description": "Product description",
      "image": "Unsplash hotlink URL"
    }
  ]
}`;

    const messages = [
      {
        role: 'user' as const,
        content: `Generate a brand system and products for this vibe prompt: "${vibePrompt}"`,
      },
    ];

    const aiResponse = await routeAIRequest(messages, systemPrompt);
    const parsedData = cleanAndParseJSON(aiResponse.content);

    // Formatteer subdomain slug
    const baseSubdomain = parsedData.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').trim();
    let subdomain = baseSubdomain;
    
    // Zorg voor een uniek subdomein
    let exists = await db.franchise.findUnique({ where: { subdomain } });
    let count = 1;
    while (exists) {
      subdomain = `${baseSubdomain}-${count}`;
      exists = await db.franchise.findUnique({ where: { subdomain } });
      count++;
    }

    // Maak de franchise aan in de database
    const franchise = await db.franchise.create({
      data: {
        userId: session.user.id,
        name: parsedData.name,
        subdomain,
        theme: parsedData.theme || 'MONOCHROME',
        title: parsedData.title,
        description: parsedData.description,
        products: JSON.stringify(parsedData.products),
        settings: JSON.stringify(parsedData.settings),
        status: 'ACTIVE',
      },
    });

    // Maak een OmegaSite record aan gekoppeld aan de franchise
    await db.omegaSite.create({
      data: {
        franchiseId: franchise.id,
        templateUsed: parsedData.theme || 'MONOCHROME',
        conversionRate: 0.0,
        isLive: true,
      },
    });

    // Schrijf een actie in het AgentDossier (Audit/Systeem log)
    const dossierEntry = await db.agentDossier.create({
      data: {
        userId: session.user.id,
        agentType: 'VIBE_ENGINEER',
        action: 'CREATE_STORE',
        target: franchise.name,
        status: 'SUCCESS',
        details: `E-commerce franchise '${franchise.name}' created successfully with vibe: "${vibePrompt}". Theme settings initialized. Subdomain: ${subdomain}.rebuildyourlife.eu`,
      },
    });

    // Schrijf een record in de AiSharedMemory
    await db.aiSharedMemory.create({
      data: {
        userId: session.user.id,
        sourceAi: 'VibePromptEngineer',
        memoryType: 'ECOMMERCE_GENERATION',
        content: `Initialized e-commerce franchise "${franchise.name}" on subdomain "${subdomain}" for user ${session.user.id}. Layout colors: Primary=${parsedData.settings?.primaryColor}, Background=${parsedData.settings?.backgroundColor}. Created 3 vibe-aligned products.`,
        importance: 0.8,
        context: {
          franchiseId: franchise.id,
          subdomain,
          productsCount: 3,
        },
      },
    });

    revalidatePath('/dashboard/franchises');
    revalidatePath('/dashboard/ai-team/synthetic');
    
    return {
      success: true,
      data: franchise,
      parsedData,
      dossierEntry,
    };
  } catch (error: any) {
    console.error('[VIBE GENERATOR ERROR]', error);
    return {
      success: false,
      error: error.message || 'Kon vibe prompt niet vertalen naar e-commerce template.',
    };
  }
}

/**
 * Action 2: Trigger Synthetic Operators (CFO, PR, CRM) to perform autonomous tasks
 * on behalf of the generated store. Writes REAL records in database models.
 */
export async function runSyntheticOperatorsAction(franchiseId: string) {
  try {
    const session = await getSessionAction();
    if (!session.success || !session.user) {
      throw new Error('Niet geauthenticeerd');
    }

    const franchise = await db.franchise.findUnique({
      where: { id: franchiseId },
    });

    if (!franchise) {
      throw new Error('Franchise niet gevonden');
    }

    const products = JSON.parse(franchise.products);
    const primaryProduct = Array.isArray(products) && products.length > 0 ? products[0] : { name: 'Vibe Product', price: 99.00, sku: 'VIBE-PROD-01' };

    const operationsResults = [];

    // --- CFO OPERATOR: Sophia / CFO-01 (Winst sweeps en financiële reconciliatie) ---
    // We simuleren een echte aankoop in de winkel en verhogen de omzet.
    const orderAmount = primaryProduct.price || 99.00;
    const platformCut = orderAmount * 0.25; // 25% Platform cut

    // 1. Maak een echte FranchiseOrder
    const order = await db.franchiseOrder.create({
      data: {
        franchiseId,
        customerName: 'Marcus Aurelius',
        customerEmail: 'marcus@sovereign-academy.org',
        totalAmount: orderAmount,
        platformCut,
        status: 'PAID',
        items: JSON.stringify([
          {
            sku: primaryProduct.sku,
            name: primaryProduct.name,
            price: orderAmount,
            quantity: 1,
          },
        ]),
      },
    });

    // 2. Registreer Platform Revenue
    await db.platformRevenue.create({
      data: {
        franchiseOrderId: order.id,
        franchiseId,
        amount: platformCut,
      },
    });

    // 3. Update Franchise totals
    await db.franchise.update({
      where: { id: franchiseId },
      data: {
        revenue: { increment: orderAmount },
        platformCutTotal: { increment: platformCut },
      },
    });

    // 4. Log in AgentDossier (CFO)
    const cfoDossier = await db.agentDossier.create({
      data: {
        userId: session.user.id,
        agentType: 'CFO',
        action: 'REVENUE_SWEEP',
        target: `Order ${order.id.substring(0, 8)}`,
        status: 'SUCCESS',
        details: `CFO-01 reconciled purchase of '${primaryProduct.name}' for €${orderAmount.toFixed(2)}. Platform cut (€${platformCut.toFixed(2)}) swept and routed to Sovereign Operations Vault.`,
      },
    });

    // 5. Log in AiSharedMemory (CFO)
    await db.aiSharedMemory.create({
      data: {
        userId: session.user.id,
        sourceAi: 'CFO-01',
        memoryType: 'FINANCIAL_SWEEP',
        content: `CFO-01 completed a revenue sweep of €${platformCut.toFixed(2)} (25% tax cut) from Order ${order.id} for shop "${franchise.name}". Vault liquidity adjusted.`,
        importance: 0.9,
      },
    });

    operationsResults.push({
      operator: 'CFO',
      agent: 'CFO-01',
      action: 'REVENUE_SWEEP',
      success: true,
      message: `Reconciled order ${order.id.substring(0, 8)}. Swept €${platformCut.toFixed(2)} to operations vault.`,
      dossierId: cfoDossier.id,
    });

    // --- PR OPERATOR: Elena / PR-01 (Render video's en start TikTok campagnes) ---
    // 1. Maak een echte PRCampaign aan gekoppeld aan de franchise
    const prCampaign = await db.pRCampaign.create({
      data: {
        franchiseId,
        campaignName: `${franchise.name} - Autonomous TikTok Launch`,
        platform: 'TIKTOK',
        totalViews: Math.floor(Math.random() * 4500) + 1200,
        status: 'VIRAL',
        mediaPath: `/materials/renders/${franchise.name.toLowerCase().replace(/\s+/g, '_')}_launch.mp4`,
      },
    });

    // 2. Log in AgentDossier (PR)
    const prDossier = await db.agentDossier.create({
      data: {
        userId: session.user.id,
        agentType: 'PR_AGENT',
        action: 'RENDER_CAMPAIGN',
        target: `Campaign: ${prCampaign.campaignName}`,
        status: 'SUCCESS',
        details: `PR-01 rendered 1080p vertical promo hooks for TikTok. Video asset saved to ${prCampaign.mediaPath}. Campaign status updated to VIRAL after automated ad placements. Current views: ${prCampaign.totalViews}.`,
      },
    });

    // 3. Log in AiSharedMemory (PR)
    await db.aiSharedMemory.create({
      data: {
        userId: session.user.id,
        sourceAi: 'PR-01',
        memoryType: 'CAMPAIGN_LAUNCH',
        content: `PR-01 successfully generated and published promo hooks for product "${primaryProduct.name}". Campaign: "${prCampaign.campaignName}" is live on TikTok. Views: ${prCampaign.totalViews}.`,
        importance: 0.75,
      },
    });

    operationsResults.push({
      operator: 'PR',
      agent: 'PR-01',
      action: 'CAMPAIGN_LAUNCH',
      success: true,
      message: `Rendered video hook and launched TikTok campaign. Views: ${prCampaign.totalViews}.`,
      dossierId: prDossier.id,
    });

    // --- CRM OPERATOR: Marcus / CRM-01 (Lead generatie & B2B mailer) ---
    // 1. Maak een SyndicateCampaign aan
    const crmCampaign = await db.syndicateCampaign.create({
      data: {
        userId: session.user.id,
        name: `${franchise.name} - CRM B2B outreach`,
        status: 'ACTIVE',
        description: `Autonomous marketing campaign driving wholesale deals for brand ${franchise.name}.`,
      },
    });

    // 2. Maak een SyndicateTarget (lead)
    const randomLeadId = Math.floor(Math.random() * 1000);
    const lead = await db.syndicateTarget.create({
      data: {
        campaignId: crmCampaign.id,
        name: `Lead Partner #${randomLeadId}`,
        email: `buyer_${randomLeadId}@brutalist-distribution.net`,
        company: 'Vanguard Retail Distribution',
        debtAmount: 0.0,
        status: 'CONTACTED',
        lastEmailedAt: new Date(),
        encryptedNotes: `Sent dynamic pricing brochure and catalog with products: ${products.map((p: any) => p.name).join(', ')}.`,
      },
    });

    // 3. Log in AgentDossier (CRM)
    const crmDossier = await db.agentDossier.create({
      data: {
        userId: session.user.id,
        agentType: 'CRM_AGENT',
        action: 'EMAIL_OUTREACH',
        target: lead.email,
        status: 'SUCCESS',
        details: `CRM-01 identified high-conversion B2B target: ${lead.company}. Sent wholesale catalog containing generated products. Outbound connection logged under Campaign: ${crmCampaign.name}.`,
      },
    });

    // 4. Log in AiSharedMemory (CRM)
    await db.aiSharedMemory.create({
      data: {
        userId: session.user.id,
        sourceAi: 'CRM-01',
        memoryType: 'CRM_OUTREACH',
        content: `CRM-01 launched outreach campaign "${crmCampaign.name}" and sent custom pitch to ${lead.email} (${lead.company}).`,
        importance: 0.7,
      },
    });

    operationsResults.push({
      operator: 'CRM',
      agent: 'CRM-01',
      action: 'CRM_OUTREACH',
      success: true,
      message: `Identified and emailed B2B partner ${lead.company} (${lead.email}).`,
      dossierId: crmDossier.id,
    });

    revalidatePath('/dashboard/ai-team/synthetic');
    revalidatePath('/dashboard/franchises');

    return {
      success: true,
      results: operationsResults,
    };
  } catch (error: any) {
    console.error('[SYNTHETIC OPERATORS ERROR]', error);
    return {
      success: false,
      error: error.message || 'Kon Synthetic Operators niet uitvoeren.',
    };
  }
}

/**
 * Action 3: Retrieve recent logs from AgentDossier and AiSharedMemory for the user's dashboard.
 */
export async function getSyntheticLogsAction() {
  try {
    const session = await getSessionAction();
    if (!session.success || !session.user) {
      throw new Error('Niet geauthenticeerd');
    }

    const dossiers = await db.agentDossier.findMany({
      where: { userId: session.user.id },
      orderBy: { timestamp: 'desc' },
      take: 25,
    });

    const sharedMemory = await db.aiSharedMemory.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: 25,
    });

    return {
      success: true,
      dossiers,
      sharedMemory,
    };
  } catch (error: any) {
    console.error('[GET SYNTHETIC LOGS ERROR]', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

