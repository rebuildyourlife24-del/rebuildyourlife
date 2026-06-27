import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { prisma } from "@rebuildyourlife/database";
import jwt from 'jsonwebtoken';


const JWT_SECRET = process.env.JWT_SECRET! || "fallback";
if (!JWT_SECRET) throw new Error('JWT_SECRET is missing');

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) { return cookieStore.get(name)?.value; },
          set(name: string, value: string, options: any) { cookieStore.set({ name, value, ...options }); },
          remove(name: string, options: any) { cookieStore.set({ name, value: '', ...options }); },
        },
      }
    );
    
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (data.session && data.session.user) {
      const email = data.session.user.email;
      if (email) {
        // Zorg dat de gebruiker in onze eigen Prisma database bestaat
        const user = await prisma.user.upsert({
          where: { email },
          update: {
            // we kunnen hier bijwerken als we willen
          },
          create: {
            id: data.session.user.id,
            email,
            passwordHash: '', // Geen wachtwoord nodig want Google Auth
            firstName: data.session.user.user_metadata?.full_name?.split(' ')[0] || '',
            lastName: data.session.user.user_metadata?.full_name?.split(' ').slice(1).join(' ') || '',
            role: email === 'hsemler50@gmail.com' ? 'SUPER_ADMIN' : 'USER',
            subscriptionTier: email === 'hsemler50@gmail.com' ? 'ENTERPRISE' : 'FREE',
          }
        });

        // Maak het systeem-token aan
        const token = jwt.sign({ userId: user.id }, JWT_SECRET);
        
        // Zet de cookie
        cookieStore.set('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/'
        });
      }
    }
  }

  return NextResponse.redirect(new URL('/dashboard/war-room', request.url));
}

