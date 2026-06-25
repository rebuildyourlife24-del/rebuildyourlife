import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { TrafficService } from "../services/traffic.service.js";
import { authenticate } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = Router();

const buyCreditsSchema = z.object({
  credits: z.number().int().min(100).max(10000)
});

const launchCampaignSchema = z.object({
  campaignName: z.string().min(3).max(100),
  budgetCredits: z.number().int().min(50).max(5000)
});

const completePurchaseSchema = z.object({
  purchaseId: z.string()
});

// GET user ad credits balance
router.get(
  "/credits",
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const credits = await TrafficService.getUserCredits(userId);
      res.status(200).json({
        status: "success",
        data: { credits }
      });
    } catch (error) {
      next(error);
    }
  }
);

// POST purchase ad credits via Mollie (or simulated checkout URL)
router.post(
  "/buy-credits",
  authenticate,
  validate({ body: buyCreditsSchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const { credits } = req.body;
      const result = await TrafficService.createCreditsCheckout(userId, credits);
      res.status(200).json({
        status: "success",
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
);

// POST complete purchase (sandbox simulator or Mollie callback fallback)
router.post(
  "/complete-purchase",
  authenticate,
  validate({ body: completePurchaseSchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { purchaseId } = req.body;
      const purchase = await TrafficService.completePurchase(purchaseId);
      if (!purchase) {
        return res.status(404).json({
          status: "fail",
          message: "Purchase transaction not found or already processed"
        });
      }
      res.status(200).json({
        status: "success",
        data: purchase
      });
    } catch (error) {
      next(error);
    }
  }
);

// GET user PR campaigns
router.get(
  "/campaigns",
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const campaigns = await TrafficService.getCampaigns(userId);
      res.status(200).json({
        status: "success",
        data: campaigns
      });
    } catch (error) {
      next(error);
    }
  }
);

// POST launch new PR campaign
router.post(
  "/campaigns",
  authenticate,
  validate({ body: launchCampaignSchema }),
  async (req: Request, res: Response, _next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const { campaignName, budgetCredits } = req.body;
      
      const currentCredits = await TrafficService.getUserCredits(userId);
      if (currentCredits < budgetCredits) {
        return res.status(400).json({
          status: "fail",
          message: `Insufficient ad-credits. You need ${budgetCredits} credits, but you only have ${currentCredits}.`
        });
      }

      const campaign = await TrafficService.launchCampaign(userId, campaignName, budgetCredits);
      res.status(201).json({
        status: "success",
        data: campaign
      });
    } catch (error: any) {
      res.status(400).json({
        status: "fail",
        message: error.message || "Failed to launch campaign"
      });
    }
  }
);

// POST viral boost simulation trigger
router.post(
  "/campaigns/:id/viral",
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const campaignId = req.params.id;
      const campaign = await TrafficService.triggerViralBoost(userId, campaignId);
      if (!campaign) {
        return res.status(404).json({
          status: "fail",
          message: "Campaign not found"
        });
      }
      res.status(200).json({
        status: "success",
        data: campaign
      });
    } catch (error) {
      next(error);
    }
  }
);

export const trafficRoutes = router;
