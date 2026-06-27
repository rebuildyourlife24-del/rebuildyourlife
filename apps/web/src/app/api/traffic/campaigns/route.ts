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

export async function GET() {
  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const campaigns = await TrafficService.getCampaigns(userId);
    return NextResponse.json({
      status: 'success',
      data: campaigns
    });
  } catch (error: any) {
    console.error('Error fetching campaigns:', error);
    return NextResponse.json({ error: 'Failed to fetch campaigns' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { campaignName, budgetCredits } = body;

    if (!campaignName || typeof campaignName !== 'string' || campaignName.length < 3) {
      return NextResponse.json({ error: 'Invalid campaign name.' }, { status: 400 });
    }

    if (!budgetCredits || typeof budgetCredits !== 'number' || budgetCredits < 50) {
      return NextResponse.json({ error: 'Invalid budget. Minimum is 50 credits.' }, { status: 400 });
    }

    const currentCredits = await TrafficService.getUserCredits(userId);
    if (currentCredits < budgetCredits) {
      return NextResponse.json({ error: `Insufficient credits. You have ${currentCredits} credits.` }, { status: 400 });
    }

    const campaign = await TrafficService.launchCampaign(userId, campaignName, budgetCredits);
    return NextResponse.json({
      status: 'success',
      data: campaign
    });
  } catch (error: any) {
    console.error('Error launching campaign:', error);
    return NextResponse.json({ error: error.message || 'Failed to launch campaign' }, { status: 500 });
  }
}
