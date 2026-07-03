import { NextResponse } from 'next/server';
import { prisma } from '@rebuildyourlife/database';

export async function GET() {
  try {
    // Haal de eerste user op (omdat we in deze MVP uitgaan van 1 hoofd-user)
    const user = await prisma.user.findFirst();
    
    if (!user) {
      return NextResponse.json({ error: 'No user found' }, { status: 404 });
    }

    const settings = user.settings ? JSON.parse(user.settings) : {};
    return NextResponse.json(settings);
  } catch (error: any) {
    return NextResponse.json({ error: 'Fout bij ophalen instellingen' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    const user = await prisma.user.findFirst();
    if (!user) {
      return NextResponse.json({ error: 'No user found' }, { status: 404 });
    }

    // Merge nieuwe settings met bestaande
    const currentSettings = user.settings ? JSON.parse(user.settings) : {};
    const newSettings = { ...currentSettings, ...body };

    await prisma.user.update({
      where: { id: user.id },
      data: { settings: JSON.stringify(newSettings) }
    });

    return NextResponse.json({ success: true, settings: newSettings });
  } catch (error: any) {
    return NextResponse.json({ error: 'Fout bij opslaan instellingen' }, { status: 500 });
  }
}
