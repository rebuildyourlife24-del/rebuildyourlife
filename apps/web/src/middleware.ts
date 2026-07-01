import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const hostname = request.headers.get('host') || '';

  // Bepaal of we op het exclusieve ai-henksemler.nl domein zitten
  const isAiHenksemler = hostname.includes('ai-henksemler.nl') || hostname.includes('localhost:3000');

  // Enforce Domain Access voor /ceo en /klanten
  if ((url.pathname.startsWith('/ceo') || url.pathname.startsWith('/klanten')) && !isAiHenksemler) {
    // Blokkeer toegang vanaf rebuildyourlife.eu
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Als we op het ai-henksemler domein zitten en we zitten in de root `/`, 
  // routeer dan naar de /agency map (de verkooppagina)
  if (isAiHenksemler && url.pathname === '/') {
    return NextResponse.rewrite(new URL(`/agency`, request.url));
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
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
