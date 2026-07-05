import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { platform, content } = await req.json();

    if (!platform || !content) {
      return NextResponse.json({ error: 'Missing required fields: platform, content' }, { status: 400 });
    }

    const webhookUrl = process.env.MAKE_SOCIAL_WEBHOOK_URL;

    if (!webhookUrl) {
      console.warn("MAKE_SOCIAL_WEBHOOK_URL ontbreekt. Social post wordt gesimuleerd.");
      console.log(`[SIMULATION SOCIAL] Platform: ${platform} | Content: ${content}`);
      return NextResponse.json({ success: true, message: 'Social post gesimuleerd (geen webhook URL)' }, { status: 200 });
    }

    // Echte trigger naar Make.com
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        platform,
        content,
        timestamp: new Date().toISOString()
      })
    });

    if (!res.ok) {
      throw new Error("Make.com Webhook faalde.");
    }

    return NextResponse.json({ success: true, message: 'Succesvol verzonden naar Make.com webhook' }, { status: 200 });

  } catch (error: any) {
    console.error('Social Publish API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
