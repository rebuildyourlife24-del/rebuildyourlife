import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// OpenAI client will be instantiated inside the function to prevent build-time errors

export async function POST(req: Request) {
  try {
    const { topic, tone, platform } = await req.json();

    if (!topic || !platform) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    console.log(`[CONTENT FORGE] Generating ${tone} content for ${platform} on topic: ${topic}`);

    const systemPrompt = `You are an elite, aggressive, "Billionaire / Apex Predator" marketing copywriter. 
You write extremely persuasive, direct, and slightly controversial content to wake people up from "The Matrix".
Your tone is '${tone}', and the platform is '${platform}'.

Format the response EXACTLY as a valid JSON object with the following keys:
{
  "title": "A highly clickable hook title",
  "script": "The video/post script with sections like HOOK, PROBLEM, SOLUTION, CALL TO ACTION",
  "midjourneyPrompt": "A highly detailed Midjourney v6 prompt for a related luxury/cyberpunk/wealth aesthetic image",
  "voiceoverText": "A clean text version of the script suitable for an AI voice generator to read (no stage directions)",
  "hashtags": ["#array", "#of", "#hashtags"]
}`;

    const userPrompt = `Write a script about: ${topic}.`;

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || "dummy_key",
    });

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.8,
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error("No content generated");

    const parsedData = JSON.parse(content);

    return NextResponse.json({
      success: true,
      data: parsedData
    });
  } catch (error: any) {
    console.error('[CONTENT FORGE] Error generating content:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate content' }, { status: 500 });
  }
}
