import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { authenticate } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import * as socialService from "../services/social.service.js";

const router = Router();

// ---- Validation Schemas ----

const contactTypeEnum = z.enum(["FAMILY", "FRIEND", "PARTNER", "COLLEAGUE"]);

const createContactSchema = z.object({
  name: z.string().min(1, "Naam is verplicht.").max(255),
  type: contactTypeEnum,
  relationship: z.string().max(100).optional(),
  lastContactAt: z.string().datetime().optional(),
  reminderFrequencyDays: z.number().int().positive().optional(),
  notes: z.string().max(5000).optional(),
  phone: z.string().max(50).optional(),
  email: z.string().email("Ongeldig e-mailadres.").optional(),
  isImportant: z.boolean().optional(),
});

const updateContactSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  type: contactTypeEnum.optional(),
  relationship: z.string().max(100).nullable().optional(),
  lastContactAt: z.string().datetime().nullable().optional(),
  reminderFrequencyDays: z.number().int().positive().nullable().optional(),
  notes: z.string().max(5000).nullable().optional(),
  phone: z.string().max(50).nullable().optional(),
  email: z.string().email().nullable().optional(),
  isImportant: z.boolean().optional(),
});

const listQuerySchema = z.object({
  type: contactTypeEnum.optional(),
});

const paramsWithId = z.object({
  id: z.string().uuid("Ongeldig contact-ID."),
});

// ---- Routes ----

// GET /due — Contacts due for follow-up (must be before /:id)
router.get(
  "/due",
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const contacts = await socialService.getContactsDueForFollowUp(
        req.user!.userId,
      );
      res.json(contacts);
    } catch (error) {
      next(error);
    }
  },
);

// GET / — List all contacts
router.get(
  "/",
  authenticate,
  validate({ query: listQuerySchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { type } = req.query as { type?: string };
      const contacts = await socialService.getContacts(req.user!.userId, type);
      res.json(contacts);
    } catch (error) {
      next(error);
    }
  },
);

// GET /:id — Single contact
router.get(
  "/:id",
  authenticate,
  validate({ params: paramsWithId }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const contact = await socialService.getContactById(
        req.user!.userId,
        req.params.id,
      );
      res.json(contact);
    } catch (error) {
      next(error);
    }
  },
);

// POST / — Create contact
router.post(
  "/",
  authenticate,
  validate({ body: createContactSchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const contact = await socialService.createContact(
        req.user!.userId,
        req.body,
      );
      res.status(201).json(contact);
    } catch (error) {
      next(error);
    }
  },
);

// PATCH /:id — Update contact
router.patch(
  "/:id",
  authenticate,
  validate({ params: paramsWithId, body: updateContactSchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const contact = await socialService.updateContact(
        req.user!.userId,
        req.params.id,
        req.body,
      );
      res.json(contact);
    } catch (error) {
      next(error);
    }
  },
);

// DELETE /:id — Delete contact
router.delete(
  "/:id",
  authenticate,
  validate({ params: paramsWithId }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await socialService.deleteContact(req.user!.userId, req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
);

export default router;
