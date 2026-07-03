import { NextResponse } from 'next/server';
import { prisma } from '@rebuildyourlife/database';

export async function POST(req: Request) {
  try {
    // Inbound Parse Webhooks (like SendGrid/Postmark) usually send multipart/form-data or JSON
    // We'll support JSON for this implementation
    const body = await req.json();

    // Standard Inbound Parse payload extraction (Generic mapping)
    const sender = body.From || body.sender;
    const recipient = body.To || body.recipient;
    const subject = body.Subject || body.subject;
    const emailBody = body['Body-Plain'] || body.body_plain || body.text || body.content;

    if (!sender || !emailBody) {
      return NextResponse.json({ error: 'Missing essential email fields (sender or body)' }, { status: 400 });
    }

    console.log(`[INBOUND EMAIL] Nieuwe e-mail ontvangen van ${sender} gericht aan ${recipient}. Onderwerp: "${subject}"`);

    // Stuur de inhoud direct naar Godbrain
    const godbrainResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/godbrain/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'PROCESS_SUPPORT_EMAIL',
        source: 'INBOUND_EMAIL_WEBHOOK',
        payload: {
          senderEmail: sender,
          recipientEmail: recipient,
          subject: subject,
          body: emailBody
        }
      })
    });

    const result = await godbrainResponse.json();

    return NextResponse.json({ 
      success: true, 
      message: 'Email succesvol doorgestuurd naar AI Klantenservice Agent (Godbrain)',
      godbrain: result 
    });

  } catch (error: any) {
    console.error('[INBOUND EMAIL ERROR]', error);
    return NextResponse.json({ error: 'Interne fout bij verwerken van email', details: error.message }, { status: 500 });
  }
}
