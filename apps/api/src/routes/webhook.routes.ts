import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { authenticate } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import * as webhookService from "../services/webhook.service.js";
import { UnauthorizedError } from "../middleware/errorHandler.js";

const router = Router();

const generateApiKeySchema = z.object({
  name: z.string().min(1, "Naam is verplicht.").max(255),
});

const keyIdParams = z.object({
  id: z.string().uuid("Ongeldig API Key-ID."),
});

// GET /keys - Returns all API keys for a user
router.get(
  "/keys",
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const keys = await webhookService.getApiKeys(req.user!.userId);
      res.json(keys);
    } catch (error) {
      next(error);
    }
  }
);

// POST /keys - Generates an API key
router.post(
  "/keys",
  authenticate,
  validate({ body: generateApiKeySchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await webhookService.generateApiKey(req.user!.userId, req.body.name);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }
);

// DELETE /keys/:id - Deletes an API key
router.delete(
  "/keys/:id",
  authenticate,
  validate({ params: keyIdParams }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await webhookService.revokeApiKey(req.user!.userId, req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
);

// POST /wordpress - Webhook from WordPress
router.post(
  "/wordpress",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new UnauthorizedError("Geen API key opgegeven in Authorization header.");
      }

      const token = authHeader.split(" ")[1];
      const validKey = await webhookService.validateWordPressToken(token);

      if (!validKey) {
        throw new UnauthorizedError("Ongeldige API key.");
      }

      const result = await webhookService.handleWordPressWebhook(req.body);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
);

import { RealityGateway } from "../core/cognition/RealityGateway.js";

// POST /reality-sync - External or Cron trigger for the Cognitive Loop
router.post(
  "/reality-sync",
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const gateway = new RealityGateway();
      // Since this is authenticated, req.user is guaranteed.
      const result = await gateway.syncReality(req.user!.userId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
