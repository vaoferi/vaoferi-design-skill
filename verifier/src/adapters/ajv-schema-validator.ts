import { createRequire } from 'node:module';
import type {
  SchemaValidator,
  SchemaViolation,
  ValidationResult
} from '../core/schema-validator.js';

type AjvErrorLike = {
  instancePath?: string;
  keyword?: string;
  message?: string;
  params?: unknown;
};

type AjvValidateFunctionLike = ((document: unknown) => boolean) & {
  errors?: AjvErrorLike[] | null;
};

type AjvInstanceLike = {
  compile(schema: Record<string, unknown>): AjvValidateFunctionLike;
};

type AjvConstructorLike = new (options?: Record<string, unknown>) => AjvInstanceLike;

const require = createRequire(import.meta.url);

function loadAjvConstructor(): AjvConstructorLike {
  const loaded = require('ajv') as unknown;

  if (typeof loaded === 'function') {
    return loaded as AjvConstructorLike;
  }

  if (
    loaded !== null &&
    typeof loaded === 'object' &&
    'default' in loaded &&
    typeof (loaded as { default?: unknown }).default === 'function'
  ) {
    return (loaded as { default: AjvConstructorLike }).default;
  }

  throw new TypeError('Unable to resolve Ajv constructor');
}

function normalizeViolations(errors: AjvErrorLike[] | null | undefined): SchemaViolation[] {
  return (errors ?? []).map((error) => ({
    instancePath: error.instancePath ?? '',
    keyword: error.keyword ?? 'unknown',
    ...(error.message === undefined ? {} : { message: error.message }),
    ...(error.params === undefined ? {} : { params: error.params })
  }));
}

export class AjvSchemaValidator implements SchemaValidator {
  private readonly ajv: AjvInstanceLike;

  constructor() {
    const Ajv = loadAjvConstructor();
    this.ajv = new Ajv({ allErrors: true, strict: true });
  }

  validate(schema: Record<string, unknown>, document: unknown): ValidationResult {
    const validate = this.ajv.compile(schema);

    if (validate(document)) {
      return { valid: true, violations: [] };
    }

    return {
      valid: false,
      violations: normalizeViolations(validate.errors)
    };
  }
}
