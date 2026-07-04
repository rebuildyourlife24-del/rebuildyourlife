'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function loginAction(formData: FormData) {
  const password = formData.get('password') as string;
  const validToken = process.env.RD_ADMIN_SECRET || 'fallback-secret-for-dev';

  if (password === validToken) {
    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set('rd_admin_token', password, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });
    
    redirect('/');
  } else {
    throw new Error('Invalid secret');
  }
}
