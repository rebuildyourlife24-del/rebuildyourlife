import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { prisma } from "@rebuildyourlife/database";
import { env } from "../config/env.js";
import { sendPasswordResetEmail, sendVerificationEmail } from "./email.service.js";
import {
  AppError,
  ConflictError,
  UnauthorizedError,
} from "../middleware/errorHandler.js";
import type { JwtPayload } from "../middleware/auth.js";

const SALT_ROUNDS = 12;

function generateAccessToken(payload: JwtPayload): string {
  return jwt.sign(payload as any, env.JWT_SECRET as string, {
    expiresIn: env.JWT_EXPIRES_IN as any,
  });
}

function generateRefreshToken(payload: JwtPayload): string {
  return jwt.sign(payload as any, env.JWT_REFRESH_SECRET as string, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN as any,
  });
}

function parseExpiresIn(expiresIn: string): Date {
  const match = expiresIn.match(/^(\d+)([smhd])$/);
  if (!match) {
    return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // default 7d
  }
  const value = parseInt(match[1], 10);
  const unit = match[2];
  const ms: Record<string, number> = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };
  return new Date(Date.now() + value * (ms[unit] ?? ms.d));
}

function expiresInSeconds(expiresIn: string): number {
  const match = expiresIn.match(/^(\d+)([smhd])$/);
  if (!match) return 900; // default 15m
  const value = parseInt(match[1], 10);
  const unit = match[2];
  const multipliers: Record<string, number> = {
    s: 1,
    m: 60,
    h: 3600,
    d: 86400,
  };
  return value * (multipliers[unit] ?? 60);
}

export interface RegisterInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export async function register(
  input: RegisterInput,
  ipAddress?: string,
  userAgent?: string,
) {
  const existing = await prisma.user.findUnique({
    where: { email: input.email.toLowerCase() },
  });

  if (existing) {
    throw new ConflictError("Er bestaat al een account met dit e-mailadres.");
  }

  const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      email: input.email.toLowerCase(),
      passwordHash,
      firstName: input.firstName,
      lastName: input.lastName,
    },
  });

  // Generate Email Verification Token (JWT for statelessness)
  const verifyToken = jwt.sign(
    { userId: user.id },
    env.JWT_SECRET as string,
    { expiresIn: "24h" }
  );
  await sendVerificationEmail(user.email, verifyToken);

  const jwtPayload: JwtPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = generateAccessToken(jwtPayload);
  const refreshToken = generateRefreshToken(jwtPayload);

  await prisma.session.create({
    data: {
      userId: user.id,
      token: accessToken,
      refreshToken,
      expiresAt: parseExpiresIn(env.JWT_REFRESH_EXPIRES_IN),
      ipAddress: ipAddress ?? null,
      userAgent: userAgent ?? null,
    },
  });

  return {
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      avatarUrl: user.avatarUrl,
      subscriptionTier: user.subscriptionTier,
      onboardingCompleted: user.onboardingCompleted,
      createdAt: user.createdAt.toISOString(),
    },
    tokens: {
      accessToken,
      refreshToken,
      expiresIn: expiresInSeconds(env.JWT_EXPIRES_IN),
    },
  };
}

export async function login(
  input: LoginInput,
  ipAddress?: string,
  userAgent?: string,
) {
  const user = await prisma.user.findUnique({
    where: { email: input.email.toLowerCase() },
  });

  if (!user) {
    throw new UnauthorizedError("Ongeldig e-mailadres of wachtwoord.");
  }

  const valid = await bcrypt.compare(input.password, user.passwordHash);
  if (!valid) {
    throw new UnauthorizedError("Ongeldig e-mailadres of wachtwoord.");
  }

  const jwtPayload: JwtPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = generateAccessToken(jwtPayload);
  const refreshToken = generateRefreshToken(jwtPayload);

  await prisma.session.create({
    data: {
      userId: user.id,
      token: accessToken,
      refreshToken,
      expiresAt: parseExpiresIn(env.JWT_REFRESH_EXPIRES_IN),
      ipAddress: ipAddress ?? null,
      userAgent: userAgent ?? null,
    },
  });

  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  return {
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      avatarUrl: user.avatarUrl,
      subscriptionTier: user.subscriptionTier,
      onboardingCompleted: user.onboardingCompleted,
      createdAt: user.createdAt.toISOString(),
    },
    tokens: {
      accessToken,
      refreshToken,
      expiresIn: expiresInSeconds(env.JWT_EXPIRES_IN),
    },
  };
}

export async function refreshToken(token: string) {
  let decoded: JwtPayload;
  try {
    decoded = jwt.verify(token, env.JWT_REFRESH_SECRET) as JwtPayload;
  } catch {
    throw new UnauthorizedError("Ongeldig of verlopen refresh token.");
  }

  const session = await prisma.session.findUnique({
    where: { refreshToken: token },
  });

  if (!session || session.expiresAt < new Date()) {
    if (session) {
      await prisma.session.delete({ where: { id: session.id } });
    }
    throw new UnauthorizedError("Sessie verlopen. Log opnieuw in.");
  }

  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
  });

  if (!user) {
    throw new UnauthorizedError("Gebruiker niet gevonden.");
  }

  const jwtPayload: JwtPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  const newAccessToken = generateAccessToken(jwtPayload);
  const newRefreshToken = generateRefreshToken(jwtPayload);

  await prisma.session.update({
    where: { id: session.id },
    data: {
      token: newAccessToken,
      refreshToken: newRefreshToken,
      expiresAt: parseExpiresIn(env.JWT_REFRESH_EXPIRES_IN),
    },
  });

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    expiresIn: expiresInSeconds(env.JWT_EXPIRES_IN),
  };
}

export async function logout(refreshTokenValue: string) {
  const session = await prisma.session.findUnique({
    where: { refreshToken: refreshTokenValue },
  });

  if (session) {
    await prisma.session.delete({ where: { id: session.id } });
  }
}

export async function verifyEmail(token: string) {
  let decoded: any;
  try {
    decoded = jwt.verify(token, env.JWT_SECRET as string);
  } catch (err) {
    throw new AppError("Ongeldig of verlopen verificatietoken.", 400, "INVALID_TOKEN");
  }

  const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
  if (!user) throw new AppError("Gebruiker niet gevonden.", 404, "USER_NOT_FOUND");
  if (user.isEmailVerified) return;

  await prisma.user.update({
    where: { id: user.id },
    data: { isEmailVerified: true },
  });
}

export async function resetPassword(email: string) {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  // Always return success to prevent email enumeration
  if (!user) return;

  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
  await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      token,
      expiresAt,
    },
  });

  await sendPasswordResetEmail(user.email, token);
}

export async function confirmPasswordReset(token: string, newPassword: string) {
  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { token },
  });

  if (!resetToken || resetToken.expiresAt < new Date() || resetToken.usedAt) {
    throw new AppError("Ongeldige of verlopen resetlink.", 400, "INVALID_TOKEN");
  }

  const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: resetToken.userId },
      data: { passwordHash },
    }),
    prisma.passwordResetToken.update({
      where: { id: resetToken.id },
      data: { usedAt: new Date() },
    }),
  ]);
}
