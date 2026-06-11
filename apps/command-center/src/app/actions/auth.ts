"use server";

import { PrismaClient } from "@rebuildyourlife/database";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { cookies } from "next/headers";

const prisma = new PrismaClient();
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "SUPREME_OVERSEER_FALLBACK_SECRET_KEY_2026");

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Vul je e-mailadres en wachtwoord in." };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return { error: "Toegang Geweigerd." };
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);

    if (!isValidPassword) {
      return { error: "Toegang Geweigerd." };
    }

    // Only allow ADMIN or SUPREME_OVERSEER for now
    if (user.role !== "ADMIN" && user.role !== "SUPREME_OVERSEER") {
      return { error: "Onvoldoende rechten." };
    }

    // Create session token (JWT)
    const token = await new SignJWT({ userId: user.id, role: user.role, email: user.email })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("24h")
      .sign(JWT_SECRET);

    // Save to database
    await prisma.session.create({
      data: {
        userId: user.id,
        token: token,
        refreshToken: "not-implemented",
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      }
    });

    // Set cookie securely
    const cookieStore = await cookies();
    cookieStore.set("orion_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60, // 1 day
      path: "/",
    });

    return { success: true };
  } catch (error: any) {
    console.error("Login error:", error);
    return { error: `Systeemfout: ${error?.message || String(error)}` };
  }
}

export async function logout() {
  const cookieStore = await cookies();
  const token = cookieStore.get("orion_session")?.value;

  if (token) {
    try {
      await prisma.session.deleteMany({
        where: { token }
      });
    } catch (e) {
      console.error("Failed to delete session", e);
    }
  }

  cookieStore.delete("orion_session");
  return { success: true };
}
