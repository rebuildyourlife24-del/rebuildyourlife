export class KnowledgeRelation {
  constructor(
    public readonly id: string,
    public readonly fromEntityId: string,
    public readonly toEntityId: string,
    public readonly relationType: string,
    public readonly confidence: number,
    public readonly source: string,
    public readonly createdAt: Date = new Date(),
    public readonly validationWarnings: string[] = []
  ) {}
}
