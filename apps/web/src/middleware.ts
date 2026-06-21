import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default async function middleware(request: NextRequest) {
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
    // WILDCARD SUBDOMEIN DETECTIE
    url.pathname = `/_sites/${hostname}${url.pathname}`;
    response = NextResponse.rewrite(url);
    response.headers.set('x-tenant-domain', hostname);
    return response;
  }

  // THE SOVEREIGN GRID: NO-AUTH PROTOCOL ACTIVE
  // We explicitly removed all Supabase Auth checks.
  // The site is fully public for demonstration and testing.

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api/).*)',
  ],
};
