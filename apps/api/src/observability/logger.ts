import { getCorrelationId } from '../middleware/observability.middleware.js';

export class Logger {
  static info(message: string, meta: Record<string, any> = {}) {
    this.log('INFO', message, meta);
  }

  static warn(message: string, meta: Record<string, any> = {}) {
    this.log('WARN', message, meta);
  }

  static error(message: string, error?: Error | unknown, meta: Record<string, any> = {}) {
    this.log('ERROR', message, { 
      ...meta, 
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined
    });
  }

  private static log(level: string, message: string, meta: Record<string, any>) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      correlationId: getCorrelationId() || 'SYSTEM',
      ...meta
    };

    // Output JSON for Datadog / ELK parsing
    console.log(JSON.stringify(logEntry));
  }
}
