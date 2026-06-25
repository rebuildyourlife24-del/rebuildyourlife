import { db } from "@/lib/db";

export interface SystemLogParams {
  userId: string;
  action: string;
  category: string;
  status: "SUCCESS" | "FAILED" | "RUNNING";
  executionTime?: number;
  metadata?: Record<string, any>;
  errorMessage?: string;
}

export class SystemLoggingService {
  static async log(params: SystemLogParams) {
    try {
      const log = await db.systemActivityLog.create({
        data: {
          userId: params.userId,
          action: params.action,
          category: params.category,
          status: params.status,
          executionTime: params.executionTime || null,
          metadata: params.metadata ? JSON.stringify(params.metadata) : null,
          errorMessage: params.errorMessage || null,
        },
      });
      return log;
    } catch (err) {
      console.error("Error writing system activity log:", err);
      return null;
    }
  }
}
