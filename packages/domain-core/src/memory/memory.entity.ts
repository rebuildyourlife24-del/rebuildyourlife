export class MemoryFoundation {
  constructor(
    public readonly id: string,
    public readonly identityId: string,
    public readonly memoryType: string,
    public readonly domain: string,
    public readonly content: string,
    public readonly confidence: number,
    public readonly createdAt: Date = new Date(),
    public readonly validationWarnings: string[] = []
  ) {}
}
