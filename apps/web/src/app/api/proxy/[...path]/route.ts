import { NextRequest, NextResponse } from 'next/server';

// The URL of our internal Node.js/Express Modular Monolith
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

/**
 * Fase E3: Backend For Frontend (BFF) Proxy
 * 
 * This file acts as the ultimate security boundary.
 * The browser UI never talks directly to the Express Monolith. 
 * Instead, it talks to `/api/proxy/*` on the Next.js frontend.
 * 
 * Why?
 * 1. Security: We can attach server-side HTTP-only cookies here without exposing tokens to XSS.
 * 2. Shaping: We can format error responses before the UI sees them.
 * 3. Logging: We can log frontend network activity centrally.
 */

async function handleProxy(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  try {
    const resolvedParams = await params;
    const path = resolvedParams.path.join('/');
    const targetUrl = `${API_URL}/${path}`;
    
    // Extract search params
    const searchParams = req.nextUrl.search;
    const finalUrl = `${targetUrl}${searchParams}`;

    // Extract headers (Filter out host, connection, etc to prevent conflicts)
    const headers = new Headers();
    req.headers.forEach((value, key) => {
      if (!['host', 'connection'].includes(key.toLowerCase())) {
        headers.set(key, value);
      }
    });

    // BFF Injection: Here we would inject the secure HttpOnly cookie as a Bearer token
    // For now, we just pass through what we have, but the architecture is ready.
    headers.set('X-Client-Type', 'ui'); // For D0.2 API Gateway shaping

    const fetchOptions: RequestInit = {
      method: req.method,
      headers,
      // Pass body if not GET/HEAD
      body: ['GET', 'HEAD'].includes(req.method) ? undefined : await req.blob(),
      // Disable caching for proxy
      cache: 'no-store', 
    };

    const response = await fetch(finalUrl, fetchOptions);

    // Stream the response back to the client
    const resHeaders = new Headers(response.headers);
    
    return new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: resHeaders,
    });

  } catch (error) {
    console.error('[BFF Proxy Error]', error);
    return NextResponse.json(
      { error: { code: 'BFF_ERROR', message: 'Failed to proxy request to internal monolith.' } },
      { status: 502 }
    );
  }
}

export const GET = handleProxy;
export const POST = handleProxy;
export const PUT = handleProxy;
export const DELETE = handleProxy;
export const PATCH = handleProxy;
