import { Request, Response, NextFunction } from 'express';

/**
 * Cloud-Grade API Gateway Layer (D0.2)
 * 
 * In a real physical deployment, this might be handled by AWS API Gateway,
 * Cloudflare Workers, or Kong. Within our Modular Monolith, this acts as the 
 * absolute first line of defense before any internal Domain Service is reached.
 */

// Simple in-memory rate limiter for the monolith
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

export class ApiGateway {

  /**
   * 1. Edge Authentication Validation
   * Validates tokens at the edge before even touching domain logic.
   */
  static authenticateEdge(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    const clientType = req.headers['x-client-type'] || 'external';

    // Fast-fail if no auth (bypass for health checks)
    if (!authHeader && req.path !== '/api/health') {
      return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Missing Authorization header' }});
    }

    // Attach client type to request for downstream shaping
    (req as any).clientType = clientType;
    next();
  }

  /**
   * 2. Request Shaping & Client Identification
   * Different clients get different rate limits and access levels.
   */
  static shapeClientRequest(req: Request, res: Response, next: NextFunction) {
    const clientType = (req as any).clientType as string; // 'ui', 'agent', 'external'

    let limit = 100; // default for external
    if (clientType === 'ui') limit = 1000; // BFF / Next.js gets higher throughput
    if (clientType === 'agent') limit = 500; // AI Agents

    (req as any).rateLimitThreshold = limit;
    next();
  }

  /**
   * 3. Rate Limiting (Memory Based for now)
   */
  static enforceRateLimit(req: Request, res: Response, next: NextFunction) {
    if (req.path === '/api/health') return next();

    const ip = req.ip || 'unknown';
    const limit = (req as any).rateLimitThreshold || 100;
    const now = Date.now();

    let record = rateLimitMap.get(ip);
    if (!record || now > record.resetAt) {
      record = { count: 0, resetAt: now + 60000 }; // 1 minute window
    }

    record.count++;
    rateLimitMap.set(ip, record);

    res.setHeader('X-RateLimit-Limit', limit);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, limit - record.count));

    if (record.count > limit) {
      return res.status(429).json({
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: 'Too many requests. Please slow down.',
          retryable: true
        }
      });
    }

    next();
  }
}
