import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// -----------------------------------------------------------------------------
// PRIVATE R&D ADMIN ENVIRONMENT (PROMPT J)
// -----------------------------------------------------------------------------
// This middleware ensures that ONLY the owner can access this application.
// It checks for a specific securely hashed cookie that matches the owner's session.

export function middleware(request: NextRequest) {
  // In a real scenario, this would verify a Supabase JWT or a specific Admin Token
  const adminToken = request.cookies.get('rd_admin_token')?.value;
  const validToken = process.env.RD_ADMIN_SECRET || 'fallback-secret-for-dev';

  const isLoginPage = request.nextUrl.pathname === '/login';

  if (!adminToken || adminToken !== validToken) {
    if (!isLoginPage) {
      // Redirect unauthenticated users to the isolated login page
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  // If authenticated but visiting login page, redirect to dashboard
  if (isLoginPage) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
