import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "SUPREME_OVERSEER_FALLBACK_SECRET_KEY_2026");

export default async function proxy(request: NextRequest) {
  const sessionToken = request.cookies.get('orion_session')?.value;
  
  // Routes to protect
  if (request.nextUrl.pathname.startsWith('/hq') || request.nextUrl.pathname.startsWith('/ceo')) {
    if (!sessionToken) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      // Verify JWT
      await jwtVerify(sessionToken, JWT_SECRET);
      return NextResponse.next();
    } catch (error) {
      console.error('Invalid token in middleware', error);
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Redirect root to /hq (which will redirect to /login if not authenticated)
  if (request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/hq', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/hq/:path*', '/ceo/:path*', '/'],
};
