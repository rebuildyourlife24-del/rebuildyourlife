export interface LogContext {
  trace_id: string;
  tenant_id?: string;
  agent_id?: string;
  [key: string]: any;
}

export const logger = {
  info: (message: string, context: LogContext) => {
    console.log(JSON.stringify({ level: 'INFO', message, ...context, timestamp: new Date().toISOString() }));
  },
  error: (message: string, context: LogContext, error?: Error) => {
    console.error(JSON.stringify({ 
      level: 'ERROR', 
      message, 
      ...context, 
      error: error ? { message: error.message, stack: error.stack } : undefined,
      timestamp: new Date().toISOString() 
    }));
  },
  warn: (message: string, context: LogContext) => {
    console.warn(JSON.stringify({ level: 'WARN', message, ...context, timestamp: new Date().toISOString() }));
  },
  debug: (message: string, context: LogContext) => {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(JSON.stringify({ level: 'DEBUG', message, ...context, timestamp: new Date().toISOString() }));
    }
  }
};
