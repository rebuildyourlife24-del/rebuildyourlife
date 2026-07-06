import { Request, Response, NextFunction } from 'express';
import { CorrelationManager } from '@rebuildyourlife/shared'; // Assuming shared is linked, or we can use relative path.

// We will use a relative path if the package alias doesn't work. Let's assume relative or we'll fix it if typescript complains.
// For now, let's just use the shared path directly or import uuid locally if needed. 
// Actually, since this is a monorepo, let's use the absolute relative path for now if alias isn't set.
import { v4 as uuidv4 } from 'uuid';

declare global {
  namespace Express {
    interface Request {
      correlationId: string;
    }
  }
}

export const correlationMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const headerId = req.headers['x-correlation-id'] || req.headers['x-request-id'];
  const correlationId = (typeof headerId === 'string' && headerId) ? headerId : `req_${uuidv4()}`;
  
  req.correlationId = correlationId;
  res.setHeader('X-Correlation-ID', correlationId);
  
  next();
};
