import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { prompt } = body;

    if (!prompt) {
      return NextResponse.json({ error: "No prompt provided" }, { status: 400 });
    }

    // ----------------------------------------------------
    // PHASE 3: ORION'S ROUTING LOGIC
    // ----------------------------------------------------
    // In production, this prompt goes to a fast LLM (like GPT-4o-mini)
    // to classify WHICH agent needs to be triggered.
    
    const promptLower = prompt.toLowerCase();
    let assignedAgent: 'ORION_CORE' | 'FINANCE_MGR' | 'SEO_MARKETING' | 'LEAD_SCRAPER' | 'ECOMMERCE_MEDIA' = 'ORION_CORE';
    let responseText = '';

    // Simulated Classification Logic
    if (promptLower.includes('scrape') || promptLower.includes('lead')) {
      assignedAgent = 'LEAD_SCRAPER';
      responseText = "I am routing your request to the Scraper Agent. It will begin searching the target databases immediately.";
    } else if (promptLower.includes('finance') || promptLower.includes('mollie') || promptLower.includes('margin')) {
      assignedAgent = 'FINANCE_MGR';
      responseText = "Connecting to the Finance module. I will compile a report on your Mollie payments and current margins.";
    } else if (promptLower.includes('seo') || promptLower.includes('marketing') || promptLower.includes('ads')) {
      assignedAgent = 'SEO_MARKETING';
      responseText = "Activating the SEO Agent. We will adjust the current ad spend and generate new blog posts.";
    } else if (promptLower.includes('shop') || promptLower.includes('product') || promptLower.includes('video')) {
      assignedAgent = 'ECOMMERCE_MEDIA';
      responseText = "Understood. The E-Commerce Agent is generating white-label assets and syncing with Shopify.";
    } else {
      assignedAgent = 'ORION_CORE';
      responseText = "I am processing your command. Analyzing data to determine the best course of action.";
    }

    // ----------------------------------------------------
    // DATABASE LOGGING: LONG-TERM MEMORY & DAILY OPS
    // ----------------------------------------------------
    
    await db.dailyLog.create({
      data: {
        agentType: assignedAgent,
        action: `Processed Voice Command: "${prompt}"`,
        costUsd: 0.01,
        status: "SUCCESS"
      }
    });

    await db.aIMemory.create({
      data: {
        agentType: assignedAgent,
        content: `User requested: ${prompt}. Routed to ${assignedAgent}.`,
        category: "VOICE_COMMAND",
        importance: 5
      }
    });

    return NextResponse.json({
      agent: assignedAgent,
      response: responseText,
      status: "ROUTED_SUCCESSFULLY"
    });

  } catch (error) {
    console.error("Orion API Error:", error);
    return NextResponse.json({ error: "Internal System Failure" }, { status: 500 });
  }
}
