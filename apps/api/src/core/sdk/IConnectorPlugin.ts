import { EventPayload, IEventBus } from './IEventBus.js';

export interface ConnectorResponse {
  success: boolean;
  eventsPublished: number;
  error?: string;
}

export interface IConnectorPlugin {
  /**
   * Unique name of the connector (e.g. SHOPIFY_CONNECTOR)
   */
  readonly name: string;

  /**
   * Translates an external webhook/API payload into standard EnterpriseEvents.
   * Does NOT publish them yet.
   */
  normalize(rawPayload: any, headers?: any): Promise<EventPayload[]>;

  /**
   * Validates the security/integrity of the payload (e.g. signature verification)
   */
  validate(rawPayload: any, headers?: any): Promise<boolean>;

  /**
   * Core method called by the Reality Fabric. Validates, normalizes, and publishes.
   */
  process(rawPayload: any, headers: any, bus: IEventBus): Promise<ConnectorResponse>;
}
