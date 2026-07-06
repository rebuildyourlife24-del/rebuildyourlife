import { v4 as uuidv4 } from 'uuid';

/**
 * Generates a new Correlation ID or ensures an existing one is passed along.
 * Correlation IDs are critical for tracing an action (like a user click) 
 * all the way through the OS Kernel, Core Services, and AI Agents.
 */
export class CorrelationManager {
  /**
   * Create a fresh Correlation ID for a new request or event chain.
   */
  static generate(): string {
    return `req_${uuidv4()}`;
  }

  /**
   * Validates if a string is a properly formatted correlation ID, 
   * otherwise generates a fallback.
   */
  static validateOrGenerate(id?: string | null): string {
    if (id && id.startsWith('req_')) {
      return id;
    }
    return this.generate();
  }
}
