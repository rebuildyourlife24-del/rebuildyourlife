import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';
import { apiLimiter } from './middleware/rateLimiter.js';
import routes from './routes/index.js';
import { EventReplayer } from './core/twin/EventReplayer.js';

dotenv.config();

const app = express();

app.use(helmet());
app.use(cors({
  origin: ['https://rebuildyourlife.eu', 'https://ai-henksemler.nl', 'http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));
app.use(compression());
app.use(express.json());

import { correlationMiddleware } from './middleware/correlation.js';

// Apply global rate limiter
app.use(apiLimiter);

// Apply Correlation ID for global tracing
app.use(correlationMiddleware);

// Routes
app.use('/api/v1', routes);

// Error Handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: err.message || 'Interne serverfout'
  });
});

const PORT = process.env.PORT || process.env.API_PORT || 4000;

if (process.env.NODE_ENV !== 'serverless') {
  app.listen(PORT, async () => {
    console.log(`RebuildYourLife API running on port ${PORT}`);
    
    // V6.0 - Boot the Digital Twin by replaying the Event Store
    try {
      const replayer = new EventReplayer();
      await replayer.rebuildTwinFromScratch();
    } catch (error) {
      console.error('[Startup] Failed to rebuild Digital Twin:', error);
    }
  });
}

export { app };
