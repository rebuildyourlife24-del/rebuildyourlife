import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { prompt } = body;

    if (!prompt) {
      return NextResponse.json({ error: "No prompt provided" }, { status: 400 });
    }

    // ----------------------------------------------------
    // PHASE 3: TRUE AI INTELLIGENCE (ORION'S BRAIN)
    // ----------------------------------------------------
    
    // We ask GPT-4o-mini to act as Orion, determine the agent, and give a response.
    const systemPrompt = `You are ORION, the central AI CEO of the Command Center for Henk Semler.
You must analyze the user's voice command and determine which sub-agent should handle it.
Sub-agents: ORION_CORE, FINANCE_MGR, SEO_MARKETING, LEAD_SCRAPER, ECOMMERCE_MEDIA.
Respond in JSON format exactly like this:
{
  "agent": "AGENT_NAME",
  "response": "Je zelfverzekerde, korte, strategische reactie. BELANGRIJK: Spreek ALTIJD Nederlands. Spreek Henk direct aan."
}`;

    const { text } = await generateText({
      model: openai('gpt-4o-mini'),
      system: systemPrompt,
      prompt: prompt,
    });

    let assignedAgent: string = 'ORION_CORE';
    let responseText = 'System anomaly: Could not parse AI response.';

    try {
      // Clean up the response if it has markdown formatting
      const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const aiDecision = JSON.parse(cleanJson);
      assignedAgent = aiDecision.agent || 'ORION_CORE';
      responseText = aiDecision.response || text;
    } catch (e) {
      // Fallback if AI didn't return perfect JSON
      responseText = text;
    }

    // ----------------------------------------------------
    // DATABASE LOGGING: LONG-TERM MEMORY & DAILY OPS
    // ----------------------------------------------------
    
    await db.dailyLog.create({
      data: {
        agentType: assignedAgent as any,
        action: `Processed Command: "${prompt}"`,
        costUsd: 0.01,
        status: "SUCCESS"
      }
    });

    await db.aIMemory.create({
      data: {
        agentType: assignedAgent as any,
        content: `User requested: ${prompt}. AI Responded: ${responseText}`,
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
    console.error("Orion AI Error:", error);
    return NextResponse.json({ error: "Orion Cognitive Core Offline" }, { status: 500 });
  }
}
