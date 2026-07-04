import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { prisma } from '@rebuildyourlife/database';
import { GoogleGenAI } from '@google/genai';

const JWT_SECRET = process.env.JWT_SECRET!;
const AI_KEY = process.env.GEMINI_API_KEY_1 || process.env.GOOGLE_GENERATIVE_AI_API_KEY;

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("ryl_session")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const userId = decoded.userId;

    const { topic, platform, length } = await req.json();
    
    if (!AI_KEY) {
      throw new Error("No AI Key available");
    }

    const prompt = `Je bent een expert in viral short-form video's (TikTok, Reels, Shorts). 
Schrijf een script over het onderwerp: "${topic}".
Platform: ${platform}. 
Lengte: ${length} seconden.
Geef een duidelijke Hook, Body en Call to Action. Gebruik een spreektaal stijl.`;

    const ai = new GoogleGenAI({ apiKey: AI_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt
    });

    const generatedScript = response.text?.trim() || "Script kon niet gegenereerd worden.";

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
  } catch (error: any) {
    console.error("Video Factory Error:", error);
    return NextResponse.json({ error: "Internal Server Error", message: error.message }, { status: 500 });
  }
}
