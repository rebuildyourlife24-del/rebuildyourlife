import { ABEEViolationError } from './domain-error';

export class ValidationResult {
  private constructor(
    public readonly isSuccess: boolean,
    public readonly warnings: string[] = [],
    public readonly error?: ABEEViolationError
  ) {}

  public static success(warnings: string[] = []): ValidationResult {
    return new ValidationResult(true, warnings);
  }

  public static fail(code: string, message: string): ValidationResult {
    return new ValidationResult(false, [], new ABEEViolationError(code, message));
  }
}
