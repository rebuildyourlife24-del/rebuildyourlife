import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { GoalStatus, GoalTimeframe } from "@rebuildyourlife/shared";
import { authenticate } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import * as goalService from "../services/goal.service.js";

const router = Router();

const createGoalSchema = z.object({
  title: z.string().min(1, "Titel is verplicht.").max(255),
  description: z.string().max(5000).optional(),
  timeframe: z.nativeEnum(GoalTimeframe, {
    errorMap: () => ({ message: "Ongeldig tijdsframe." }),
  }),
  targetDate: z.string().datetime().optional(),
  lifeAreaId: z.string().uuid().optional(),
  parentGoalId: z.string().uuid().optional(),
});

const updateGoalSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().max(5000).optional(),
  status: z.nativeEnum(GoalStatus).optional(),
  timeframe: z.nativeEnum(GoalTimeframe).optional(),
  progress: z.number().int().min(0).max(100).optional(),
  targetDate: z.string().datetime().nullable().optional(),
  lifeAreaId: z.string().uuid().nullable().optional(),
  parentGoalId: z.string().uuid().nullable().optional(),
});

const querySchema = z.object({
  status: z.nativeEnum(GoalStatus).optional(),
  // Accept any string then map 'ALL' (or empty) to undefined so the service
  // returns all goals without a timeframe filter.
  timeframe: z
    .preprocess(
      (val) => (val === "ALL" || val === "" || val === undefined ? undefined : val),
      z.nativeEnum(GoalTimeframe).optional(),
    )
    .optional(),
  lifeAreaId: z.string().uuid().optional(),
  page: z.coerce.number().int().positive().optional(),
  pageSize: z.coerce.number().int().positive().max(100).optional(),
});

const paramsWithId = z.object({
  id: z.string().uuid("Ongeldig doel-ID."),
});

// GET / – List goals with filters
router.get(
  "/",
  authenticate,
  validate({ query: querySchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await goalService.getGoals(req.user!.userId, req.query as any);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },
);

// GET /tree – Goal hierarchy
router.get(
  "/tree",
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tree = await goalService.getGoalTree(req.user!.userId);
      res.json(tree);
    } catch (error) {
      next(error);
    }
  },
);

// GET /:id – Single goal
router.get(
  "/:id",
  authenticate,
  validate({ params: paramsWithId }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const goal = await goalService.getGoalById(req.user!.userId, req.params.id);
      res.json(goal);
    } catch (error) {
      next(error);
    }
  },
);

// POST / – Create goal
router.post(
  "/",
  authenticate,
  validate({ body: createGoalSchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const goal = await goalService.createGoal(req.user!.userId, req.body);
      res.status(201).json(goal);
    } catch (error) {
      next(error);
    }
  },
);

// PATCH /:id – Update goal
router.patch(
  "/:id",
  authenticate,
  validate({ params: paramsWithId, body: updateGoalSchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const goal = await goalService.updateGoal(
        req.user!.userId,
        req.params.id,
        req.body,
      );
      res.json(goal);
    } catch (error) {
      next(error);
    }
  },
);

// DELETE /:id – Delete goal
router.delete(
  "/:id",
  authenticate,
  validate({ params: paramsWithId }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await goalService.deleteGoal(req.user!.userId, req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
);

export default router;
