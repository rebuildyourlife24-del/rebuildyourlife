import type { Request, Response, NextFunction } from "express";
import { ForbiddenError } from "./errorHandler.js";

const TIERS = {
  FREE: 0,
  BASIC: 1,
  PREMIUM: 2,
  ENTERPRISE: 3,
} as const;

export type SubscriptionTier = keyof typeof TIERS;

export const requireTier = (minTier: "PREMIUM" | "ENTERPRISE") => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const userTier = req.user?.subscriptionTier ?? "FREE";
    
    const userTierLevel = TIERS[userTier] ?? 0;
    const requiredTierLevel = TIERS[minTier] ?? 0;
    
    if (userTierLevel < requiredTierLevel) {
      return next(new ForbiddenError(`Upgrade naar ${minTier} vereist.`));
    }
    
    next();
  };
};
