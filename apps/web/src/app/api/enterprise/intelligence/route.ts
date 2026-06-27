import { NextResponse } from 'next/server';
import { prisma } from '@rebuildyourlife/database';
import { routeAIRequest } from '@/lib/ai-router';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET! || 'secret';

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("ryl_session")?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    let userId;
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      userId = decoded.userId;
    } catch {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { subject } = await req.json();
    if (!subject) {
      return NextResponse.json({ error: 'Geen onderwerp opgegeven.' }, { status: 400 });
    }

    const prompt = `Je bent de Imperial Intelligence Motor van The Sovereign Grid. 
    Schrijf een uitgebreid 5-delig marktonderzoek over: ${subject}. 
    Het moet professioneel, meedogenloos en strategisch zijn. 
    Gebruik Markdown voor opmaak. 
    Focus op macro-economische trends, risico's en kansen voor investeerders.`;

    const aiRes = await routeAIRequest([{ role: 'user', content: prompt }]);

    const doc = await prisma.document.create({
      data: {
        userId,
        title: `Intelligence Report: ${subject}`,
        type: 'INTELLIGENCE_REPORT',
        content: aiRes.content
      }
    });

    return NextResponse.json({ success: true, document: doc });
  } catch (error: any) {
    console.error('[INTELLIGENCE ERROR]', error);
    return NextResponse.json({ error: 'Fout bij genereren dossier' }, { status: 500 });
  }
}
