export type GoalStatus = 'DRAFT' | 'ACTIVE' | 'ACHIEVED' | 'FAILED' | 'ABANDONED';

export class Goal {
  constructor(
    public readonly id: string,
    public readonly identityId: string,
    public readonly description: string,
    public readonly status: GoalStatus,
    public readonly createdAt: Date = new Date(),
    public readonly validationWarnings: string[] = []
  ) {}
}
