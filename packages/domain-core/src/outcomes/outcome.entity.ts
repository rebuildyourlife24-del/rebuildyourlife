export class Outcome {
  constructor(
    public readonly id: string,
    public readonly actionId: string,
    public readonly success: boolean,
    public readonly resultPayload: any,
    public readonly observedAt: Date = new Date(),
    public readonly validationWarnings: string[] = []
  ) {}
}
