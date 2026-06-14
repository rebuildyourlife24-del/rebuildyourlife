import { NextResponse } from 'next/server';
import { SocialSwarmService } from '@/lib/services/social.service';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    // Orion triggers the Social Media Swarm
    const result = await SocialSwarmService.generateAndScheduleViralPosts(userId);

    return NextResponse.json({
      message: 'Social Swarm Agents deployed successfully.',
      ...result
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
