"use server";

import { PrismaClient } from "@rebuildyourlife/database";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "super-secret-jwt-key-2026-rebuild";

export async function loginAction(email: string, password: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return { success: false, error: "Ongeldig e-mailadres of wachtwoord." };
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return { success: false, error: "Ongeldig e-mailadres of wachtwoord." };
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Set HTTP-only cookie for secure session
    cookies().set("ryl_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return { 
      success: true, 
      user: { 
        id: user.id, 
        email: user.email, 
        role: user.role,
        firstName: user.firstName
      } 
    };
  } catch (error: any) {
    console.error("Login action error:", error);
    return { success: false, error: "Debug Error: " + (error?.message || "Onbekende interne fout") };
  }
}

export async function logoutAction() {
  cookies().delete("ryl_session");
  return { success: true };
}

export async function registerAction(data: any) {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      return { success: false, error: "Dit e-mailadres is al in gebruik." };
    }

    const passwordHash = await bcrypt.hash(data.password, 12);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        firstName: data.firstName,
        lastName: data.lastName,
        role: "USER",
        subscriptionTier: "FREE",
      },
    });

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Set HTTP-only cookie for secure session
    cookies().set("ryl_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return { 
      success: true, 
      user: { 
        id: user.id, 
        email: user.email, 
        role: user.role,
        firstName: user.firstName
      } 
    };
  } catch (error) {
    console.error("Register action error:", error);
    return { success: false, error: "Er is een interne serverfout opgetreden." };
  }
}

export async function getSessionAction() {
  const token = cookies().get("ryl_session")?.value;
  if (!token) return { success: false };

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, role: true, firstName: true, lastName: true, avatarUrl: true }
    });
    
    if (!user) return { success: false };
    return { success: true, user };
  } catch (error) {
    return { success: false };
  }
}
