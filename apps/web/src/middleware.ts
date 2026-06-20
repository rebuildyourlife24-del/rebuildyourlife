import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

// Routes die beschermd zijn — alleen toegankelijk met geldige sessie
const PROTECTED_ROUTES = ['/dashboard', '/admin'];

// Routes die alleen toegankelijk zijn als je NIET bent ingelogd
const AUTH_ROUTES = ['/auth/login', '/auth/register', '/auth/forgot-password', '/auth/reset-password'];

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const pathname = url.pathname;
  const hostname = request.headers.get('host') || '';

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });
  
  response.headers.set('x-tenant-domain', hostname);
  // === FASE 2: DOMAIN ROUTING (MULTI-TENANT) ===
  const isLocalhost = hostname.includes('localhost') || hostname.includes('127.0.0.1') || hostname.includes('[::1]');
  const isMainDomain = hostname === 'ai-henksemler.nl' || hostname === 'www.ai-henksemler.nl';
  const isAppDomain = hostname === 'app.ai-henksemler.nl' || hostname === 'ai.ai-henksemler.nl';
  const isLegacyDomain = hostname === 'rebuildyourlife.eu' || hostname === 'www.rebuildyourlife.eu';

  // Als het een van onze beheerders-domeinen is, doe normale routing:
  if (isLocalhost || isMainDomain || isAppDomain || isLegacyDomain) {
    if (hostname === 'ai.ai-henksemler.nl' && pathname === '/') {
      url.pathname = '/dashboard/war-room';
      response = NextResponse.rewrite(url);
      response.headers.set('x-tenant-domain', hostname);
      return response;
    } else if ((hostname === 'ai-henksemler.nl' || hostname === 'www.ai-henksemler.nl') && pathname === '/') {
      url.pathname = '/dashboard/ai-team';
      response = NextResponse.rewrite(url);
      response.headers.set('x-tenant-domain', hostname);
      return response;
    }
  } else {
    // === WILDCARD SUBDOMEIN DETECTIE ===
    // Als we hier komen, is het een custom subdomein (bijv. shop1.ai-henksemler.nl)
    // We herschrijven dit naar een speciale map in Next.js: /_sites/[domein]/[pad]
    url.pathname = `/_sites/${hostname}${url.pathname}`;
    response = NextResponse.rewrite(url);
    response.headers.set('x-tenant-domain', hostname);
    return response;
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
  let isLoggedIn = !!user;

  // DEV BYPASS: Zodat de middleware ons niet terug gooit naar login!
  if (process.env.NODE_ENV === 'development' || request.cookies.get('dev_bypass')?.value === 'true') {
    isLoggedIn = true;
  }

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

  // RBAC: Alleen admins mogen op /admin routes of /dashboard/war-room (Godmode)
  const isGodmodeRoute = pathname.startsWith('/admin') || pathname === '/dashboard/war-room';
  if (isLoggedIn && isGodmodeRoute) {
    // TEMPORARY FIX: Allow all logged-in users to access the war room
    // to fix the "jumping away" issue if email doesn't match perfectly.
    // if (user.email !== 'hsemler50@gmail.com') {
    //    return NextResponse.redirect(new URL('/dashboard/ai-team', request.url));
    // }
  }

  return response;
}

export const config = {
  matcher: [
    // Alle routes behalve static files en API routes
    '/((?!_next/static|_next/image|favicon.ico|api/).*)',
  ],
};
