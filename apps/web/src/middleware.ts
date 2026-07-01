import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const hostname = request.headers.get('host') || '';

  // Bepaal of het ai-henksemler.nl is (of localhost alias voor testen)
  const isAgencyDomain = hostname.includes('ai-henksemler.nl');

  // Als we op het agency domein zitten en we zitten in de root `/`, 
  // routeer dan stilletjes door naar de `/agency` map.
  if (isAgencyDomain) {
    // Voorkom loops als we al in /agency zitten
    if (!url.pathname.startsWith('/agency') && !url.pathname.startsWith('/api') && !url.pathname.startsWith('/_next') && !url.pathname.startsWith('/auth')) {
      // Rewrite to /agency/[pathname]
      const rewriteUrl = new URL(`/agency${url.pathname === '/' ? '' : url.pathname}`, request.url);
      return NextResponse.rewrite(rewriteUrl);
    }
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
