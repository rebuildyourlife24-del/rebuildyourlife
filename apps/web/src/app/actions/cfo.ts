"use server";

import { prisma } from "@rebuildyourlife/database";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";


const JWT_SECRET = process.env.JWT_SECRET || "super-secret-jwt-key-2026-rebuild";

async function getUserIdFromSession(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("ryl_session")?.value;
    if (!token) return null;
    
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    return decoded.userId;
  } catch (e) {
    return null;
  }
}

export async function getCFOData() {
  const userId = await getUserIdFromSession();
  if (!userId) return { success: false, error: "Unauthorized" };

  try {
    const vault = await prisma.treasuryVault.findFirst({
      where: { userId, status: "ACTIVE" }
    });

    const taxStrategies = await prisma.taxStrategy.findMany({
      where: { userId }
    });

    const totalTaxShield = taxStrategies.reduce((sum, tax) => sum + tax.allocatedAmount, 0);

    return {
      success: true,
      data: {
        vault: vault || { balance: 0, reservedRiskCap: 0 },
        taxStrategies,
        totalTaxShield
      }
    };
  } catch (error: any) {
    console.error("CFO fetch error:", error);
    return { success: false, error: "Fout bij ophalen CFO data" };
  }
}
