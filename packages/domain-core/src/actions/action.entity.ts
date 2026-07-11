export type ActionStatus = 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';

export class Action {
  constructor(
    public readonly id: string,
    public readonly identityId: string,
    public readonly decisionId: string,
    public readonly type: string,
    public readonly payload: any,
    public readonly status: ActionStatus,
    public readonly createdAt: Date = new Date(),
    public readonly validationWarnings: string[] = []
  ) {}
}
