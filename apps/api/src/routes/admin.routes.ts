import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { prisma } from "@rebuildyourlife/database";
import { authenticate } from "../middleware/auth.js";
import { requireRole } from "../middleware/rbac.js";

const router = Router();

// Beveilig alle routes voor ADMIN en SUPREME_OVERSEER
router.use(authenticate);
router.use(requireRole("ADMIN", "SUPREME_OVERSEER"));

// GET /stats - Live statistieken van de database
router.get("/stats", async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const totalUsers = await prisma.user.count();
    
    const activeFranchises = await prisma.franchise.count({
      where: { status: "ACTIVE" },
    });

    const revenueAgg = await prisma.platformRevenue.aggregate({
      _sum: { amount: true },
    });
    
    // Bereken ook via de som van franchise platformCutTotal als fallback
    const franchiseCutAgg = await prisma.franchise.aggregate({
      _sum: { platformCutTotal: true },
    });

    const platformCutsRevenue = (revenueAgg._sum.amount ?? 0) || (franchiseCutAgg._sum.platformCutTotal ?? 0);

    res.json({
      status: "success",
      data: {
        totalUsers,
        activeFranchises,
        platformCutsRevenue,
      },
    });
  } catch (error) {
    next(error);
  }
});

// GET /users - Lijst van alle gebruikers
router.get("/users", async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        subscriptionTier: true,
        clearanceLevel: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({
      status: "success",
      data: users,
    });
  } catch (error) {
    next(error);
  }
});

// GET /franchises - Lijst van alle franchises
router.get("/franchises", async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const franchises = await prisma.franchise.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({
      status: "success",
      data: franchises,
    });
  } catch (error) {
    next(error);
  }
});

// PATCH /users/:id - Wijzig subscription tier en/of rol van een gebruiker
const updateUserSchema = z.object({
  subscriptionTier: z.string().optional(),
  role: z.string().optional(),
  clearanceLevel: z.number().int().min(1).max(10).optional(),
});

router.patch("/users/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const body = updateUserSchema.parse(req.body);

    const updatedUser = await prisma.user.update({
      where: { id },
      data: body,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        subscriptionTier: true,
        clearanceLevel: true,
      },
    });

    res.json({
      status: "success",
      message: "Gebruiker succesvol bijgewerkt.",
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
});

// PATCH /franchises/:id/status - Activeer/deactiveer een franchise
const updateFranchiseSchema = z.object({
  status: z.enum(["ACTIVE", "INACTIVE"]),
});

router.patch("/franchises/:id/status", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status } = updateFranchiseSchema.parse(req.body);

    const updatedFranchise = await prisma.franchise.update({
      where: { id },
      data: { status },
    });

    res.json({
      status: "success",
      message: `Franchise succesvol ${status === "ACTIVE" ? "geactiveerd" : "gedeactiveerd"}.`,
      data: updatedFranchise,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
