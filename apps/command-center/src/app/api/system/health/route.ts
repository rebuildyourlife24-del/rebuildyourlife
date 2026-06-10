import { NextResponse } from 'next/server';

export async function GET() {
  const missingKeys: string[] = [];

  if (!process.env.OPENAI_API_KEY) missingKeys.push('OPENAI_API_KEY');
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) missingKeys.push('GOOGLE_GENERATIVE_AI_API_KEY');
  if (!process.env.DATABASE_URL) missingKeys.push('DATABASE_URL');

  if (missingKeys.length > 0) {
    return NextResponse.json({
      status: 'error',
      message: `Ontbrekende API Keys gedetecteerd: ${missingKeys.join(', ')}. Orion kan niet optimaal functioneren.`,
      missingKeys
    }, { status: 200 }); // Return 200 so the frontend can parse the error gracefully
  }

  return NextResponse.json({
    status: 'ok',
    message: 'Alle systemen nominaal. API verbindingen actief.'
  });
}
