import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { prisma } from '@rebuildyourlife/database';

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-jwt-key-2026-rebuild";

export async function GET(req: Request) {
  try {
    // Authenticate the user starting the OAuth flow
    const cookieStore = await cookies();
    const token = cookieStore.get("ryl_session")?.value;
    
    if (!token) {
      return NextResponse.redirect(new URL('/login?error=unauthorized_mollie_connect', req.url));
    }

    let userId: string;
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      userId = decoded.userId;
    } catch (err) {
      return NextResponse.redirect(new URL('/login?error=invalid_session', req.url));
    }

    const clientId = process.env.MOLLIE_CLIENT_ID;
    if (!clientId) {
      return NextResponse.json({ error: "Mollie Client ID is not configured" }, { status: 500 });
    }

    // Genereer een random "state" string om CSRF attacks te voorkomen, en sla deze + userId op
    // Voor nu sturen we de userId en een random hash simpelweg als state mee in Base64 (of Redis in productie)
    const randomHash = crypto.randomBytes(16).toString('hex');
    const stateObj = { userId, hash: randomHash };
    const stateString = Buffer.from(JSON.stringify(stateObj)).toString('base64');

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://rebuildyourlife.eu";
    const redirectUri = `${appUrl}/api/mollie/callback`;

    // Mollie OAuth Scopes: 
    // organizations.read (to get the organizationId for routing)
    // payments.write (to create payments on their behalf)
    // profiles.read (to get profile info)
    const scopes = "organizations.read payments.read payments.write profiles.read";

    const mollieAuthUrl = new URL("https://my.mollie.com/oauth2/authorize");
    mollieAuthUrl.searchParams.set("client_id", clientId);
    mollieAuthUrl.searchParams.set("redirect_uri", redirectUri);
    mollieAuthUrl.searchParams.set("state", stateString);
    mollieAuthUrl.searchParams.set("scope", scopes);
    mollieAuthUrl.searchParams.set("response_type", "code");
    mollieAuthUrl.searchParams.set("approval_prompt", "auto"); // of 'force'

    return NextResponse.redirect(mollieAuthUrl.toString());

  } catch (error: any) {
    console.error("Mollie Connect Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
