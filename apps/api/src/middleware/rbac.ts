import type { Request, Response, NextFunction } from "express";
import { ForbiddenError, UnauthorizedError } from "./errorHandler.js";

export function requireRole(...allowedRoles: string[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new UnauthorizedError());
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      next(
        new ForbiddenError(
          "Je hebt niet de juiste rechten voor deze actie.",
        ),
      );
      return;
    }

    next();
  };
}
