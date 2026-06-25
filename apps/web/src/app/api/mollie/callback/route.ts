import { NextResponse } from 'next/server';
import { prisma } from '@rebuildyourlife/database';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const code = url.searchParams.get("code");
    const stateStr = url.searchParams.get("state");
    const error = url.searchParams.get("error");

    if (error) {
      console.error("[MOLLIE CALLBACK] User denied OAuth access or error occurred:", error);
      return NextResponse.redirect(new URL('/dashboard?error=mollie_connect_failed', req.url));
    }

    if (!code || !stateStr) {
      return NextResponse.redirect(new URL('/dashboard?error=missing_mollie_params', req.url));
    }

    // Decode state
    let stateObj;
    try {
      stateObj = JSON.parse(Buffer.from(stateStr, 'base64').toString('utf-8'));
    } catch (e) {
      return NextResponse.redirect(new URL('/dashboard?error=invalid_state', req.url));
    }

    const userId = stateObj.userId;
    if (!userId) {
      return NextResponse.redirect(new URL('/dashboard?error=invalid_user', req.url));
    }

    const clientId = process.env.MOLLIE_CLIENT_ID;
    const clientSecret = process.env.MOLLIE_CLIENT_SECRET;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://rebuildyourlife.eu";
    const redirectUri = `${appUrl}/api/mollie/callback`;

    if (!clientId || !clientSecret) {
      throw new Error("Mollie OAuth credentials missing in environment.");
    }

    // 1. Wissel de 'code' in voor een Access Token via Mollie
    // (We gebruiken basic auth voor de client credentials)
    const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    
    const tokenResponse = await fetch("https://api.mollie.com/oauth2/tokens", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Basic ${basicAuth}`
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: redirectUri
      })
    });

    if (!tokenResponse.ok) {
      const errData = await tokenResponse.text();
      console.error("[MOLLIE CALLBACK] Token exchange failed:", errData);
      return NextResponse.redirect(new URL('/dashboard?error=mollie_token_exchange_failed', req.url));
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;
    const refreshToken = tokenData.refresh_token;

    // 2. Haal het Organization ID van de Franchise-nemer op
    // Dit hebben we nodig voor de Split Payments (routing naar hun account)
    const orgResponse = await fetch("https://api.mollie.com/v2/organizations/me", {
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    });

    if (!orgResponse.ok) {
      console.error("[MOLLIE CALLBACK] Failed to fetch organization info:", await orgResponse.text());
      return NextResponse.redirect(new URL('/dashboard?error=mollie_org_fetch_failed', req.url));
    }

    const orgData = await orgResponse.json();
    const organizationId = orgData.id;

    // 3. Sla alles op in de database bij de User
    await prisma.user.update({
      where: { id: userId },
      data: {
        mollieAccessToken: accessToken,
        mollieRefreshToken: refreshToken,
        mollieOrganizationId: organizationId
      }
    });

    console.log(`[MOLLIE CONNECT] Successfully connected Mollie for user ${userId} (Org: ${organizationId})`);

    // 4. Stuur terug naar het dashboard met een success parameter
    return NextResponse.redirect(new URL('/dashboard?success=mollie_connected', req.url));

  } catch (error: any) {
    console.error("[MOLLIE CALLBACK] Internal Error:", error);
    return NextResponse.redirect(new URL('/dashboard?error=mollie_internal_error', req.url));
  }
}
