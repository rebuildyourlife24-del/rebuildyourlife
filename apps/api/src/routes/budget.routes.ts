import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { authenticate } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import * as budgetService from "../services/budget.service.js";

const router = Router();

const createBudgetSchema = z.object({
  month: z.string().min(1, "Maand is verplicht (ISO datum, bijv. 2026-06-01)."),
  totalIncome: z.number().min(0, "Inkomen mag niet negatief zijn."),
  totalExpenses: z.number().min(0, "Uitgaven mogen niet negatief zijn."),
  savingsTarget: z.number().min(0, "Spaardoel mag niet negatief zijn."),
  categories: z
    .array(
      z.object({
        name: z.string().min(1, "Categorienaam is verplicht.").max(100),
        planned: z.number().min(0),
        actual: z.number().min(0).optional(),
      }),
    )
    .optional(),
});

const updateBudgetSchema = z.object({
  totalIncome: z.number().min(0).optional(),
  totalExpenses: z.number().min(0).optional(),
  savingsTarget: z.number().min(0).optional(),
});

const createCategorySchema = z.object({
  name: z.string().min(1, "Categorienaam is verplicht.").max(100),
  planned: z.number().min(0),
  actual: z.number().min(0).optional(),
});

const updateCategorySchema = z.object({
  name: z.string().min(1).max(100).optional(),
  planned: z.number().min(0).optional(),
  actual: z.number().min(0).optional(),
});

const budgetIdParams = z.object({
  id: z.string().uuid("Ongeldig budget-ID."),
});

const categoryIdParams = z.object({
  id: z.string().uuid(),
  categoryId: z.string().uuid("Ongeldig categorie-ID."),
});

const monthParams = z.object({
  month: z.string().regex(/^\d{4}-\d{2}$/, "Formaat moet YYYY-MM zijn."),
});

// GET / – List all budgets
router.get(
  "/",
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const budgets = await budgetService.getBudgets(req.user!.userId);
      res.json({ data: budgets });
    } catch (error) {
      next(error);
    }
  },
);

// GET /summary/:month – Monthly summary (format: YYYY-MM)
router.get(
  "/summary/:month",
  authenticate,
  validate({ params: monthParams }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const summary = await budgetService.getMonthlySummary(
        req.user!.userId,
        req.params.month,
      );
      res.json({ data: summary });
    } catch (error) {
      next(error);
    }
  },
);

// GET /:id – Single budget
router.get(
  "/:id",
  authenticate,
  validate({ params: budgetIdParams }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const budget = await budgetService.getBudgetById(
        req.user!.userId,
        req.params.id,
      );
      res.json({ data: budget });
    } catch (error) {
      next(error);
    }
  },
);

// POST / – Create budget
router.post(
  "/",
  authenticate,
  validate({ body: createBudgetSchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const budget = await budgetService.createBudget(req.user!.userId, req.body);
      res.status(201).json(budget);
    } catch (error) {
      next(error);
    }
  },
);

// PATCH /:id – Update budget
router.patch(
  "/:id",
  authenticate,
  validate({ params: budgetIdParams, body: updateBudgetSchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const budget = await budgetService.updateBudget(
        req.user!.userId,
        req.params.id,
        req.body,
      );
      res.json(budget);
    } catch (error) {
      next(error);
    }
  },
);

// DELETE /:id – Delete budget
router.delete(
  "/:id",
  authenticate,
  validate({ params: budgetIdParams }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await budgetService.deleteBudget(req.user!.userId, req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
);

// POST /:id/categories – Add category to budget
router.post(
  "/:id/categories",
  authenticate,
  validate({ params: budgetIdParams, body: createCategorySchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const category = await budgetService.addCategory(
        req.user!.userId,
        req.params.id,
        req.body,
      );
      res.status(201).json(category);
    } catch (error) {
      next(error);
    }
  },
);

// PATCH /:id/categories/:categoryId – Update category
router.patch(
  "/:id/categories/:categoryId",
  authenticate,
  validate({ params: categoryIdParams, body: updateCategorySchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const category = await budgetService.updateCategory(
        req.user!.userId,
        req.params.categoryId,
        req.body,
      );
      res.json(category);
    } catch (error) {
      next(error);
    }
  },
);

// DELETE /:id/categories/:categoryId – Delete category
router.delete(
  "/:id/categories/:categoryId",
  authenticate,
  validate({ params: categoryIdParams }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await budgetService.deleteCategory(req.user!.userId, req.params.categoryId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
);

export default router;
