export type IdentityStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'LEGACY_INVALID';
export type EntityType = 'USER' | 'AGENT' | 'SYSTEM' | 'TENANT';

export class UniversalIdentity {
  constructor(
    public readonly id: string,
    public readonly entityType: EntityType,
    public readonly status: IdentityStatus,
    public readonly tenantId: string | null = null,
    public readonly metadata: Record<string, any> = {},
    public readonly validationWarnings: string[] = [] // For legacy reads tolerant mode
  ) {}

  public isLegacyInvalid(): boolean {
    return this.status === 'LEGACY_INVALID';
  }
}

export class Agent {
  constructor(
    public readonly identityId: string,
    public readonly name: string,
    public readonly role: string,
    public readonly department: string,
    public readonly systemPrompt: string,
    public readonly status: IdentityStatus,
    public readonly validationWarnings: string[] = []
  ) {}
}
