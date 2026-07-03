import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { validate } from "../middleware/validate.js";
import * as authService from "../services/auth.service.js";

const router = Router();

const registerSchema = z.object({
  email: z.string().email("Ongeldig e-mailadres."),
  password: z
    .string()
    .min(8, "Wachtwoord moet minimaal 8 tekens bevatten.")
    .max(128, "Wachtwoord mag maximaal 128 tekens bevatten."),
  firstName: z
    .string()
    .min(1, "Voornaam is verplicht.")
    .max(100, "Voornaam mag maximaal 100 tekens bevatten."),
  lastName: z
    .string()
    .min(1, "Achternaam is verplicht.")
    .max(100, "Achternaam mag maximaal 100 tekens bevatten."),
});

const loginSchema = z.object({
  email: z.string().email("Ongeldig e-mailadres."),
  password: z.string().min(1, "Wachtwoord is verplicht."),
});

const refreshSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is verplicht."),
});

const logoutSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is verplicht."),
});

const verifyEmailSchema = z.object({
  token: z.string().min(1, "Verificatietoken is verplicht."),
});

const resetPasswordSchema = z.object({
  email: z.string().email("Ongeldig e-mailadres."),
});

// POST /register
router.post(
  "/register",
  validate({ body: registerSchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await authService.register(
        req.body,
        req.ip,
        req.headers["user-agent"],
      );
      res.status(201).json({ status: "success", data: result });
    } catch (error) {
      next(error);
    }
  },
);

// POST /login
router.post(
  "/login",
  validate({ body: loginSchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await authService.login(
        req.body,
        req.ip,
        req.headers["user-agent"],
      );
      res.json({ status: "success", data: result });
    } catch (error) {
      next(error);
    }
  },
);

// POST /refresh
router.post(
  "/refresh",
  validate({ body: refreshSchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await authService.refreshToken(req.body.refreshToken);
      res.json({ status: "success", data: result });
    } catch (error) {
      next(error);
    }
  },
);

// POST /logout
router.post(
  "/logout",
  validate({ body: logoutSchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await authService.logout(req.body.refreshToken);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
);

// POST /verify-email
router.post(
  "/verify-email",
  validate({ body: verifyEmailSchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await authService.verifyEmail(req.body.token);
      res.json({ message: "E-mailadres geverifieerd." });
    } catch (error) {
      next(error);
    }
  },
);

// POST /reset-password
router.post(
  "/reset-password",
  validate({ body: resetPasswordSchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await authService.resetPassword(req.body.email);
      res.json({
        message:
          "Als het e-mailadres bij ons bekend is, ontvang je een resetlink.",
      });
    } catch (error) {
      next(error);
    }
  },
);

const confirmResetSchema = z.object({
  token: z.string().min(1, "Token is verplicht."),
  newPassword: z.string().min(8, "Wachtwoord moet minimaal 8 tekens bevatten."),
});

// POST /reset-password/confirm
router.post(
  "/reset-password/confirm",
  validate({ body: confirmResetSchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await authService.confirmPasswordReset(req.body.token, req.body.newPassword);
      res.json({ message: "Wachtwoord succesvol gewijzigd." });
    } catch (error) {
      next(error);
    }
  },
);

export default router;
