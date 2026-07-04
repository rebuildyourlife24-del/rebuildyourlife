import { NextResponse } from 'next/server';
import { prisma } from '@rebuildyourlife/database';

export async function POST(req: Request) {
  try {
    const { actionType, data, userId } = await req.json();

    if (!userId || !actionType || !data) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    console.log(`[AUTOPILOT] Executing ${actionType} for User ${userId}`);

    // Simulate AI / Network latency (1-3 seconds)
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1500));

    let result = {};

    switch (actionType) {
      case 'SEND_EMAIL':
        // HIER KOMT DE ECHTE INTEGRATIE (e.g. Resend, Sendgrid, of Gmail API)
        // Voor nu simuleren we succes als de payload klopt
        const { to, subject, body } = data;
        if (!to || !subject || !body) {
          throw new Error("Invalid email payload");
        }
        
        result = {
          success: true,
          message: `E-mail verzonden naar ${to}`,
          provider: 'Mock_Transport_Autopilot',
          deliveredAt: new Date().toISOString()
        };
        break;

      case 'PUBLISH_POST':
        result = {
          success: true,
          message: `Social post succesvol gepubliceerd`,
          platform: data.platform || 'LinkedIn',
          url: 'https://linkedin.com/post/mock123'
        };
        break;

      default:
        return NextResponse.json({ error: "Unknown action type" }, { status: 400 });
    }

    // Record the action in the database
    // We assume an 'AgentAction' or similar table exists. If not, we just log it to SocialMediaPost for now
    if (actionType === 'PUBLISH_POST') {
      await prisma.socialMediaPost.create({
        data: {
          title: data.subject || "Autopilot Post",
          content: data.body,
          status: "PUBLISHED",
          scheduledFor: new Date(),
          authorId: userId
        }
      });
    }

    return NextResponse.json({ success: true, result });

  } catch (error: any) {
    console.error("Autopilot Execute Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
