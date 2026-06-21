import { NextResponse } from 'next/server';
import { prisma } from '@rebuildyourlife/database';

export async function GET() {
  try {
    // Generate dummy opportunities
    await prisma.opportunity.createMany({
      data: [
        {
          title: 'SEO Optimalisatie B2B',
          description: 'Genereer 5 SEO artikelen met Agent Alpha voor TechFlow Inc.',
          payout: 150.00,
          category: 'SEO',
          status: 'AVAILABLE',
        },
        {
          title: 'Koude Lead Extractie (10k)',
          description: 'Scrape 10.000 leads in de Real Estate sector UAE.',
          payout: 85.00,
          category: 'LEAD_GEN',
          status: 'AVAILABLE',
        },
        {
          title: 'Social Media Management',
          description: 'Plan 14 posts in voor luxe horloge merk via BufferBot.',
          payout: 120.00,
          category: 'SOCIAL',
          status: 'AVAILABLE',
        },
        {
          title: 'Klantenservice Escalaties',
          description: 'Behandel 20 open tickets voor Apex Auto Accessoires.',
          payout: 45.00,
          category: 'SUPPORT',
          status: 'AVAILABLE',
        }
      ]
    });

    return NextResponse.json({ success: true, message: 'Opportunities seeded' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to seed' }, { status: 500 });
  }
}
