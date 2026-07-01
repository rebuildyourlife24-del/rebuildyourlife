"use server";

import { cookies } from "next/headers";
import * as jwt from "jsonwebtoken";
import { createServerClient } from "@/lib/supabase/server";
import { prisma } from "@rebuildyourlife/database";

export async function loginAction(email: string, password: string, rememberMe?: boolean) {
  const supabase = await createServerClient();

  // DEV BYPASS: Zodat jij altijd via jouw master-email in kunt loggen
  if (email === 'hsemler50@gmail.com' && (password === 'admin' || password === 'orion' || password === 'Imperialdreams2055')) {
    const cookieStore = await cookies();
    cookieStore.set('dev_bypass', 'true', { path: '/' });
    
    // Genereer een ryl_session token zodat alle admin/dashboard APIs werken
    let realUserId = 'dev-local-admin-id';
    
    // Zorg ervoor dat de dev user ook echt in Prisma bestaat om foreign key errors (zoals bij AI chat) te voorkomen!
    try {
      let existingUser = await prisma.user.findUnique({ where: { email: 'hsemler50@gmail.com' } });
      if (existingUser) {
        realUserId = existingUser.id;
        // Zorg ervoor dat de rol SUPER_ADMIN is
        if (existingUser.role !== 'SUPER_ADMIN') {
           await prisma.user.update({ where: { id: realUserId }, data: { role: 'SUPER_ADMIN', subscriptionTier: 'ELITE' } });
        }
      } else {
        await prisma.user.create({
          data: {
            id: realUserId,
            email: 'hsemler50@gmail.com',
            passwordHash: '',
            firstName: 'Hendrik',
            lastName: 'Semler',
            role: 'SUPER_ADMIN',
            subscriptionTier: 'ELITE'
          }
        });
      }
    } catch (e) {
      console.warn("Dev bypass fetch/create failed in loginAction", e);
    }

    const jwtToken = jwt.sign({ userId: realUserId, role: 'SUPER_ADMIN' }, process.env.JWT_SECRET || 'fallback-secret-for-dev', { expiresIn: '7d' });
    cookieStore.set('ryl_session', jwtToken, { path: '/', httpOnly: true });
    
    return { 
      success: true, 
      user: { 
        id: bypassUserId, 
        email: email || 'hsemler50@gmail.com', 
        firstName: 'Hendrik', 
        lastName: 'Semler', 
        role: 'SUPER_ADMIN', 
        subscriptionTier: 'ELITE',
        clearanceLevel: 5
      } 
    };
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) {
      try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (user) {
          await prisma.auditLog.create({
            data: {
              userId: user.id,
              action: "LOGIN_FAILED",
              entityType: "AUTH",
            }
          });
        }
      } catch (dbErr) {
        console.warn("[AUTH] Failed to log login attempt:", dbErr);
      }
      return { success: false, error: "Ongeldige logingegevens." };
    }

    try {
      let user = await prisma.user.findUnique({ where: { id: data.user.id } });
      
      if (!user) {
        user = await prisma.user.upsert({
          where: { email },
          update: { id: data.user.id },
          create: {
            id: data.user.id,
            email,
            passwordHash: '',
            firstName: data.user.user_metadata?.first_name || '',
            lastName: data.user.user_metadata?.last_name || '',
            role: email === 'hsemler50@gmail.com' ? 'SUPER_ADMIN' : 'USER',
          }
        });
      }

      await prisma.auditLog.create({
        data: { userId: user.id, action: "LOGIN_SUCCESS", entityType: "AUTH" }
      });

      await prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() }
      });
      
      const cookieStore = await cookies();
      const jwtToken = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET || 'fallback-secret-for-dev', { expiresIn: '7d' });
      cookieStore.set('ryl_session', jwtToken, { path: '/', httpOnly: true });

      return { success: true, user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role, subscriptionTier: user.subscriptionTier } };
    } catch (dbErr) {
      console.warn("[AUTH] Prisma database sync failed during login, proceeding with Supabase data:", dbErr);
      
      // Fallback: login anyway if Supabase auth succeeded, even if Prisma fails
      const cookieStore = await cookies();
      const jwtToken = jwt.sign({ userId: data.user.id, role: 'USER' }, process.env.JWT_SECRET || 'fallback-secret-for-dev', { expiresIn: '7d' });
      cookieStore.set('ryl_session', jwtToken, { path: '/', httpOnly: true });
      
      return { success: true, user: { id: data.user.id, email: data.user.email || '', firstName: data.user.user_metadata?.first_name || '', lastName: data.user.user_metadata?.last_name || '', role: 'USER' } };
    }
  } catch (err) {
    console.error("[AUTH] Login failed completely:", err);
    return { success: false, error: "Er kon geen verbinding gemaakt worden met de inlogserver. Probeer het later opnieuw." };
  }
}

export async function registerAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;

  if (!email || !password) {
    return { success: false, error: "E-mail en wachtwoord zijn verplicht." };
  }

  if (password.length < 12) {
    return { success: false, error: "Wachtwoord moet minimaal 12 tekens bevatten (Apex Protocol)." };
  }

  const supabase = await createServerClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
      }
    }
  });

  if (error) {
    return { success: false, error: error.message };
  }

  if (data.user) {
    // Sla direct op in Prisma
    await prisma.user.create({
      data: {
        id: data.user.id,
        email,
        passwordHash: '', // Wordt beheerd door Supabase
        firstName: firstName || '',
        lastName: lastName || '',
        role: email === 'hsemler50@gmail.com' ? 'SUPER_ADMIN' : 'USER',
      }
    });

    return { success: true, message: "Controleer je e-mail voor de verificatielink." };
  }

  return { success: false, error: "Onbekende fout bij registratie." };
}

