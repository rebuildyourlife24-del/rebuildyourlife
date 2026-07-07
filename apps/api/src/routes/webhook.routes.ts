import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { authenticate } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import * as webhookService from "../services/webhook.service.js";
import { UnauthorizedError } from "../middleware/errorHandler.js";

import { realityFabricInstance } from "../core/reality/RealityFabric.js";

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

// ==========================================
// V6.0 SOVEREIGN ENTERPRISE CONTROL PLANE
// ==========================================

router.post('/reality-sync', async (req, res) => {
  try {
    const { source, payload } = req.body;
    const headers = req.headers;

    // We determine the connector based on the source payload or a header
    // If testing locally or via simple API call:
    const connectorName = source || 'SHOPIFY_CONNECTOR'; 

    console.log(`[Webhook] Incoming signal for ${connectorName}`);

    // Reality Fabric normalizes, validates, and publishes to the Event Bus
    const response = await realityFabricInstance.handleIncomingWebhook(connectorName, payload, headers);

    if (response.success) {
      res.status(200).json({ 
        message: 'Reality synchronized successfully', 
        eventsPublished: response.eventsPublished 
      });
    } else {
      res.status(400).json({ 
        message: 'Reality synchronization failed', 
        error: response.error 
      });
    }

  } catch (error: any) {
    console.error('[Reality Sync Error]', error);
    res.status(500).json({ error: error.message || 'Internal Enterprise Server Error' });
  }
});

export default router;
