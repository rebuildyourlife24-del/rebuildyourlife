import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { AgentType } from "@rebuildyourlife/shared";
import { authenticate } from "../middleware/auth.js";
import { requireTier } from "../middleware/subscription.js";
import { validate } from "../middleware/validate.js";
import { aiLimiter } from "../middleware/rateLimiter.js";
import * as aiService from "../services/ai.service.js";

const router = Router();

const chatSchema = z.object({
  message: z.string().min(1, "Bericht is leeg."),
  conversationId: z.string().uuid().optional(),
  agentType: z.nativeEnum(AgentType).optional(),
});

// POST /chat
router.post(
  "/chat",
  authenticate,
  aiLimiter,
  requireTier("PREMIUM"),
  validate({ body: chatSchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await aiService.chat(req.user!.userId, req.body);
      res.json(response);
    } catch (error) {
      next(error);
    }
  },
);

export default router;
