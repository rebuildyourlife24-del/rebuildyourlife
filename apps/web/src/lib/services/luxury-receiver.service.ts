import { PrismaClient } from "@rebuildyourlife/database";
import crypto from "crypto";

const prisma = new PrismaClient();
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "super-secret-32-byte-long-key123!"; // Moet 32 bytes zijn
const ALGORITHM = "aes-256-gcm";

// --- MILITARY GRADE ENCRYPTION ---
export function encryptData(text: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY), iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  const authTag = cipher.getAuthTag().toString("hex");
  return `${iv.toString("hex")}:${authTag}:${encrypted}`;
}

export function decryptData(encryptedString: string): string {
  const parts = encryptedString.split(":");
  if (parts.length !== 3) throw new Error("Invalid encrypted format");
  const iv = Buffer.from(parts[0], "hex");
  const authTag = Buffer.from(parts[1], "hex");
  const encryptedText = parts[2];
  
  const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY), iv);
  decipher.setAuthTag(authTag);
  let decrypted = decipher.update(encryptedText, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

// --- LUXURY ADMINISTRATION ---
export async function calculateVTLB(_userId: string) {
  // 2x Modaal ZZP loon garantie = ~€5.000 netto per maand
  const LUXURY_VTLB = 5000;
  return LUXURY_VTLB;
}

export async function processDebtDossiers(userId: string) {
  const vtlb = await calculateVTLB(userId);
  const vault = await prisma.treasuryVault.findFirst({ where: { userId } });
  
  if (!vault || vault.balance <= vtlb) {
    return { success: false, message: "Kluissaldo onder Luxury VTLB limiet. Geen aflossing mogelijk deze maand." };
  }

  const slashCapacity = vault.balance - vtlb;
  
  // Hash the decision in the Justice Ledger
  const hash = crypto.createHash("sha256").update(`${userId}-VTLB-${Date.now()}`).digest("hex");
  await prisma.justiceLedger.create({
    data: {
      userId,
      actionType: "VTLB_DISTRIBUTION",
      description: `Berekende aflossingscapaciteit na aftrek van €${vtlb} Luxury VTLB: €${slashCapacity}`,
      amount: slashCapacity,
      cryptographicHash: hash
    }
  });

  return { success: true, slashCapacity };
}

// --- THE ADS ENGINE ---
export async function generateMarketingCampaign(_userId: string) {
  const adCopy = "Vergeet de traditionele bewindvoerder die je op water en brood zet. Neem controle met de AI Luxury Receiver van Rebuild Your Life. Leef vrij, terwijl de AI je schulden oplost.";
  
  const campaign = await prisma.socialCampaign.create({
    data: {
      platformId: "SYSTEM",
      campaignName: "Luxury Receiver Promo - Auto Gen",
      campaignType: "PAID_AD",
      status: "DRAFT",
      caption: adCopy,
      budgetDaily: 25.0
    }
  });

  return { success: true, campaign };
}
