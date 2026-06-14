import { NextResponse } from 'next/server';

export async function GET() {
  const dbUrl = process.env.DATABASE_URL || '';
  const maskedUrl = dbUrl.replace(/:([^:@]+)@/, ':***@');
  
  return NextResponse.json({ 
    url: maskedUrl,
    hasPgBouncer: dbUrl.includes('pgbouncer=true'),
    length: dbUrl.length,
    rawUser: dbUrl.split(':')[1]?.replace('//', '')
  });
}
