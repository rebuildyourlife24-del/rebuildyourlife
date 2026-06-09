import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { DebtStatus } from "@rebuildyourlife/shared";
import { authenticate } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import * as debtService from "../services/debt.service.js";

const router = Router();

const createDebtSchema = z.object({
  creditorName: z.string().min(1, "Naam schuldeiser is verplicht.").max(255),
  originalAmount: z.number().positive("Oorspronkelijk bedrag moet positief zijn."),
  currentBalance: z.number().min(0, "Huidig saldo mag niet negatief zijn."),
  interestRate: z.number().min(0).max(100, "Rentepercentage moet tussen 0 en 100 zijn."),
  minimumPayment: z.number().min(0, "Minimale betaling mag niet negatief zijn."),
  monthlyPayment: z.number().min(0, "Maandelijkse betaling mag niet negatief zijn."),
  dueDate: z.string().datetime().optional(),
  notes: z.string().max(5000).optional(),
  priority: z.number().int().min(0).max(100).optional(),
});

const updateDebtSchema = z.object({
  creditorName: z.string().min(1).max(255).optional(),
  currentBalance: z.number().min(0).optional(),
  interestRate: z.number().min(0).max(100).optional(),
  minimumPayment: z.number().min(0).optional(),
  monthlyPayment: z.number().min(0).optional(),
  dueDate: z.string().datetime().nullable().optional(),
  status: z.nativeEnum(DebtStatus).optional(),
  notes: z.string().max(5000).nullable().optional(),
  priority: z.number().int().min(0).max(100).optional(),
});

const addPaymentSchema = z.object({
  amount: z.number().positive("Bedrag moet positief zijn."),
  paidAt: z.string().datetime().optional(),
  notes: z.string().max(1000).optional(),
});

const debtIdParams = z.object({
  id: z.string().uuid("Ongeldig schuld-ID."),
});

const scenariosQuery = z.object({
  extraPayment: z.coerce.number().min(0).optional(),
});

const paymentHistoryQuery = z.object({
  page: z.coerce.number().int().positive().optional(),
  pageSize: z.coerce.number().int().positive().max(100).optional(),
});

// GET / – List all debts
router.get(
  "/",
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const debts = await debtService.getDebts(req.user!.userId);
      res.json({ data: debts });
    } catch (error) {
      next(error);
    }
  },
);

// GET /overview – Debt overview with totals
router.get(
  "/overview",
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const overview = await debtService.getDebtOverview(req.user!.userId);
      res.json({ data: overview });
    } catch (error) {
      next(error);
    }
  },
);

// GET /scenarios – Calculate payoff scenarios
router.get(
  "/scenarios",
  authenticate,
  validate({ query: scenariosQuery }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const extraPayment = (req.query as any).extraPayment ?? 0;
      const scenarios = await debtService.calculatePayoffScenarios(
        req.user!.userId,
        extraPayment,
      );
      res.json({ data: scenarios });
    } catch (error) {
      next(error);
    }
  },
);

// GET /:id – Single debt with recent payments
router.get(
  "/:id",
  authenticate,
  validate({ params: debtIdParams }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const debt = await debtService.getDebtById(req.user!.userId, req.params.id);
      res.json(debt);
    } catch (error) {
      next(error);
    }
  },
);

// POST / – Create debt
router.post(
  "/",
  authenticate,
  validate({ body: createDebtSchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const debt = await debtService.createDebt(req.user!.userId, req.body);
      res.status(201).json(debt);
    } catch (error) {
      next(error);
    }
  },
);

// PATCH /:id – Update debt
router.patch(
  "/:id",
  authenticate,
  validate({ params: debtIdParams, body: updateDebtSchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const debt = await debtService.updateDebt(
        req.user!.userId,
        req.params.id,
        req.body,
      );
      res.json(debt);
    } catch (error) {
      next(error);
    }
  },
);

// DELETE /:id – Delete debt
router.delete(
  "/:id",
  authenticate,
  validate({ params: debtIdParams }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await debtService.deleteDebt(req.user!.userId, req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
);

// POST /:id/payments – Add payment to debt
router.post(
  "/:id/payments",
  authenticate,
  validate({ params: debtIdParams, body: addPaymentSchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payment = await debtService.addPayment(
        req.user!.userId,
        req.params.id,
        req.body,
      );
      res.status(201).json(payment);
    } catch (error) {
      next(error);
    }
  },
);

// GET /:id/payments – Payment history
router.get(
  "/:id/payments",
  authenticate,
  validate({ params: debtIdParams, query: paymentHistoryQuery }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const q = req.query as any;
      const result = await debtService.getPaymentHistory(
        req.user!.userId,
        req.params.id,
        q.page,
        q.pageSize,
      );
      res.json(result);
    } catch (error) {
      next(error);
    }
  },
);

export default router;
