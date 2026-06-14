import { NextResponse } from 'next/server';
import { CFOService } from '@/lib/services/cfo.service';
import { SocialSwarmService } from '@/lib/services/social.service';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, productId, requestedBudget } = body;

    if (!userId || !productId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // CFO INTERCEPTION: Does this test violate the 2% Risk Cap?
    const isApprovedByCFO = await CFOService.validateTestBudget(userId, requestedBudget || 5.00);

    if (!isApprovedByCFO) {
      return NextResponse.json({ 
        error: 'CFO_REJECTED', 
        message: 'The requested test budget exceeds the 2% maximum Risk of Ruin cap. Test aborted by Orion CFO.' 
      }, { status: 403 });
    }

    // CFO Approved. Launch the Swarm.
    // In reality, this would deploy the ads. We'll simulate by triggering the Social Swarm schedule.
    await SocialSwarmService.generateAndScheduleViralPosts(userId);

    return NextResponse.json({
      message: 'CFO Approved. Social Media Swarm deployed for Live Testing.',
      riskStatus: 'WITHIN_LIMITS'
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
