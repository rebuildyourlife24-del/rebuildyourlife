import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { PaymentService } from "../services/payment.service.js";
import { authenticate } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = Router();

const checkoutSchema = z.object({
  plan: z.enum(["PREMIUM", "ENTERPRISE"]),
});

router.post(
  "/checkout",
  authenticate,
  validate({ body: checkoutSchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const { plan } = req.body;

      const result = await PaymentService.createCheckoutSession(userId, plan);

      res.status(200).json({
        status: "success",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
);

const webhookSchema = z.object({
  id: z.string(),
});

router.post(
  "/webhook",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.body;
      if (!id) {
        return res.status(400).send("No ID provided");
      }

      await PaymentService.handleWebhook(id);
      res.status(200).send("OK");
    } catch (error) {
      console.error("Mollie Webhook Error:", error);
      res.status(500).send("Webhook failed");
    }
  }
);

export const paymentRoutes = router;
