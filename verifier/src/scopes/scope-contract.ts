import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import scopeContractSchema from '../../../schemas/scope-contract.schema.json' with { type: 'json' };
import { AjvSchemaValidator } from '../adapters/ajv-schema-validator.js';
import type { SchemaValidator } from '../core/schema-validator.js';
import type { SurfaceProfile } from './scope-resolver.js';

export type ScopeDensity = 'comfortable' | 'compact' | 'dense' | 'custom-approved';

export interface ScopeContract {
  scopeId: string;
  contractVersion: string;
  profile: SurfaceProfile;
  density: ScopeDensity;
  tokens?: Record<string, unknown>;
  [key: string]: unknown;
}

const defaultValidator = new AjvSchemaValidator();

export async function loadScopeContract(
  projectRoot: string,
  scopeId: string,
  validator: SchemaValidator = defaultValidator
): Promise<ScopeContract> {
  const path = join(projectRoot, '.design', 'scopes', scopeId, 'contract.json');
  const source = await readFile(path, 'utf8');
  const value = JSON.parse(source) as unknown;
  const validation = validator.validate(
    scopeContractSchema as Record<string, unknown>,
    value
  );

  if (!validation.valid) {
    throw new Error('SCOPE_CONTRACT_SCHEMA_INVALID');
  }

  const contract = value as ScopeContract;
  if (contract.scopeId !== scopeId) {
    throw new Error('SCOPE_CONTRACT_ID_MISMATCH');
  }

  return contract;
}
