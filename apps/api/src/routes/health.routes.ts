import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { authenticate } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import * as healthService from "../services/health.service.js";

const router = Router();

// ---- Validation Schemas ----

const logHealthSchema = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Datum moet het formaat YYYY-MM-DD hebben."),
  steps: z.number().int().nonnegative().optional(),
  sleepScore: z.number().int().min(1).max(10).optional(),
  weightKg: z.number().positive().optional(),
  waterMl: z.number().int().nonnegative().optional(),
  workoutMinutes: z.number().int().nonnegative().optional(),
  workoutType: z
    .enum(["STRENGTH", "CARDIO", "YOGA", "SPORTS", "WALK", "OTHER"])
    .optional(),
  notes: z.string().max(2000).optional(),
});

const logsQuerySchema = z.object({
  days: z.coerce.number().int().positive().max(365).default(30),
});

const paramsWithId = z.object({
  id: z.string().uuid("Ongeldig log-ID."),
});

// ---- Routes ----

// GET /summary — must be BEFORE /:id to avoid conflict
router.get(
  "/summary",
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const summary = await healthService.getHealthSummary(req.user!.userId);
      res.json(summary);
    } catch (error) {
      next(error);
    }
  },
);

// GET / — List health logs (last N days, default 30)
router.get(
  "/",
  authenticate,
  validate({ query: logsQuerySchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { days } = req.query as unknown as { days: number };
      const logs = await healthService.getHealthLogs(req.user!.userId, days);
      res.json(logs);
    } catch (error) {
      next(error);
    }
  },
);

// GET /:id — Single log
router.get(
  "/:id",
  authenticate,
  validate({ params: paramsWithId }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const log = await healthService.getHealthLogById(
        req.user!.userId,
        req.params.id,
      );
      res.json(log);
    } catch (error) {
      next(error);
    }
  },
);

// POST / — Log or update health for a day (upsert)
router.post(
  "/",
  authenticate,
  validate({ body: logHealthSchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const log = await healthService.logHealth(req.user!.userId, req.body);
      res.status(201).json(log);
    } catch (error) {
      next(error);
    }
  },
);

// DELETE /:id — Delete a health log
router.delete(
  "/:id",
  authenticate,
  validate({ params: paramsWithId }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await healthService.deleteHealthLog(req.user!.userId, req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
);

export default router;
