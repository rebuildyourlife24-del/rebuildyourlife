export type DecisionStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUPERSEDED';

export class Decision {
  constructor(
    public readonly id: string,
    public readonly identityId: string,
    public readonly goalId: string,
    public readonly description: string,
    public readonly status: DecisionStatus,
    public readonly rationale: string = '',
    public readonly createdAt: Date = new Date(),
    public readonly validationWarnings: string[] = []
  ) {}
}
