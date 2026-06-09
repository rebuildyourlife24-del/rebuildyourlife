import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { env } from "../config/env.js";

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly isOperational: boolean;
  public readonly details?: Record<string, string[]>;

  constructor(
    message: string,
    statusCode: number,
    code: string,
    details?: Record<string, string[]>,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
    this.details = details;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} niet gevonden.`, 404, "NOT_FOUND");
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Niet geautoriseerd. Log opnieuw in.") {
    super(message, 401, "UNAUTHORIZED");
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Geen toegang tot deze resource.") {
    super(message, 403, "FORBIDDEN");
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409, "CONFLICT");
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: Record<string, string[]>) {
    super(message, 400, "VALIDATION_ERROR", details);
  }
}

export class TooManyRequestsError extends AppError {
  constructor(message = "Te veel verzoeken. Probeer het later opnieuw.") {
    super(message, 429, "TOO_MANY_REQUESTS");
  }
}

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      message: err.message,
      code: err.code,
      statusCode: err.statusCode,
      ...(err.details && { details: err.details }),
    });
    return;
  }

  if (err instanceof ZodError) {
    const details: Record<string, string[]> = {};
    for (const issue of err.issues) {
      const path = issue.path.join(".") || "_root";
      if (!details[path]) details[path] = [];
      details[path].push(issue.message);
    }
    res.status(400).json({
      message: "Validatiefout in de aanvraag.",
      code: "VALIDATION_ERROR",
      statusCode: 400,
      details,
    });
    return;
  }

  console.error("Unhandled error:", err);

  res.status(500).json({
    message:
      env.NODE_ENV === "production"
        ? "Er is een interne serverfout opgetreden."
        : err.message,
    code: "INTERNAL_ERROR",
    statusCode: 500,
  });
}
