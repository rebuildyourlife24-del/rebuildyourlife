import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  // Clear Supabase Session
  try {
    const supabase = await createServerClient();
    await supabase.auth.signOut();
  } catch (err) {
    console.warn("Supabase signout failed during logout", err);
  }

  // Clear Custom Cookies
  const cookieStore = await cookies();
  cookieStore.delete('ryl_session');
  cookieStore.delete('dev_bypass');

  // Hard Redirect to Login Page
  return NextResponse.redirect(new URL('/auth/login', request.url));
}
