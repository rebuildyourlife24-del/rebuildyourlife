import { AsyncLocalStorage } from 'async_hooks';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

/**
 * AsyncLocalStorage allows us to store the correlationId per request
 * without having to drill it down through every function parameter.
 */
export const requestContext = new AsyncLocalStorage<Map<string, string>>();

/**
 * Middleware that ensures every incoming request has a Correlation ID,
 * and makes it globally available in the current asynchronous execution context.
 */
export const observabilityMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // 1. Extract or Generate Correlation ID
  const correlationId = (req.headers['x-correlation-id'] as string) || uuidv4();
  
  // 2. Attach to Request object (for legacy/direct access)
  (req as any).correlationId = correlationId;

  // 3. Attach to Response headers so the client knows it
  res.setHeader('X-Correlation-ID', correlationId);

  // 4. Initialize AsyncLocalStorage context
  const store = new Map<string, string>();
  store.set('correlationId', correlationId);
  
  // Also store workspaceId if available early
  if (req.headers['x-workspace-id']) {
    store.set('workspaceId', req.headers['x-workspace-id'] as string);
  }

  // 5. Run the rest of the request within this context
  requestContext.run(store, () => {
    next();
  });
};

/**
 * Utility to retrieve the current Correlation ID from anywhere in the codebase
 */
export const getCorrelationId = (): string | undefined => {
  const store = requestContext.getStore();
  return store?.get('correlationId');
};
