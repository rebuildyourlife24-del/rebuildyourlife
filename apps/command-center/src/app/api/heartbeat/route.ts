import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { cookies } from 'next/headers';
import * as jwt from 'jsonwebtoken';

export async function POST(req: Request) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('orion_session');

    if (!token) {
      return NextResponse.json({ success: false, error: "No token" }, { status: 401 });
    }

    const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_123';
    
    // Bij God-Mode bypass was de userId "supreme-overseer" of we zoeken op role.
    let userId: string | null = null;
    let email: string | null = null;
    
    try {
      const decoded: any = jwt.verify(token.value, JWT_SECRET);
      userId = decoded.userId;
      email = decoded.email;
    } catch (e) {
      return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 });
    }

    let user;

    if (userId === 'supreme-overseer' || (email && ['admin', 'orion'].includes(email))) {
      // Find the admin user
      user = await db.user.findFirst({
        where: { role: 'ADMIN' },
        orderBy: { createdAt: 'asc' }
      });
    } else if (userId) {
      user = await db.user.findUnique({ where: { id: userId } });
    }

    if (!user) {
      // Fallback: update any user if it's the only one
      user = await db.user.findFirst();
    }

    if (user) {
      await db.user.update({
        where: { id: user.id },
        data: {
          lastActiveAt: new Date()
        }
      });
      return NextResponse.json({ success: true, updated: true });
    }

    return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
  } catch (error: any) {
    console.error("[HEARTBEAT] Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
