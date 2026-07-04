import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const hostname = request.headers.get('host') || '';

  const isAiHenksemler = hostname.includes('ai-henksemler.nl') || hostname.includes('localhost') || hostname.includes('192.168');

  if ((url.pathname.startsWith('/ceo') || url.pathname.startsWith('/klanten')) && !isAiHenksemler) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Geen rewrite naar /agency meer, dus de originele landingpagina (app/page.tsx) wordt geladen.
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
