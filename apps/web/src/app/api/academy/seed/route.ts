import { NextResponse } from 'next/server';
import { prisma } from '@rebuildyourlife/database';

export async function GET() {
  try {
    await prisma.course.createMany({
      data: [
        {
          title: 'Module 1: Ontsnappen uit de Matrix',
          description: 'Leer hoe je je mindset herprogrammeert, schulden vernietigt en controle pakt over je financiële toekomst.',
          tierAccess: 'FREE',
          order: 1
        },
        {
          title: 'Module 2: Jouw Eerste Werkopdracht',
          description: 'De ultieme gids om the Opportunity Engine te gebruiken. Hoe je 10x sneller werkt met AI tools.',
          tierAccess: 'PREMIUM',
          order: 2
        },
        {
          title: 'Module 3: Syndicate Capital',
          description: 'Gevorderde strategieën voor het meebouwen aan assets, investeren en compounding weath.',
          tierAccess: 'PREMIUM',
          order: 3
        }
      ]
    });

    return NextResponse.json({ success: true, message: 'Academy seeded' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to seed academy' }, { status: 500 });
  }
}
