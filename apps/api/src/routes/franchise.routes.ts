import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { authenticate } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import * as franchiseService from "../services/franchise.service.js";

const router = Router();

const createFranchiseSchema = z.object({
  name: z.string().min(1, "Naam is verplicht.").max(100),
  subdomain: z.string().min(1, "Subdomein is verplicht.").max(50).regex(/^[a-z0-9-]+$/, "Subdomein mag alleen kleine letters, cijfers en streepjes bevatten."),
  customDomain: z.string().max(100).optional(),
  title: z.string().max(100).optional(),
  description: z.string().max(500).optional(),
  theme: z.string().max(50).optional(),
  products: z.array(z.any()).optional(),
  settings: z.any().optional(),
});

const updateFranchiseSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  subdomain: z.string().min(1).max(50).regex(/^[a-z0-9-]+$/, "Subdomein mag alleen kleine letters, cijfers en streepjes bevatten.").optional(),
  customDomain: z.string().max(100).nullable().optional(),
  status: z.enum(["ACTIVE", "PAUSED", "DRAFT"]).optional(),
  title: z.string().max(100).optional(),
  description: z.string().max(500).optional(),
  theme: z.string().max(50).optional(),
  products: z.array(z.any()).optional(),
  settings: z.any().optional(),
});

const createOrderSchema = z.object({
  customerName: z.string().min(1, "Klantnaam is verplicht."),
  customerEmail: z.string().email("Ongeldig e-mailadres."),
  totalAmount: z.number().min(0.01, "Bedrag moet groter zijn dan 0."),
  items: z.array(z.object({
    id: z.string(),
    name: z.string(),
    price: z.number(),
    quantity: z.number(),
  })),
});

const idParams = z.object({
  id: z.string().uuid("Ongeldig franchise-ID."),
});

const subdomainParams = z.object({
  subdomain: z.string().min(1),
});

// GET / - List franchises of user
router.get(
  "/",
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const franchises = await franchiseService.getFranchises(req.user!.userId);
      res.json({ data: franchises });
    } catch (error) {
      next(error);
    }
  }
);

// GET /subdomain/:subdomain - Public lookup
router.get(
  "/subdomain/:subdomain",
  validate({ params: subdomainParams }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const franchise = await franchiseService.getFranchiseBySubdomain(req.params.subdomain);
      res.json({ data: franchise });
    } catch (error) {
      next(error);
    }
  }
);

// POST / - Create franchise
router.post(
  "/",
  authenticate,
  validate({ body: createFranchiseSchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const franchise = await franchiseService.createFranchise(req.user!.userId, req.body);
      res.status(201).json({ data: franchise });
    } catch (error) {
      next(error);
    }
  }
);

// GET /:id - Get franchise by ID
router.get(
  "/:id",
  authenticate,
  validate({ params: idParams }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const franchise = await franchiseService.getFranchiseById(req.user!.userId, req.params.id);
      res.json({ data: franchise });
    } catch (error) {
      next(error);
    }
  }
);

// PUT /:id - Update franchise
router.put(
  "/:id",
  authenticate,
  validate({ params: idParams, body: updateFranchiseSchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const franchise = await franchiseService.updateFranchise(req.user!.userId, req.params.id, req.body);
      res.json({ data: franchise });
    } catch (error) {
      next(error);
    }
  }
);

// DELETE /:id - Delete franchise
router.delete(
  "/:id",
  authenticate,
  validate({ params: idParams }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await franchiseService.deleteFranchise(req.user!.userId, req.params.id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

// POST /:id/order - Create (simulate) order and process 25% cut
router.post(
  "/:id/order",
  validate({ params: idParams, body: createOrderSchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await franchiseService.createFranchiseOrder(req.params.id, req.body);
      res.status(201).json({ data: result });
    } catch (error) {
      next(error);
    }
  }
);

// GET /:id/orders - Get franchise orders
router.get(
  "/:id/orders",
  authenticate,
  validate({ params: idParams }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orders = await franchiseService.getFranchiseOrders(req.user!.userId, req.params.id);
      res.json({ data: orders });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
