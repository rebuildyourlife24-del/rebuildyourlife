import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const pathname = url.pathname;
  let hostname = request.headers.get('host') || '';

  // Strip port if present (e.g. localhost:3000) for local testing
  if (hostname.includes(':')) {
    hostname = hostname.split(':')[0];
  }

  // Remove www. prefix for consistent checking
  const cleanHostname = hostname.replace('www.', '');

  // Setup response with tenant header
  const response = NextResponse.next({
    request: { headers: request.headers },
  });
  response.headers.set('x-tenant-domain', cleanHostname);

  // ══════════════════════════════════════════════════════════════
  // GEO-IP & GLOBAL EXPANSION ROUTING
  // ══════════════════════════════════════════════════════════════
  const country = request.geo?.country || request.headers.get('x-vercel-ip-country') || 'NL';
  response.headers.set('x-user-country', country);

  // Simple currency assignment based on country
  let currency = 'EUR';
  if (['US', 'CA', 'AU'].includes(country)) currency = 'USD';
  if (country === 'GB') currency = 'GBP';
  if (country === 'JP') currency = 'JPY';
  response.headers.set('x-user-currency', currency);

  // ══════════════════════════════════════════════════════════════
  // DOMAIN ROUTING LOGIC
  // ══════════════════════════════════════════════════════════════

  // Helper to maintain auth headers during rewrites
  const createRewrite = (newPath: string) => {
    url.pathname = newPath;
    const rewriteRes = NextResponse.rewrite(url, {
      request: { headers: request.headers },
    });
    rewriteRes.headers.set('x-tenant-domain', cleanHostname);
    return rewriteRes;
  };

  // 1. DASHBOARD DOMAIN (ai-henksemler.nl)
  if (cleanHostname === 'ai-henksemler.nl') {
    if (pathname === '/') return createRewrite('/dashboard');
    return response;
  }

  // 2. AI ASSISTANT DOMAIN (ai.ai-henksemler.nl)
  if (cleanHostname === 'ai.ai-henksemler.nl') {
    if (pathname === '/') return createRewrite('/dashboard/ai-assistant');
    return response;
  }

  // 3. FRONTEND PLATFORM DOMAIN (rebuildyourlife.eu)
  if (cleanHostname === 'rebuildyourlife.eu') {
    // Normal routing to frontpage / app
    return response;
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api/ (API routes - we let them handle their own security)
     */
    '/((?!_next/static|_next/image|favicon.ico|api/).*)',
  ],
};
