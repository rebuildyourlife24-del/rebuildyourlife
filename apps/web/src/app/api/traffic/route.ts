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

    const credits = await TrafficService.getUserCredits(userId);
    return NextResponse.json({
      status: 'success',
      data: { credits }
    });
  } catch (error: any) {
    console.error('Error fetching credits:', error);
    return NextResponse.json({ error: 'Failed to fetch credits' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { credits } = body;

    if (!credits || typeof credits !== 'number' || credits < 100) {
      return NextResponse.json({ error: 'Invalid credit amount. Minimum is 100.' }, { status: 400 });
    }

    const checkoutData = await TrafficService.createCreditsCheckout(userId, credits);
    return NextResponse.json({
      status: 'success',
      data: checkoutData
    });
  } catch (error: any) {
    console.error('Error buying credits:', error);
    return NextResponse.json({ error: 'Failed to buy credits' }, { status: 500 });
  }
}
