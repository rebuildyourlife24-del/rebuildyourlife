"use server";

import { prisma } from "@rebuildyourlife/database";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";


const JWT_SECRET = process.env.JWT_SECRET! ;

// Haal de huidige ingelogde gebruiker op
async function getCurrentUser() {
  const token = (await cookies()).get("ryl_session")?.value;
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, subscriptionTier: true, role: true },
    });
  } catch {
    return null;
  }
}

// TIER_LEVELS was here

// getUserLevel was here

// Feature matrix per tier
export const FEATURE_ACCESS = {
  // FREE features
  basicDashboard: ['FREE', 'PREMIUM', 'ENTERPRISE', 'ADMIN', 'SUPREME_OVERSEER'],
  basicGoals: ['FREE', 'PREMIUM', 'ENTERPRISE', 'ADMIN', 'SUPREME_OVERSEER'],
  limitedBudget: ['FREE', 'PREMIUM', 'ENTERPRISE', 'ADMIN', 'SUPREME_OVERSEER'],
  debtOverview: ['FREE', 'PREMIUM', 'ENTERPRISE', 'ADMIN', 'SUPREME_OVERSEER'],

  // PREMIUM features (€14,95/mnd)
  aiTeam: ['PREMIUM', 'ENTERPRISE', 'ADMIN', 'SUPREME_OVERSEER'],
  warRoom: ['PREMIUM', 'ENTERPRISE', 'ADMIN', 'SUPREME_OVERSEER'],
  legalEngine: ['PREMIUM', 'ENTERPRISE', 'ADMIN', 'SUPREME_OVERSEER'],
  proactiveAI: ['PREMIUM', 'ENTERPRISE', 'ADMIN', 'SUPREME_OVERSEER'],
  unlimitedGoals: ['PREMIUM', 'ENTERPRISE', 'ADMIN', 'SUPREME_OVERSEER'],
  healthTracking: ['PREMIUM', 'ENTERPRISE', 'ADMIN', 'SUPREME_OVERSEER'],

  // ENTERPRISE features (€49,95/mnd)
  businessDashboard: ['ENTERPRISE', 'ADMIN', 'SUPREME_OVERSEER'],
  invoicing: ['ENTERPRISE', 'ADMIN', 'SUPREME_OVERSEER'],
  crmModule: ['ENTERPRISE', 'ADMIN', 'SUPREME_OVERSEER'],
  whatsappIntegration: ['ENTERPRISE', 'ADMIN', 'SUPREME_OVERSEER'],
  separatedFinances: ['ENTERPRISE', 'ADMIN', 'SUPREME_OVERSEER'],

  // GOD-MODE features (alleen SUPREME_OVERSEER)
  godMode: ['SUPREME_OVERSEER'],
  wealthEngine: ['SUPREME_OVERSEER'],
  commandCenter: ['ADMIN', 'SUPREME_OVERSEER'],
  enterpriseOS: ['ADMIN', 'SUPREME_OVERSEER'],
} as const;

export type FeatureName = keyof typeof FEATURE_ACCESS;

// Controleer of huidige gebruiker toegang heeft tot een feature
export async function checkFeatureAccessAction(feature: FeatureName): Promise<{
  hasAccess: boolean;
  userTier: string;
  requiredTier: string;
}> {
  const user = await getCurrentUser();

  if (!user) {
    return { hasAccess: false, userTier: 'NONE', requiredTier: FEATURE_ACCESS[feature][0] };
  }

  // Master override for admins and elite tiers
  if (['SUPER_ADMIN', 'SUPREME_OVERSEER'].includes(user.role) || user.subscriptionTier === 'ELITE') {
    return {
      hasAccess: true,
      userTier: user.subscriptionTier,
      requiredTier: FEATURE_ACCESS[feature][0],
    };
  }

  const allowedTiers = FEATURE_ACCESS[feature] as readonly string[];
  const hasAccess = allowedTiers.includes(user.subscriptionTier) ||
    allowedTiers.includes(user.role);

  return {
    hasAccess,
    userTier: user.subscriptionTier,
    requiredTier: allowedTiers[0],
  };
}

// Haal alle feature flags op voor de huidige gebruiker (voor frontend gebruik)
export async function getUserFeaturesAction(): Promise<{
  features: Record<FeatureName, boolean>;
  tier: string;
  role: string;
}> {
  const user = await getCurrentUser();

  const features = {} as Record<FeatureName, boolean>;

  if (!user) {
    for (const feature of Object.keys(FEATURE_ACCESS) as FeatureName[]) {
      features[feature] = (FEATURE_ACCESS[feature] as readonly string[]).includes('FREE');
    }
    return { features, tier: 'NONE', role: 'GUEST' };
  }

  const isMaster = ['SUPER_ADMIN', 'SUPREME_OVERSEER'].includes(user.role) || user.subscriptionTier === 'ELITE';

  for (const feature of Object.keys(FEATURE_ACCESS) as FeatureName[]) {
    const allowedTiers = FEATURE_ACCESS[feature] as readonly string[];
    features[feature] = isMaster || allowedTiers.includes(user.subscriptionTier) || allowedTiers.includes(user.role);
  }

  return {
    features,
    tier: user.subscriptionTier,
    role: user.role,
  };
}
