import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "@rebuildyourlife/database";
import { env } from "../config/env.js";
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

export async function verifyEmail(_token: string) {
  // Stub: email verification via token.
  // In productie: decodeer verificationToken, zoek user, update isEmailVerified = true.
  throw new AppError(
    "E-mailverificatie is nog niet geïmplementeerd.",
    501,
    "NOT_IMPLEMENTED",
  );
}

export async function resetPassword(_email: string) {
  // Stub: password reset flow.
  // In productie: genereer resettoken, stuur via SMTP, valideer, update wachtwoord.
  throw new AppError(
    "Wachtwoord resetten is nog niet geïmplementeerd.",
    501,
    "NOT_IMPLEMENTED",
  );
}
