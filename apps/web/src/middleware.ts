import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const pathname = url.pathname;
  const hostname = request.headers.get('host') || '';

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Bepaal domeinen
  const isAiHenksemler = hostname.includes('ai-henksemler.nl') || hostname.includes('localhost') || hostname.includes('192.168');
  
  if (isAiHenksemler && pathname === '/') {
    return response;
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api/).*)',
  ],
};
