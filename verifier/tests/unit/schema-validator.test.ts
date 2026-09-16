import { describe, expect, it } from 'vitest';
import { AjvSchemaValidator } from '../../src/adapters/ajv-schema-validator.js';

describe('AjvSchemaValidator', () => {
  it('returns normalized violations without exposing Ajv types', () => {
    const validator = new AjvSchemaValidator();
    const result = validator.validate(
      {
        type: 'object',
        additionalProperties: false,
        properties: {
          ok: { type: 'boolean' }
        }
      },
      { ok: true, extra: 1 }
    );

    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.violations[0]).toMatchObject({
        keyword: 'additionalProperties'
      });
      expect(result.violations[0]).toHaveProperty('instancePath');
    }
  });

  it('returns an empty violation list for a valid document', () => {
    const validator = new AjvSchemaValidator();
    const result = validator.validate(
      {
        type: 'object',
        additionalProperties: false,
        required: ['ok'],
        properties: {
          ok: { type: 'boolean' }
        }
      },
      { ok: true }
    );

    expect(result).toEqual({ valid: true, violations: [] });
  });
});
