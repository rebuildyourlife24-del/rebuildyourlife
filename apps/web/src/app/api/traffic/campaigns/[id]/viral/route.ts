import { NextResponse } from 'next/server';
import { TrafficService } from '@/lib/services/traffic.service';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET! ;

async function getAuthenticatedUserId() {
  const cookieStore = await cookies();
  const token = cookieStore.get('ryl_session')?.value;
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return decoded.userId;
  } catch {
    return null;
  }
}

export async function POST(req: Request, context: any) {
  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Next.js 15+ has promise params. Let's handle both promise and raw object.
    const resolvedParams = context.params instanceof Promise ? await context.params : context.params;
    const campaignId = resolvedParams?.id;

    if (!campaignId) {
      return NextResponse.json({ error: 'Missing campaign ID' }, { status: 400 });
    }

    const campaign = await TrafficService.triggerViralBoost(userId, campaignId);
    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    return NextResponse.json({
      status: 'success',
      data: campaign
    });
  } catch (error: any) {
    console.error('Error triggering viral boost:', error);
    return NextResponse.json({ error: 'Failed to boost campaign' }, { status: 500 });
  }
}
