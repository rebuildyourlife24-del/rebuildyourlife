import { prisma } from "@rebuildyourlife/database";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { NotFoundError, UnauthorizedError } from "../middleware/errorHandler.js";

/**
 * Generates a secure random 32-byte hex token, hashes it using bcryptjs,
 * saves the hash to ApiKey, and returns the raw token to the user.
 */
export async function generateApiKey(userId: string, name: string) {
  const token = crypto.randomBytes(32).toString("hex");
  const keyHash = await bcrypt.hash(token, 10);
  
  const apiKey = await prisma.apiKey.create({
    data: {
      userId,
      name,
      keyHash,
    },
  });

  return {
    id: apiKey.id,
    name: apiKey.name,
    token, // The raw token is only shown once
  };
}

/**
 * Returns all API keys for a user (without the hash).
 */
export async function getApiKeys(userId: string) {
  const apiKeys = await prisma.apiKey.findMany({
    where: { userId },
    select: {
      id: true,
      name: true,
      lastUsedAt: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return apiKeys;
}

/**
 * Deletes an API key.
 */
export async function revokeApiKey(userId: string, keyId: string) {
  const apiKey = await prisma.apiKey.findUnique({
    where: { id: keyId },
  });

  if (!apiKey) {
    throw new NotFoundError("API Key");
  }

  if (apiKey.userId !== userId) {
    throw new UnauthorizedError("Deze API Key behoort niet tot jou.");
  }

  await prisma.apiKey.delete({
    where: { id: keyId },
  });

  return { success: true };
}

/**
 * Validates a given token against stored API key hashes using bcrypt.
 * Updates lastUsedAt if valid.
 */
export async function validateWordPressToken(token: string) {
  // We have to retrieve all keys because bcrypt hashes are salted.
  // In a large production app, the token should include the keyId as prefix.
  const allKeys = await prisma.apiKey.findMany();

  for (const apiKey of allKeys) {
    const isValid = await bcrypt.compare(token, apiKey.keyHash);
    if (isValid) {
      await prisma.apiKey.update({
        where: { id: apiKey.id },
        data: { lastUsedAt: new Date() },
      });
      return apiKey;
    }
  }

  return null;
}

/**
 * A placeholder function for now that logs the incoming data from WordPress
 * (e.g., WooCommerce new subscription).
 */
export async function handleWordPressWebhook(payload: any) {
  console.log("Received WordPress webhook payload:", payload);
  return { success: true, message: "Webhook received successfully" };
}
