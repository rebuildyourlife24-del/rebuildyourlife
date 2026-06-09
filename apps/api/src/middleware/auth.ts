import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { UnauthorizedError } from "./errorHandler.js";

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
  subscriptionTier?: "FREE" | "BASIC" | "PREMIUM" | "ENTERPRISE";
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedError("Geen toegangstoken opgegeven.");
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      throw new UnauthorizedError("Ongeldig token formaat.");
    }

    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      next(error);
      return;
    }
    if (error instanceof jwt.JsonWebTokenError) {
      next(new UnauthorizedError("Ongeldig of verlopen token."));
      return;
    }
    next(error);
  }
}
