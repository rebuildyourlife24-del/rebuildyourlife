import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes die beschermd zijn — alleen toegankelijk met geldige sessie
const PROTECTED_ROUTES = ['/dashboard'];

// Routes die alleen toegankelijk zijn als je NIET bent ingelogd
const AUTH_ROUTES = ['/auth/login', '/auth/register', '/auth/forgot-password'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const sessionCookie = request.cookies.get('ryl_session');
  const isLoggedIn = !!sessionCookie?.value;

  // Check of dit een beschermde route is
  const isProtectedRoute = PROTECTED_ROUTES.some(route =>
    pathname.startsWith(route)
  );

  // Check of dit een auth-only route is
  const isAuthRoute = AUTH_ROUTES.some(route =>
    pathname.startsWith(route)
  );

  // Niet ingelogd en probeer beschermde route te bezoeken → naar login
  if (!isLoggedIn && isProtectedRoute) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Al ingelogd en probeer login/register te bezoeken → naar dashboard
  if (isLoggedIn && isAuthRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Alle routes behalve static files en API routes
    '/((?!_next/static|_next/image|favicon.ico|api/).*)',
  ],
};
