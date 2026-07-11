export class RetrievalPolicy {
  constructor(
    public readonly minConfidence: number = 0.5,
    public readonly requireSourceVerification: boolean = true,
    public readonly excludeLegacyInvalid: boolean = true
  ) {}

  shouldInclude(confidence: number, hasSource: boolean, isLegacyInvalid: boolean): boolean {
    if (this.excludeLegacyInvalid && isLegacyInvalid) return false;
    if (this.requireSourceVerification && !hasSource) return false;
    if (confidence < this.minConfidence) return false;
    return true;
  }
}
