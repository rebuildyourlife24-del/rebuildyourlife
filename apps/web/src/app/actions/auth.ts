"use server";

import { createServerClient } from "@/lib/supabase/server";
import { prisma } from "@rebuildyourlife/database";

export async function loginAction(email: string, password: string, rememberMe?: boolean) {
  const supabase = await createServerClient();

  // DEV BYPASS: Zodat Henk lokaal kan inloggen zonder naar de live-website gestuurd te worden!
  if (email === 'hsemler50@gmail.com' && password === 'admin') {
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    cookieStore.set('dev_bypass', 'true', { path: '/' });
    
    return { 
      success: true, 
      user: { 
        id: 'dev-local-admin-id', 
        email: 'hsemler50@gmail.com', 
        firstName: 'Hendrik', 
        lastName: 'Semler', 
        role: 'SUPER_ADMIN', 
        subscriptionTier: 'ENTERPRISE' 
      } 
    };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    // Log mislukte poging
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
    return { success: false, error: "Ongeldige logingegevens." };
  }

  // Zorg dat gebruiker in Prisma staat
  let user = await prisma.user.findUnique({ where: { id: data.user.id } });
  
  if (!user) {
    // Fallback voor als de sync mislukt was
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

  // Log succesvolle login
  await prisma.auditLog.create({
    data: {
      userId: user.id,
      action: "LOGIN_SUCCESS",
      entityType: "AUTH",
    }
  });

  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() }
  });

  return { success: true, user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role, subscriptionTier: user.subscriptionTier } };
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
  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();
  
  // DEV BYPASS: Zodat Henk lokaal kan testen zonder Supabase restricties
  if (process.env.NODE_ENV === 'development' || cookieStore.get('dev_bypass')?.value === 'true') {
    return { 
      success: true, 
      user: { 
        id: 'dev-local-admin-id', 
        email: 'hsemler50@gmail.com', 
        firstName: 'Hendrik', 
        lastName: 'Semler', 
        role: 'SUPER_ADMIN', 
        subscriptionTier: 'ENTERPRISE' 
      } 
    };
  }

  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false };

  try {
    let dbUser = await prisma.user.findUnique({
      where: { id: user.id }
    });

    if (!dbUser && user.email) {
      dbUser = await prisma.user.findUnique({
        where: { email: user.email }
      });
    }

    if (!dbUser) {
      // Fallback: return supabase user data to prevent infinite redirect loop
      return { 
        success: true, 
        user: { 
          id: user.id, 
          email: user.email, 
          firstName: user.user_metadata?.first_name || '', 
          lastName: user.user_metadata?.last_name || '', 
          role: user.email === 'hsemler50@gmail.com' ? 'SUPER_ADMIN' : 'USER' 
        } 
      };
    }
    
    return { success: true, user: { id: dbUser.id, email: dbUser.email, firstName: dbUser.firstName, lastName: dbUser.lastName, role: dbUser.role, subscriptionTier: dbUser.subscriptionTier } };
  } catch (err) {
    console.error("getSessionAction Error:", err);
    // Extreme fallback
    return { 
      success: true, 
      user: { 
        id: user.id, 
        email: user.email, 
        firstName: '', 
        lastName: '', 
        role: user.email === 'hsemler50@gmail.com' ? 'SUPER_ADMIN' : 'USER' 
      } 
    };
  }
}
