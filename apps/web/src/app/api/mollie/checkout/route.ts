import { NextResponse } from 'next/server';
import { prisma } from "@rebuildyourlife/database";
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { createServerClient } from "@/lib/supabase/server";
import bcrypt from 'bcryptjs';


const JWT_SECRET = process.env.JWT_SECRET || "super-secret-jwt-key-2026-rebuild";

const TIER_MAPPING: Record<string, { amount: string; description: string; tier: string }> = {
  tier_ecom_50: {
    amount: "50.00",
    description: "RebuildYourLife Commerce Syndicate — Maandelijks abonnement",
    tier: "ECOM",
  },
  tier_tech_99: {
    amount: "99.00",
    description: "RebuildYourLife SaaS Protocol — Maandelijks abonnement",
    tier: "TECH",
  },
  tier_elite_1500: {
    amount: "1500.00",
    description: "RebuildYourLife Elite Team — Toegang & begeleiding",
    tier: "ELITE",
  },
  tier_elite_2000: {
    amount: "2000.00",
    description: "RebuildYourLife Sovereign Grid Elite — Eenmalig / Jaarlidmaatschap",
    tier: "ELITE",
  },
};

export async function POST(req: Request) {
  try {
    const { priceId, successUrl, cancelUrl, name, email, franchiseOwnerId } = await req.json();
    console.log("Onboarding Checkout Request:", { priceId, successUrl, cancelUrl, name, email, franchiseOwnerId });

    // 1. Resolve User
    let userId: string | null = null;

    // A. Check dev bypass cookie (for developer convenience)
    const cookieStore = await cookies();
    const devBypass = cookieStore.get('dev_bypass')?.value === 'true';
    
    // B. Check ryl_session JWT cookie (Omega Protocol)
    const token = cookieStore.get("ryl_session")?.value;
    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        userId = decoded.userId;
      } catch (err) {
        console.warn("JWT verification failed, falling back to Supabase auth:", err);
      }
    }

    // C. Check Supabase auth
    if (!userId) {
      try {
        const supabase = await createServerClient();
        const { data: { user: sbUser } } = await supabase.auth.getUser();
        if (sbUser) {
          userId = sbUser.id;
        }
      } catch (err) {
        console.warn("Supabase auth retrieval failed:", err);
      }
    }

    // D. If dev bypass is active and still no userId, fallback to a local test user
    if (!userId && (devBypass || process.env.NODE_ENV === 'development')) {
      const devUser = await prisma.user.findFirst({
        where: { email: email || 'hsemler50@gmail.com' }
      });
      if (devUser) {
        userId = devUser.id;
      }
    }

    // E. Resolve or create user by email from request body if still not resolved
    if (!userId && email) {
      const normalizedEmail = email.trim().toLowerCase();
      let dbUser = await prisma.user.findUnique({
        where: { email: normalizedEmail }
      });

      if (!dbUser) {
        const nameParts = (name || "").trim().split(/\s+/);
        const firstName = nameParts[0] || "Voornaam";
        const lastName = nameParts.slice(1).join(" ") || "Achternaam";
        
        // Generate secure random temp password
        const tempPassword = Math.random().toString(36).slice(-12) + "A1!";
        const passwordHash = await bcrypt.hash(tempPassword, 10);

        dbUser = await prisma.user.create({
          data: {
            email: normalizedEmail,
            passwordHash: passwordHash,
            firstName: firstName,
            lastName: lastName,
            role: normalizedEmail === 'hsemler50@gmail.com' ? 'SUPER_ADMIN' : 'USER',
            subscriptionTier: 'FREE',
            subscriptionStatus: 'ACTIVE',
            onboardingCompleted: false,
          }
        });
        console.log(`[ONBOARDING] Created new user in database: ${dbUser.email} (${dbUser.id})`);
      } else {
        console.log(`[ONBOARDING] Resolved existing user in database by email: ${dbUser.email} (${dbUser.id})`);
      }

      userId = dbUser.id;

      // Set cookie so the user is logged in
      const jwtToken = jwt.sign({ userId: dbUser.id }, JWT_SECRET);
      cookieStore.set('ryl_session', jwtToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/'
      });
      console.log(`[ONBOARDING] Set ryl_session cookie for user ${dbUser.email}`);
    }

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const planConfig = TIER_MAPPING[priceId] || TIER_MAPPING.tier_ecom_50;
    console.log(`[OMEGA PROTOCOL] Initiating Mollie Checkout for ${user.email} - Price: ${priceId} - Tier: ${planConfig.tier}`);

    const mollieKey = process.env.MOLLIE_API_KEY;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://rebuildyourlife.eu";

    if (!mollieKey || mollieKey.startsWith("test_REPLACE") || mollieKey === "") {
      // --- DEVELOPMENT / MOCK MODE ---
      console.log(`[DEV] Mollie API Key is missing or default. Simulating checkout for ${user.email}`);

      // Directly upgrade the user in the database in mock/dev mode
      await prisma.user.update({
        where: { id: user.id },
        data: {
          subscriptionTier: planConfig.tier,
          subscriptionStatus: "ACTIVE",
          onboardingCompleted: true,
          mollieCustomerId: "cst_mock_omega_customer_12345",
        }
      });

      // Send welcome notification
      await prisma.notification.create({
        data: {
          userId: user.id,
          title: `Welkom bij ${planConfig.tier === 'ECOM' ? 'Commerce Syndicate' : planConfig.tier === 'TECH' ? 'SaaS Protocol' : 'Elite Team'}!`,
          message: `Je onboarding betaling is succesvol verwerkt. Je hebt nu toegang tot alle functionaliteiten.`,
        },
      });
      
      const mockSuccessUrl = new URL(successUrl);
      mockSuccessUrl.searchParams.set('mollie_session_id', 'tr_mock_omega_mollie_12345');
      mockSuccessUrl.searchParams.set('userId', user.id);
      mockSuccessUrl.searchParams.set('tier', planConfig.tier);
      mockSuccessUrl.searchParams.set('priceId', priceId);
      
      return NextResponse.json({ url: mockSuccessUrl.toString() });
    }

    // --- REAL MOLLIE CHECKOUT ---
    
    // Step A: Ensure customer exists in Mollie
    let customerId = user.mollieCustomerId;
    if (!customerId) {
      try {
        const customerResponse = await fetch("https://api.mollie.com/v2/customers", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${mollieKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name || `${user.firstName} ${user.lastName}` || user.email,
            email: email || user.email,
            metadata: {
              userId: user.id,
            },
          }),
        });

        if (customerResponse.ok) {
          const customerData = await customerResponse.json();
          customerId = customerData.id;
          
          // Save customerId in database
          await prisma.user.update({
            where: { id: user.id },
            data: { mollieCustomerId: customerId },
          });
          console.log(`Created Mollie Customer ${customerId} for user ${user.id}`);
        } else {
          const errData = await customerResponse.json();
          console.error("Failed to create Mollie customer:", errData);
        }
      } catch (err) {
        console.error("Mollie Customer creation request error:", err);
      }
    }

    // Step B: Create payment
    const isLocal = appUrl.includes("localhost") || appUrl.includes("127.0.0.1") || appUrl.includes("::1");
    const webhookUrl = isLocal ? undefined : `${appUrl}/api/mollie/webhook`;

    const paymentRequestBody: any = {
      amount: {
        currency: "EUR",
        value: planConfig.amount,
      },
      description: planConfig.description,
      redirectUrl: successUrl,
      metadata: {
        userId: user.id,
        userEmail: user.email,
        priceId: priceId,
        tier: planConfig.tier,
      },
    };

    if (customerId) {
      paymentRequestBody.customerId = customerId;
      // sequenceType "first" allows us to obtain a billing mandate for recurring payments
      paymentRequestBody.sequenceType = "first";
    }

    if (webhookUrl) {
      paymentRequestBody.webhookUrl = webhookUrl;
    }

    // --- SPLIT PAYMENTS / ROUTING ---
    // If this payment belongs to a specific Franchisee (passed via body as franchiseOwnerId)
    // We look up their organizationId to route 75% to them.
    if (franchiseOwnerId) {
      const franchiseOwner = await prisma.user.findUnique({ where: { id: franchiseOwnerId } });
      if (franchiseOwner && franchiseOwner.mollieOrganizationId) {
        const totalAmount = parseFloat(planConfig.amount);
        const franchiseCut = (totalAmount * 0.75).toFixed(2); // 75% for Franchisee
        
        paymentRequestBody.routing = [
          {
            amount: {
              currency: "EUR",
              value: franchiseCut
            },
            destination: {
              type: "organization",
              organizationId: franchiseOwner.mollieOrganizationId
            }
          }
        ];
        console.log(`[OMEGA PROTOCOL] Routing €${franchiseCut} of €${planConfig.amount} to Franchisee ${franchiseOwner.mollieOrganizationId}`);
      }
    }

    const paymentResponse = await fetch("https://api.mollie.com/v2/payments", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${mollieKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentRequestBody),
    });

    const paymentData = await paymentResponse.json();

    if (!paymentResponse.ok) {
      console.error("Mollie checkout API error:", paymentData);
      return NextResponse.json({ error: paymentData.detail || "Mollie payment creation failed" }, { status: 400 });
    }

    // Return the checkout url for redirection
    const checkoutUrl = paymentData._links?.checkout?.href;
    if (!checkoutUrl) {
      console.error("Mollie did not return checkout link:", paymentData);
      return NextResponse.json({ error: "No checkout URL returned from Mollie" }, { status: 500 });
    }

    return NextResponse.json({ url: checkoutUrl });

  } catch (error: any) {
    console.error("Mollie Checkout Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
