export class DomainError extends Error {
  constructor(public code: string, message: string) {
    super(message);
    this.name = 'DomainError';
  }
}

export class ABEEViolationError extends DomainError {
  constructor(code: string, message: string) {
    super(code, message);
    this.name = 'ABEEViolationError';
  }
}
