import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { authenticate } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import * as userService from "../services/user.service.js";

const router = Router();

const updateProfileSchema = z.object({
  firstName: z
    .string()
    .min(1, "Voornaam is verplicht.")
    .max(100)
    .optional(),
  lastName: z
    .string()
    .min(1, "Achternaam is verplicht.")
    .max(100)
    .optional(),
  avatarUrl: z.string().url("Ongeldige URL.").nullable().optional(),
  openaiKey: z.string().nullable().optional(),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Huidig wachtwoord is verplicht."),
  newPassword: z
    .string()
    .min(8, "Nieuw wachtwoord moet minimaal 8 tekens bevatten.")
    .max(128),
});

const deleteAccountSchema = z.object({
  password: z.string().min(1, "Wachtwoord is verplicht voor bevestiging."),
});

// GET /me
router.get(
  "/me",
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const profile = await userService.getProfile(req.user!.userId);
      res.json({ data: profile });
    } catch (error) {
      next(error);
    }
  },
);

// GET /dashboard
router.get(
  "/dashboard",
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const stats = await userService.getDashboardStats(req.user!.userId);
      res.json({ status: "success", data: stats });
    } catch (error) {
      next(error);
    }
  },
);

// GET /dashboard/activities
router.get(
  "/dashboard/activities",
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const activities = await userService.getDashboardActivities(req.user!.userId);
      res.json({ status: "success", data: activities });
    } catch (error) {
      next(error);
    }
  }
);

// PATCH /me
router.patch(
  "/me",
  authenticate,
  validate({ body: updateProfileSchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const profile = await userService.updateProfile(req.user!.userId, req.body);
      res.json(profile);
    } catch (error) {
      next(error);
    }
  },
);

// PATCH /me/password
router.patch(
  "/me/password",
  authenticate,
  validate({ body: changePasswordSchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await userService.changePassword(req.user!.userId, req.body);
      res.json({ message: "Wachtwoord succesvol gewijzigd." });
    } catch (error) {
      next(error);
    }
  },
);

// DELETE /me
router.delete(
  "/me",
  authenticate,
  validate({ body: deleteAccountSchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await userService.deleteAccount(req.user!.userId, req.body.password);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
);

export default router;