export async function logoutAction() {
  const supabase = await createServerClient();
  await supabase.auth.signOut();
  return { success: true };
}

export async function getSessionAction() {
  try {
    const cookieStore = await cookies();
    
    // MASTER BYPASS: Werkt altijd, overal — lokaal EN productie.
    // Zodra de dev_bypass cookie is gezet (door loginAction), ben je binnen.
    if (cookieStore.get('dev_bypass')?.value === 'true') {
      const email = 'hsemler50@gmail.com';
      let realUserId = 'dev-local-admin-id';
      
      // Auto-sync dev admin user in DB to prevent foreign key errors for AI chat
      try {
        let existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
          realUserId = existingUser.id;
        } else {
          // Creëer hem als hij echt niet bestaat
          await prisma.user.create({
            data: {
              id: realUserId,
              email: email,
              passwordHash: '',
              firstName: 'Hendrik',
              lastName: 'Semler',
              role: 'SUPER_ADMIN',
              subscriptionTier: 'ELITE'
            }
          });
        }
      } catch (e) {
        console.warn("Dev bypass fetch/create failed, fallback to dev-local-admin-id", e);
      }

      return { 
        success: true, 
        user: { 
          id: realUserId, 
          email: 'hsemler50@gmail.com', 
          firstName: 'Hendrik', 
          lastName: 'Semler', 
          role: 'SUPER_ADMIN', 
          subscriptionTier: 'ELITE',
          clearanceLevel: 5
        } 
      };
    }

    // Check of er een ryl_session JWT cookie is (van de Mollie checkout flow)
    const jwtToken = cookieStore.get('ryl_session')?.value;
    if (jwtToken) {
      try {
        const JWT_SECRET = process.env.JWT_SECRET! ;
        const decoded = jwt.verify(jwtToken, JWT_SECRET) as any;
        if (decoded.userId) {
          try {
            const dbUser = await prisma.user.findUnique({ where: { id: decoded.userId } });
            if (dbUser) {
              return { success: true, user: { id: dbUser.id, email: dbUser.email, firstName: dbUser.firstName, lastName: dbUser.lastName, role: dbUser.role, subscriptionTier: dbUser.subscriptionTier } };
            }
          } catch (dbErr) {
            console.warn("[AUTH] Database lookup failed for JWT user, returning JWT data:", dbErr);
          }
          // Fallback: geef JWT data terug zonder DB lookup
          return { success: true, user: { id: decoded.userId, email: decoded.email || '', firstName: '', lastName: '', role: 'USER' } };
        }
      } catch (jwtErr) {
        console.warn("[AUTH] JWT verification failed:", jwtErr);
      }
    }

    // Probeer Supabase Auth (kan falen als Supabase down is)
    let supabaseUser = null;
    try {
      const supabase = await createServerClient();
      const { data: { user } } = await supabase.auth.getUser();
      supabaseUser = user;
    } catch (sbErr) {
      console.warn("[AUTH] Supabase auth check failed (service may be down):", sbErr);
      // Supabase is down — we crashen NIET, we gaan gewoon door
    }

    if (!supabaseUser) return { success: false };

    // Probeer de user op te zoeken in Prisma (kan ook falen)
    try {
      let dbUser = await prisma.user.findUnique({ where: { id: supabaseUser.id } });
      if (!dbUser && supabaseUser.email) {
        dbUser = await prisma.user.findUnique({ where: { email: supabaseUser.email } });
      }

      if (!dbUser && supabaseUser.email) {
        // User exists in Supabase but NOT in Prisma. Sync them now to prevent Foreign Key errors!
        try {
          dbUser = await prisma.user.create({
            data: {
              id: supabaseUser.id,
              email: supabaseUser.email,
              passwordHash: '', // Managed by Supabase
              firstName: supabaseUser.user_metadata?.first_name || '',
              lastName: supabaseUser.user_metadata?.last_name || '',
              role: supabaseUser.email === 'hsemler50@gmail.com' ? 'SUPER_ADMIN' : 'USER',
            }
          });
        } catch (syncErr) {
          console.error("[AUTH] Failed to auto-sync Supabase user to Prisma:", syncErr);
        }
      }

      if (dbUser) {
        return { success: true, user: { id: dbUser.id, email: dbUser.email, firstName: dbUser.firstName, lastName: dbUser.lastName, role: dbUser.role, subscriptionTier: dbUser.subscriptionTier } };
      }
    } catch (dbErr) {
      console.warn("[AUTH] Prisma user lookup failed:", dbErr);
    }

    // Supabase user bestaat maar Prisma is down of sync faalde — geef toch de Supabase data terug
    return { 
      success: true, 
      user: { 
        id: supabaseUser.id, 
        email: supabaseUser.email || '', 
        firstName: supabaseUser.user_metadata?.first_name || '', 
        lastName: supabaseUser.user_metadata?.last_name || '', 
        role: supabaseUser.email === 'hsemler50@gmail.com' ? 'SUPER_ADMIN' : 'USER' 
      } 
    };
  } catch (err) {
    console.error("[AUTH] Complete auth system failure:", err);
    // NUCLEAIRE FALLBACK: zelfs als álles kapot is, crash niet de hele app
    return { success: false };
  }
}
