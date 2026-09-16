export interface SchemaViolation {
  instancePath: string;
  keyword: string;
  message?: string;
  params?: unknown;
}

export type ValidationResult =
  | { valid: true; violations: [] }
  | { valid: false; violations: SchemaViolation[] };

export interface SchemaValidator {
  validate(schema: Record<string, unknown>, document: unknown): ValidationResult;
}
