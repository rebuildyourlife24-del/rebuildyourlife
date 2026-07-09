// Base primitives for the RYL OS Platform
export type TenantID = string;
export type WorkspaceID = string;
export type UserID = string;
export type AgentID = string;
export type CorrelationID = string;

export interface StandardResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    trace_id: string;
  };
}
