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

export async function POST(req: Request) {
  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { purchaseId } = body;

    if (!purchaseId) {
      return NextResponse.json({ error: 'Missing purchaseId' }, { status: 400 });
    }

    const purchase = await TrafficService.completePurchase(purchaseId);
    if (!purchase) {
      return NextResponse.json({ error: 'Purchase not found or already processed' }, { status: 404 });
    }

    return NextResponse.json({
      status: 'success',
      data: purchase
    });
  } catch (error: any) {
    console.error('Error completing purchase:', error);
    return NextResponse.json({ error: 'Failed to complete purchase' }, { status: 500 });
  }
}
