import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

// Routes die beschermd zijn — alleen toegankelijk met geldige sessie
const PROTECTED_ROUTES = ['/dashboard', '/admin'];

// Routes die alleen toegankelijk zijn als je NIET bent ingelogd
const AUTH_ROUTES = ['/auth/login', '/auth/register', '/auth/forgot-password', '/auth/reset-password'];

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const url = request.nextUrl.clone();
  const pathname = url.pathname;
  const hostname = request.headers.get('host') || '';

  // === FASE 2: DOMAIN ROUTING ===
  if (hostname === 'ai.ai-henksemler.nl') {
    if (pathname === '/') {
      url.pathname = '/dashboard/war-room';
      return NextResponse.rewrite(url);
    }
  } else if (hostname === 'ai-henksemler.nl' || hostname === 'www.ai-henksemler.nl') {
    if (pathname === '/') {
      url.pathname = '/dashboard/ai-team';
      return NextResponse.rewrite(url);
    }
  } else if (hostname === 'rebuildyourlife.eu' || hostname === 'www.rebuildyourlife.eu') {
    if (pathname === '/') {
      url.pathname = '/dashboard';
      return NextResponse.rewrite(url);
    }
  }

  // === SUPABASE AUTHENTICATIE ===
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({
            request: { headers: request.headers },
          });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          request.cookies.set({ name, value: '', ...options });
          response = NextResponse.next({
            request: { headers: request.headers },
          });
          response.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const isLoggedIn = !!user;

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
    return NextResponse.redirect(new URL('/dashboard/war-room', request.url));
  }

  // RBAC: Alleen admins mogen op /admin routes
  if (isLoggedIn && pathname.startsWith('/admin')) {
    // We checken de rol uit de user_metadata (ingesteld tijdens login of via database sync)
    // Omdat middleware edge-compatible moet zijn en we geen Prisma kunnen draaien hier,
    // vertrouwen we op Supabase JWT of sturen we door naar een client-side check.
    // Dit is een simpele check voor nu:
    if (user.email !== 'hsemler50@gmail.com') {
       return NextResponse.redirect(new URL('/dashboard/war-room', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    // Alle routes behalve static files en API routes
    '/((?!_next/static|_next/image|favicon.ico|api/).*)',
  ],
};
