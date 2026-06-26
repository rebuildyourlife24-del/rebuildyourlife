import { NextResponse } from 'next/server';
import { prisma } from '@rebuildyourlife/database';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("ryl_session")?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    let userId;
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      userId = decoded.userId;
    } catch {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, action } = await req.json();

    if (!id || !action) {
      return NextResponse.json({ error: 'Missing id or action' }, { status: 400 });
    }

    const newStatus = action === 'approve' ? 'PUBLISHED' : 'REJECTED';

    const updated = await prisma.socialMediaPost.update({
      where: { id },
      data: { status: newStatus }
    });

    return NextResponse.json({ success: true, post: updated });
  } catch (error: any) {
    console.error('Error updating QC action:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
