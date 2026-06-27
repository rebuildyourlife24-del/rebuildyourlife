import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { prisma } from '@rebuildyourlife/database';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET! || 'secret';

// To support cron jobs and manual triggers
export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    let userId = null;

    // Check for API key / Cron secret first
    if (authHeader === `Bearer ${process.env.CRON_SECRET}`) {
      // Find the admin user (first user in DB)
      const admin = await prisma.user.findFirst();
      if (admin) userId = admin.id;
    } else {
      // Manual trigger from UI
      const cookieStore = await cookies();
      const token = cookieStore.get("ryl_session")?.value;
      if (token) {
        try {
          const decoded = jwt.verify(token, JWT_SECRET) as any;
          userId = decoded.userId;
        } catch {
          // ignore
        }
      }
    }

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { platform = 'TikTok' } = await req.json().catch(() => ({}));

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || "dummy_key",
    });

    const systemPrompt = `You are "The Swarm", an autonomous elite marketing AI.
Generate a high-converting script/post for ${platform} about wealth creation and escaping the matrix.
Format the response EXACTLY as a valid JSON object with:
{
  "title": "A highly clickable hook title",
  "script": "The video/post script with sections like HOOK, PROBLEM, SOLUTION",
  "hashtags": ["#array", "#of", "#hashtags"]
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: "Generate the next asset." }
      ],
      response_format: { type: "json_object" },
      temperature: 0.8,
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error("No content generated");

    const parsedData = JSON.parse(content);
    const postContent = `**${parsedData.title}**\n\n${parsedData.script}\n\n${parsedData.hashtags.join(' ')}`;

    // Calculate a publish date (e.g. tomorrow)
    const publishAt = new Date();
    publishAt.setDate(publishAt.getDate() + 1);

    // Save to DB in REVIEW status so it shows up in QC Terminal
    const post = await prisma.socialMediaPost.create({
      data: {
        userId,
        platform,
        content: postContent,
        status: 'REVIEW',
        publishAt,
        views: 0,
        engagement: 0,
        mediaUrl: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80",
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Swarm generated asset successfully',
      post
    });

  } catch (error: any) {
    console.error('[SWARM_EXECUTE] Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
