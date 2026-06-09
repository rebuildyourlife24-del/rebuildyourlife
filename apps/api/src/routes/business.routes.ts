import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { authenticate } from "../middleware/auth.js";
import { requireTier } from "../middleware/subscription.js";
import { validate } from "../middleware/validate.js";
import * as businessService from "../services/business.service.js";

const router = Router();

// ============================================================================
// Validation Schemas
// ============================================================================

const clientStatusEnum = z.enum(["PROSPECT", "ACTIVE", "INACTIVE"]);
const invoiceStatusEnum = z.enum(["DRAFT", "SENT", "PAID", "OVERDUE"]);

const createClientSchema = z.object({
  name: z.string().min(1, "Naam is verplicht.").max(255),
  email: z.string().email("Ongeldig e-mailadres.").optional(),
  phone: z.string().max(50).optional(),
  company: z.string().max(255).optional(),
  status: clientStatusEnum.optional(),
  notes: z.string().max(5000).optional(),
});

const updateClientSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  email: z.string().email().nullable().optional(),
  phone: z.string().max(50).nullable().optional(),
  company: z.string().max(255).nullable().optional(),
  status: clientStatusEnum.optional(),
  notes: z.string().max(5000).nullable().optional(),
  lastContactAt: z.string().datetime().nullable().optional(),
});

const createInvoiceSchema = z.object({
  invoiceNr: z.string().min(1, "Factuurnummer is verplicht.").max(100),
  description: z.string().max(5000).optional(),
  amount: z.number().positive("Bedrag moet positief zijn."),
  dueDate: z.string().datetime().optional(),
});

const updateInvoiceSchema = z.object({
  invoiceNr: z.string().min(1).max(100).optional(),
  description: z.string().max(5000).nullable().optional(),
  amount: z.number().positive().optional(),
  dueDate: z.string().datetime().nullable().optional(),
});

const updateInvoiceStatusSchema = z.object({
  status: invoiceStatusEnum,
});

const clientsQuerySchema = z.object({
  status: clientStatusEnum.optional(),
});

const invoicesQuerySchema = z.object({
  status: invoiceStatusEnum.optional(),
});

const clientParams = z.object({
  clientId: z.string().uuid("Ongeldig klant-ID."),
});

const invoiceParams = z.object({
  invoiceId: z.string().uuid("Ongeldig factuur-ID."),
});

// ============================================================================
// Summary Route (must be before /:id routes)
// ============================================================================

// GET /summary — Business KPI summary
router.get(
  "/summary",
  authenticate,
  requireTier("ENTERPRISE"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const summary = await businessService.getBusinessSummary(req.user!.userId);
      res.json(summary);
    } catch (error) {
      next(error);
    }
  },
);

// ============================================================================
// Invoice routes (non-nested) — top-level /invoices
// ============================================================================

// GET /invoices — All invoices (optionally filter by status)
router.get(
  "/invoices",
  authenticate,
  requireTier("ENTERPRISE"),
  validate({ query: invoicesQuerySchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { status } = req.query as { status?: string };
      const invoices = await businessService.getInvoices(
        req.user!.userId,
        status,
      );
      res.json(invoices);
    } catch (error) {
      next(error);
    }
  },
);

// GET /invoices/:invoiceId — Single invoice (non-nested)
router.get(
  "/invoices/:invoiceId",
  authenticate,
  requireTier("ENTERPRISE"),
  validate({ params: invoiceParams }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const invoice = await businessService.getInvoiceById(
        req.user!.userId,
        req.params.invoiceId,
      );
      res.json(invoice);
    } catch (error) {
      next(error);
    }
  },
);

// PATCH /invoices/:invoiceId/status — Update invoice status
router.patch(
  "/invoices/:invoiceId/status",
  authenticate,
  requireTier("ENTERPRISE"),
  validate({ params: invoiceParams, body: updateInvoiceStatusSchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const invoice = await businessService.updateInvoiceStatus(
        req.user!.userId,
        req.params.invoiceId,
        req.body.status,
      );
      res.json(invoice);
    } catch (error) {
      next(error);
    }
  },
);

// PATCH /invoices/:invoiceId — Update invoice fields
router.patch(
  "/invoices/:invoiceId",
  authenticate,
  requireTier("ENTERPRISE"),
  validate({ params: invoiceParams, body: updateInvoiceSchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const invoice = await businessService.updateInvoice(
        req.user!.userId,
        req.params.invoiceId,
        req.body,
      );
      res.json(invoice);
    } catch (error) {
      next(error);
    }
  },
);

// DELETE /invoices/:invoiceId — Delete invoice
router.delete(
  "/invoices/:invoiceId",
  authenticate,
  requireTier("ENTERPRISE"),
  validate({ params: invoiceParams }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await businessService.deleteInvoice(
        req.user!.userId,
        req.params.invoiceId,
      );
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
);

// ============================================================================
// Client CRUD routes
// ============================================================================

// GET /clients — List all clients
router.get(
  "/clients",
  authenticate,
  requireTier("ENTERPRISE"),
  validate({ query: clientsQuerySchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { status } = req.query as { status?: string };
      const clients = await businessService.getClients(req.user!.userId, status);
      res.json(clients);
    } catch (error) {
      next(error);
    }
  },
);

// GET /clients/:clientId — Single client with invoices
router.get(
  "/clients/:clientId",
  authenticate,
  requireTier("ENTERPRISE"),
  validate({ params: clientParams }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const client = await businessService.getClientById(
        req.user!.userId,
        req.params.clientId,
      );
      res.json(client);
    } catch (error) {
      next(error);
    }
  },
);

// POST /clients — Create client
router.post(
  "/clients",
  authenticate,
  requireTier("ENTERPRISE"),
  validate({ body: createClientSchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const client = await businessService.createClient(
        req.user!.userId,
        req.body,
      );
      res.status(201).json(client);
    } catch (error) {
      next(error);
    }
  },
);

// PATCH /clients/:clientId — Update client
router.patch(
  "/clients/:clientId",
  authenticate,
  requireTier("ENTERPRISE"),
  validate({ params: clientParams, body: updateClientSchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const client = await businessService.updateClient(
        req.user!.userId,
        req.params.clientId,
        req.body,
      );
      res.json(client);
    } catch (error) {
      next(error);
    }
  },
);

// DELETE /clients/:clientId — Delete client
router.delete(
  "/clients/:clientId",
  authenticate,
  requireTier("ENTERPRISE"),
  validate({ params: clientParams }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await businessService.deleteClient(req.user!.userId, req.params.clientId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
);

// ============================================================================
// Nested invoice routes under /clients/:clientId/invoices
// ============================================================================

// POST /clients/:clientId/invoices — Create invoice for client
router.post(
  "/clients/:clientId/invoices",
  authenticate,
  requireTier("ENTERPRISE"),
  validate({ params: clientParams, body: createInvoiceSchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const invoice = await businessService.createInvoice(
        req.user!.userId,
        req.params.clientId,
        req.body,
      );
      res.status(201).json(invoice);
    } catch (error) {
      next(error);
    }
  },
);

export default router;
