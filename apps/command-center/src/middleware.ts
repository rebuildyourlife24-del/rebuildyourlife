import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "SUPREME_OVERSEER_FALLBACK_SECRET_KEY_2026");

export async function middleware(request: NextRequest) {
  const sessionToken = request.cookies.get('orion_session')?.value;
  const hostname = request.headers.get('host') || '';
  const isEnterpriseDomain = hostname.includes('enterprise.ai-henksemler.nl');
  
  // If user accesses the enterprise domain at the root path, rewrite to /seo
  if (isEnterpriseDomain && request.nextUrl.pathname === '/') {
    const url = request.nextUrl.clone();
    url.pathname = '/seo';
    return NextResponse.rewrite(url);
  }

  // Routes to protect
  if (
    request.nextUrl.pathname.startsWith('/hq') || 
    request.nextUrl.pathname.startsWith('/ceo') || 
    request.nextUrl.pathname.startsWith('/seo') ||
    isEnterpriseDomain
  ) {
    // Exclude the login page itself from the redirect loop
    if (request.nextUrl.pathname === '/login') {
      return NextResponse.next();
    }

    if (!sessionToken) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      // Verify JWT
      await jwtVerify(sessionToken, JWT_SECRET);
    } catch (error) {
      console.error('Invalid token in middleware', error);
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Redirect root to /hq for normal domain (if not authenticated it will bounce to /login)
  if (!isEnterpriseDomain && request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/hq', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
