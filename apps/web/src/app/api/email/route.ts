import { NextRequest, NextResponse } from 'next/server';

// Let op: Voor productie heb je `npm i resend` nodig en een geldige RESEND_API_KEY
// import { Resend } from 'resend';
// const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { to, subject, htmlContent } = await req.json();

    if (!to || !subject || !htmlContent) {
      return NextResponse.json({ error: 'Missing required fields: to, subject, htmlContent' }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      console.warn("RESEND_API_KEY ontbreekt. E-mail wordt gesimuleerd.");
      console.log(`[SIMULATION EMAIL] Naar: ${to} | Onderwerp: ${subject}`);
      // Simuleer een succesvolle verzending voor testdoeleinden
      return NextResponse.json({ success: true, message: 'Email gesimuleerd (geen API key)' }, { status: 200 });
    }

    // --- ECHTE VERZENDING (Als Resend is geïnstalleerd en key aanwezig is) ---
    // const data = await resend.emails.send({
    //   from: 'Sovereign OS <onboarding@rebuildyourlife.eu>',
    //   to: [to],
    //   subject: subject,
    //   html: htmlContent,
    // });
    
    // Fallback voor nu: gebruik standaard fetch naar Resend API (vereist geen npm package!)
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        from: 'Sovereign OS <onboarding@rebuildyourlife.eu>', // Je geverifieerde Resend domein
        to: [to],
        subject: subject,
        html: htmlContent,
      })
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Resend API error:", errorText);
      throw new Error("Fout bij versturen via Resend");
    }

    const data = await res.json();
    return NextResponse.json({ success: true, id: data.id }, { status: 200 });

  } catch (error: any) {
    console.error('Email API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
