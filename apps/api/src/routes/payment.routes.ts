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

export const paymentRoutes = router;
