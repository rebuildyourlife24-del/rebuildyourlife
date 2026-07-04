import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const hostname = request.headers.get('host') || '';

  // Bepaal of we op het exclusieve ai-henksemler.nl domein zitten
  const isAiHenksemler = hostname.includes('ai-henksemler.nl') || hostname.includes('localhost') || hostname.includes('192.168');

  // Enforce Domain Access voor /ceo en /klanten
  if ((url.pathname.startsWith('/ceo') || url.pathname.startsWith('/klanten')) && !isAiHenksemler) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  let response = NextResponse.next();

  // Routeer naar agency page als we op het ai-henksemler domein zitten en we zitten in de root `/`
  if (isAiHenksemler && url.pathname === '/') {
    response = NextResponse.rewrite(new URL(`/agency`, request.url));
  }

  // Affiliate & Partner Tracking
  const ref = url.searchParams.get('ref');
  const sponsor = url.searchParams.get('sponsor');

  // Zet de ref cookie (directe sale) voor 30 dagen
  if (ref) {
    response.cookies.set('ryl_affiliate_ref', ref, {
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      sameSite: 'lax'
    });
  }

  // Zet de sponsor cookie (netwerk werving) voor 30 dagen
  if (sponsor) {
    response.cookies.set('ryl_affiliate_sponsor', sponsor, {
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      sameSite: 'lax'
    });
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
