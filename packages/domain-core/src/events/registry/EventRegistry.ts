import { EventDescriptor } from '../EventDescriptor';
import { EventEnvelopeBaseSchema, EventEnvelope, RegistryError, EventValidationError, JsonSerializer, SerializationError } from '@rylos/contracts';

export interface CatalogEntry {
  eventName: string;
  aggregate: string;
  version: number;
  semanticClassification: string;
  compatibility: string;
  deprecated: boolean;
  replaySafe: boolean;
  snapshotCandidate: boolean;
  visibility: string;
  retentionPolicy: string;
}

export class EventRegistry {
  private descriptors: Map<string, EventDescriptor<unknown>> = new Map();

  public register<T>(descriptor: EventDescriptor<T>): void {
    const key = `${descriptor.eventName}_v${descriptor.version}`;
    if (this.descriptors.has(key)) {
      throw new RegistryError(`Event descriptor for ${key} is already registered.`);
    }
    this.descriptors.set(key, descriptor as EventDescriptor<unknown>);
  }

  public lookup(eventName: string, version: number): EventDescriptor<unknown> {
    const key = `${eventName}_v${version}`;
    const descriptor = this.descriptors.get(key);
    if (!descriptor) {
      throw new RegistryError(`No descriptor found for event: ${key}`);
    }
    return descriptor;
  }

  public deserialize(payload: string): EventEnvelope<unknown> {
    // 1. Initial deserialization to get event envelope metadata
    const tempSerializer = new JsonSerializer();
    let envelope: EventEnvelope<unknown>;
    try {
      envelope = tempSerializer.deserialize(payload);
    } catch (err) {
      throw new SerializationError(`Invalid JSON payload.`);
    }

    // 2. Validate envelope base schema
    const envelopeValidation = EventEnvelopeBaseSchema.safeParse(envelope);
    if (!envelopeValidation.success) {
      throw new EventValidationError('Unknown', envelopeValidation.error.format());
    }

    // 3. Extract version info (assuming semantic version string like "1.0.0")
    // Simple extraction of major version for registry lookup
    const majorVersion = parseInt(envelope.version.split('.')[0], 10);
    
    // 4. Lookup specific descriptor
    const descriptor = this.lookup(envelope.type, majorVersion);

    // 5. Validate the inner payload against the domain schema
    const payloadValidation = descriptor.schema.safeParse(envelope.data);
    if (!payloadValidation.success) {
      throw new EventValidationError(envelope.type, payloadValidation.error.format());
    }

    return envelope;
  }

  public validate(envelope: EventEnvelope<unknown>): boolean {
    try {
      const majorVersion = parseInt(envelope.version.split('.')[0], 10);
      const descriptor = this.lookup(envelope.type, majorVersion);
      const payloadValidation = descriptor.schema.safeParse(envelope.data);
      return payloadValidation.success;
    } catch {
      return false;
    }
  }

  public generateCatalog(): Record<string, CatalogEntry[]> {
    const catalog: Record<string, CatalogEntry[]> = {};
    for (const [key, descriptor] of this.descriptors.entries()) {
      if (!catalog[descriptor.eventName]) {
        catalog[descriptor.eventName] = [];
      }
      catalog[descriptor.eventName].push({
        eventName: descriptor.eventName,
        aggregate: descriptor.aggregate,
        version: descriptor.version,
        semanticClassification: descriptor.semanticClassification,
        compatibility: descriptor.compatibility,
        deprecated: descriptor.deprecated,
        replaySafe: descriptor.replaySafe,
        snapshotCandidate: descriptor.snapshotCandidate,
        visibility: descriptor.visibility,
        retentionPolicy: descriptor.retentionPolicy
      });
    }
    return catalog;
  }
}
