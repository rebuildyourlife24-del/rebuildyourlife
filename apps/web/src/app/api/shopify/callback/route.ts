import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const shop = searchParams.get('shop');

    if (!code || !shop) {
      return NextResponse.json({ error: 'Missing code or shop parameter' }, { status: 400 });
    }

    // De NIEUWE sleutels
    const client_id = "7c382304bbc740d7028137d3ddfa6632";
    const client_secret = "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";

    // Exchange the code for an access token
    const tokenResponse = await fetch(`https://${shop}/admin/oauth/access_token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id,
        client_secret,
        code
      })
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error("Failed to exchange token:", errorText);
      return NextResponse.json({ error: 'OAuth exchange failed', details: errorText }, { status: 500 });
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Hardcoded Godmode user
    const TEST_USER_ID = "00000000-0000-0000-0000-000000000000";

    let user = await db.user.findUnique({ where: { id: TEST_USER_ID }});
    if (!user) {
      user = await db.user.create({
        data: {
          id: TEST_USER_ID,
          email: "ceo@godmode.com",
          firstName: "Supreme",
          lastName: "Overseer",
          passwordHash: "hashedpassword",
          role: "USER"
        }
      });
    }

    // Clean URL
    const cleanUrl = shop.replace('https://', '').replace('http://', '').replace(/\/$/, '');

    // Sla op in Franchise
    await db.shopifyStore.upsert({
      where: {
        userId_shopUrl: {
          userId: user.id,
          shopUrl: cleanUrl,
        }
      },
      update: {
        accessToken: accessToken,
      },
      create: {
        shopUrl: cleanUrl,
        accessToken: accessToken,
        userId: user.id,
        status: 'ACTIVE'
      }
    });

    return NextResponse.redirect(new URL('/dashboard/war-room', request.url));

  } catch (error: any) {
    console.error('Shopify Callback Error:', error);
    return NextResponse.json({ error: 'System error during callback', message: error.message }, { status: 500 });
  }
}
