import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { prisma } from '@rebuildyourlife/database';

const JWT_SECRET = process.env.JWT_SECRET!;
// Fallback to Groq or Gemini if Cerebras not available
const AI_KEY = process.env.GEMINI_API_KEY_1 || process.env.GOOGLE_GENERATIVE_AI_API_KEY;

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("ryl_session")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const userId = decoded.userId;

    const { topic, platform, length } = await req.json();

    // In a real scenario, this would call the GodBrain router (Cerebras/Groq/Gemini)
    // For now we will mock the AI response to ensure fast execution without complex fetch logic here,
    // or actually call Gemini REST API. Let's call Gemini REST API.
    
    if (!AI_KEY) {
      throw new Error("No AI Key available");
    }

    const prompt = `Je bent een expert in viral short-form video's (TikTok, Reels, Shorts). 
Schrijf een script over het onderwerp: "${topic}".
Platform: ${platform}. 
Lengte: ${length} seconden.
Geef een duidelijke Hook, Body en Call to Action. Gebruik een spreektaal stijl.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${AI_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const aiData = await response.json();
    const generatedScript = aiData.candidates?.[0]?.content?.parts?.[0]?.text || "Er ging iets mis bij het genereren.";

    // Save to database as a drafted SocialMediaPost
    const post = await prisma.socialMediaPost.create({
      data: {
        userId,
        platform: platform,
        content: generatedScript,
        status: "DRAFT",
        publishAt: new Date(Date.now() + 86400000), // Default publish tomorrow
      }
    });

    return NextResponse.json({ success: true, script: generatedScript, post });
  } catch (error) {
    console.error("Video Factory Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
