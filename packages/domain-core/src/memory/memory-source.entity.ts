export class MemorySource {
  constructor(
    public readonly id: string,
    public readonly memoryId: string,
    public readonly sourceType: string,
    public readonly sourceReference: string,
    public readonly reliabilityScore: number,
    public readonly createdBy: string
  ) {}
}
